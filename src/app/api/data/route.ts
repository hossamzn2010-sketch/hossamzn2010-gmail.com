import { NextRequest, NextResponse } from 'next/server'

// تخزين البيانات في الذاكرة (لبيئة Serverless مثل Vercel)
// ملاحظة: في الإنتاج، يُفضل استخدام قاعدة بيانات خارجية مثل Vercel Postgres أو Supabase
let inMemoryData: any = {
  journalEntries: [],
  activityLogs: [],
  companySettings: null,
  accounts: null,
  lastUpdated: null,
  version: '3.0'
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
    console.log(`📥 طلب بيانات في ${new Date().toLocaleString('ar-EG')} - القيود: ${inMemoryData.journalEntries?.length || 0}`)
    
    return NextResponse.json(inMemoryData)
  } catch (error) {
    console.error('Error in GET:', error)
    return NextResponse.json({ 
      journalEntries: [], 
      activityLogs: [], 
      companySettings: null,
      accounts: null,
      lastUpdated: null,
      version: '3.0',
      error: 'فشل في تحميل البيانات'
    })
  }
}

// POST: حفظ/تحديث البيانات المشتركة
export async function POST(request: NextRequest) {
  try {
    const newData = await request.json()

    console.log(`📤 استلام بيانات:`, {
      hasJournalEntries: !!newData.journalEntries,
      journalCount: newData.journalEntries?.length || 0,
      hasActivityLogs: !!newData.activityLogs,
      activityCount: newData.activityLogs?.length || 0,
      hasCompanySettings: !!newData.companySettings,
      hasAccounts: !!newData.accounts
    })

    // دمج القيود المحاسبية (ذكية - تحديث أو إضافة)
    if (newData.journalEntries && Array.isArray(newData.journalEntries)) {
      inMemoryData.journalEntries = mergeJournalEntries(
        inMemoryData.journalEntries || [], 
        newData.journalEntries
      )
      console.log(`✓ تم دمج ${newData.journalEntries.length} قيد - الإجمالي: ${inMemoryData.journalEntries.length}`)
    }

    // دمج سجل العمليات - إضافة جديدة فقط
    if (newData.activityLogs && Array.isArray(newData.activityLogs)) {
      const existingIds = new Set((inMemoryData.activityLogs || []).map((l: any) => l.id))
      const newLogs = newData.activityLogs.filter((l: any) => !existingIds.has(l.id))
      inMemoryData.activityLogs = [...newLogs, ...(inMemoryData.activityLogs || [])].slice(0, 200)
      console.log(`✓ تم إضافة ${newLogs.length} عملية جديدة`)
    }

    // تحديث إعدادات الشركة
    if (newData.companySettings) {
      inMemoryData.companySettings = newData.companySettings
      console.log('✓ تم تحديث إعدادات الشركة')
    }

    // تحديث/دمج الحسابات
    if (newData.accounts && Array.isArray(newData.accounts)) {
      const existingMap = new Map((inMemoryData.accounts || []).map((a: any) => [a.id, a]))
      newData.accounts.forEach((acc: any) => {
        existingMap.set(acc.id, acc)
      })
      inMemoryData.accounts = Array.from(existingMap.values())
      console.log(`✓ تم تحديث الحسابات - الإجمالي: ${inMemoryData.accounts.length}`)
    }

    inMemoryData.lastUpdated = new Date().toISOString()

    return NextResponse.json({ 
      success: true, 
      message: 'تم حفظ البيانات بنجاح', 
      lastUpdated: inMemoryData.lastUpdated,
      totalJournalEntries: inMemoryData.journalEntries?.length || 0,
      totalActivityLogs: inMemoryData.activityLogs?.length || 0
    })
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
    inMemoryData = {
      journalEntries: [],
      activityLogs: [],
      companySettings: null,
      accounts: null,
      lastUpdated: new Date().toISOString(),
      version: '3.0'
    }
    return NextResponse.json({ success: true, message: 'تم مسح جميع البيانات' })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطأ في مسح البيانات' }, { status: 500 })
  }
}
