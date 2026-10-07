// نظام قاعدة البيانات الخارجية - يدعم التخزين الدائم
// يدعم: JSONBin.io (مجاني) أو أي API تخزين JSON

export interface DatabaseConfig {
  provider: 'jsonbin' | 'memory' | 'custom';
  apiKey?: string;
  binId?: string;
  customUrl?: string;
}

// البيانات المخزنة
interface AppData {
  journalEntries: any[];
  activityLogs: any[];
  companySettings: any;
  accounts: any[];
  users: any[];
  backups: any[];
  lastUpdated: string | null;
  version: string;
}

// البيانات في الذاكرة (للاستخدام عندما لا يكون هناك اتصال بقاعدة بيانات)
let inMemoryData: AppData = {
  journalEntries: [],
  activityLogs: [],
  companySettings: null,
  accounts: [],
  users: [],
  backups: [],
  lastUpdated: null,
  version: '4.0'
};

// دمج القيود المحاسبية
function mergeJournalEntries(existing: any[], newData: any[]): any[] {
  const mergedMap = new Map<string, any>();
  existing.forEach(entry => mergedMap.set(entry.id, entry));
  newData.forEach(entry => {
    if (entry.id) {
      mergedMap.set(entry.id, entry);
    }
  });
  return Array.from(mergedMap.values()).sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return (a.entryNumber || 0) - (b.entryNumber || 0);
  });
}

// ======== JSONBin.io Provider ========
class JSONBinProvider {
  private apiKey: string;
  private binId: string;
  private baseUrl = 'https://api.jsonbin.io/v3';

  constructor(apiKey: string, binId: string) {
    this.apiKey = apiKey;
    this.binId = binId;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-Master-Key': this.apiKey,
      'X-Bin-Meta': 'false'
    };
  }

  async read(): Promise<AppData> {
    try {
      const response = await fetch(`${this.baseUrl}/b/${this.binId}/latest`, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        console.error('JSONBin read error:', response.status);
        return inMemoryData;
      }
      
      const data = await response.json();
      console.log('✓ تم تحميل البيانات من JSONBin');
      return data;
    } catch (error) {
      console.error('JSONBin connection error:', error);
      return inMemoryData;
    }
  }

  async write(data: AppData): Promise<boolean> {
    try {
      data.lastUpdated = new Date().toISOString();
      
      const response = await fetch(`${this.baseUrl}/b/${this.binId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data, null, 2)
      });
      
      if (response.ok) {
        console.log('✓ تم حفظ البيانات في JSONBin -', data.lastUpdated);
        return true;
      }
      console.error('JSONBin write error:', response.status);
      return false;
    } catch (error) {
      console.error('JSONBin write error:', error);
      return false;
    }
  }
}

// ======== Memory Provider (للاختبار المحلي) ========
class MemoryProvider {
  async read(): Promise<AppData> {
    return inMemoryData;
  }

  async write(data: AppData): Promise<boolean> {
    inMemoryData = { ...data };
    inMemoryData.lastUpdated = new Date().toISOString();
    console.log('✓ تم حفظ البيانات في الذاكرة -', inMemoryData.lastUpdated);
    return true;
  }
}

// ======== Database Manager ========
let dbProvider: JSONBinProvider | MemoryProvider | null = null;

export function initDatabase(config: DatabaseConfig) {
  switch (config.provider) {
    case 'jsonbin':
      if (config.apiKey && config.binId) {
        dbProvider = new JSONBinProvider(config.apiKey, config.binId);
        console.log('✓ تم تهيئة قاعدة بيانات JSONBin');
      } else {
        console.warn('⚠️ JSONBin مفتاح API أو Bin ID مفقود، استخدام الذاكرة');
        dbProvider = new MemoryProvider();
      }
      break;
    case 'memory':
    default:
      dbProvider = new MemoryProvider();
      console.log('✓ استخدام قاعدة بيانات الذاكرة');
  }
}

// تهيئة تلقائية
const DB_PROVIDER = process.env.DB_PROVIDER || 'memory';
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY || '';
const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID || '';

initDatabase({
  provider: DB_PROVIDER as 'jsonbin' | 'memory',
  apiKey: JSONBIN_API_KEY,
  binId: JSONBIN_BIN_ID
});

// ======== Public API ========

export async function getData(): Promise<AppData> {
  if (!dbProvider) {
    return inMemoryData;
  }
  
  const data = await dbProvider.read();
  
  // التأكد من وجود جميع الحقول
  return {
    journalEntries: data.journalEntries || [],
    activityLogs: data.activityLogs || [],
    companySettings: data.companySettings || null,
    accounts: data.accounts || [],
    users: data.users || [],
    backups: data.backups || [],
    lastUpdated: data.lastUpdated || null,
    version: data.version || '4.0'
  };
}

export async function updateData(newData: Partial<AppData>): Promise<{ success: boolean; message: string; data?: AppData }> {
  if (!dbProvider) {
    return { success: false, message: 'قاعدة البيانات غير مهيأة' };
  }

  try {
    const currentData = await getData();

    // دمج القيود المحاسبية
    if (newData.journalEntries && Array.isArray(newData.journalEntries)) {
      currentData.journalEntries = mergeJournalEntries(
        currentData.journalEntries,
        newData.journalEntries
      );
    }

    // دمج سجل العمليات
    if (newData.activityLogs && Array.isArray(newData.activityLogs)) {
      const existingIds = new Set(currentData.activityLogs.map((l: any) => l.id));
      const newLogs = newData.activityLogs.filter((l: any) => !existingIds.has(l.id));
      currentData.activityLogs = [...newLogs, ...currentData.activityLogs].slice(0, 200);
    }

    // تحديث إعدادات الشركة
    if (newData.companySettings) {
      currentData.companySettings = newData.companySettings;
    }

    // تحديث الحسابات
    if (newData.accounts && Array.isArray(newData.accounts)) {
      const existingMap = new Map(currentData.accounts.map((a: any) => [a.id, a]));
      newData.accounts.forEach((acc: any) => existingMap.set(acc.id, acc));
      currentData.accounts = Array.from(existingMap.values());
    }

    // تحديث المستخدمين
    if (newData.users && Array.isArray(newData.users)) {
      const existingMap = new Map(currentData.users.map((u: any) => [u.id, u]));
      newData.users.forEach((user: any) => existingMap.set(user.id, user));
      currentData.users = Array.from(existingMap.values());
    }

    // حفظ البيانات
    const success = await dbProvider.write(currentData);

    if (success) {
      return {
        success: true,
        message: 'تم حفظ البيانات بنجاح',
        data: currentData
      };
    } else {
      return { success: false, message: 'فشل في حفظ البيانات' };
    }
  } catch (error) {
    console.error('updateData error:', error);
    return { 
      success: false, 
      message: 'خطأ: ' + (error as Error).message 
    };
  }
}

export async function resetData(): Promise<{ success: boolean; message: string }> {
  if (!dbProvider) {
    return { success: false, message: 'قاعدة البيانات غير مهيأة' };
  }

  const emptyData: AppData = {
    journalEntries: [],
    activityLogs: [],
    companySettings: null,
    accounts: [],
    users: [],
    backups: [],
    lastUpdated: new Date().toISOString(),
    version: '4.0'
  };

  const success = await dbProvider.write(emptyData);
  
  return {
    success,
    message: success ? 'تم مسح جميع البيانات' : 'فشل في مسح البيانات'
  };
}
