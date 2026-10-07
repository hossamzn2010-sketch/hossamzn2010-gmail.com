import { NextRequest, NextResponse } from 'next/server';
import { getData, updateData, resetData } from '@/lib/db';

// GET: استرجاع البيانات المشتركة
export async function GET(request: NextRequest) {
  try {
    const data = await getData();
    
    console.log(`📥 طلب بيانات - القيود: ${data.journalEntries?.length || 0}`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET:', error);
    return NextResponse.json({ 
      journalEntries: [], 
      activityLogs: [], 
      companySettings: null,
      accounts: [],
      users: [],
      lastUpdated: null,
      version: '4.0',
      error: 'فشل في تحميل البيانات'
    });
  }
}

// POST: حفظ/تحديث البيانات المشتركة
export async function POST(request: NextRequest) {
  try {
    const newData = await request.json();

    console.log(`📤 استلام بيانات:`, {
      hasJournalEntries: !!newData.journalEntries,
      journalCount: newData.journalEntries?.length || 0,
      hasActivityLogs: !!newData.activityLogs,
      activityCount: newData.activityLogs?.length || 0,
      hasCompanySettings: !!newData.companySettings,
      hasAccounts: !!newData.accounts,
      hasUsers: !!newData.users
    });

    const result = await updateData(newData);

    return NextResponse.json({
      success: result.success,
      message: result.message,
      lastUpdated: result.data?.lastUpdated,
      totalJournalEntries: result.data?.journalEntries?.length || 0,
      totalActivityLogs: result.data?.activityLogs?.length || 0
    }, { status: result.success ? 200 : 500 });
  } catch (error) {
    console.error('Error in POST:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'خطأ في حفظ البيانات: ' + (error as Error).message
    }, { status: 500 });
  }
}

// DELETE: مسح جميع البيانات
export async function DELETE() {
  try {
    const result = await resetData();
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'خطأ في مسح البيانات' 
    }, { status: 500 });
  }
}
