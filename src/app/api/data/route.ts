import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'public', 'data', 'sharedData.json')

// التأكد من وجود الملف وإنشائه إذا لم يكن موجوداً
function ensureDataFile() {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(DATA_FILE)) {
    // تحميل البيانات الأولية من ملف القيود إذا كان موجوداً
    let initialEntries: any[] = []
    try {
      const journalFile = path.join(process.cwd(), 'public', 'data', 'journalEntriesData.json')
      if (fs.existsSync(journalFile)) {
        const content = fs.readFileSync(journalFile, 'utf-8')
        initialEntries = JSON.parse(content)
      }
    } catch (e) {
      console.error('خطأ في تحميل القيود الأولية:', e)
    }
    
    fs.writeFileSync(DATA_FILE, JSON.stringify({
      journalEntries: initialEntries,
      activityLogs: [],
      companySettings: null,
      accounts: null,
      lastUpdated: null,
      version: '2.0'
    }, null, 2))
    console.log('✓ تم إنشاء ملف البيانات المشتركة مع', initialEntries.length, 'قيد')
  }
}

// قراءة البيانات الحالية
function readData(): any {
  try {
    ensureDataFile()
    const content = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error('خطأ في قراءة البيانات:', error)
    return {
      journalEntries: [],
      activityLogs: [],
      companySettings: null,
      accounts: null,
      lastUpdated: null,
      version: '2.0'
    }
  }
}

// كتابة البيانات
function writeData(data: any): boolean {
  try {
    ensureDataFile()
    data.lastUpdated = new Date().toISOString()
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
    console.log('✓ تم حفظ البيانات في:', data.lastUpdated, '- عدد القيود:', data.journalEntries?.length || 0)
    return true
  } catch (error) {
    console.error('خطأ في كتابة البيانات:', error)
    return false
  }
}

// دمج القيود المحاسبية (إضافة جديدة أو تحديث موجودة)
function mergeJournalEntries(existing: any[], newData: any[]): any[] {
  const mergedMap = new Map<string, any>()
  
  // أضف القيود الموجودة
  existing.forEach(entry => mergedMap.set(entry.id, entry))
  
  // دمج/تحديث بالقيود الجديدة
  newData.forEach(entry => {
    if (entry.id) {
      mergedMap.set(entry.id, entry)
    }
  })
  
  // ترتيب حسب التاريخ ورقم القيد
  return Array.from(mergedMap.values()).sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date)
    return (a.entryNumber || 0) - (b.entryNumber || 0)
  })
}

// GET: استرجاع البيانات المشتركة
export async function GET(request: NextRequest) {
  try {
    const data = readData()
    
    console.log(`📥 طلب بيانات في ${new Date().toLocaleString('ar-EG')} - القيود: ${data.journalEntries?.length || 0}`)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in GET:', error)
    return NextResponse.json({ 
      journalEntries: [], 
      activityLogs: [], 
      companySettings: null,
      accounts: null,
      lastUpdated: null,
      version: '2.0',
      error: 'فشل في تحميل البيانات'
    })
  }
}

// POST: حفظ/تحديث البيانات المشتركة
export async function POST(request: NextRequest) {
  try {
    const newData = await request.json()
    const currentData = readData()

    console.log(`📤接收数据:`, {
      hasJournalEntries: !!newData.journalEntries,
      journalCount: newData.journalEntries?.length || 0,
      hasActivityLogs: !!newData.activityLogs,
      activityCount: newData.activityLogs?.length || 0,
      hasCompanySettings: !!newData.companySettings,
      hasAccounts: !!newData.accounts
    })

    // دمج القيود المحاسبية (ذكية - تحديث أو إضافة)
    if (newData.journalEntries && Array.isArray(newData.journalEntries)) {
      currentData.journalEntries = mergeJournalEntries(
        currentData.journalEntries || [], 
        newData.journalEntries
      )
      console.log(`✓ تم دمج ${newData.journalEntries.length} قيد - الإجمالي: ${currentData.journalEntries.length}`)
    }

    // دمج سجل العمليات - إضافة جديدة فقط
    if (newData.activityLogs && Array.isArray(newData.activityLogs)) {
      const existingIds = new Set((currentData.activityLogs || []).map((l: any) => l.id))
      const newLogs = newData.activityLogs.filter((l: any) => !existingIds.has(l.id))
      currentData.activityLogs = [...newLogs, ...(currentData.activityLogs || [])].slice(0, 200)
      console.log(`✓ تم إضافة ${newLogs.length} عملية جديدة`)
    }

    // تحديث إعدادات الشركة
    if (newData.companySettings) {
      currentData.companySettings = newData.companySettings
      console.log('✓ تم تحديث إعدادات الشركة')
    }

    // تحديث/دمج الحسابات
    if (newData.accounts && Array.isArray(newData.accounts)) {
      const existingMap = new Map((currentData.accounts || []).map((a: any) => [a.id, a]))
      newData.accounts.forEach((acc: any) => {
        existingMap.set(acc.id, acc)
      })
      currentData.accounts = Array.from(existingMap.values())
      console.log(`✓ تم تحديث الحسابات - الإجمالي: ${currentData.accounts.length}`)
    }

    // حفظ البيانات المدمجة
    const success = writeData(currentData)

    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'تم حفظ البيانات بنجاح', 
        lastUpdated: currentData.lastUpdated,
        totalJournalEntries: currentData.journalEntries?.length || 0,
        totalActivityLogs: currentData.activityLogs?.length || 0
      })
    } else {
      throw new Error('فشل في كتابة الملف')
    }
  } catch (error) {
    console.error('Error in POST:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'خطأ في حفظ البيانات: ' + (error as Error).message
    }, { status: 500 })
  }
}

// DELETE: مسح جميع البيانات (للاختبار أو إعادة التعيين)
export async function DELETE() {
  try {
    const emptyData = {
      journalEntries: [],
      activityLogs: [],
      companySettings: null,
      accounts: null,
      lastUpdated: new Date().toISOString(),
      version: '2.0'
    }
    writeData(emptyData)
    return NextResponse.json({ success: true, message: 'تم مسح جميع البيانات' })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطأ في مسح البيانات' }, { status: 500 })
  }
}
