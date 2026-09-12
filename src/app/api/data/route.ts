import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'public', 'data', 'sharedData.json')

// التأكد من وجود الملف
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
      lastUpdated: null
    }, null, 2))
  }
}

// GET: استرجاع البيانات المشتركة
export async function GET() {
  try {
    ensureDataFile()
    const data = fs.readFileSync(DATA_FILE, 'utf-8')
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    console.error('Error reading shared data:', error)
    return NextResponse.json({ 
      journalEntries: [], 
      activityLogs: [], 
      companySettings: null,
      lastUpdated: null 
    })
  }
}

// POST: حفظ البيانات المشتركة
export async function POST(request: NextRequest) {
  try {
    ensureDataFile()
    const data = await request.json()
    
    // قراءة البيانات الحالية ودمجها
    let currentData = { journalEntries: [], activityLogs: [], companySettings: null }
    try {
      const existing = fs.readFileSync(DATA_FILE, 'utf-8')
      currentData = JSON.parse(existing)
    } catch (e) {
      // استخدام القيم الافتراضية
    }

    // دمج البيانات الجديدة
    if (data.journalEntries) {
      currentData.journalEntries = data.journalEntries
    }
    if (data.activityLogs) {
      currentData.activityLogs = data.activityLogs
    }
    if (data.companySettings) {
      currentData.companySettings = data.companySettings
    }
    
    currentData.lastUpdated = new Date().toISOString()

    fs.writeFileSync(DATA_FILE, JSON.stringify(currentData, null, 2))
    
    return NextResponse.json({ success: true, message: 'تم حفظ البيانات بنجاح', lastUpdated: currentData.lastUpdated })
  } catch (error) {
    console.error('Error saving shared data:', error)
    return NextResponse.json({ success: false, message: 'خطأ في حفظ البيانات' }, { status: 500 })
  }
}
