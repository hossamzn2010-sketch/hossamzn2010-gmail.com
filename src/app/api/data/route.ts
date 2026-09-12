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
    fs.writeFileSync(DATA_FILE, JSON.stringify({
      journalEntries: [],
      activityLogs: [],
      companySettings: null,
      lastUpdated: null,
      version: '1.0'
    }, null, 2))
    console.log('✓ تم إنشاء ملف البيانات المشتركة:', DATA_FILE)
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
      lastUpdated: null,
      version: '1.0'
    }
  }
}

// كتابة البيانات
function writeData(data: any): boolean {
  try {
    ensureDataFile()
    data.lastUpdated = new Date().toISOString()
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
    console.log('✓ تم حفظ البيانات في:', data.lastUpdated)
    return true
  } catch (error) {
    console.error('خطأ في كتابة البيانات:', error)
    return false
  }
}

// GET: استرجاع البيانات المشتركة
export async function GET(request: NextRequest) {
  try {
    const data = readData()
    
    // تسجيل الطلب في السجل
    console.log(`📥 طلب بيانات في ${new Date().toLocaleString('ar-EG')}`)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in GET:', error)
    return NextResponse.json({ 
      journalEntries: [], 
      activityLogs: [], 
      companySettings: null,
      lastUpdated: null,
      version: '1.0',
      error: 'فشل في تحميل البيانات'
    })
  }
}

// POST: حفظ/تحديث البيانات المشتركة
export async function POST(request: NextRequest) {
  try {
    const newData = await request.json()
    const currentData = readData()

    // دمج البيانات الجديدة مع القديمة (لمنع فقدان البيانات)
    
    // دمج سجل العمليات - إضافة جديدة فقط وليس استبدال
    if (newData.activityLogs && Array.isArray(newData.activityLogs)) {
      const existingIds = new Set(currentData.activityLogs.map((l: any) => l.id))
      const newLogs = newData.activityLogs.filter((l: any) => !existingIds.has(l.id))
      currentData.activityLogs = [...newLogs, ...currentData.activityLogs].slice(0, 200)
    }

    // تحديث القيود المحاسبية
    if (newData.journalEntries) {
      currentData.journalEntries = newData.journalEntries
    }

    // تحديث إعدادات الشركة
    if (newData.companySettings) {
      currentData.companySettings = newData.companySettings
    }

    // حفظ البيانات المدمجة
    const success = writeData(currentData)

    if (success) {
      console.log(`💾 تم حفظ ${newData.activityLogs?.length || 0} عملية جديدة`)
      return NextResponse.json({ 
        success: true, 
        message: 'تم حفظ البيانات بنجاح', 
        lastUpdated: currentData.lastUpdated,
        totalLogs: currentData.activityLogs.length
      })
    } else {
      throw new Error('فشل في كتابة الملف')
    }
  } catch (error) {
    console.error('Error in POST:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'خطأ في حفظ البيانات' 
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
      lastUpdated: new Date().toISOString(),
      version: '1.0'
    }
    writeData(emptyData)
    return NextResponse.json({ success: true, message: 'تم مسح جميع البيانات' })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطأ في مسح البيانات' }, { status: 500 })
  }
}
