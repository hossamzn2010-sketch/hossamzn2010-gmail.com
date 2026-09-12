'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { 
  LayoutDashboard, ShoppingCart, Package, Users, Wallet, FileText, Settings,
  Menu, X, Plus, Search, Filter, Download, Printer, Eye, Edit2, Trash2,
  TrendingUp, TrendingDown, DollarSign, AlertCircle, CheckCircle, Clock,
  ArrowUpRight, ArrowDownLeft, Receipt, Send, BarChart3, PieChart as PieChartIcon,
  ChevronDown, ChevronLeft, RefreshCw, Save, XCircle, Calendar, Building2,
  Phone, Mail, MapPin, Hash, Percent, CreditCard, Banknote, Calculator,
  Lock, User, UserCheck, Shield, LogOut, Bell, AlertTriangle,
  GitBranch, BookOpen, Landmark, ClipboardList, UserCircle, Briefcase,
  CalendarDays, Clock3, HandCoins, Plane, FileCheck, FileBarChart,
  ChevronRight, ChevronUp, ZoomIn, QrCode, Truck, RotateCcw,
  Star, Award, Target, Activity, PieChart, LineChart, Scissors,
  Upload, Database, Key, EyeOff, ToggleLeft, ToggleRight, Zap,
  Undo2, Copy, Archive, CheckSquare, Square
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { IncomeStatementReport, BalanceSheetReport, TrialBalanceReport } from '@/components/Reports'

// ============ TYPES ============
type ModuleType = 'dashboard' | 'sales' | 'purchases' | 'inventory' | 'parties' | 'treasury' | 'reports' | 'settings' | 'accounts' | 'banks' | 'hr' | 'expenses' | 'chart-of-accounts' | 'journal-entries' | 'general-ledger'

interface Invoice {
  id: string
  number: string
  date: string
  customerName: string
  total: number
  paidAmount: number
  remainingAmount: number
  paymentMethod: 'cash' | 'bank' | 'check' | 'partial'
  status: 'draft' | 'posted' | 'paid' | 'cancelled'
  items: InvoiceItem[]
}

interface PurchaseInvoice {
  id: string
  number: string
  date: string
  supplierName: string
  total: number
  paidAmount: number
  remainingAmount: number
  paymentMethod: 'cash' | 'bank' | 'check' | 'partial'
  status: 'draft' | 'posted' | 'paid' | 'cancelled'
  items: InvoiceItem[]
}

interface InvoiceItem {
  id: string
  name: string
  quantity: number
  price: number
  total: number
}

interface Item {
  id: string
  nameAr: string
  code: string
  category: string
  stock: number
  price: number
}

interface Party {
  id: string
  nameAr: string
  type: 'customer' | 'supplier' | 'both'
  phone: string
  balance: number
}

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
}

interface Account {
  id: string
  code: string
  name: string
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
  level: number
  parentId: string | null
  balance: number
}

interface JournalEntryLine {
  accountCode: string
  accountName: string
  debit: number
  credit: number
}

interface JournalEntry {
  id: string
  entryNumber: number
  date: string
  description: string
  lines: JournalEntryLine[]
  totalDebit: number
  totalCredit: number
  status: 'draft' | 'posted' | 'reversed'
}

// ============ EMPTY DATA ARRAYS FOR MANUAL ENTRY ============
const mockInvoices: Invoice[] = []
const mockQuotations: any[] = []
const mockSalesReturns: any[] = []
const mockItems: Item[] = [
  { id: 'item-001', nameAr: 'مطبخ مودرن', code: 'MK-001', category: 'أثاث مطابخ', stock: 10, price: 15000 },
  { id: 'item-002', nameAr: 'دريسينج رووم', code: 'DR-001', category: 'غرف نوم', stock: 15, price: 4500 },
  { id: 'item-003', nameAr: 'كوفى كورنر', code: 'CC-001', category: 'أثاث صالات', stock: 8, price: 6500 },
  { id: 'item-004', nameAr: 'تربيزة شاشة', code: 'TV-001', category: 'أثاث صالات', stock: 20, price: 1200 },
  { id: 'item-005', nameAr: 'مكتب', code: 'DS-001', category: 'مكاتب', stock: 12, price: 2800 },
  { id: 'item-006', nameAr: 'غرفة نوم', code: 'BR-001', category: 'غرف نوم', stock: 6, price: 12000 }
]
const mockParties: Party[] = []
const mockTransactions: Transaction[] = []
const mockPurchaseOrders: any[] = []
const mockAccounts: Account[] = [
  // ============ الأصول (1000) ============
  { id: 'acc-1000', code: '1000', name: 'الأصول', type: 'asset', level: 1, parentId: null, balance: 0 },
  
  // الأصول المتداولة (1100)
  { id: 'acc-1100', code: '1100', name: 'الأصول المتداولة', type: 'asset', level: 2, parentId: 'acc-1000', balance: 0 },
  
  // النقدية والبنوك (1110)
  { id: 'acc-1110', code: '1110', name: 'النقدية والبنوك', type: 'asset', level: 3, parentId: 'acc-1100', balance: 0 },
  { id: 'acc-1111', code: '1111', name: 'الصندوق', type: 'asset', level: 4, parentId: 'acc-1110', balance: 0 },
  { id: 'acc-1112', code: '1112', name: 'البنك - الرصيد الحالي', type: 'asset', level: 4, parentId: 'acc-1110', balance: 0 },
  
  // المدينون (1200)
  { id: 'acc-1200', code: '1200', name: 'المدينون', type: 'asset', level: 2, parentId: 'acc-1000', balance: 0 },
  { id: 'acc-1210', code: '1210', name: 'العملاء', type: 'asset', level: 3, parentId: 'acc-1200', balance: 0 },
  { id: 'acc-1211', code: '1211', name: 'عميل 1', type: 'asset', level: 4, parentId: 'acc-1210', balance: 0 },
  { id: 'acc-1212', code: '1212', name: 'عميل 2', type: 'asset', level: 4, parentId: 'acc-1210', balance: 0 },
  { id: 'acc-1213', code: '1213', name: 'عميل 3', type: 'asset', level: 4, parentId: 'acc-1210', balance: 0 },
  { id: 'acc-1214', code: '1214', name: 'عميل 4', type: 'asset', level: 4, parentId: 'acc-1210', balance: 0 },
  { id: 'acc-1220', code: '1220', name: 'أوراق قبض', type: 'asset', level: 3, parentId: 'acc-1200', balance: 0 },
  { id: 'acc-1230', code: '1230', name: 'مصاريف مقدمه', type: 'asset', level: 3, parentId: 'acc-1200', balance: 0 },
  
  // المخزون (1300)
  { id: 'acc-1300', code: '1300', name: 'المخزون', type: 'asset', level: 2, parentId: 'acc-1000', balance: 0 },
  { id: 'acc-1301', code: '1301', name: 'مخزون البضاعة', type: 'asset', level: 3, parentId: 'acc-1300', balance: 0 },
  { id: 'acc-1302', code: '1302', name: 'مخزون المواد الخام', type: 'asset', level: 3, parentId: 'acc-1300', balance: 0 },
  { id: 'acc-1303', code: '1303', name: 'الضريبة القابلة للخصم', type: 'asset', level: 3, parentId: 'acc-1300', balance: 0 },
  
  // الأصول الثابتة (1400)
  { id: 'acc-1400', code: '1400', name: 'الأصول الثابتة', type: 'asset', level: 2, parentId: 'acc-1000', balance: 0 },
  { id: 'acc-1401', code: '1401', name: 'الأثاث والتجهيزات', type: 'asset', level: 3, parentId: 'acc-1400', balance: 0 },
  { id: 'acc-1402', code: '1402', name: 'الحاسبات والأجهزة', type: 'asset', level: 3, parentId: 'acc-1400', balance: 0 },
  { id: 'acc-1403', code: '1403', name: 'السيارات', type: 'asset', level: 3, parentId: 'acc-1400', balance: 0 },
  { id: 'acc-1404', code: '1404', name: 'المباني', type: 'asset', level: 3, parentId: 'acc-1400', balance: 0 },
  { id: 'acc-1405', code: '1405', name: 'الأرضي', type: 'asset', level: 3, parentId: 'acc-1400', balance: 0 },
  { id: 'acc-1406', code: '1406', name: 'مجمع الإهلاك', type: 'asset', level: 3, parentId: 'acc-1400', balance: 0 },

  // ============ الالتزامات (2000) ============
  { id: 'acc-2000', code: '2000', name: 'الالتزامات', type: 'liability', level: 1, parentId: null, balance: 0 },
  
  // الالتزامات المتداولة (2100)
  { id: 'acc-2100', code: '2100', name: 'الالتزامات المتداولة', type: 'liability', level: 2, parentId: 'acc-2000', balance: 0 },
  { id: 'acc-2210', code: '2210', name: 'الموردون', type: 'liability', level: 3, parentId: 'acc-2100', balance: 0 },
  { id: 'acc-2211', code: '2211', name: 'مورد 1', type: 'liability', level: 4, parentId: 'acc-2210', balance: 0 },
  { id: 'acc-2212', code: '2212', name: 'مورد 2', type: 'liability', level: 4, parentId: 'acc-2210', balance: 0 },
  { id: 'acc-2213', code: '2213', name: 'مورد 3', type: 'liability', level: 4, parentId: 'acc-2210', balance: 0 },
  { id: 'acc-2214', code: '2214', name: 'مورد 4', type: 'liability', level: 4, parentId: 'acc-2210', balance: 0 },
  { id: 'acc-2215', code: '2215', name: 'مورد 5', type: 'liability', level: 4, parentId: 'acc-2210', balance: 0 },
  { id: 'acc-2216', code: '2216', name: 'مورد 6', type: 'liability', level: 4, parentId: 'acc-2210', balance: 0 },
  { id: 'acc-2217', code: '2217', name: 'مورد 7', type: 'liability', level: 4, parentId: 'acc-2210', balance: 0 },
  { id: 'acc-2218', code: '2218', name: 'مورد 8', type: 'liability', level: 4, parentId: 'acc-2210', balance: 0 },
  { id: 'acc-2220', code: '2220', name: 'أوراق دفع', type: 'liability', level: 3, parentId: 'acc-2100', balance: 0 },
  { id: 'acc-2230', code: '2230', name: 'الضريبة المستحقة', type: 'liability', level: 3, parentId: 'acc-2100', balance: 0 },
  { id: 'acc-2240', code: '2240', name: 'مرتبات مستحقة', type: 'liability', level: 3, parentId: 'acc-2100', balance: 0 },
  { id: 'acc-2250', code: '2250', name: 'إيرادات مستحقة', type: 'liability', level: 3, parentId: 'acc-2100', balance: 0 },
  
  // الالتزامات طويلة الأجل (2200)
  { id: 'acc-2200', code: '2200', name: 'الالتزامات طويلة الأجل', type: 'liability', level: 2, parentId: 'acc-2000', balance: 0 },
  { id: 'acc-2260', code: '2260', name: 'القروض طويلة الأجل', type: 'liability', level: 3, parentId: 'acc-2200', balance: 0 },
  { id: 'acc-2270', code: '2270', name: 'السندات المستحقة', type: 'liability', level: 3, parentId: 'acc-2200', balance: 0 },

  // ============ حقوق الملكية (3000) ============
  { id: 'acc-3000', code: '3000', name: 'حقوق الملكية', type: 'equity', level: 1, parentId: null, balance: 0 },
  { id: 'acc-3001', code: '3001', name: 'رأس المال', type: 'equity', level: 2, parentId: 'acc-3000', balance: 0 },
  { id: 'acc-3002', code: '3002', name: 'احتياطي عام', type: 'equity', level: 2, parentId: 'acc-3000', balance: 0 },
  { id: 'acc-3003', code: '3003', name: 'الأرباح المحتجزة', type: 'equity', level: 2, parentId: 'acc-3000', balance: 0 },
  { id: 'acc-3004', code: '3004', name: 'الأسهم', type: 'equity', level: 2, parentId: 'acc-3000', balance: 0 },

  // ============ الإيرادات (4000) ============
  { id: 'acc-4000', code: '4000', name: 'الإيرادات', type: 'revenue', level: 1, parentId: null, balance: 0 },
  { id: 'acc-4001', code: '4001', name: 'إيرادات المبيعات', type: 'revenue', level: 2, parentId: 'acc-4000', balance: 0 },
  { id: 'acc-4002', code: '4002', name: 'إيرادات الخدمات', type: 'revenue', level: 2, parentId: 'acc-4000', balance: 0 },
  { id: 'acc-4003', code: '4003', name: 'إيرادات أخرى', type: 'revenue', level: 2, parentId: 'acc-4000', balance: 0 },
  { id: 'acc-4010', code: '4010', name: 'مردودات المبيعات', type: 'revenue', level: 2, parentId: 'acc-4000', balance: 0 },
  { id: 'acc-4020', code: '4020', name: 'خصومات مسموح بها', type: 'revenue', level: 2, parentId: 'acc-4000', balance: 0 },

  // ============ المصروفات (5000) ============
  { id: 'acc-5000', code: '5000', name: 'المصروفات', type: 'expense', level: 1, parentId: null, balance: 0 },
  { id: 'acc-5001', code: '5001', name: 'تكلفة المبيعات', type: 'expense', level: 2, parentId: 'acc-5000', balance: 0 },
  { id: 'acc-5002', code: '5002', name: 'مرتبات وأجور', type: 'expense', level: 2, parentId: 'acc-5000', balance: 0 },
  { id: 'acc-5003', code: '5003', name: 'إيجار المصنع', type: 'expense', level: 2, parentId: 'acc-5000', balance: 0 },
  
  // مصروفات إدارية وعامة (5010)
  { id: 'acc-5010', code: '5010', name: 'مصروفات إدارية وعامة', type: 'expense', level: 2, parentId: 'acc-5000', balance: 0 },
  { id: 'acc-5011', code: '5011', name: 'إيجار المكتب', type: 'expense', level: 3, parentId: 'acc-5010', balance: 0 },
  { id: 'acc-5012', code: '5012', name: 'مرافق (كهرباء/مياه)', type: 'expense', level: 3, parentId: 'acc-5010', balance: 0 },
  { id: 'acc-5013', code: '5013', name: 'اتصالات وانترنت', type: 'expense', level: 3, parentId: 'acc-5010', balance: 0 },
  { id: 'acc-5014', code: '5014', name: 'قرطاسية ومستلزمات', type: 'expense', level: 3, parentId: 'acc-5010', balance: 0 },
  { id: 'acc-5015', code: '5015', name: 'صيانة وتصليحات', type: 'expense', level: 3, parentId: 'acc-5010', balance: 0 },
  { id: 'acc-5016', code: '5016', name: 'تأمينات', type: 'expense', level: 3, parentId: 'acc-5010', balance: 0 },
  { id: 'acc-5017', code: '5017', name: 'سفر وإنتقالات', type: 'expense', level: 3, parentId: 'acc-5010', balance: 0 },
  { id: 'acc-5018', code: '5018', name: 'إعلان ودعاية', type: 'expense', level: 3, parentId: 'acc-5010', balance: 0 },
  
  // مصروفات بيعية (5020)
  { id: 'acc-5020', code: '5020', name: 'مصروفات بيعية', type: 'expense', level: 2, parentId: 'acc-5000', balance: 0 },
  { id: 'acc-5021', code: '5021', name: 'عمولات المبيعات', type: 'expense', level: 3, parentId: 'acc-5020', balance: 0 },
  { id: 'acc-5022', code: '5022', name: 'شحن وتوصيل', type: 'expense', level: 3, parentId: 'acc-5020', balance: 0 },
  
  // مصروفات مالية (5030)
  { id: 'acc-5030', code: '5030', name: 'مصروفات مالية', type: 'expense', level: 2, parentId: 'acc-5000', balance: 0 },
  { id: 'acc-5031', code: '5031', name: 'مصروفات فائدة', type: 'expense', level: 3, parentId: 'acc-5030', balance: 0 },
  { id: 'acc-5032', code: '5032', name: 'خسائر عملة', type: 'expense', level: 3, parentId: 'acc-5030', balance: 0 },
  
  // الإهلاك (5040)
  { id: 'acc-5040', code: '5040', name: 'الإهلاك', type: 'expense', level: 2, parentId: 'acc-5000', balance: 0 }
]
const mockBankAccounts: any[] = []
const mockChecks: any[] = []
const mockEmployees: any[] = []
const mockExpenses: any[] = []
// استيراد البيانات الكاملة للقيود المحاسبية (150 قيد)
// سيتم تحميل البيانات ديناميكياً لتجنب أخطاء require في العميل
const mockJournalEntriesDefault: JournalEntry[] = []

// ============ ERROR BOUNDARY ============
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean; error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4" dir="rtl">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-red-800 mb-2">حدث خطأ في التطبيق</h1>
            <p className="text-gray-600 mb-4">نأسف، حدث خطأ غير متوقع. يرجى تحديث الصفحة.</p>
            <details className="text-left bg-gray-100 p-4 rounded-lg mb-4">
                <summary className="cursor-pointer font-bold text-gray-700">تفاصيل الخطأ</summary>
                <pre className="mt-2 text-sm text-red-600 overflow-auto">{this.state.error?.message}\n{this.state.error?.stack}</pre>
            </details>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold"
            >
              تحديث الصفحة
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// ============ MAIN COMPONENT ============
function AccountingApp() {
  const [activeModule, setActiveModule] = useState<ModuleType>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [purchaseInvoices, setPurchaseInvoices] = useState<PurchaseInvoice[]>([])
  const [items, setItems] = useState<Item[]>(mockItems)
  const [parties, setParties] = useState<Party[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(mockJournalEntriesDefault)
  const [journalDataLoaded, setJournalDataLoaded] = useState(false)
  const [showJournalDialog, setShowJournalDialog] = useState(false)
  const [viewingJournalEntry, setViewingJournalEntry] = useState<JournalEntry | null>(null)
  const [journalSearchTerm, setJournalSearchTerm] = useState('')
  const [journalDateFilter, setJournalDateFilter] = useState('')
  
  // حالات التقارير - جديدة وبسيطة
  const [showIncomeStatement, setShowIncomeStatement] = useState(false)
  const [showBalanceSheet, setShowBalanceSheet] = useState(false)
  const [showTrialBalance, setShowTrialBalance] = useState(false)
  const [reportFromDate, setReportFromDate] = useState('')
  const [reportToDate, setReportToDate] = useState('')
  const [reportType, setReportType] = useState<'detailed' | 'summary'>('detailed')
  
  // حالات جديدة لإدارة القيود بشكل كامل
  const [editingJournalEntry, setEditingJournalEntry] = useState<JournalEntry | null>(null)
  const [showJournalFormDialog, setShowJournalFormDialog] = useState(false)
  const [journalForm, setJournalForm] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    lines: [{ accountCode: '', accountName: '', debit: 0, credit: 0 }] as JournalEntryLine[]
  })
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set(['acc-1000', 'acc-2000', 'acc-3000', 'acc-4000', 'acc-5000']))
  const [searchTerm, setSearchTerm] = useState('')

  // إعدادات الشركة
  const [companySettings, setCompanySettings] = useState({
    nameAr: 'بلانك وود للمطابخ',
    nameEn: 'Blank Wood Kitchens',
    commercialRegister: '',
    taxNumber: '',
    address: '',
    phone: '',
    email: '',
    fiscalYear: '2026',
    fiscalYearStart: '2026-01',
    currency: 'egp',
    language: 'ar'
  })
  const [settingsSaved, setSettingsSaved] = useState(false)

  // حالة نافذة إضافة حساب جديد
  const [showAddAccountDialog, setShowAddAccountDialog] = useState(false)
  const [newAccountForm, setNewAccountForm] = useState({
    code: '',
    name: '',
    type: 'asset' as 'asset' | 'liability' | 'equity' | 'revenue' | 'expense',
    parentId: '',
    balance: 0,
    level: 2
  })

  // حالات الاستاذ العام
  const [selectedGLAccount, setSelectedGLAccount] = useState<string>('')
  const [glDateFrom, setGlDateFrom] = useState('')
  const [glDateTo, setGlDateTo] = useState(new Date().toISOString().split('T')[0])
  const [showGLStatement, setShowGLStatement] = useState(false)
  
  // حالات عرض/تعديل الحساب في دليل الحسابات
  const [viewingAccount, setViewingAccount] = useState<any>(null)
  const [showAccountDialog, setShowAccountDialog] = useState(false)
  const [editingAccount, setEditingAccount] = useState<any>(null)
  const [showEditAccountDialog, setShowEditAccountDialog] = useState(false)

  // سجل العمليات (يتم مشاركته بين جميع الأجهزة)
  const [activityLogs, setActivityLogs] = useState<{id: string; time: string; action: string; details: string}[]>([])

  // دالة إضافة عملية جديدة ومزامنتها فوراً
  const addLogEntry = useCallback((action: string, details: string) => {
    const logEntry = { 
      id: Date.now().toString(), 
      time: new Date().toLocaleString('ar-EG'), 
      action, 
      details 
    }
    setActivityLogs(prev => {
      const updated = [logEntry, ...prev].slice(0, 100)
      // مزامنة فورية مع الخادم
      setTimeout(() => syncDataToServer({ activityLogs: updated }), 100)
      return updated
    })
  }, [])

  // دالة مزامنة البيانات مع الخادم
  const syncDataToServer = useCallback(async (data?: { 
    journalEntries?: any[], 
    activityLogs?: any[], 
    companySettings?: any 
  }) => {
    try {
      const payload: any = {}
      if (data?.journalEntries) payload.journalEntries = data.journalEntries
      if (data?.activityLogs) payload.activityLogs = data.activityLogs
      if (data?.companySettings) payload.companySettings = data.companySettings
      
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const result = await response.json()
      if (result.success) {
        console.log('✓ تمت المزامنة بنجاح')
      }
    } catch (error) {
      console.error('خطأ في المزامنة:', error)
    }
  }, [])

  // دالة مزامنة جميع البيانات الحالية
  const syncAllDataToServer = useCallback(() => {
    syncDataToServer({ 
      activityLogs, 
      companySettings,
      journalEntries,
      accounts: mockAccounts
    })
  }, [activityLogs, companySettings, journalEntries, syncDataToServer])

  // ⭐ مهم: مزامنة فورية للقيود عند أي تغيير
  useEffect(() => {
    // تأخير المزامنة قليلاً لتجنب الطلبات المتكررة
    const timeoutId = setTimeout(() => {
      if (journalEntries.length > 0) {
        console.log('🔄 جاري مزامنة القيود...', journalEntries.length, 'قيد')
        syncDataToServer({ 
          journalEntries,
          accounts: mockAccounts
        })
      }
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [journalEntries, syncDataToServer])

  // دالة حساب كشف الحساب من القيود المحاسبية
  const getAccountStatement = useCallback((accountCode: string) => {
    const account = mockAccounts.find(a => a.code === accountCode)
    if (!account) return { account: null, entries: [], openingBalance: 0, totalDebit: 0, totalCredit: 0, closingBalance: 0 }
    
    // تصفية القيود للحساب المحدد وفي التاريخ المحدد
    let filteredEntries = journalEntries.filter(entry => {
      if (entry.status !== 'posted') return false
      if (glDateFrom && entry.date < glDateFrom) return false
      if (glDateTo && entry.date > glDateTo) return false
      return entry.lines.some(line => line.accountCode === accountCode)
    })

    // حساب الرصيد الافتتاحي (قبل تاريخ البداية)
    let openingBalance = account.balance || 0
    if (glDateFrom) {
      const earlierEntries = journalEntries.filter(entry => {
        if (entry.status !== 'posted') return false
        if (entry.date >= glDateFrom) return false
        return entry.lines.some(line => line.accountCode === accountCode)
      })
      
      earlierEntries.forEach(entry => {
        entry.lines.forEach(line => {
          if (line.accountCode === accountCode) {
            // للأصول والمصروفات: المدين يزيد، الدائن ينقص
            // للخصوم والإيرادات والدائن يزيد، المدين ينقص
            if (['asset', 'expense'].includes(account.type)) {
              openingBalance += (line.debit - line.credit)
            } else {
              openingBalance += (line.credit - line.debit)
            }
          }
        })
      })
    }

    // حساب إجمالي المدين والدائن
    let totalDebit = 0
    let totalCredit = 0

    filteredEntries.forEach(entry => {
      entry.lines.forEach(line => {
        if (line.accountCode === accountCode) {
          totalDebit += line.debit || 0
          totalCredit += line.credit || 0
        }
      })
    })

    // حساب الرصيد الختامي
    let closingBalance = openingBalance
    if (['asset', 'expense'].includes(account.type)) {
      closingBalance = openingBalance + totalDebit - totalCredit
    } else {
      closingBalance = openingBalance + totalCredit - totalDebit
    }

    return {
      account,
      entries: filteredEntries,
      openingBalance,
      totalDebit,
      totalCredit,
      closingBalance
    }
  }, [journalEntries, glDateFrom, glDateTo])

  // دالة تصدير Excel لكشف الحساب
  const exportAccountToExcel = () => {
    if (!selectedGLAccount) return
    
    const statement = getAccountStatement(selectedGLAccount)
    if (!statement.account) return

    const csvContent = '\uFEFF' + `كشف حساب: ${statement.account.name} (${statement.account.code})\n` +
      `التاريخ من: ${glDateFrom || 'بداية الفترة'} إلى: ${glDateTo || 'ت اليوم'}\n` +
      `الشركة: ${companySettings.nameAr}\n\n` +
      `التاريخ,رقم القيد,البيان,مدين,دائن,الرصيد\n`

    let runningBalance = statement.openingBalance
    const rows = [`رصيد افتتاحي,,,,,${runningBalance}`]
    
    statement.entries.forEach(entry => {
      const line = entry.lines.find(l => l.accountCode === selectedGLAccount)
      if (line) {
        if (['asset', 'expense'].includes(statement.account.type)) {
          runningBalance += (line.debit - line.credit)
        } else {
          runningBalance += (line.credit - line.debit)
        }
        rows.push(`${entry.date},${entry.entryNumber},${entry.description},${line.debit || ''},${line.credit || ''},${runningBalance}`)
      }
    })

    const fullContent = csvContent + rows.join('\n') + `\n\nالإجمالي,,,$${statement.totalDebit},$${statement.totalCredit},$${statement.closingBalance}`
    
    const blob = new Blob([fullContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `كشف_حساب_${statement.account.code}_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    
    addLogEntry('تصدير Excel', `تم تصدير كشف حساب: ${statement.account.name}`)
  }

  // دالة طباعة كشف الحساب
  const printAccountStatement = () => {
    if (!selectedGLAccount) return
    window.print()
    addLogEntry('طباعة', `تم طباعة كشف حساب`)
  }

  // دالة عرض تفاصيل الحساب
  const viewAccountDetails = (account: any) => {
    setViewingAccount(account)
    setShowAccountDialog(true)
  }

  // دالة تعديل الحساب
  const editAccount = (account: any) => {
    setEditingAccount({...account})
    setShowEditAccountDialog(true)
  }

  // دالة حذف الحساب
  const deleteAccount = (accountId: string, accountName: string) => {
    if (confirm(`هل أنت متأكد من حذف الحساب "${accountName}"؟`)) {
      const index = mockAccounts.findIndex(a => a.id === accountId)
      if (index > -1) {
        mockAccounts.splice(index, 1)
        addLogEntry('حذف حساب', `تم حذف حساب: ${accountName}`)
        alert('✓ تم حذف الحساب بنجاح')
      }
    }
  }

  // دالة حفظ تعديلات الحساب
  const saveAccountEdit = () => {
    if (!editingAccount) return
    const index = mockAccounts.findIndex(a => a.id === editingAccount.id)
    if (index > -1) {
      mockAccounts[index] = editingAccount
      addLogEntry('تعديل حساب', `تم تعديل حساب: ${editingAccount.name}`)
      setShowEditAccountDialog(false)
      alert('✓ تم تحديث الحساب بنجاح')
    }
  }

  // تحميل البيانات المشتركة من الخادم عند فتح الصفحة
  useEffect(() => {
    let mounted = true
    
    const loadSharedData = async () => {
      try {
        const response = await fetch('/api/data')
        const data = await response.json()
        
        if (!mounted) return
        
        console.log('📥 البيانات المحملة من الخادم:', {
          journalEntries: data.journalEntries?.length || 0,
          activityLogs: data.activityLogs?.length || 0,
          hasCompanySettings: !!data.companySettings,
          accounts: data.accounts?.length || 0
        })
        
        // ⭐ تحميل القيود المحاسبية (الأهم!)
        if (data.journalEntries && Array.isArray(data.journalEntries) && data.journalEntries.length > 0) {
          setJournalEntries(data.journalEntries)
          console.log(`✓ تم تحميل ${data.journalEntries.length} قيد محاسبي من الخادم`)
        }
        
        // تحميل الحسابات المحدثة
        if (data.accounts && Array.isArray(data.accounts) && data.accounts.length > 0) {
          // دمج الحسابات مع الحسابات الموجودة
          data.accounts.forEach((newAcc: any) => {
            const existingIdx = mockAccounts.findIndex(a => a.id === newAcc.id)
            if (existingIdx >= 0) {
              mockAccounts[existingIdx] = newAcc
            } else {
              mockAccounts.push(newAcc)
            }
          })
          console.log(`✓ تم تحديث ${data.accounts.length} حساب`)
        }
        
        // تحميل سجل العمليات المشترك
        if (data.activityLogs && data.activityLogs.length > 0) {
          setActivityLogs(data.activityLogs)
          console.log(`✓ تم تحميل ${data.activityLogs.length} عملية من الخادم`)
        }
        
        // تحميل إعدادات الشركة إذا كانت محفوظة
        if (data.companySettings) {
          setCompanySettings(data.companySettings)
          console.log('✓ تم تحميل إعدادات الشركة')
        }
      } catch (err) {
        console.error('خطأ في تحميل البيانات المشتركة:', err)
      }
    }

    loadSharedData()

    // المزامنة التلقائية كل 15 ثانية
    const syncInterval = setInterval(() => {
      console.log('🔄 جاري المزامنة الدورية...')
      syncAllDataToServer()
    }, 15000)

    // حفظ البيانات عند إغلاق الصفحة
    const handleBeforeUnload = () => {
      // استخدام sendBeacon للحفظ السريع قبل الإغلاق
      const data = new Blob([JSON.stringify({
        activityLogs,
        companySettings,
        journalEntries
      })], { type: 'application/json' })
      navigator.sendBeacon('/api/data', data)
      console.log('💾 تم حفظ البيانات قبل الإغلاق')
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => { 
      mounted = false 
      clearInterval(syncInterval)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      // حفظ نهائي عند إلغاء المكون
      syncAllDataToServer()
    }
  }, [syncAllDataToServer])

  // تحميل إعدادات الشركة من localStorage
  useEffect(() => {
    const saved = localStorage.getItem('companySettings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setCompanySettings(parsed)
      } catch (e) {
        console.error('خطأ في تحميل إعدادات الشركة:', e)
      }
    }
  }, [])

  // تحميل بيانات القيود المحاسبية من ملف JSON
  useEffect(() => {
    let mounted = true
    fetch('/data/journalEntriesData.json')
      .then(res => {
        if (!res.ok) throw new Error('فشل في تحميل البيانات')
        return res.json()
      })
      .then((data: JournalEntry[]) => {
        if (mounted) {
          setJournalEntries(data)
          setJournalDataLoaded(true)
        }
      })
      .catch(err => {
        if (mounted) {
          console.error('خطأ في تحميل بيانات القيود:', err)
          setJournalDataLoaded(true)
        }
      })
    return () => { mounted = false }
  }, [])

  // Toggle account expansion
  const toggleAccountExpansion = (accountId: string) => {
    setExpandedAccounts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(accountId)) {
        newSet.delete(accountId)
      } else {
        newSet.add(accountId)
      }
      return newSet
    })
  }
  
  // Invoice Form States
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [invoiceJustSaved, setInvoiceJustSaved] = useState(false)
  const [currentInvoiceForPrint, setCurrentInvoiceForPrint] = useState<Invoice | null>(null)
  const [invoiceForm, setInvoiceForm] = useState({
    customerId: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    paymentMethod: 'cash' as 'cash' | 'bank' | 'check' | 'partial',
    paidAmount: 0,
    taxRate: 15,
    discount: 0,
    items: [] as { itemId: string; quantity: number; price: number; discount: number }[]
  })

  // Purchase Invoice Form States
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false)
  const [editingPurchase, setEditingPurchase] = useState<PurchaseInvoice | null>(null)
  const [purchaseJustSaved, setPurchaseJustSaved] = useState(false)
  const [currentPurchaseForPrint, setCurrentPurchaseForPrint] = useState<PurchaseInvoice | null>(null)
  const [purchaseForm, setPurchaseForm] = useState({
    supplierId: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    paymentMethod: 'cash' as 'cash' | 'bank' | 'check' | 'partial',
    paidAmount: 0,
    taxRate: 15,
    discount: 0,
    items: [] as { itemId: string; quantity: number; price: number; discount: number }[]
  })
  const [showAddSupplierDialog, setShowAddSupplierDialog] = useState(false)
  const [newSupplier, setNewSupplier] = useState({ nameAr: '', type: 'supplier' as 'supplier' | 'customer' | 'both', phone: '' })

  // Delete Confirmation State
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; type: string; id: string; name: string }>({ show: false, type: '', id: '', name: '' })

  // Notification State - Empty for fresh start
  const [notifications] = useState<any[]>([])

  // Login Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggedIn(true)
  }

  // ============ INVOICE ACTIONS ============
  const openNewInvoice = () => {
    setEditingInvoice(null)
    setInvoiceForm({ 
      customerId: '', 
      date: new Date().toISOString().split('T')[0], 
      notes: '', 
      paymentMethod: 'cash',
      paidAmount: 0,
      taxRate: 15,
      discount: 0,
      items: [] 
    })
    setShowInvoiceDialog(true)
  }

  const openEditInvoice = (invoice: Invoice) => {
    if (invoice.status === 'posted' || invoice.status === 'paid') {
      alert('لا يمكن تعديل فاتورة مرحلة')
      return
    }
    setEditingInvoice(invoice)
    setInvoiceForm({
      customerId: invoice.id,
      date: invoice.date,
      notes: '',
      items: invoice.items.map(item => ({ itemId: item.id, quantity: item.quantity, price: item.price, discount: 0 }))
    })
    setShowInvoiceDialog(true)
  }

  // Add new customer/party on the fly
  const [showAddCustomerDialog, setShowAddCustomerDialog] = useState(false)
  const [newCustomer, setNewCustomer] = useState({ nameAr: '', type: 'customer' as 'customer' | 'supplier' | 'both', phone: '' })

  const addNewCustomer = () => {
    if (!newCustomer.nameAr) {
      alert('يرجى إدخال اسم العميل')
      return
    }
    const party: Party = {
      id: Date.now().toString(),
      nameAr: newCustomer.nameAr,
      type: newCustomer.type,
      phone: newCustomer.phone,
      balance: 0
    }
    setParties(prev => [...prev, party])
    setInvoiceForm(prev => ({ ...prev, customerId: party.id }))
    setNewCustomer({ nameAr: '', type: 'customer', phone: '' })
    setShowAddCustomerDialog(false)
  }

  // ============ PARTIES CRUD ============
  const [showPartyDialog, setShowPartyDialog] = useState(false)
  const [editingParty, setEditingParty] = useState<Party | null>(null)
  const [partyForm, setPartyForm] = useState({ nameAr: '', type: 'customer' as 'customer' | 'supplier' | 'both', phone: '', balance: 0 })

  const openNewParty = () => {
    setEditingParty(null)
    setPartyForm({ nameAr: '', type: 'customer', phone: '', balance: 0 })
    setShowPartyDialog(true)
  }

  const openEditParty = (party: Party) => {
    setEditingParty(party)
    setPartyForm({
      nameAr: party.nameAr,
      type: party.type,
      phone: party.phone,
      balance: party.balance
    })
    setShowPartyDialog(true)
  }

  const saveParty = () => {
    if (!partyForm.nameAr) {
      alert('يرجى إدخال اسم الطرف')
      return
    }

    if (editingParty) {
      setParties(prev => prev.map(p => 
        p.id === editingParty.id 
          ? { ...p, ...partyForm }
          : p
      ))
      alert('تم تحديث بيانات الطرف بنجاح')
    } else {
      const party: Party = {
        id: Date.now().toString(),
        nameAr: partyForm.nameAr,
        type: partyForm.type,
        phone: partyForm.phone,
        balance: partyForm.balance
      }
      setParties(prev => [...prev, party])
      alert('تم إضافة الطرف بنجاح')
    }
    
    setShowPartyDialog(false)
    setEditingParty(null)
    setPartyForm({ nameAr: '', type: 'customer', phone: '', balance: 0 })
  }

  const deleteParty = (partyId: string, partyName: string) => {
    setDeleteConfirm({
      show: true,
      type: 'party',
      id: partyId,
      name: partyName
    })
  }

  const viewPartyDetails = (party: Party) => {
    alert(`تفاصيل الطرف:\n\nالاسم: ${party.nameAr}\nالنوع: ${party.type === 'customer' ? 'عميل' : party.type === 'supplier' ? 'مورد' : 'كلاهما'}\nالهاتف: ${party.phone || 'غير محدد'}\nالرصيد: ${party.balance >= 0 ? '' : '-'}${Math.abs(party.balance).toLocaleString()} ج.م`)
  }

  const printPartyStatement = (party: Party) => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html dir="rtl">
        <head><title>كشف حساب - ${party.nameAr}</title>
        <style>
          body { font-family: Arial; padding: 20px; direction: rtl; }
          h1 { color: #005f73; text-align: center; }
          .info { margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
          th { background: #005f73; color: white; }
        </style>
        </head>
        <body>
          <h1>📋 كشف حساب</h1>
          <div class="info">
            <p><strong>الاسم:</strong> ${party.nameAr}</p>
            <p><strong>الهاتف:</strong> ${party.phone || '-'}</p>
            <p><strong>الرصيد الحالي:</strong> ${party.balance >= 0 ? '' : '-'}${Math.abs(party.balance).toLocaleString()} ج.م</p>
          </div>
          <table>
            <thead>
              <tr><th>التاريخ</th><th>البيان</th><th>مدين</th><th>دائن</th><th>الرصيد</th></tr>
            </thead>
            <tbody>
              <tr><td colspan="5" style="text-align:center;">لا توجد حركات</td></tr>
            </tbody>
          </table>
        </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  // ============ TRANSACTIONS CRUD ============
  const [showTransactionDialog, setShowTransactionDialog] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [transactionForm, setTransactionForm] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    description: '', 
    amount: 0, 
    type: 'income' as 'income' | 'expense',
    category: ''
  })
  const [viewingTransaction, setViewingTransaction] = useState<Transaction | null>(null)

  const openNewTransaction = (type: 'income' | 'expense') => {
    setEditingTransaction(null)
    setTransactionForm({ 
      date: new Date().toISOString().split('T')[0], 
      description: '', 
      amount: 0, 
      type,
      category: type === 'income' ? 'إيرادات أخرى' : 'مصروفات أخرى'
    })
    setShowTransactionDialog(true)
  }

  const openEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setTransactionForm({
      date: transaction.date,
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category
    })
    setShowTransactionDialog(true)
  }

  const saveTransaction = () => {
    if (!transactionForm.description) {
      alert('يرجى إدخال الوصف')
      return
    }
    if (!transactionForm.amount || transactionForm.amount <= 0) {
      alert('يرجى إدخال مبلغ صحيح')
      return
    }

    if (editingTransaction) {
      setTransactions(prev => prev.map(t => 
        t.id === editingTransaction.id 
          ? { ...t, ...transactionForm }
          : t
      ))
      alert('تم تحديث العملية بنجاح')
    } else {
      const transaction: Transaction = {
        id: Date.now().toString(),
        date: transactionForm.date,
        description: transactionForm.description,
        amount: transactionForm.amount,
        type: transactionForm.type,
        category: transactionForm.category
      }
      setTransactions(prev => [...prev, transaction])
      alert('تمت إضافة العملية بنجاح')
    }
    
    setShowTransactionDialog(false)
    setEditingTransaction(null)
    setTransactionForm({ date: new Date().toISOString().split('T')[0], description: '', amount: 0, type: 'income', category: '' })
  }

  const deleteTransaction = (transactionId: string, description: string) => {
    setDeleteConfirm({
      show: true,
      type: 'transaction',
      id: transactionId,
      name: description
    })
  }

  const viewTransactionDetails = (transaction: Transaction) => {
    setViewingTransaction(transaction)
  }

  const printTransaction = (transaction: Transaction) => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html dir="rtl">
        <head><title>${transaction.type === 'income' ? 'إيصال إيراد' : 'إيصال مصروف'}</title>
        <style>
          body { font-family: Arial; padding: 40px; direction: rtl; max-width: 400px; margin: 0 auto; }
          h1 { color: #005f73; text-align: center; border-bottom: 2px solid #005f73; padding-bottom: 10px; }
          .details { margin: 20px 0; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #ddd; }
          .total { font-size: 24px; font-weight: bold; color: ${transaction.type === 'income' ? 'green' : 'red'}; text-align: center; margin-top: 20px; }
          .date { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        </style>
        </head>
        <body>
          <h1>${transaction.type === 'income' ? '💰 إيصال إيراد' : '💸 إيصال مصروف'}</h1>
          <div class="details">
            <div class="row"><span>رقم العملية:</span><span>#${transaction.id.slice(-6)}</span></div>
            <div class="row"><span>التاريخ:</span><span>${transaction.date}</span></div>
            <div class="row"><span>الوصف:</span><span>${transaction.description}</span></div>
            <div class="row"><span>الفئة:</span><span>${transaction.category}</span></div>
          </div>
          <div class="total">${transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()} ج.م</div>
          <div class="date">تاريخ الطباعة: ${new Date().toLocaleDateString('ar-SA')}</div>
        </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  // ============ JOURNAL ENTRIES CRUD ACTIONS ============
  
  // فتح نافذة قيد جديد
  const openNewJournalDialog = () => {
    setEditingJournalEntry(null)
    setJournalForm({
      date: new Date().toISOString().split('T')[0],
      description: '',
      lines: [{ accountCode: '', accountName: '', debit: 0, credit: 0 }]
    })
    setShowJournalFormDialog(true)
  }

  // فتح نافذة تعديل قيد
  const openEditJournal = (entry: JournalEntry) => {
    if (entry.status === 'posted') {
      alert('لا يمكن تعديل قيد مرحل - يرجى إلغاء الترحيل أولاً')
      return
    }
    setEditingJournalEntry(entry)
    setJournalForm({
      date: entry.date,
      description: entry.description,
      lines: [...entry.lines]
    })
    setShowJournalFormDialog(true)
  }

  // إضافة سطر جديد للقيد
  const addNewJournalLine = () => {
    setJournalForm(prev => ({
      ...prev,
      lines: [...prev.lines, { accountCode: '', accountName: '', debit: 0, credit: 0 }]
    }))
  }

  // حذف سطر من القيد
  const removeJournalLine = (index: number) => {
    if (journalForm.lines.length <= 1) {
      alert('يجب أن يحتوي القيد على سطر واحد على الأقل')
      return
    }
    setJournalForm(prev => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== index)
    }))
  }

  // تحديث بيانات سطر في القيد
  const updateJournalLine = (index: number, field: string, value: any) => {
    setJournalForm(prev => ({
      ...prev,
      lines: prev.lines.map((line, i) => {
        if (i === index) {
          const updatedLine = { ...line, [field]: value }
          // عند اختيار الحساب، يتم ملء اسم الحساب تلقائياً
          if (field === 'accountCode') {
            const selectedAccount = mockAccounts.find(acc => acc.code === value)
            if (selectedAccount) {
              updatedLine.accountName = selectedAccount.name
            }
          }
          return updatedLine
        }
        return line
      })
    }))
  }

  // حفظ قيد جديد أو تعديل قيد موجود
  const saveJournalEntry = () => {
    // التحقق من البيانات
    if (!journalForm.description.trim()) {
      alert('يرجى إدخال بيان القيد')
      return
    }

    // التحقق من وجود بنود صالحة
    const validLines = journalForm.lines.filter(line => line.accountCode && (line.debit > 0 || line.credit > 0))
    if (validLines.length < 2) {
      alert('يجب أن يحتوي القيد على بندين صالحين على الأقل')
      return
    }

    // حساب المجاميع
    const totalDebit = validLines.reduce((sum, line) => sum + (line.debit || 0), 0)
    const totalCredit = validLines.reduce((sum, line) => sum + (line.credit || 0), 0)

    // التحقق من التوازن
    if (totalDebit !== totalCredit) {
      alert(`القيد غير متوازن\nالمدين: ${totalDebit.toLocaleString()} ج.م\nالدائن: ${totalCredit.toLocaleString()} ج.م\nالفرق: ${Math.abs(totalDebit - totalCredit).toLocaleString()} ج.م`)
      return
    }

    if (editingJournalEntry) {
      // تعديل قيد موجود
      setJournalEntries(prev => prev.map(entry => 
        entry.id === editingJournalEntry.id 
          ? {
              ...entry,
              date: journalForm.date,
              description: journalForm.description,
              lines: validLines,
              totalDebit,
              totalCredit
            }
          : entry
      ))
      alert('تم تحديث القيد بنجاح ✓')
    } else {
      // إضافة قيد جديد
      const newEntry: JournalEntry = {
        id: `je-${Date.now()}`,
        entryNumber: Math.max(...journalEntries.map(e => e.entryNumber), 0) + 1,
        date: journalForm.date,
        description: journalForm.description,
        lines: validLines,
        totalDebit,
        totalCredit,
        status: 'draft'
      }
      setJournalEntries(prev => [...prev, newEntry])
      alert('تم إضافة القيد الجديد بنجاح ✓')
    }

    // إغلاق النافذة وإعادة تعيين النموذج
    setShowJournalFormDialog(false)
    setEditingJournalEntry(null)
    setJournalForm({
      date: new Date().toISOString().split('T')[0],
      description: '',
      lines: [{ accountCode: '', accountName: '', debit: 0, credit: 0 }]
    })
  }

  // حذف قيد
  const deleteJournalEntry = (id: string) => {
    const entry = journalEntries.find(e => e.id === id)
    if (!entry) return
    
    if (entry.status === 'posted') {
      alert('لا يمكن حذف قيد مرحل - يرجى إلغاء الترحيل أولاً')
      return
    }

    if (confirm(`هل أنت متأكد من حذف القيد رقم ${entry.entryNumber}؟\n\nالبيان: ${entry.description}`)) {
      setJournalEntries(prev => prev.filter(e => e.id !== id))
      alert('تم حذف القيد بنجاح')
      
      // إذا كان القيد معروضاً، أغلق نافذة العرض
      if (viewingJournalEntry?.id === id) {
        setViewingJournalEntry(null)
      }
    }
  }

  // ترحيل قيد
  const postJournalEntry = (id: string) => {
    const entry = journalEntries.find(e => e.id === id)
    if (!entry) return

    // التحقق من توازن القيد قبل الترحيل
    if (entry.totalDebit !== entry.totalCredit) {
      alert('لا يمكن ترحيل قيد غير متوازن')
      return
    }

    if (confirm(`هل تريد ترحيل القيد رقم ${entry.entryNumber}؟\n\nبعد الترحيل لا يمكن تعديل القيد أو حذفه`)) {
      setJournalEntries(prev => prev.map(e => 
        e.id === id ? { ...e, status: 'posted' as const } : e
      ))
      alert('تم ترحيل القيد بنجاح ✓')
      
      // تحديث العرض إذا كان القيد مفتوحاً
      if (viewingJournalEntry?.id === id) {
        setViewingJournalEntry(prev => prev ? { ...prev, status: 'posted' } : null)
      }
    }
  }

  // إلغاء ترحيل قيد
  const unpostJournalEntry = (id: string) => {
    const entry = journalEntries.find(e => e.id === id)
    if (!entry) return

    if (confirm(`هل تريد إلغاء ترحيل القيد رقم ${entry.entryNumber}؟`)) {
      setJournalEntries(prev => prev.map(e => 
        e.id === id ? { ...e, status: 'draft' as const } : e
      ))
      alert('تم إلغاء ترحيل القيد - أصبح الآن مسودة')
      
      // تحديث العرض إذا كان القيد مفتوحاً
      if (viewingJournalEntry?.id === id) {
        setViewingJournalEntry(prev => prev ? { ...prev, status: 'draft' } : null)
      }
    }
  }

  // طباعة قيد
  const printJournalEntry = (entry: JournalEntry) => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      const linesHtml = entry.lines.map((line, idx) => `
        <tr class="${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
          <td class="p-3 font-mono">${line.accountCode}</td>
          <td class="p-3">${line.accountName}</td>
          <td class="p-3 text-left font-bold ${line.debit > 0 ? 'text-red-600' : ''}">${line.debit > 0 ? line.debit.toLocaleString() : '-'}</td>
          <td class="p-3 text-left font-bold ${line.credit > 0 ? 'text-green-600' : ''}">${line.credit > 0 ? line.credit.toLocaleString() : '-'}</td>
        </tr>
      `).join('')

      printWindow.document.write(`
        <html dir="rtl">
        <head><title>قيد محاسبي رقم ${entry.entryNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; direction: rtl; }
          h1 { color: #4f46e5; text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 15px; }
          .header { display: flex; justify-content: space-between; margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; }
          .description { margin: 20px 0; padding: 15px; background: #eef2ff; border-radius: 8px; border-right: 4px solid #4f46e5; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #4f46e5; color: white; padding: 12px; text-align: right; }
          td { padding: 12px; border-bottom: 1px solid #ddd; }
          tfoot { background: #f3f4f6; font-weight: bold; }
          .total-row { background: #eef2ff !important; }
          .total-row td { font-size: 16px; }
          .balance-check { margin-top: 20px; padding: 15px; border-radius: 8px; text-align: center; font-weight: bold; }
          .balanced { background: #dcfce7; color: #166534; }
          .unbalanced { background: #fee2e2; color: #991b1b; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
        </head>
        <body>
          <h1>📒 القيد المحاسبي</h1>
          <div class="header">
            <div><strong>رقم القيد:</strong> #${entry.entryNumber}</div>
            <div><strong>التاريخ:</strong> ${entry.date}</div>
            <div><strong>الحالة:</strong> ${entry.status === 'posted' ? '✅ مرحل' : '📝 مسودة'}</div>
          </div>
          <div class="description">
            <strong>البيان:</strong>
            <p style="margin-top: 10px; font-size: 16px;">${entry.description}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>كود الحساب</th>
                <th>اسم الحساب</th>
                <th style="text-align: left;">مدين (ج.م)</th>
                <th style="text-align: left;">دائن (ج.م)</th>
              </tr>
            </thead>
            <tbody>${linesHtml}</tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="2" style="text-align: left;">الإجمالي:</td>
                <td style="text-align: left; color: #dc2626; font-size: 18px;">${entry.totalDebit.toLocaleString()}</td>
                <td style="text-align: left; color: #16a34a; font-size: 18px;">${entry.totalCredit.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
          <div class="balance-check ${entry.totalDebit === entry.totalCredit ? 'balanced' : 'unbalanced'}">
            ${entry.totalDebit === entry.totalCredit ? '✅ القيد متوازن' : `❌ القيد غير متوازن - الفرق: ${Math.abs(entry.totalDebit - entry.totalCredit).toLocaleString()} ج.م`}
          </div>
          <div class="footer">تاريخ الطباعة: ${new Date().toLocaleDateString('ar-SA')} | نظام المحاسبة</div>
        </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  // Add new item on the fly (from invoice form)
  const [showAddItemDialog, setShowAddItemDialog] = useState(false)
  const [newItem, setNewItem] = useState({ nameAr: '', code: '', category: '', stock: 0, price: 0 })
  const [itemEditIndex, setItemEditIndex] = useState<number | null>(null)

  // Inventory Item Dialog State (for inventory tab)
  const [showInventoryItemDialog, setShowInventoryItemDialog] = useState(false)
  const [editingInventoryItem, setEditingInventoryItem] = useState<Item | null>(null)
  const [inventoryItemForm, setInventoryItemForm] = useState({ nameAr: '', code: '', category: '', stock: 0, price: 0 })

  const openNewInventoryItem = () => {
    setEditingInventoryItem(null)
    setInventoryItemForm({ nameAr: '', code: '', category: '', stock: 0, price: 0 })
    setShowInventoryItemDialog(true)
  }

  const openEditInventoryItem = (item: Item) => {
    setEditingInventoryItem(item)
    setInventoryItemForm({
      nameAr: item.nameAr,
      code: item.code,
      category: item.category,
      stock: item.stock,
      price: item.price
    })
    setShowInventoryItemDialog(true)
  }

  const saveInventoryItem = () => {
    if (!inventoryItemForm.nameAr) {
      alert('يرجى إدخال اسم الصنف')
      return
    }

    if (editingInventoryItem) {
      // Edit existing item
      setItems(prev => prev.map(item => 
        item.id === editingInventoryItem.id 
          ? { ...item, ...inventoryItemForm }
          : item
      ))
    } else {
      // Add new item
      const item: Item = {
        id: Date.now().toString(),
        nameAr: inventoryItemForm.nameAr,
        code: inventoryItemForm.code || `P${items.length + 1}`,
        category: inventoryItemForm.category || 'عام',
        stock: inventoryItemForm.stock,
        price: inventoryItemForm.price
      }
      setItems(prev => [...prev, item])
    }
    
    setShowInventoryItemDialog(false)
    setEditingInventoryItem(null)
    setInventoryItemForm({ nameAr: '', code: '', category: '', stock: 0, price: 0 })
  }

  const deleteInventoryItem = (itemId: string, itemName: string) => {
    setDeleteConfirm({
      show: true,
      type: 'item',
      id: itemId,
      name: itemName
    })
  }

  const confirmDeleteItem = () => {
    if (deleteConfirm.type === 'item') {
      setItems(prev => prev.filter(item => item.id !== deleteConfirm.id))
    }
    setDeleteConfirm({ show: false, type: '', id: '', name: '' })
  }

  const addNewItem = () => {
    if (!newItem.nameAr) {
      alert('يرجى إدخال اسم الصنف')
      return
    }
    const item: Item = {
      id: Date.now().toString(),
      nameAr: newItem.nameAr,
      code: newItem.code || `P${items.length + 1}`,
      category: newItem.category || 'عام',
      stock: newItem.stock,
      price: newItem.price
    }
    setItems(prev => [...prev, item])
    
    // If adding from invoice form, update the specific item row
    if (itemEditIndex !== null) {
      updateInvoiceItem(itemEditIndex, 'itemId', item.id)
      updateInvoiceItem(itemEditIndex, 'price', item.price)
      setItemEditIndex(null)
    }
    
    setNewItem({ nameAr: '', code: '', category: '', stock: 0, price: 0 })
    setShowAddItemDialog(false)
  }

  const addInvoiceItem = () => {
    setInvoiceForm(prev => ({
      ...prev,
      items: [...prev.items, { itemId: '', quantity: 1, price: 0, discount: 0 }]
    }))
  }

  const updateInvoiceItem = (index: number, field: string, value: any) => {
    setInvoiceForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === index ? { ...item, [field]: value } : item)
    }))
  }

  const removeInvoiceItem = (index: number) => {
    setInvoiceForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const saveInvoice = () => {
    if (!invoiceForm.customerId) {
      alert('يرجى اختيار العميل')
      return
    }
    if (invoiceForm.items.length === 0) {
      alert('يرجى إضافة بند واحد على الأقل')
      return
    }

    const selectedCustomer = parties.find(p => p.id === invoiceForm.customerId)
    
    // حساب المجاميع
    const subtotal = invoiceForm.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
    const discountAmount = (subtotal * invoiceForm.discount) / 100
    const afterDiscount = subtotal - discountAmount
    const taxAmount = (afterDiscount * invoiceForm.taxRate) / 100
    const grandTotal = afterDiscount + taxAmount
    
    // التحقق من المبلغ المدفوع
    const paidAmount = invoiceForm.paidAmount || 0
    const remainingAmount = grandTotal - paidAmount
    
    // تحديد طريقة السداد بناءً على المبلغ المدفوع
    let paymentMethod = invoiceForm.paymentMethod
    let status: 'draft' | 'posted' | 'paid' | 'cancelled' = 'draft'
    
    if (paidAmount >= grandTotal) {
      status = 'paid'
      paymentMethod = invoiceForm.paymentMethod === 'partial' ? 'cash' : invoiceForm.paymentMethod
    } else if (paidAmount > 0 && paidAmount < grandTotal) {
      paymentMethod = 'partial'
    }

    if (editingInvoice) {
      setInvoices(prev => prev.map(inv => inv.id === editingInvoice.id ? {
        ...inv,
        customerName: selectedCustomer?.nameAr || '',
        date: invoiceForm.date,
        total: grandTotal,
        paidAmount: paidAmount,
        remainingAmount: Math.max(0, remainingAmount),
        paymentMethod: paymentMethod,
        status: status,
        items: invoiceForm.items.map((item, idx) => ({
          id: `new-${idx}`,
          name: items.find(i => i.id === item.itemId)?.nameAr || 'منتج',
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price
        }))
      } : inv))
    } else {
      const newInvoice: Invoice = {
        id: Date.now().toString(),
        number: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
        date: invoiceForm.date,
        customerName: selectedCustomer?.nameAr || '',
        total: grandTotal,
        paidAmount: paidAmount,
        remainingAmount: Math.max(0, remainingAmount),
        paymentMethod: paymentMethod,
        status: status,
        items: invoiceForm.items.map((item, idx) => ({
          id: `new-${idx}`,
          name: items.find(i => i.id === item.itemId)?.nameAr || 'منتج',
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price
        }))
      }
      setInvoices(prev => [...prev, newInvoice])
      setCurrentInvoiceForPrint(newInvoice)
    }
    
    // تعيين حالة الحفظ لإظهار زر الطباعة
    setInvoiceJustSaved(true)
  }

  const printInvoice = () => {
    const selectedCustomer = parties.find(p => p.id === invoiceForm.customerId)
    
    // حساب المجاميع
    const subtotal = invoiceForm.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
    const discountAmount = (subtotal * invoiceForm.discount) / 100
    const afterDiscount = subtotal - discountAmount
    const taxAmount = (afterDiscount * invoiceForm.taxRate) / 100
    const grandTotal = afterDiscount + taxAmount
    const paidAmount = invoiceForm.paidAmount || 0
    const remainingAmount = Math.max(0, grandTotal - paidAmount)

    // تحديد نص طريقة السداد
    const paymentMethodText = invoiceForm.paymentMethod === 'cash' ? 'نقدى' : 
                             invoiceForm.paymentMethod === 'bank' ? 'تحويل بنكي' :
                             invoiceForm.paymentMethod === 'check' ? 'شيك' : 'جزئي'

    // إنشاء محتوى الفاتورة للطباعة
    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>فاتورة مبيعات</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Cairo', 'Tahoma', Arial, sans-serif; 
              direction: rtl;
              padding: 20px;
              color: #333;
            }
            .invoice-header {
              text-align: center;
              border-bottom: 3px solid #005f73;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .invoice-title { font-size: 28px; font-weight: bold; color: #005f73; margin-bottom: 10px; }
            .invoice-number { font-size: 18px; color: #666; }
            .invoice-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              background: #f8f9fa;
              padding: 15px;
              border-radius: 10px;
            }
            .info-item { margin-bottom: 5px; }
            .info-label { font-weight: bold; color: #555; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background: #005f73; color: white; padding: 12px; text-align: right; }
            td { padding: 12px; border-bottom: 1px solid #ddd; text-align: right; }
            .totals { width: 50%; margin-right: auto; margin-left: 0; }
            .totals tr td { padding: 8px 12px; }
            .total-row { font-weight: bold; }
            .grand-total { 
              background: #005f73; 
              color: white; 
              font-size: 18px;
            }
            .payment-info {
              background: #fff3cd;
              border: 2px solid #ffc107;
              padding: 15px;
              border-radius: 10px;
              margin-top: 20px;
            }
            .payment-info h3 { color: #856404; margin-bottom: 10px; }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #ddd;
              color: #666;
            }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div class="invoice-title">📄 فاتورة مبيعات</div>
            <div class="invoice-number">رقم الفاتورة: ${currentInvoiceForPrint?.number || 'NEW'}</div>
            <div>التاريخ: ${invoiceForm.date}</div>
          </div>

          <div class="invoice-info">
            <div>
              <div class="info-item"><span class="info-label">العميل:</span> ${selectedCustomer?.nameAr || '-'}</div>
              <div class="info-item"><span class="info-label">طريقة السداد:</span> ${paymentMethodText}</div>
            </div>
            <div style="text-align: left;">
              <div class="info-item"><span class="info-label">التاريخ:</span> ${invoiceForm.date}</div>
              <div class="info-item"><span class="info-label">الحالة:</span> ${paidAmount >= grandTotal ? '✅ مدفوع بالكامل' : paidAmount > 0 ? '⏳ دفع جزئي' : '📋 غير مدفوع'}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>الصنف</th>
                <th>الكمية</th>
                <th>سعر الوحدة</th>
                <th>الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceForm.items.map((item, idx) => {
                const itemName = items.find(i => i.id === item.itemId)?.nameAr || 'منتج'
                return `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>${itemName}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price.toLocaleString()} ج.م</td>
                    <td>${(item.quantity * item.price).toLocaleString()} ج.م</td>
                  </tr>
                `
              }).join('')}
            </tbody>
          </table>

          <table class="totals">
            <tr>
              <td>المجموع الفرعي:</td>
              <td>${subtotal.toLocaleString()} ج.م</td>
            </tr>
            ${invoiceForm.discount > 0 ? `
            <tr>
              <td>الخصم (${invoiceForm.discount}%):</td>
              <td>-${discountAmount.toLocaleString()} ج.م</td>
            </tr>
            ` : ''}
            <tr>
              <td>الضريبة (${invoiceForm.taxRate}%):</td>
              <td>+${taxAmount.toLocaleString()} ج.م</td>
            </tr>
            <tr class="grand-total">
              <td>الإجمالي الكلي:</td>
              <td>${grandTotal.toLocaleString()} ج.م</td>
            </tr>
          </table>

          <div class="payment-info">
            <h3>💰 تفاصيل السداد</h3>
            <p><strong>المبلغ المدفوع:</strong> ${paidAmount.toLocaleString()} ج.م</p>
            <p><strong>المتبقي:</strong> ${remainingAmount.toLocaleString()} ج.م</p>
          </div>

          ${invoiceForm.notes ? `
          <div style="margin-top: 20px; padding: 15px; background: #e9ecef; border-radius: 10px;">
            <strong>📝 ملاحظات:</strong><br>
            ${invoiceForm.notes}
          </div>
          ` : ''}

          <div class="footer">
            <p>شكراً لتعاملكم معنا - نظام إنجاز المحاسبي</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
            }
          </script>
        </body>
      </html>
    `

    // فتح نافذة الطباعة
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
    } else {
      alert('يرجى السماح بالنوافذ المنبثقة لطباعة الفاتورة')
    }
  }

  const postInvoice = (invoiceId: string) => {
    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'posted' as const } : inv))
    alert('تم ترحيل الفاتورة بنجاح')
  }

  const unpostInvoice = (invoiceId: string) => {
    if (confirm('هل أنت متأكد من إلغاء ترحيل هذه الفاتورة؟')) {
      setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'draft' as const } : inv))
      alert('تم إلغاء ترحيل الفاتورة')
    }
  }

  const deleteInvoice = (invoiceId: string, invoiceNumber: string) => {
    setDeleteConfirm({ show: true, type: 'invoice', id: invoiceId, name: invoiceNumber })
  }

  const confirmDelete = () => {
    if (deleteConfirm.type === 'invoice') {
      setInvoices(prev => prev.filter(inv => inv.id !== deleteConfirm.id))
      alert('تم حذف الفاتورة بنجاح')
    } else if (deleteConfirm.type === 'item') {
      setItems(prev => prev.filter(item => item.id !== deleteConfirm.id))
      alert('تم حذف الصنف بنجاح')
    } else if (deleteConfirm.type === 'party') {
      setParties(prev => prev.filter(party => party.id !== deleteConfirm.id))
      alert('تم حذف الطرف بنجاح')
    } else if (deleteConfirm.type === 'transaction') {
      setTransactions(prev => prev.filter(t => t.id !== deleteConfirm.id))
      alert('تم حذف العملية بنجاح')
    }
    setDeleteConfirm({ show: false, type: '', id: '', name: '' })
  }

  // Calculate invoice totals
  const getInvoiceSubtotal = () => {
    return invoiceForm.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  }

  const getInvoiceDiscount = () => {
    return invoiceForm.items.reduce((sum, item) => sum + item.discount, 0)
  }

  const getInvoiceTotal = () => {
    return getInvoiceSubtotal() - getInvoiceDiscount()
  }

  // ============ PURCHASE INVOICE ACTIONS ============
  const openNewPurchase = () => {
    setEditingPurchase(null)
    setPurchaseForm({ 
      supplierId: '', 
      date: new Date().toISOString().split('T')[0], 
      notes: '', 
      paymentMethod: 'cash',
      paidAmount: 0,
      taxRate: 15,
      discount: 0,
      items: [] 
    })
    setPurchaseJustSaved(false)
    setCurrentPurchaseForPrint(null)
    setShowPurchaseDialog(true)
  }

  const openEditPurchase = (purchase: PurchaseInvoice) => {
    if (purchase.status === 'posted' || purchase.status === 'paid') {
      alert('لا يمكن تعديل فاتورة مرحلة')
      return
    }
    setEditingPurchase(purchase)
    setPurchaseForm({
      supplierId: parties.find(p => p.nameAr === purchase.supplierName)?.id || '',
      date: purchase.date,
      notes: '',
      paymentMethod: purchase.paymentMethod,
      paidAmount: purchase.paidAmount,
      taxRate: 15,
      discount: 0,
      items: purchase.items.map(item => ({
        itemId: items.find(i => i.nameAr === item.name)?.id || '',
        quantity: item.quantity,
        price: item.price,
        discount: 0
      }))
    })
    setPurchaseJustSaved(false)
    setShowPurchaseDialog(true)
  }

  const addPurchaseItem = () => {
    setPurchaseForm(prev => ({
      ...prev,
      items: [...prev.items, { itemId: '', quantity: 1, price: 0, discount: 0 }]
    }))
  }

  const updatePurchaseItem = (index: number, field: string, value: any) => {
    setPurchaseForm(prev => ({
      ...prev,
      items: prev.items.map((item, idx) => idx === index ? { ...item, [field]: value } : item)
    }))
  }

  const removePurchaseItem = (index: number) => {
    setPurchaseForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const getPurchaseTotal = () => {
    return purchaseForm.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  }

  const savePurchase = () => {
    if (!purchaseForm.supplierId) {
      alert('يرجى اختيار المورد')
      return
    }
    if (purchaseForm.items.length === 0) {
      alert('يرجى إضافة بند واحد على الأقل')
      return
    }

    const selectedSupplier = parties.find(p => p.id === purchaseForm.supplierId)
    
    // حساب المجاميع
    const subtotal = purchaseForm.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
    const discountAmount = (subtotal * purchaseForm.discount) / 100
    const afterDiscount = subtotal - discountAmount
    const taxAmount = (afterDiscount * purchaseForm.taxRate) / 100
    const grandTotal = afterDiscount + taxAmount
    
    // التحقق من المبلغ المدفوع
    const paidAmount = purchaseForm.paidAmount || 0
    const remainingAmount = grandTotal - paidAmount
    
    let paymentMethod = purchaseForm.paymentMethod
    let status: 'draft' | 'posted' | 'paid' | 'cancelled' = 'draft'
    
    if (paidAmount >= grandTotal) {
      status = 'paid'
      paymentMethod = purchaseForm.paymentMethod === 'partial' ? 'cash' : purchaseForm.paymentMethod
    } else if (paidAmount > 0 && paidAmount < grandTotal) {
      paymentMethod = 'partial'
    }

    if (editingPurchase) {
      setPurchaseInvoices(prev => prev.map(pur => pur.id === editingPurchase.id ? {
        ...pur,
        supplierName: selectedSupplier?.nameAr || '',
        date: purchaseForm.date,
        total: grandTotal,
        paidAmount: paidAmount,
        remainingAmount: Math.max(0, remainingAmount),
        paymentMethod: paymentMethod,
        status: status,
        items: purchaseForm.items.map((item, idx) => ({
          id: `new-${idx}`,
          name: items.find(i => i.id === item.itemId)?.nameAr || 'منتج',
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price
        }))
      } : pur))
    } else {
      const newPurchase: PurchaseInvoice = {
        id: Date.now().toString(),
        number: `PUR-${String(purchaseInvoices.length + 1).padStart(3, '0')}`,
        date: purchaseForm.date,
        supplierName: selectedSupplier?.nameAr || '',
        total: grandTotal,
        paidAmount: paidAmount,
        remainingAmount: Math.max(0, remainingAmount),
        paymentMethod: paymentMethod,
        status: status,
        items: purchaseForm.items.map((item, idx) => ({
          id: `new-${idx}`,
          name: items.find(i => i.id === item.itemId)?.nameAr || 'منتج',
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price
        }))
      }
      setPurchaseInvoices(prev => [...prev, newPurchase])
      setCurrentPurchaseForPrint(newPurchase)
    }
    
    setPurchaseJustSaved(true)
  }

  const printPurchaseInvoice = () => {
    const selectedSupplier = parties.find(p => p.id === purchaseForm.supplierId)
    
    const subtotal = purchaseForm.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
    const discountAmount = (subtotal * purchaseForm.discount) / 100
    const afterDiscount = subtotal - discountAmount
    const taxAmount = (afterDiscount * purchaseForm.taxRate) / 100
    const grandTotal = afterDiscount + taxAmount
    const paidAmount = purchaseForm.paidAmount || 0
    const remainingAmount = Math.max(0, grandTotal - paidAmount)

    const paymentMethodText = purchaseForm.paymentMethod === 'cash' ? 'نقدى' : 
                             purchaseForm.paymentMethod === 'bank' ? 'تحويل بنكي' :
                             purchaseForm.paymentMethod === 'check' ? 'شيك' : 'جزئي'

    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>فاتورة مشتريات</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Cairo', 'Tahoma', Arial, sans-serif; direction: rtl; padding: 20px; color: #333; }
            .invoice-header { text-align: center; border-bottom: 3px solid #dc2626; padding-bottom: 20px; margin-bottom: 30px; }
            .invoice-title { font-size: 28px; font-weight: bold; color: #dc2626; margin-bottom: 10px; }
            .invoice-info { display: flex; justify-content: space-between; margin-bottom: 30px; background: #fef2f2; padding: 15px; border-radius: 10px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background: #dc2626; color: white; padding: 12px; text-align: right; }
            td { padding: 12px; border-bottom: 1px solid #ddd; text-align: right; }
            .totals { width: 50%; margin-right: auto; margin-left: 0; }
            .grand-total { background: #dc2626; color: white; font-size: 18px; }
            .payment-info { background: #fff3cd; border: 2px solid #ffc107; padding: 15px; border-radius: 10px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; color: #666; }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div class="invoice-title">📋 فاتورة مشتريات</div>
            <div>رقم الفاتورة: ${currentPurchaseForPrint?.number || 'NEW'}</div>
            <div>التاريخ: ${purchaseForm.date}</div>
          </div>

          <div class="invoice-info">
            <div>
              <div><strong>المورد:</strong> ${selectedSupplier?.nameAr || '-'}</div>
              <div><strong>طريقة السداد:</strong> ${paymentMethodText}</div>
            </div>
            <div style="text-align: left;">
              <div><strong>التاريخ:</strong> ${purchaseForm.date}</div>
              <div><strong>الحالة:</strong> ${paidAmount >= grandTotal ? '✅ مدفوع بالكامل' : paidAmount > 0 ? '⏳ دفع جزئي' : '📋 غير مدفوع'}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr><th>#</th><th>الصنف</th><th>الكمية</th><th>سعر الوحدة</th><th>الإجمالي</th></tr>
            </thead>
            <tbody>
              ${purchaseForm.items.map((item, idx) => {
                const itemName = items.find(i => i.id === item.itemId)?.nameAr || 'منتج'
                return `<tr><td>${idx + 1}</td><td>${itemName}</td><td>${item.quantity}</td><td>${item.price.toLocaleString()} ج.م</td><td>${(item.quantity * item.price).toLocaleString()} ج.م</td></tr>`
              }).join('')}
            </tbody>
          </table>

          <table class="totals">
            <tr><td>المجموع الفرعي:</td><td>${subtotal.toLocaleString()} ج.م</td></tr>
            ${purchaseForm.discount > 0 ? `<tr><td>الخصم (${purchaseForm.discount}%):</td><td>-${discountAmount.toLocaleString()} ج.م</td></tr>` : ''}
            <tr><td>الضريبة (${purchaseForm.taxRate}%):</td><td>+${taxAmount.toLocaleString()} ج.م</td></tr>
            <tr class="grand-total"><td>الإجمالي الكلي:</td><td>${grandTotal.toLocaleString()} ج.م</td></tr>
          </table>

          <div class="payment-info">
            <h3>💰 تفاصيل السداد</h3>
            <p><strong>المبلغ المدفوع:</strong> ${paidAmount.toLocaleString()} ج.م</p>
            <p><strong>المتبقي:</strong> ${remainingAmount.toLocaleString()} ج.م</p>
          </div>

          ${purchaseForm.notes ? `<div style="margin-top: 20px; padding: 15px; background: #e9ecef; border-radius: 10px;"><strong>📝 ملاحظات:</strong><br>${purchaseForm.notes}</div>` : ''}

          <div class="footer"><p>شكراً لتعاملكم معنا - نظام إنجاز المحاسبي</p></div>

          <script>window.onload = function() { window.print(); window.onafterprint = function() { window.close(); } }</script>
        </body>
      </html>
    `

    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
    } else {
      alert('يرجى السماح بالنوافذ المنبثقة لطباعة الفاتورة')
    }
  }

  const deletePurchase = (purchaseId: string, purchaseNumber: string) => {
    if (confirm(`هل أنت متأكد من حذف فاتورة المشتريات ${purchaseNumber}؟`)) {
      setPurchaseInvoices(prev => prev.filter(pur => pur.id !== purchaseId))
      alert('تم حذف فاتورة المشتريات بنجاح')
    }
  }

  const viewPurchaseDetails = (purchase: PurchaseInvoice) => {
    alert(`تفاصيل فاتورة المشتريات:\n\nرقم الفاتورة: ${purchase.number}\nالمورد: ${purchase.supplierName}\nالتاريخ: ${purchase.date}\nالإجمالي: ${purchase.total.toLocaleString()} ج.م\nالمدفوع: ${purchase.paidAmount.toLocaleString()} ج.م\nالمتبقي: ${purchase.remainingAmount.toLocaleString()} ج.م\nالحالة: ${purchase.status === 'draft' ? 'مسودة' : purchase.status === 'posted' ? 'مرحلة' : purchase.status === 'paid' ? 'مدفوعة' : 'ملغاة'}`)
  }

  const saveNewSupplier = () => {
    if (!newSupplier.nameAr) {
      alert('يرجى إدخال اسم المورد')
      return
    }
    const supplier: Party = {
      id: `supplier-${Date.now()}`,
      nameAr: newSupplier.nameAr,
      type: newSupplier.type,
      phone: newSupplier.phone,
      balance: 0,
      address: ''
    }
    setParties(prev => [...prev, supplier])
    setPurchaseForm(prev => ({ ...prev, supplierId: supplier.id }))
    setShowAddSupplierDialog(false)
    setNewSupplier({ nameAr: '', type: 'supplier', phone: '' })
    alert('تم إضافة المورد بنجاح')
  }

  // ============ SIDEBAR MENU ITEMS ============
  const menuItems = [
    { id: 'dashboard' as ModuleType, icon: LayoutDashboard, label: 'لوحة التحكم' },
    { id: 'sales' as ModuleType, icon: ShoppingCart, label: 'المبيعات' },
    { id: 'purchases' as ModuleType, icon: Package, label: 'المشتريات' },
    { id: 'inventory' as ModuleType, icon: Package, label: 'المخزون' },
    { id: 'parties' as ModuleType, icon: Users, label: 'الأطراف' },
    { id: 'treasury' as ModuleType, icon: Wallet, label: 'الخزينة' },
    { id: 'journal-entries' as ModuleType, icon: BookOpen, label: 'القيود المحاسبية' },
    { id: 'general-ledger' as ModuleType, icon: Landmark, label: 'الاستاذ العام' },
    { id: 'accounts' as ModuleType, icon: Landmark, label: 'دليل الحسابات' },
    { id: 'banks' as ModuleType, icon: Landmark, label: 'البنوك' },
    { id: 'hr' as ModuleType, icon: Users, label: 'الموارد البشرية' },
    { id: 'expenses' as ModuleType, icon: Receipt, label: 'المصروفات' },
    { id: 'reports' as ModuleType, icon: FileText, label: 'التقارير' },
    { id: 'settings' as ModuleType, icon: Settings, label: 'الإعدادات' }
  ]

  // ============ LOGIN SCREEN ============
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#005f73] via-[#0a9396] to-[#94d2bd] flex items-center justify-center p-4" dir="rtl">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="w-20 h-20 bg-gradient-to-r from-[#005f73] to-[#0a9396] rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#005f73]">نظام إنجاز المحاسبي</CardTitle>
            <CardDescription>قم بتسجيل الدخول للمتابعة</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input id="username" type="text" placeholder="أدخل اسم المستخدم" className="mt-1" defaultValue="admin" />
              </div>
              <div>
                <Label htmlFor="password">كلمة المرور</Label>
                <Input id="password" type="password" placeholder="أدخل كلمة المرور" className="mt-1" defaultValue="admin123" />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-[#005f73] to-[#0a9396] h-12 text-lg">
                <Lock className="ml-2 h-5 w-5" />تسجيل الدخول
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>للاستخدام التجريبي: admin / admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ============ MAIN APP LAYOUT ============
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex" dir="rtl">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-[#005f73] to-[#0a9396] text-white transition-all duration-300 flex flex-col fixed h-full z-40`}>
        <div className="p-4 flex items-center justify-between border-b border-white/20">
          {sidebarOpen && <h1 className="text-xl font-bold flex items-center gap-2"><Calculator className="w-6 h-6" />إنجاز</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg"><Menu className="w-5 h-5" /></button>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveModule(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors ${activeModule === item.id ? 'bg-white/20 border-r-4 border-white' : ''}`}>
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/20">
          <button 
            onClick={async () => {
              // حفظ جميع البيانات قبل الخروج
              addLogEntry('تسجيل الخروج', 'جارٍ حفظ البيانات...')
              await syncAllDataToServer()
              // أيضاً حفظ في localStorage كنسخة احتياطية
              const backup = { 
                companySettings, 
                journalEntries, 
                activityLogs,
                lastLogout: new Date().toISOString() 
              }
              localStorage.setItem('appBackup', JSON.stringify(backup))
              
              setTimeout(() => {
                setIsLoggedIn(false)
                alert('✓ تم حفظ جميع البيانات وتسجيل الخروج بنجاح')
              }, 500)
            }} 
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/20 rounded-lg text-red-200 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? 'mr-64' : 'mr-20'} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"><Menu className="w-5 h-5" /></button>
            <div>
              <h2 className="text-xl font-bold text-[#005f73]">{menuItems.find(m => m.id === activeModule)?.label}</h2>
              <p className="text-sm text-gray-500">مرحباً بك في نظام إنجاز المحاسبي</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white">{notifications.length}</Badge>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>الإشعارات</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  {notifications.map(notif => (
                    <div key={notif.id} className={`p-3 rounded-lg ${notif.type === 'success' ? 'bg-green-50' : notif.type === 'warning' ? 'bg-yellow-50' : 'bg-blue-50'}`}>
                      <p className="text-sm">{notif.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            {/* Search */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-gray-400 ml-2" />
              <input type="text" placeholder="بحث..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none text-sm w-48" />
            </div>

            {/* User */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#005f73] rounded-full flex items-center justify-center text-white font-bold">م</div>
              <span className="hidden md:block font-medium">مدير النظام</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {/* ============ DASHBOARD MODULE (DYNAMIC) ============ */}
          {activeModule === 'dashboard' && (
            <div className="space-y-6">
              {/* Calculate Dynamic KPI Values from Journal Entries */}
              {(() => {
                // ===== حسابات من القيود المحاسبية =====
                
                // إجمالي المدين والدائن من جميع القيود
                const totalDebit = journalEntries.reduce((sum, entry) => sum + (Number(entry.totalDebit) || 0), 0)
                const totalCredit = journalEntries.reduce((sum, entry) => sum + (Number(entry.totalCredit) || 0), 0)
                
                // حساب أرصدة الحسابات من القيود
                const accountBalances: Record<string, { name: string; debit: number; credit: number; net: number }> = {}
                
                journalEntries.forEach(entry => {
                  entry.lines.forEach(line => {
                    const code = String(line.accountCode || '')
                    if (!accountBalances[code]) {
                      accountBalances[code] = { name: line.accountName || '', debit: 0, credit: 0, net: 0 }
                    }
                    accountBalances[code].debit += Number(line.debit) || 0
                    accountBalances[code].credit += Number(line.credit) || 0
                  })
                })
                
                // حساب صافي كل حساب
                Object.keys(accountBalances).forEach(code => {
                  accountBalances[code].net = accountBalances[code].debit - accountBalances[code].credit
                })
                
                // الإيرادات (حسابات 4xxx - جانب الدائن يزيد الإيراد)
                let totalRevenue = 0
                // المصروفات (حسابات 5xxx - جانب المدين يزيد المصروف)
                let totalExpenses = 0
                
                Object.entries(accountBalances).forEach(([code, data]) => {
                  const codeStr = String(code)
                  if (codeStr.startsWith('4')) {
                    // حسابات الإيرادات - الرصيد الدائن يمثل الإيراد
                    totalRevenue += Math.max(0, data.credit - data.debit)
                  } else if (codeStr.startsWith('5')) {
                    // حسابات المصروفات - الرصيد المدين يمثل المصروف
                    totalExpenses += Math.max(0, data.debit - data.credit)
                  }
                })
                
                // رصيد الصندوق (1111) - مدين يزيد الرصيد
                const cashBalance = accountBalances['1111'] ? (accountBalances['1111'].debit - accountBalances['1111'].credit) : 0
                
                // رصيد البنك (1112)
                const bankBalance = accountBalances['1112'] ? (accountBalances['1112'].debit - accountBalances['1112'].credit) : 0
                
                // إجمالي النقدية
                const totalCash = cashBalance + bankBalance
                
                // صافي الربح/الخسارة
                const netProfit = totalRevenue - totalExpenses
                
                // عدد القيود المحاسبية
                const postedEntries = journalEntries.filter(e => e.status === 'posted').length
                const draftEntries = journalEntries.filter(e => e.status === 'draft').length
                
                // إجمالي العملاء والموردين من القيود
                const customerAccounts = Object.keys(accountBalances).filter(code => code.startsWith('121'))
                const supplierAccounts = Object.keys(accountBalances).filter(code => code.startsWith('221'))
                
                // المدينون (العملاء - رصيد مدين يعني أنهم مدينون لنا)
                const totalReceivables = customerAccounts.reduce((sum, code) => {
                  const bal = accountBalances[code]
                  return sum + Math.max(0, bal.debit - bal.credit)
                }, 0)
                
                // الدائنون (الموردين - رصيد دائن يعني أننا مديونون لهم)
                const totalPayables = supplierAccounts.reduce((sum, code) => {
                  const bal = accountBalances[code]
                  return sum + Math.max(0, bal.credit - bal.debit)
                }, 0)

                return (
                  <>
                    {/* Main KPI Cards - Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <Card className="border-r-4 border-r-green-500 hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">إجمالي الإيرادات</p>
                              <p className="text-2xl font-bold text-green-600">{totalRevenue.toLocaleString()} ج.م</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                              <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            من قائمة الدخل
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-r-4 border-r-red-500 hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">إجمالي المصروفات</p>
                              <p className="text-2xl font-bold text-red-600">{totalExpenses.toLocaleString()} ج.م</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                              <TrendingDown className="w-6 h-6 text-red-600" />
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            من حسابات الأرباح والخسائر
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-r-4 border-r-blue-500 hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">صافي الربح</p>
                              <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                {netProfit.toLocaleString()} ج.م
                              </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <DollarSign className="w-6 h-6 text-blue-600" />
                            </div>
                          </div>
                          <p className={`text-xs mt-2 ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            {netProfit >= 0 ? '↑ ربح صافي' : '↓ خسارة صافية'}
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-r-4 border-r-emerald-500 hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">إجمالي الحركات</p>
                              <p className="text-2xl font-bold text-emerald-600">{totalDebit.toLocaleString()} ج.م</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                              <Activity className="w-6 h-6 text-emerald-600" />
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            {journalEntries.length} قيد محاسبي • مدين = دائن ✓
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Additional KPIs - Row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <Card className="border-r-4 border-r-purple-500 hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">رصيد الصندوق</p>
                              <p className="text-2xl font-bold text-purple-600">{cashBalance.toLocaleString()} ج.م</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                              <Wallet className="w-6 h-6 text-purple-600" />
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            حساب 1111 - الصندوق
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-r-4 border-r-cyan-500 hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">رصيد البنك</p>
                              <p className="text-2xl font-bold text-cyan-600">{bankBalance.toLocaleString()} ج.م</p>
                            </div>
                            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                              <Landmark className="w-6 h-6 text-cyan-600" />
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            حساب 1112 - البنك
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-r-4 border-r-orange-500 hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">المدينون (العملاء)</p>
                              <p className="text-2xl font-bold text-orange-600">{totalReceivables.toLocaleString()} ج.م</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                              <Users className="w-6 h-6 text-orange-600" />
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            {customerAccounts.length} حساب عملاء
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-r-4 border-r-rose-500 hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">الدائنون (الموردين)</p>
                              <p className="text-2xl font-bold text-rose-600">{totalPayables.toLocaleString()} ج.م</p>
                            </div>
                            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                              <Truck className="w-6 h-6 text-rose-600" />
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            {supplierAccounts.length} حساب موردين
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Charts and Quick Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <Card className="lg:col-span-2">
                        <CardHeader>
                          <CardTitle>نظرة عامة على الحركات المحاسبية</CardTitle>
                          <CardDescription>إحصائيات مباشرة من القيود المحاسبية</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {journalEntries.length > 0 ? (
                            <div className="h-64 flex items-end justify-around gap-4 px-4">
                              {/* Dynamic chart based on journal entries data */}
                              <div className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full flex gap-1 items-end justify-center h-48">
                                  <div 
                                    className="w-full bg-gradient-to-t from-[#005f73] to-[#0a9396] rounded-t"
                                    style={{height: `${Math.min(100, Math.max(5, (totalRevenue / Math.max(totalRevenue + totalExpenses, 1)) * 100))}%`}}
                                  />
                                </div>
                                <span className="text-xs text-gray-500 font-medium">الإيرادات</span>
                                <span className="text-xs text-green-600 font-bold">{totalRevenue.toLocaleString()}</span>
                              </div>
                              <div className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full flex gap-1 items-end justify-center h-48">
                                  <div 
                                    className="w-full bg-gradient-to-t from-red-400 to-red-500 rounded-t"
                                    style={{height: `${Math.min(100, Math.max(5, (totalExpenses / Math.max(totalRevenue + totalExpenses, 1)) * 100))}%`}}
                                  />
                                </div>
                                <span className="text-xs text-gray-500 font-medium">المصروفات</span>
                                <span className="text-xs text-red-600 font-bold">{totalExpenses.toLocaleString()}</span>
                              </div>
                              <div className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full flex gap-1 items-end justify-center h-48">
                                  <div 
                                    className="w-full bg-gradient-to-t from-blue-400 to-blue-500 rounded-t"
                                    style={{height: `${Math.min(100, Math.max(5, (totalCash / Math.max(totalDebit, 1)) * 100))}%`}}
                                  />
                                </div>
                                <span className="text-xs text-gray-500 font-medium">النقدية</span>
                                <span className="text-xs text-blue-600 font-bold">{totalCash.toLocaleString()}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                              <BarChart3 className="w-16 h-16 mb-3 opacity-50" />
                              <p className="text-lg font-medium">جاري تحميل البيانات...</p>
                              <p className="text-sm">سيتم عرض إحصائيات القيود المحاسبية</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader><CardTitle>إجراءات سريعة</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                          <Button onClick={() => setActiveModule('journal-entries')} className="w-full justify-start bg-green-50 text-green-700 hover:bg-green-100" variant="outline"><BookOpen className="ml-2 h-4 w-4" />القيود المحاسبية</Button>
                          <Button onClick={() => setActiveModule('sales')} className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100" variant="outline"><Plus className="ml-2 h-4 w-4" />فاتورة مبيعات جديدة</Button>
                          <Button onClick={() => setActiveModule('purchases')} className="w-full justify-start bg-purple-50 text-purple-700 hover:bg-purple-100" variant="outline"><Plus className="ml-2 h-4 w-4" />طلب شراء جديد</Button>
                          <Button onClick={() => setActiveModule('treasury')} className="w-full justify-start bg-orange-50 text-orange-700 hover:bg-orange-100" variant="outline"><Wallet className="ml-2 h-4 w-4" />تحصيل جديد</Button>
                          <Button onClick={() => setActiveModule('expenses')} className="w-full justify-start bg-cyan-50 text-cyan-700 hover:bg-cyan-100" variant="outline"><Receipt className="ml-2 h-4 w-4" />مصروف جديد</Button>
                          <Button onClick={() => setActiveModule('reports')} className="w-full justify-start bg-gray-50 text-gray-700 hover:bg-gray-100" variant="outline"><FileText className="ml-2 h-4 w-4" />عرض التقارير المالية</Button>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recent Journal Entries & Account Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>آخر القيود المحاسبية</CardTitle>
                          <Button variant="ghost" size="sm" onClick={() => setActiveModule('journal-entries')}>
                            عرض الكل ({journalEntries.length})
                          </Button>
                        </CardHeader>
                        <CardContent>
                          {journalEntries.length > 0 ? (
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                              {journalEntries.slice(-5).reverse().map(entry => (
                                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                  <div>
                                    <p className="font-medium">قيد #{entry.entryNumber}</p>
                                    <p className="text-xs text-gray-500">{entry.description?.substring(0, 40)}{entry.description?.length > 40 ? '...' : ''}</p>
                                    <p className="text-xs text-gray-400">{entry.date}</p>
                                  </div>
                                  <div className="text-left">
                                    <p className="font-bold">{Number(entry.totalDebit || 0).toLocaleString()} ج.م</p>
                                    <Badge 
                                      className={
                                        entry.status === 'posted' ? 'bg-green-100 text-green-800' :
                                        entry.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                      }
                                    >
                                      {entry.status === 'posted' ? 'مرحلة' : entry.status === 'draft' ? 'مسودة' : 'ملغى'}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-400">
                              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                              <p>جاري تحميل القيود المحاسبية...</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>ملخص الحسابات الرئيسية</CardTitle>
                          <Button variant="ghost" size="sm" onClick={() => setActiveModule('chart-of-accounts')}>
                            دليل الحسابات
                          </Button>
                        </CardHeader>
                        <CardContent>
                          {Object.keys(accountBalances).length > 0 ? (
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                              {Object.entries(accountBalances)
                                .filter(([code]) => ['1111', '1112', '3001', '4100', '5100'].includes(code))
                                .slice(0, 6)
                                .map(([code, data]) => (
                                <div key={code} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div>
                                    <p className="font-medium text-sm">{data.name || 'حساب غير مسمى'}</p>
                                    <p className="text-xs text-gray-400">كود: {code}</p>
                                  </div>
                                  <div className="text-left">
                                    <p className={`font-bold ${data.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                      {Math.abs(data.net).toLocaleString()} ج.م
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      مدين: {data.debit.toLocaleString()} | دائن: {data.credit.toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-400">
                              <Calculator className="w-12 h-12 mx-auto mb-3 opacity-50" />
                              <p>لا توجد بيانات بعد</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </>
                )
              })()}
            </div>
          )}

          {/* ============ SALES MODULE (ENHANCED) ============ */}
          {activeModule === 'sales' && (
            <div className="space-y-6">
              {/* Sales Summary Cards - from Journal Entries */}
              {(() => {
                // حسابات المبيعات من القيود المحاسبية
                const salesAccounts: Record<string, { name: string; debit: number; credit: number; net: number }> = {}
                
                journalEntries.forEach(entry => {
                  entry.lines.forEach(line => {
                    const code = String(line.accountCode || '')
                    // حسابات المبيعات تبدأ بـ 4
                    if (code.startsWith('4')) {
                      if (!salesAccounts[code]) {
                        salesAccounts[code] = { name: line.accountName || '', debit: 0, credit: 0, net: 0 }
                      }
                      salesAccounts[code].debit += Number(line.debit) || 0
                      salesAccounts[code].credit += Number(line.credit) || 0
                    }
                  })
                })
                
                // حساب صافي كل حساب مبيعات
                Object.keys(salesAccounts).forEach(code => {
                  salesAccounts[code].net = salesAccounts[code].credit - salesAccounts[code].debit
                })
                
                // إجمالي المبيعات (مجموع الأرصدة الدائنة لحسابات 4xxx)
                const totalSales = Object.values(salesAccounts).reduce((sum, acc) => sum + Math.max(0, acc.net), 0)
                
                // عدد قيود المبيعات (القيود التي تحتوي على حسابات 4xxx)
                const salesEntriesCount = journalEntries.filter(entry => 
                  entry.lines.some(line => String(line.accountCode || '').startsWith('4'))
                ).length
                
                // المبالغ المستحقة من العملاء (حسابات 121x - رصيد مدين)
                let totalReceivables = 0
                const customerAccounts: Record<string, { name: string; debit: number; credit: number }> = {}
                
                journalEntries.forEach(entry => {
                  entry.lines.forEach(line => {
                    const code = String(line.accountCode || '')
                    if (code.startsWith('121')) {
                      if (!customerAccounts[code]) {
                        customerAccounts[code] = { name: line.accountName || '', debit: 0, credit: 0 }
                      }
                      customerAccounts[code].debit += Number(line.debit) || 0
                      customerAccounts[code].credit += Number(line.credit) || 0
                    }
                  })
                })
                
                totalReceivables = Object.values(customerAccounts).reduce((sum, acc) => 
                  sum + Math.max(0, acc.debit - acc.credit), 0
                )
                
                // المبيعات النقدية (قيود تحتوي على مبيعات + صندوق)
                const cashSalesEntries = journalEntries.filter(entry =>
                  entry.lines.some(l => String(l.accountCode || '').startsWith('4')) &&
                  entry.lines.some(l => l.accountCode === '1111')
                )
                const cashSalesTotal = cashSalesEntries.reduce((sum, entry) => 
                  sum + entry.lines.filter(l => String(l.accountCode || '').startsWith('4'))
                    .reduce((s, l) => s + (Number(l.credit) || 0), 0), 0
                )

                return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"><DollarSign className="w-6 h-6 text-green-600" /></div><div><p className="text-sm text-gray-500">إجمالي المبيعات</p><p className="text-xl font-bold text-green-600">{totalSales.toLocaleString()} ج.م</p></div></div></CardContent></Card>
                      <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><FileText className="w-6 h-6 text-blue-600" /></div><div><p className="text-sm text-gray-500">قيود المبيعات</p><p className="text-xl font-bold text-blue-600">{salesEntriesCount} قيد</p></div></div></CardContent></Card>
                      <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center"><Clock className="w-6 h-6 text-yellow-600" /></div><div><p className="text-sm text-gray-500">العملاء المدينون</p><p className="text-xl font-bold text-yellow-600">{totalReceivables.toLocaleString()} ج.م</p></div></div></CardContent></Card>
                      <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center"><Eye className="w-6 h-6 text-purple-600" /></div><div><p className="text-sm text-gray-500">المبيعات النقدية</p><p className="text-xl font-bold text-purple-600">{cashSalesTotal.toLocaleString()} ج.م</p></div></div></CardContent></Card>
                    </div>

              {/* Action Bar */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Button onClick={openNewInvoice} className="bg-gradient-to-r from-[#005f73] to-[#0a9396]"><Plus className="ml-2 h-4 w-4" />فاتورة جديدة</Button>
                      <Button variant="outline"><Plus className="ml-2 h-4 w-4" />عرض سعر جديد</Button>
                      <Button variant="outline"><RotateCcw className="ml-2 h-4 w-4" />مرتجع مبيعات</Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                        <Search className="w-4 h-4 text-gray-400 ml-2" />
                        <input type="text" placeholder="بحث في الفواتير..." className="bg-transparent border-none outline-none text-sm w-48" />
                      </div>
                      <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
                      <Button variant="outline" size="icon"><Download className="w-4 h-4" /></Button>
                      <Button variant="outline" size="icon"><Printer className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs: Invoices / Quotations / Returns */}
              <Tabs defaultValue="invoices" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="invoices">الفواتير ({invoices.length})</TabsTrigger>
                  <TabsTrigger value="quotations">عروض الأسعار ({mockQuotations.length})</TabsTrigger>
                  <TabsTrigger value="returns">المرتجعات ({mockSalesReturns.length})</TabsTrigger>
                </TabsList>

                {/* Invoices Tab */}
                <TabsContent value="invoices">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-gray-50">
                              <th className="text-right p-3 font-medium">#</th>
                              <th className="text-right p-3 font-medium">رقم الفاتورة</th>
                              <th className="text-right p-3 font-medium">التاريخ</th>
                              <th className="text-right p-3 font-medium">العميل</th>
                              <th className="text-right p-3 font-medium">الإجمالي</th>
                              <th className="text-right p-3 font-medium">المدفوع</th>
                              <th className="text-right p-3 font-medium">المتبقي</th>
                              <th className="text-right p-3 font-medium">طريقة السداد</th>
                              <th className="text-right p-3 font-medium">الحالة</th>
                              <th className="text-right p-3 font-medium">الإجراءات</th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoices.map((invoice, idx) => (
                              <tr key={invoice.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{idx + 1}</td>
                                <td className="p-3 font-medium">{invoice.number}</td>
                                <td className="p-3">{invoice.date}</td>
                                <td className="p-3">{invoice.customerName}</td>
                                <td className="p-3 font-bold">{invoice.total.toLocaleString()} ج.م</td>
                                <td className="p-3 font-bold text-green-600">{(invoice.paidAmount || 0).toLocaleString()} ج.م</td>
                                <td className={`p-3 font-bold ${(invoice.remainingAmount || invoice.total - (invoice.paidAmount || 0)) > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                  {(invoice.remainingAmount || (invoice.total - (invoice.paidAmount || 0))).toLocaleString()} ج.م
                                </td>
                                <td className="p-3">
                                  <Badge className={
                                    invoice.paymentMethod === 'cash' ? 'bg-green-100 text-green-800' :
                                    invoice.paymentMethod === 'bank' ? 'bg-blue-100 text-blue-800' :
                                    invoice.paymentMethod === 'check' ? 'bg-purple-100 text-purple-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }>
                                    {invoice.paymentMethod === 'cash' ? '💵 نقدى' :
                                     invoice.paymentMethod === 'bank' ? '🏦 بنك' :
                                     invoice.paymentMethod === 'check' ? '📝 شيك' : '⏳ جزئي'}
                                  </Badge>
                                </td>
                                <td className="p-3">
                                  <Badge className={
                                    invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                                    invoice.status === 'posted' ? 'bg-blue-100 text-blue-800' :
                                    invoice.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                    'bg-red-100 text-red-800'
                                  }>
                                    {invoice.status === 'draft' ? 'مسودة' : invoice.status === 'posted' ? 'مرحلة' : invoice.status === 'paid' ? 'مدفوعة' : 'ملغاة'}
                                  </Badge>
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => printInvoice(invoice)} title="طباعة"><Printer className="w-4 h-4 text-gray-600" /></Button>
                                    <Button variant="ghost" size="icon" onClick={() => openEditInvoice(invoice)} title="تعديل" disabled={invoice.status !== 'draft'}><Edit2 className="w-4 h-4 text-blue-600" /></Button>
                                    {invoice.status === 'draft' && (
                                      <Button variant="ghost" size="icon" onClick={() => postInvoice(invoice.id)} title="ترحيل"><CheckSquare className="w-4 h-4 text-green-600" /></Button>
                                    )}
                                    {(invoice.status === 'posted' || invoice.status === 'paid') && (
                                      <Button variant="ghost" size="icon" onClick={() => unpostInvoice(invoice.id)} title="إلغاء الترحيل"><Undo2 className="w-4 h-4 text-orange-600" /></Button>
                                    )}
                                    <Button variant="ghost" size="icon" onClick={() => deleteInvoice(invoice.id, invoice.number)} title="حذف" disabled={invoice.status === 'posted' || invoice.status === 'paid'}><Trash2 className="w-4 h-4 text-red-600" /></Button>
                                    <Button variant="ghost" size="icon" title="عرض"><Eye className="w-4 h-4 text-purple-600" /></Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Quotations Tab */}
                <TabsContent value="quotations">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-gray-50">
                              <th className="text-right p-3 font-medium">#</th>
                              <th className="text-right p-3 font-medium">رقم العرض</th>
                              <th className="text-right p-3 font-medium">التاريخ</th>
                              <th className="text-right p-3 font-medium">العميل</th>
                              <th className="text-right p-3 font-medium">الإجمالي</th>
                              <th className="text-right p-3 font-medium">الحالة</th>
                              <th className="text-right p-3 font-medium">صالح حتى</th>
                              <th className="text-right p-3 font-medium">الإجراءات</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockQuotations.map((quote, idx) => (
                              <tr key={quote.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{idx + 1}</td>
                                <td className="p-3 font-medium">{quote.number}</td>
                                <td className="p-3">{quote.date}</td>
                                <td className="p-3">{quote.customerName}</td>
                                <td className="p-3 font-bold">{quote.total.toLocaleString()} ج.م</td>
                                <td className="p-3">
                                  <Badge className={
                                    quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                    quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }>
                                    {quote.status === 'pending' ? 'قيد الانتظار' : quote.status === 'accepted' ? 'مقبول' : 'منتهي الصلاحية'}
                                  </Badge>
                                </td>
                                <td className="p-3">{quote.validUntil}</td>
                                <td className="p-3">
                                  <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" title="طباعة"><Printer className="w-4 h-4 text-gray-600" /></Button>
                                    <Button variant="ghost" size="icon" title="تحويل لفاتورة"><FileText className="w-4 h-4 text-blue-600" /></Button>
                                    <Button variant="ghost" size="icon" title="تعديل"><Edit2 className="w-4 h-4 text-purple-600" /></Button>
                                    <Button variant="ghost" size="icon" title="حذف"><Trash2 className="w-4 h-4 text-red-600" /></Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Returns Tab */}
                <TabsContent value="returns">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-gray-50">
                              <th className="text-right p-3 font-medium">#</th>
                              <th className="text-right p-3 font-medium">رقم المرتجع</th>
                              <th className="text-right p-3 font-medium">التاريخ</th>
                              <th className="text-right p-3 font-medium">العميل</th>
                              <th className="text-right p-3 font-medium">رقم الفاتورة</th>
                              <th className="text-right p-3 font-medium">القيمة</th>
                              <th className="text-right p-3 font-medium">السبب</th>
                              <th className="text-right p-3 font-medium">الحالة</th>
                              <th className="text-right p-3 font-medium">الإجراءات</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockSalesReturns.map((ret, idx) => (
                              <tr key={ret.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{idx + 1}</td>
                                <td className="p-3 font-medium">{ret.number}</td>
                                <td className="p-3">{ret.date}</td>
                                <td className="p-3">{ret.customerName}</td>
                                <td className="p-3">{ret.invoiceNumber}</td>
                                <td className="p-3 font-bold text-red-600">{ret.total.toLocaleString()} ج.م</td>
                                <td className="p-3">{ret.reason}</td>
                                <td className="p-3">
                                  <Badge className={ret.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                    {ret.status === 'approved' ? 'معتمد' : 'قيد المراجعة'}
                                  </Badge>
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" title="عرض"><Eye className="w-4 h-4 text-blue-600" /></Button>
                                    <Button variant="ghost" size="icon" title="طباعة"><Printer className="w-4 h-4 text-gray-600" /></Button>
                                    <Button variant="ghost" size="icon" title="حذف"><Trash2 className="w-4 h-4 text-red-600" /></Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
                  </>
                )
              })()}
            </div>
          )}

          {/* ============ PURCHASES MODULE ============ */}
          {activeModule === 'purchases' && (
            <div className="space-y-6">
              {/* Purchases Summary Cards - from Journal Entries */}
              {(() => {
                // حسابات المشتريات والمصروفات من القيود المحاسبية
                const purchaseAccounts: Record<string, { name: string; debit: number; credit: number; net: number }> = {}
                
                journalEntries.forEach(entry => {
                  entry.lines.forEach(line => {
                    const code = String(line.accountCode || '')
                    // حسابات المشتريات/التكلفة تبدأ بـ 5
                    if (code.startsWith('5')) {
                      if (!purchaseAccounts[code]) {
                        purchaseAccounts[code] = { name: line.accountName || '', debit: 0, credit: 0, net: 0 }
                      }
                      purchaseAccounts[code].debit += Number(line.debit) || 0
                      purchaseAccounts[code].credit += Number(line.credit) || 0
                    }
                  })
                })
                
                // حساب صافي كل حساب مشتريات
                Object.keys(purchaseAccounts).forEach(code => {
                  purchaseAccounts[code].net = purchaseAccounts[code].debit - purchaseAccounts[code].credit
                })
                
                // إجمالي المشتريات (مجموع الأرصدة المدينة لحسابات 5xxx)
                const totalPurchases = Object.values(purchaseAccounts).reduce((sum, acc) => sum + Math.max(0, acc.net), 0)
                
                // عدد قيود المشتريات
                const purchasesEntriesCount = journalEntries.filter(entry => 
                  entry.lines.some(line => String(line.accountCode || '').startsWith('5'))
                ).length
                
                // المبالغ المستحقة للموردين (حسابات 221x - رصيد دائن)
                let totalPayables = 0
                const supplierAccounts: Record<string, { name: string; debit: number; credit: number }> = {}
                
                journalEntries.forEach(entry => {
                  entry.lines.forEach(line => {
                    const code = String(line.accountCode || '')
                    if (code.startsWith('221')) {
                      if (!supplierAccounts[code]) {
                        supplierAccounts[code] = { name: line.accountName || '', debit: 0, credit: 0 }
                      }
                      supplierAccounts[code].debit += Number(line.debit) || 0
                      supplierAccounts[code].credit += Number(line.credit) || 0
                    }
                  })
                })
                
                totalPayables = Object.values(supplierAccounts).reduce((sum, acc) => 
                  sum + Math.max(0, acc.credit - acc.debit), 0
                )
                
                // المشتريات النقدية (قيود تحتوي على مشتريات + صندوق)
                const cashPurchasesEntries = journalEntries.filter(entry =>
                  entry.lines.some(l => String(l.accountCode || '').startsWith('5')) &&
                  entry.lines.some(l => l.accountCode === '1111')
                )
                const cashPurchasesTotal = cashPurchasesEntries.reduce((sum, entry) => 
                  sum + entry.lines.filter(l => String(l.accountCode || '').startsWith('5'))
                    .reduce((s, l) => s + (Number(l.debit) || 0), 0), 0
                )

                return (
                  <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"><TrendingDown className="w-6 h-6 text-red-600" /></div><div><p className="text-sm text-gray-500">إجمالي المشتريات</p><p className="text-xl font-bold text-red-600">{totalPurchases.toLocaleString()} ج.م</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><ClipboardList className="w-6 h-6 text-blue-600" /></div><div><p className="text-sm text-gray-500">قيود المشتريات</p><p className="text-xl font-bold text-blue-600">{purchasesEntriesCount} قيد</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center"><Clock className="w-6 h-6 text-yellow-600" /></div><div><p className="text-sm text-gray-500">الموردين الدائنون</p><p className="text-xl font-bold text-yellow-600">{totalPayables.toLocaleString()} ج.م</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center"><Truck className="w-6 h-6 text-purple-600" /></div><div><p className="text-sm text-gray-500">المشتريات النقدية</p><p className="text-xl font-bold text-purple-600">{cashPurchasesTotal.toLocaleString()} ج.م</p></div></div></CardContent></Card>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Button onClick={openNewPurchase} className="bg-gradient-to-r from-[#dc2626] to-[#ef4444] hover:from-[#b91c1c] hover:to-[#dc2626]"><Plus className="ml-2 h-4 w-4" />فاتورة مشتريات</Button>
                      <Button variant="outline" onClick={() => alert('سيتم تطبيق ميزة طلبات الشراء قريباً')}><ClipboardList className="ml-2 h-4 w-4" />طلب شراء جديد</Button>
                      <Button variant="outline" onClick={() => alert('سيتم تطبيق ميزة مرتجع المشتريات قريباً')}><RotateCcw className="ml-2 h-4 w-4" />مرتجع مشتريات</Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => {
                        const csvContent = 'data:text/csv;charset=utf-utf8,' + 
                          'رقم الفاتورة,المورد,التاريخ,الإجمالي,الحالة,المدفوع,المتبقي\n' +
                          purchaseInvoices.map(p => `${p.number},${p.supplierName},${p.date},${p.total},${p.status},${p.paidAmount},${p.remainingAmount}`).join('\n')
                        const link = document.createElement('a')
                        link.setAttribute('href', encodeURI(csvContent))
                        link.setAttribute('download', 'purchases.csv')
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                      }} title="تصدير Excel"><Download className="w-4 h-4" /></Button>
                      <Button variant="outline" size="icon" onClick={() => window.print()} title="طباعة"><Printer className="w-4 h-4" /></Button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-red-50">
                          <th className="text-right p-3 font-medium">#</th>
                          <th className="text-right p-3 font-medium">رقم الفاتورة</th>
                          <th className="text-right p-3 font-medium">المورد</th>
                          <th className="text-right p-3 font-medium">التاريخ</th>
                          <th className="text-right p-3 font-medium">الإجمالي</th>
                          <th className="text-right p-3 font-medium">المدفوع</th>
                          <th className="text-right p-3 font-medium">المتبقي</th>
                          <th className="text-right p-3 font-medium">طريقة السداد</th>
                          <th className="text-right p-3 font-medium">الحالة</th>
                          <th className="text-right p-3 font-medium">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseInvoices.length === 0 ? (
                          <tr>
                            <td colSpan={10} className="p-10 text-center text-gray-500">
                              <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
                              <p className="text-lg">لا توجد فواتير مشتريات بعد</p>
                              <p className="text-sm mt-2">اضغط على "فاتورة مشتريات" لإضافة فاتورة جديدة</p>
                            </td>
                          </tr>
                        ) : (
                          purchaseInvoices.map((purchase, idx) => (
                            <tr key={purchase.id} className="border-b hover:bg-red-50 transition-colors">
                              <td className="p-3">{idx + 1}</td>
                              <td className="p-3 font-bold font-mono text-red-700">{purchase.number}</td>
                              <td className="p-3 font-medium">{purchase.supplierName}</td>
                              <td className="p-3">{purchase.date}</td>
                              <td className="p-3 font-bold text-red-600">{purchase.total.toLocaleString()} ج.م</td>
                              <td className="p-3 font-bold text-green-600">{purchase.paidAmount.toLocaleString()} ج.م</td>
                              <td className="p-3 font-bold text-orange-600">{purchase.remainingAmount.toLocaleString()} ج.م</td>
                              <td className="p-3">
                                <Badge className={
                                  purchase.paymentMethod === 'cash' ? 'bg-green-100 text-green-800' :
                                  purchase.paymentMethod === 'bank' ? 'bg-blue-100 text-blue-800' :
                                  purchase.paymentMethod === 'check' ? 'bg-purple-100 text-purple-800' :
                                  'bg-orange-100 text-orange-800'
                                }>
                                  {purchase.paymentMethod === 'cash' ? 'نقدى' : 
                                   purchase.paymentMethod === 'bank' ? 'بنك' :
                                   purchase.paymentMethod === 'check' ? 'شيك' : 'جزئي'}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <Badge className={
                                  purchase.status === 'paid' ? 'bg-green-100 text-green-800' :
                                  purchase.status === 'posted' ? 'bg-blue-100 text-blue-800' :
                                  purchase.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }>
                                  {purchase.status === 'paid' ? '✅ مدفوعة' : 
                                   purchase.status === 'posted' ? '📋 مرحلة' :
                                   purchase.status === 'cancelled' ? '❌ ملغاة' : '📝 مسودة'}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="icon" title="عرض التفاصيل" onClick={() => viewPurchaseDetails(purchase)}><Eye className="w-4 h-4 text-blue-600" /></Button>
                                  <Button variant="ghost" size="icon" title="تعديل" onClick={() => openEditPurchase(purchase)} disabled={purchase.status === 'posted' || purchase.status === 'paid'}><Edit2 className={`w-4 h-4 ${purchase.status === 'posted' || purchase.status === 'paid' ? 'text-gray-300' : 'text-purple-600'}`} /></Button>
                                  <Button variant="ghost" size="icon" title="طباعة" onClick={() => { openEditPurchase(purchase); setTimeout(() => printPurchaseInvoice(), 100); }}><Printer className="w-4 h-4 text-gray-600" /></Button>
                                  <Button variant="ghost" size="icon" title="حذف" onClick={() => deletePurchase(purchase.id, purchase.number)} disabled={purchase.status === 'posted' || purchase.status === 'paid'}><Trash2 className={`w-4 h-4 ${purchase.status === 'posted' || purchase.status === 'paid' ? 'text-gray-300' : 'text-red-600'}`} /></Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
                  </>
                )
              })()}
            </div>
          )}

          {/* ============ INVENTORY MODULE ============ */}
          {activeModule === 'inventory' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><Package className="w-6 h-6 text-blue-600" /></div><div><p className="text-sm text-gray-500">إجمالي الأصناف</p><p className="text-xl font-bold text-blue-600">{items.length}</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-600" /></div><div><p className="text-sm text-gray-500">متوفر</p><p className="text-xl font-bold text-green-600">{items.filter(i => i.stock > 30).length}</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-yellow-600" /></div><div><p className="text-sm text-gray-500">مخزون منخفض</p><p className="text-xl font-bold text-yellow-600">{items.filter(i => i.stock <= 30 && i.stock > 10).length}</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"><AlertCircle className="w-6 h-6 text-red-600" /></div><div><p className="text-sm text-gray-500">نافذ المخزون</p><p className="text-xl font-bold text-red-600">{items.filter(i => i.stock <= 10).length}</p></div></div></CardContent></Card>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Button onClick={openNewInventoryItem} className="bg-gradient-to-r from-[#005f73] to-[#0a9396]"><Plus className="ml-2 h-4 w-4" />صنف جديد</Button>
                      <Button variant="outline"><Truck className="ml-2 h-4 w-4" />نقل مخزني</Button>
                      <Button variant="outline"><QrCode className="ml-2 h-4 w-4" />طباعة باركود</Button>
                      <Button variant="outline"><Upload className="ml-2 h-4 w-4" />استيراد</Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon"><Download className="w-4 h-4" /></Button>
                      <Button variant="outline" size="icon"><Printer className="w-4 h-4" /></Button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-right p-3 font-medium">#</th>
                          <th className="text-right p-3 font-medium">الكود</th>
                          <th className="text-right p-3 font-medium">اسم الصنف</th>
                          <th className="text-right p-3 font-medium">الفئة</th>
                          <th className="text-right p-3 font-medium">السعر</th>
                          <th className="text-right p-3 font-medium">الكمية</th>
                          <th className="text-right p-3 font-medium">الحالة</th>
                          <th className="text-right p-3 font-medium">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, idx) => (
                          <tr key={item.id} className="border-b hover:bg-gray-50">
                            <td className="p-3">{idx + 1}</td>
                            <td className="p-3 font-mono">{item.code}</td>
                            <td className="p-3 font-medium">{item.nameAr}</td>
                            <td className="p-3">{item.category}</td>
                            <td className="p-3">{item.price.toLocaleString()} ج.م</td>
                            <td className="p-3">
                              <span className={item.stock <= 10 ? 'text-red-600 font-bold' : item.stock <= 30 ? 'text-yellow-600' : ''}>{item.stock}</span>
                            </td>
                            <td className="p-3">
                              <Badge className={
                                item.stock > 30 ? 'bg-green-100 text-green-800' :
                                item.stock > 10 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }>
                                {item.stock > 30 ? 'متوفر' : item.stock > 10 ? 'منخفض' : 'نافذ'}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" onClick={() => alert(`تفاصيل الصنف:\n\nالاسم: ${item.nameAr}\nالكود: ${item.code}\nالفئة: ${item.category}\nالسعر: ${item.price.toLocaleString()} ج.م\nالكمية: ${item.stock}`)} title="عرض"><Eye className="w-4 h-4 text-blue-600" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => openEditInventoryItem(item)} title="تعديل"><Edit2 className="w-4 h-4 text-purple-600" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => {
                                  const printWindow = window.open('', '_blank')
                                  if (printWindow) {
                                    printWindow.document.write(`
                                      <html dir="rtl">
                                      <head><title>باركود - ${item.nameAr}</title>
                                      <style>
                                        body { font-family: Arial; padding: 40px; direction: rtl; text-align: center; }
                                        .barcode { font-size: 48px; font-family: monospace; margin: 20px 0; }
                                        .name { font-size: 24px; font-weight: bold; }
                                        .price { font-size: 32px; color: #005f73; margin-top: 10px; }
                                      </style>
                                      </head>
                                      <body>
                                        <div class="name">${item.nameAr}</div>
                                        <div class="barcode">|||${item.code}|||</div>
                                        <div class="code">${item.code}</div>
                                        <div class="price">${item.price.toLocaleString()} ج.م</div>
                                      </body>
                                      </html>
                                    `)
                                    printWindow.document.close()
                                    printWindow.print()
                                  }
                                }} title="طباعة باركود"><QrCode className="w-4 h-4 text-gray-600" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => alert(`حركة مخزون - ${item.nameAr}:\n\nالكمية الحالية: ${item.stock}\n\n(سيتم تطوير هذه الميزة لاحقاً)`)} title="حركة مخزون"><Activity className="w-4 h-4 text-green-600" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => deleteInventoryItem(item.id, item.nameAr)} title="حذف"><Trash2 className="w-4 h-4 text-red-600" /></Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ============ PARTIES MODULE ============ */}
          {activeModule === 'parties' && (
            <div className="space-y-6">
              <Tabs defaultValue="all">
                <TabsList><TabsTrigger value="all">الكل</TabsTrigger><TabsTrigger value="customers">العملاء</TabsTrigger><TabsTrigger value="suppliers">الموردون</TabsTrigger></TabsList>
                
                <TabsContent value="all">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <Button onClick={openNewParty} className="bg-gradient-to-r from-[#005f73] to-[#0a9396]"><Plus className="ml-2 h-4 w-4" />طرف جديد</Button>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                            <Search className="w-4 h-4 text-gray-400 ml-2" />
                            <input type="text" placeholder="بحث..." className="bg-transparent border-none outline-none text-sm" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {parties.map(party => (
                          <Card key={party.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-[#005f73]/10 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-[#005f73]" />
                                  </div>
                                  <div>
                                    <h3 className="font-bold">{party.nameAr}</h3>
                                    <p className="text-sm text-gray-500">{party.phone}</p>
                                  </div>
                                </div>
                                <Badge className={party.type === 'customer' ? 'bg-blue-100 text-blue-800' : party.type === 'supplier' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}>
                                  {party.type === 'customer' ? 'عميل' : party.type === 'supplier' ? 'مورد' : 'كلاهما'}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between pt-3 border-t">
                                <span className="text-sm text-gray-500">الرصيد</span>
                                <span className={`font-bold ${party.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {party.balance >= 0 ? '' : '-'}{Math.abs(party.balance).toLocaleString()} ج.م
                                </span>
                              </div>
                              <div className="flex items-center gap-1 mt-3">
                                <Button variant="ghost" size="sm" onClick={() => viewPartyDetails(party)} title="عرض"><Eye className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => openEditParty(party)} title="تعديل"><Edit2 className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => printPartyStatement(party)} title="كشف حساب"><Receipt className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => deleteParty(party.id, party.nameAr)} title="حذف"><Trash2 className="w-4 h-4 text-red-600" /></Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* ============ TREASURY MODULE ============ */}
          {activeModule === 'treasury' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-r-4 border-r-green-500"><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"><TrendingUp className="w-6 h-6 text-green-600" /></div><div><p className="text-sm text-gray-500">الإيرادات</p><p className="text-xl font-bold text-green-600">{transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0).toLocaleString()} ج.م</p></div></div></CardContent></Card>
                <Card className="border-r-4 border-r-red-500"><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"><TrendingDown className="w-6 h-6 text-red-600" /></div><div><p className="text-sm text-gray-500">المصروفات</p><p className="text-xl font-bold text-red-600">{transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0).toLocaleString()} ج.م</p></div></div></CardContent></Card>
                <Card className="border-r-4 border-r-blue-500"><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><Wallet className="w-6 h-6 text-blue-600" /></div><div><p className="text-sm text-gray-500">الرصيد</p><p className="text-xl font-bold text-blue-600">{(transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) - transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)).toLocaleString()} ج.م</p></div></div></CardContent></Card>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Button onClick={() => openNewTransaction('income')} className="bg-green-500 hover:bg-green-600"><Plus className="ml-2 h-4 w-4" />إيراد جديد</Button>
                      <Button onClick={() => openNewTransaction('expense')} className="bg-red-500 hover:bg-red-600"><Plus className="ml-2 h-4 w-4" />مصروف جديد</Button>
                      <Button variant="outline"><Send className="ml-2 h-4 w-4" />تحويل</Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon"><Download className="w-4 h-4" /></Button>
                      <Button variant="outline" size="icon"><Printer className="w-4 h-4" /></Button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-right p-3 font-medium">#</th>
                          <th className="text-right p-3 font-medium">التاريخ</th>
                          <th className="text-right p-3 font-medium">الوصف</th>
                          <th className="text-right p-3 font-medium">الفئة</th>
                          <th className="text-right p-3 font-medium">المبلغ</th>
                          <th className="text-right p-3 font-medium">النوع</th>
                          <th className="text-right p-3 font-medium">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((trans, idx) => (
                          <tr key={trans.id} className="border-b hover:bg-gray-50">
                            <td className="p-3">{idx + 1}</td>
                            <td className="p-3">{trans.date}</td>
                            <td className="p-3">{trans.description}</td>
                            <td className="p-3">{trans.category}</td>
                            <td className={`p-3 font-bold ${trans.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                              {trans.type === 'income' ? '+' : '-'}{trans.amount.toLocaleString()} ج.م
                            </td>
                            <td className="p-3">
                              <Badge className={trans.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {trans.type === 'income' ? 'إيراد' : 'مصروف'}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" onClick={() => viewTransactionDetails(trans)} title="عرض"><Eye className="w-4 h-4 text-blue-600" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => openEditTransaction(trans)} title="تعديل"><Edit2 className="w-4 h-4 text-purple-600" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => printTransaction(trans)} title="طباعة"><Printer className="w-4 h-4 text-gray-600" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => deleteTransaction(trans.id, trans.description)} title="حذف"><Trash2 className="w-4 h-4 text-red-600" /></Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ============ GENERAL LEDGER MODULE ============ */}
          {activeModule === 'general-ledger' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><Landmark className="w-6 h-6 text-blue-600" /></div><div><p className="text-sm text-gray-500">إجمالي الحسابات</p><p className="text-xl font-bold text-blue-600">{mockAccounts.filter(a => a.level >= 2).length}</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"><FileText className="w-6 h-6 text-green-600" /></div><div><p className="text-sm text-gray-500">القيود المرحلة</p><p className="text-xl font-bold text-green-600">{journalEntries.filter(e => e.status === 'posted').length}</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center"><Calculator className="w-6 h-6 text-purple-600" /></div><div><p className="text-sm text-gray-500">إجمالي المدين</p><p className="text-xl font-bold text-purple-600">{journalEntries.filter(e => e.status === 'posted').reduce((sum, e) => sum + e.totalDebit, 0).toLocaleString()}</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center"><DollarSign className="w-6 h-6 text-orange-600" /></div><div><p className="text-sm text-gray-500">إجمالي الدائن</p><p className="text-xl font-bold text-orange-600">{journalEntries.filter(e => e.status === 'posted').reduce((sum, e) => sum + e.totalCredit, 0).toLocaleString()}</p></div></div></CardContent></Card>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>📒 الاستاذ العام - كشف الحساب</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={printAccountStatement} disabled={!showGLStatement}><Printer className="ml-2 h-4 w-4" />طباعة</Button>
                    <Button variant="outline" onClick={exportAccountToExcel} disabled={!showGLStatement}><Download className="ml-2 h-4 w-4" />تصدير Excel</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label>الحساب</Label>
                      <Select value={selectedGLAccount} onValueChange={(v) => { setSelectedGLAccount(v); setShowGLStatement(true); addLogEntry('استعلام استاذ عام', `تم اختيار حساب: ${v}`) }}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="اختر الحساب" /></SelectTrigger>
                        <SelectContent>
                          {mockAccounts.filter(a => a.level >= 2).map(acc => (
                            <SelectItem key={acc.id} value={acc.code}>{acc.code} - {acc.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>من تاريخ</Label>
                      <Input type="date" className="mt-1" value={glDateFrom} onChange={(e) => setGlDateFrom(e.target.value)} />
                    </div>
                    <div>
                      <Label>إلى تاريخ</Label>
                      <Input type="date" className="mt-1" value={glDateTo} onChange={(e) => setGlDateTo(e.target.value)} />
                    </div>
                    <div className="flex items-end">
                      <Button 
                        className="bg-gradient-to-r from-[#005f73] to-[#0a9396] w-full"
                        onClick={() => setShowGLStatement(true)}
                        disabled={!selectedGLAccount}
                      >
                        <Search className="ml-2 h-4 w-4" />
                        عرض كشف الحساب
                      </Button>
                    </div>
                  </div>

                  {showGLStatement && selectedGLAccount && (() => {
                    const statement = getAccountStatement(selectedGLAccount)
                    if (!statement.account) return null
                    
                    let runningBalance = statement.openingBalance

                    return (
                      <div className="border rounded-lg overflow-hidden" id="account-statement-print">
                        {/* Header */}
                        <div className="bg-[#005f73] text-white p-4 text-center">
                          <h2 className="text-xl font-bold">{companySettings.nameAr}</h2>
                          <h3 className="text-lg">كشف حساب: {statement.account.name} ({statement.account.code})</h3>
                          <p className="text-sm opacity-90">الفترة من: {glDateFrom || 'بداية الفترة'} إلى: {glDateTo || 'ت اليوم'}</p>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">رصيد افتتاحي</p>
                            <p className="font-bold text-blue-600">{statement.openingBalance.toLocaleString()}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">إجمالي مدين</p>
                            <p className="font-bold text-red-600">{statement.totalDebit.toLocaleString()}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">إجمالي دائن</p>
                            <p className="font-bold text-green-600">{statement.totalCredit.toLocaleString()}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">رصيد ختامي</p>
                            <p className="font-bold text-purple-600">{statement.closingBalance.toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="p-3 text-right">التاريخ</th>
                                <th className="p-3 text-right">رقم القيد</th>
                                <th className="p-3 text-right">البيان</th>
                                <th className="p-3 text-left">مدين</th>
                                <th className="p-3 text-left">دائن</th>
                                <th className="p-3 text-left">الرصيد</th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* Opening Balance Row */}
                              <tr className="bg-blue-50 font-bold">
                                <td colSpan={3} className="p-3 text-right">رصيد افتتاحي</td>
                                <td className="p-3 text-left"></td>
                                <td className="p-3 text-left"></td>
                                <td className="p-3 text-left font-bold">{runningBalance.toLocaleString()}</td>
                              </tr>
                              
                              {/* Entry Rows */}
                              {statement.entries.length > 0 ? (
                                statement.entries.map((entry: any) => {
                                  const line = entry.lines.find((l: any) => l.accountCode === selectedGLAccount)
                                  if (!line) return null
                                  
                                  if (['asset', 'expense'].includes(statement.account.type)) {
                                    runningBalance += (line.debit - line.credit)
                                  } else {
                                    runningBalance += (line.credit - line.debit)
                                  }

                                  return (
                                    <tr key={entry.id} className="border-b hover:bg-gray-50">
                                      <td className="p-3">{entry.date}</td>
                                      <td className="p-3 font-mono">{entry.entryNumber}</td>
                                      <td className="p-3">{entry.description}</td>
                                      <td className="p-3 text-left font-medium text-red-600">{line.debit ? line.debit.toLocaleString() : ''}</td>
                                      <td className="p-3 text-left font-medium text-green-600">{line.credit ? line.credit.toLocaleString() : ''}</td>
                                      <td className="p-3 text-left font-bold">{runningBalance.toLocaleString()}</td>
                                    </tr>
                                  )
                                })
                              ) : (
                                <tr>
                                  <td colSpan={6} className="p-8 text-center text-gray-500">
                                    لا توجد قيود لهذا الحساب في الفترة المحددة
                                  </td>
                                </tr>
                              )}

                              {/* Total Row */}
                              <tr className="bg-gray-100 font-bold">
                                <td colSpan={3} className="p-3 text-right">الإجمالي / الرصيد الختامي</td>
                                <td className="p-3 text-left text-red-600">{statement.totalDebit.toLocaleString()}</td>
                                <td className="p-3 text-left text-green-600">{statement.totalCredit.toLocaleString()}</td>
                                <td className="p-3 text-left text-purple-600">{statement.closingBalance.toLocaleString()}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )
                  })()}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ============ CHART OF ACCOUNTS MODULE ============ */}
          {activeModule === 'accounts' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><BookOpen className="w-6 h-6 text-blue-600" /></div><div><p className="text-sm text-gray-500">إجمالي الحسابات</p><p className="text-xl font-bold text-blue-600">{mockAccounts.length}</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"><TrendingUp className="w-6 h-6 text-green-600" /></div><div><p className="text-sm text-gray-500">الأصول</p><p className="text-xl font-bold text-green-600">{mockAccounts.filter(a => a.type === 'asset').length} حساب</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"><TrendingDown className="w-6 h-6 text-red-600" /></div><div><p className="text-sm text-gray-500">الخصوم</p><p className="text-xl font-bold text-red-600">{mockAccounts.filter(a => a.type === 'liability').length} حساب</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center"><DollarSign className="w-6 h-6 text-emerald-600" /></div><div><p className="text-sm text-gray-500">الإيرادات</p><p className="text-xl font-bold text-emerald-600">{mockAccounts.filter(a => a.type === 'revenue').length} حساب</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center"><Receipt className="w-6 h-6 text-orange-600" /></div><div><p className="text-sm text-gray-500">المصروفات</p><p className="text-xl font-bold text-orange-600">{mockAccounts.filter(a => a.type === 'expense').length} حساب</p></div></div></CardContent></Card>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>📊 دليل الحسابات الشامل</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                      <Search className="w-4 h-4 text-gray-400 ml-2" />
                      <input 
                        type="text" 
                        placeholder="بحث في الحسابات..." 
                        className="bg-transparent border-none outline-none text-sm w-48"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button className="bg-gradient-to-r from-[#005f73] to-[#0a9396]" onClick={() => setShowAddAccountDialog(true)}><Plus className="ml-2 h-4 w-4" />حساب جديد</Button>
                    <Button variant="outline" onClick={() => window.print()}><Printer className="ml-2 h-4 w-4" />طباعة الدليل</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Account Type Legend */}
                  <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg text-sm">
                    <span className="font-medium">أنواع الحسابات:</span>
                    <Badge className="bg-blue-100 text-blue-800">أصول</Badge>
                    <Badge className="bg-red-100 text-red-800">خصوم</Badge>
                    <Badge className="bg-purple-100 text-purple-800">ملكية</Badge>
                    <Badge className="bg-green-100 text-green-800">إيرادات</Badge>
                    <Badge className="bg-orange-100 text-orange-800">مصروفات</Badge>
                  </div>

                  {/* Account Tree Table */}
                  <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-[#005f73] text-white">
                          <th className="text-right p-3 font-medium w-12">#</th>
                          <th className="text-right p-3 font-medium w-24">رقم الحساب</th>
                          <th className="text-right p-3 font-medium">اسم الحساب</th>
                          <th className="text-right p-3 font-medium w-28">نوع الحساب</th>
                          <th className="text-right p-3 font-medium w-20">المستوى</th>
                          <th className="text-right p-3 font-medium w-32">الحساب الأب/الإجمالي</th>
                          <th className="text-right p-3 font-medium w-32">إجمالي الأرصدة</th>
                          <th className="text-right p-3 font-medium w-32">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockAccounts
                          .filter(account => {
                            if (!searchTerm) return true
                            return account.name.includes(searchTerm) || account.code.includes(searchTerm)
                          })
                          .map((account, idx) => {
                            const hasChildren = mockAccounts.some(a => a.parentId === account.id)
                            const isExpanded = expandedAccounts.has(account.id)
                            const parentAccount = account.parentId ? mockAccounts.find(a => a.id === account.parentId) : null
                            
                            return (
                              <React.Fragment key={account.id}>
                                <tr className={`border-b hover:bg-gray-50 ${account.level === 1 ? 'bg-gray-100 font-bold' : ''}`}>
                                  <td className="p-3 text-gray-500">{idx + 1}</td>
                                  <td className="p-3 font-mono text-[#005f73]">{account.code}</td>
                                  <td className="p-3">
                                    <div className="flex items-center gap-2">
                                      {hasChildren && (
                                        <button 
                                          onClick={() => toggleAccountExpansion(account.id)}
                                          className="p-1 hover:bg-gray-200 rounded"
                                        >
                                          {isExpanded ? (
                                            <ChevronDown className="w-4 h-4" />
                                          ) : (
                                            <ChevronLeft className="w-4 h-4" />
                                          )}
                                        </button>
                                      )}
                                      {!hasChildren && account.level > 1 && (
                                        <span className="w-4"></span>
                                      )}
                                      <span style={{ paddingRight: `${(account.level - 1) * 16}px` }}>
                                        {account.name}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    <Badge className={
                                      account.type === 'asset' ? 'bg-blue-100 text-blue-800' :
                                      account.type === 'liability' ? 'bg-red-100 text-red-800' :
                                      account.type === 'equity' ? 'bg-purple-100 text-purple-800' :
                                      account.type === 'revenue' ? 'bg-green-100 text-green-800' :
                                      'bg-orange-100 text-orange-800'
                                    }>
                                      {account.type === 'asset' ? 'أصل' : 
                                       account.type === 'liability' ? 'خصم' : 
                                       account.type === 'equity' ? 'ملكية' : 
                                       account.type === 'revenue' ? 'إيراد' : 'مصروف'}
                                    </Badge>
                                  </td>
                                  <td className="p-3 text-center">{account.level}</td>
                                  <td className="p-3">{parentAccount?.name || '-'}</td>
                                  <td className="p-3 font-bold">{account.balance.toLocaleString()}</td>
                                  <td className="p-3">
                                    <div className="flex items-center gap-1">
                                      <Button variant="ghost" size="icon" title="عرض التفاصيل" onClick={() => viewAccountDetails(account)}><Eye className="w-4 h-4 text-blue-600" /></Button>
                                      <Button variant="ghost" size="icon" title="تعديل" onClick={() => editAccount(account)}><Edit2 className="w-4 h-4 text-purple-600" /></Button>
                                      {account.level > 2 && (
                                        <Button variant="ghost" size="icon" title="حذف" onClick={() => deleteAccount(account.id, account.name)}><Trash2 className="w-4 h-4 text-red-600" /></Button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              </React.Fragment>
                            )
                          })}
                      </tbody>
                    </table>
                  </div>

                  {mockAccounts.filter(account => {
                    if (!searchTerm) return false
                    return account.name.includes(searchTerm) || account.code.includes(searchTerm)
                  }).length === 0 && searchTerm && (
                    <div className="text-center py-8 text-gray-500">
                      <Search className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p>لا توجد نتائج لـ "{searchTerm}"</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* ============ DIALOG: إضافة حساب جديد ============ */}
              <Dialog open={showAddAccountDialog} onOpenChange={setShowAddAccountDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-[#005f73]">
                      <Plus className="w-5 h-5" />
                      إضافة حساب جديد
                    </DialogTitle>
                    <DialogDescription>أدخل بيانات الحساب الجديد في النموذج أدناه</DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label>رقم الحساب <span className="text-red-500">*</span></Label>
                      <Input 
                        className="mt-1" 
                        placeholder="مثال: 1101"
                        value={newAccountForm.code}
                        onChange={(e) => setNewAccountForm(prev => ({...prev, code: e.target.value}))}
                      />
                    </div>
                    <div>
                      <Label>اسم الحساب <span className="text-red-500">*</span></Label>
                      <Input 
                        className="mt-1" 
                        placeholder="مثال: الصندوق"
                        value={newAccountForm.name}
                        onChange={(e) => setNewAccountForm(prev => ({...prev, name: e.target.value}))}
                      />
                    </div>
                    <div>
                      <Label>نوع الحساب</Label>
                      <Select value={newAccountForm.type} onValueChange={(v) => setNewAccountForm(prev => ({...prev, type: v as any}))}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asset">أصل</SelectItem>
                          <SelectItem value="liability">خصم</SelectItem>
                          <SelectItem value="equity">ملكية</SelectItem>
                          <SelectItem value="revenue">إيراد</SelectItem>
                          <SelectItem value="expense">مصروف</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>الحساب الأب (اختياري)</Label>
                      <Select value={newAccountForm.parentId} onValueChange={(v) => {
                        const parent = mockAccounts.find(a => a.id === v)
                        setNewAccountForm(prev => ({
                          ...prev, 
                          parentId: v,
                          level: parent ? parent.level + 1 : 1
                        }))
                      }}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="اختر الحساب الأب" /></SelectTrigger>
                        <SelectContent>
                          {mockAccounts.filter(a => a.level < 3).map(acc => (
                            <SelectItem key={acc.id} value={acc.id}>{acc.code} - {acc.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>الرصيد الافتتاحي</Label>
                      <Input 
                        type="number" 
                        className="mt-1" 
                        placeholder="0"
                        value={newAccountForm.balance || ''}
                        onChange={(e) => setNewAccountForm(prev => ({...prev, balance: parseFloat(e.target.value) || 0}))}
                      />
                    </div>
                    <div>
                      <Label>المستوى</Label>
                      <Input 
                        className="mt-1 bg-gray-50" 
                        value={newAccountForm.level}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" onClick={() => setShowAddAccountDialog(false)}>
                      إلغاء
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-[#005f73] to-[#0a9396]"
                      onClick={() => {
                        if (!newAccountForm.code || !newAccountForm.name) {
                          alert('يرجى إدخال رقم الحساب واسمه')
                          return
                        }
                        // التحقق من عدم تكرار الكود
                        if (mockAccounts.some(a => a.code === newAccountForm.code)) {
                          alert('رقم الحساب موجود مسبقاً')
                          return
                        }
                        
                        const newAccount = {
                          id: `acc-${Date.now()}`,
                          code: newAccountForm.code,
                          name: newAccountForm.name,
                          type: newAccountForm.type,
                          level: newAccountForm.level,
                          parentId: newAccountForm.parentId || null,
                          balance: newAccountForm.balance
                        }
                        
                        mockAccounts.push(newAccount)
                        addLogEntry('إضافة حساب', `تم إضافة حساب: ${newAccountForm.code} - ${newAccountForm.name}`)
                        
                        // إعادة تعيين النموذج وإغلاق النافذة
                        setNewAccountForm({
                          code: '',
                          name: '',
                          type: 'asset',
                          parentId: '',
                          balance: 0,
                          level: 2
                        })
                        setShowAddAccountDialog(false)
                        alert('✓ تم إضافة الحساب بنجاح')
                      }}
                    >
                      <Save className="ml-2 h-4 w-4" />
                      حفظ الحساب
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* ============ DIALOG: عرض تفاصيل الحساب ============ */}
              <Dialog open={showAccountDialog} onOpenChange={setShowAccountDialog}>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-[#005f73]">
                      <Eye className="w-5 h-5" />
                      تفاصيل الحساب
                    </DialogTitle>
                  </DialogHeader>
                  {viewingAccount && (
                    <div className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div><Label>رقم الحساب</Label><Input className="mt-1 bg-gray-50" value={viewingAccount.code} readOnly /></div>
                        <div><Label>اسم الحساب</Label><Input className="mt-1 bg-gray-50" value={viewingAccount.name} readOnly /></div>
                        <div><Label>نوع الحساب</Label><Input className="mt-1 bg-gray-50" value={
                          viewingAccount.type === 'asset' ? 'أصل' : 
                          viewingAccount.type === 'liability' ? 'خصم' : 
                          viewingAccount.type === 'equity' ? 'ملكية' : 
                          viewingAccount.type === 'revenue' ? 'إيراد' : 'مصروف'
                        } readOnly /></div>
                        <div><Label>المستوى</Label><Input className="mt-1 bg-gray-50" value={viewingAccount.level} readOnly /></div>
                        <div><Label>الحساب الأب</Label><Input className="mt-1 bg-gray-50" value={viewingAccount.parentId ? mockAccounts.find(a => a.id === viewingAccount.parentId)?.name || '-' : '-'} readOnly /></div>
                        <div><Label>الرصيد</Label><Input className="mt-1 bg-gray-50 font-bold text-green-600" value={viewingAccount.balance.toLocaleString()} readOnly /></div>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="outline" onClick={() => setShowAccountDialog(false)}>إغلاق</Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* ============ DIALOG: تعديل حساب ============ */}
              <Dialog open={showEditAccountDialog} onOpenChange={setShowEditAccountDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-[#005f73]">
                      <Edit2 className="w-5 h-5" />
                      تعديل الحساب
                    </DialogTitle>
                    <DialogDescription>قم بتعديل بيانات الحساب أدناه</DialogDescription>
                  </DialogHeader>
                  
                  {editingAccount && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label>رقم الحساب</Label>
                        <Input className="mt-1 bg-gray-50" value={editingAccount.code} disabled />
                      </div>
                      <div>
                        <Label>اسم الحساب</Label>
                        <Input 
                          className="mt-1" 
                          value={editingAccount.name}
                          onChange={(e) => setEditingAccount({...editingAccount, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>نوع الحساب</Label>
                        <Select 
                          value={editingAccount.type} 
                          onValueChange={(v) => setEditingAccount({...editingAccount, type: v as any})}
                        >
                          <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asset">أصل</SelectItem>
                            <SelectItem value="liability">خصم</SelectItem>
                            <SelectItem value="equity">ملكية</SelectItem>
                            <SelectItem value="revenue">إيراد</SelectItem>
                            <SelectItem value="expense">مصروف</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>الرصيد</Label>
                        <Input 
                          type="number"
                          className="mt-1" 
                          value={editingAccount.balance || ''}
                          onChange={(e) => setEditingAccount({...editingAccount, balance: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" onClick={() => setShowEditAccountDialog(false)}>
                      إلغاء
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-[#005f73] to-[#0a9396]"
                      onClick={saveAccountEdit}
                    >
                      <Save className="ml-2 h-4 w-4" />
                      حفظ التعديلات
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* ============ BANKS MODULE ============ */}
          {activeModule === 'banks' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><Landmark className="w-6 h-6 text-blue-600" /></div><div><p className="text-sm text-gray-500">إجمالي الحسابات البنكية</p><p className="text-xl font-bold text-blue-600">125,000 ج.م</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"><CreditCard className="w-6 h-6 text-green-600" /></div><div><p className="text-sm text-gray-500">الشيكات المعلقة</p><p className="text-xl font-bold text-green-600">{mockChecks.filter(c => c.status === 'pending').length}</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center"><Clock className="w-6 h-6 text-yellow-600" /></div><div><p className="text-sm text-gray-500">شيكات مستحقة قريباً</p><p className="text-xl font-bold text-yellow-600">2</p></div></div></CardContent></Card>
              </div>

              <Tabs defaultValue="accounts">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="accounts">الحسابات البنكية</TabsTrigger>
                  <TabsTrigger value="checks">الشيكات</TabsTrigger>
                  <TabsTrigger value="reconciliation">التسوية</TabsTrigger>
                </TabsList>

                <TabsContent value="accounts">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>الحسابات البنكية</CardTitle>
                      <Button className="bg-gradient-to-r from-[#005f73] to-[#0a9396]"><Plus className="ml-2 h-4 w-4" />حساب بنكي جديد</Button>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-gray-50">
                              <th className="text-right p-3 font-medium">#</th>
                              <th className="text-right p-3 font-medium">البنك</th>
                              <th className="text-right p-3 font-medium">رقم الحساب</th>
                              <th className="text-right p-3 font-medium">نوع الحساب</th>
                              <th className="text-right p-3 font-medium">الرصيد</th>
                              <th className="text-right p-3 font-medium">العملة</th>
                              <th className="text-right p-3 font-medium">الإجراءات</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockBankAccounts.map((acc, idx) => (
                              <tr key={acc.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{idx + 1}</td>
                                <td className="p-3 font-medium">{acc.bankName}</td>
                                <td className="p-3 font-mono">{acc.accountNumber}</td>
                                <td className="p-3">{acc.accountType}</td>
                                <td className="p-3 font-bold text-green-600">{acc.balance.toLocaleString()} {acc.currency}</td>
                                <td className="p-3">{acc.currency}</td>
                                <td className="p-3">
                                  <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" title="عرض"><Eye className="w-4 h-4 text-blue-600" /></Button>
                                    <Button variant="ghost" size="icon" title="كشف حساب"><Receipt className="w-4 h-4 text-purple-600" /></Button>
                                    <Button variant="ghost" size="icon" title="تحويل"><Send className="w-4 h-4 text-green-600" /></Button>
                                    <Button variant="ghost" size="icon" title="تعديل"><Edit2 className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="icon" title="حذف"><Trash2 className="w-4 h-4 text-red-600" /></Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="checks">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>الشيكات</CardTitle>
                      <Button className="bg-gradient-to-r from-[#005f73] to-[#0a9396]"><Plus className="ml-2 h-4 w-4" />شيك جديد</Button>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-gray-50">
                              <th className="text-right p-3 font-medium">#</th>
                              <th className="text-right p-3 font-medium">رقم الشيك</th>
                              <th className="text-right p-3 font-medium">البنك</th>
                              <th className="text-right p-3 font-medium">المبلغ</th>
                              <th className="text-right p-3 font-medium">تاريخ الاستحقاق</th>
                              <th className="text-right p-3 font-medium">المستفيد</th>
                              <th className="text-right p-3 font-medium">الحالة</th>
                              <th className="text-right p-3 font-medium">الإجراءات</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockChecks.map((check, idx) => (
                              <tr key={check.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{idx + 1}</td>
                                <td className="p-3 font-medium font-mono">{check.checkNumber}</td>
                                <td className="p-3">{check.bankName}</td>
                                <td className="p-3 font-bold">{check.amount.toLocaleString()} ج.م</td>
                                <td className="p-3">{check.dueDate}</td>
                                <td className="p-3">{check.beneficiary}</td>
                                <td className="p-3">
                                  <Badge className={check.status === 'deposited' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                    {check.status === 'pending' ? 'معلق' : 'مودع'}
                                  </Badge>
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" title="عرض"><Eye className="w-4 h-4 text-blue-600" /></Button>
                                    {check.status === 'pending' && (
                                      <>
                                        <Button variant="ghost" size="icon" title="إيداع"><CheckSquare className="w-4 h-4 text-green-600" /></Button>
                                        <Button variant="ghost" size="icon" title="إلغاء"><XCircle className="w-4 h-4 text-red-600" /></Button>
                                      </>
                                    )}
                                    <Button variant="ghost" size="icon" title="طباعة"><Printer className="w-4 h-4 text-gray-600" /></Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reconciliation">
                  <Card>
                    <CardHeader><CardTitle>تسوية حسابات بنكية</CardHeader></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>اختر الحساب البنكي</Label>
                          <Select><SelectTrigger className="mt-1"><SelectValue placeholder="اختر الحساب" /></SelectTrigger><SelectContent>{mockBankAccounts.map(acc => <SelectItem key={acc.id} value={acc.id}>{acc.bankName} - {acc.accountNumber}</SelectItem>)}</SelectContent></Select>
                        </div>
                        <div>
                          <Label>تاريخ التسوية</Label>
                          <Input type="date" className="mt-1" defaultValue={new Date().toISOString().split('T')[0]} />
                        </div>
                      </div>
                      <Button className="bg-gradient-to-r from-[#005f73] to-[#0a9396]"><RefreshCw className="ml-2 h-4 w-4" />بدء التسوية</Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* ============ HR/PAYROLL MODULE ============ */}
          {activeModule === 'hr' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><Users className="w-6 h-6 text-blue-600" /></div><div><p className="text-sm text-gray-500">إجمالي الموظفين</p><p className="text-xl font-bold text-blue-600">{mockEmployees.length}</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"><UserCheck className="w-6 h-6 text-green-600" /></div><div><p className="text-sm text-gray-500">نشطون</p><p className="text-xl font-bold text-green-600">{mockEmployees.filter(e => e.status === 'active').length}</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center"><HandCoins className="w-6 h-6 text-yellow-600" /></div><div><p className="text-sm text-gray-500">إجمالي الرواتب</p><p className="text-xl font-bold text-yellow-600">{mockEmployees.reduce((sum, e) => sum + e.salary, 0).toLocaleString()} ج.م</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center"><Plane className="w-6 h-6 text-purple-600" /></div><div><p className="text-sm text-gray-500">إجازات معتمدة</p><p className="text-xl font-bold text-purple-600">3</p></div></div></CardContent></Card>
              </div>

              <Tabs defaultValue="employees">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="employees">الموظفين</TabsTrigger>
                  <TabsTrigger value="salaries">الرواتب</TabsTrigger>
                  <TabsTrigger value="attendance">الحضور</TabsTrigger>
                  <TabsTrigger value="loans">السلف والقروض</TabsTrigger>
                  <TabsTrigger value="vacations">الإجازات</TabsTrigger>
                </TabsList>

                <TabsContent value="employees">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>الموظفين</CardTitle>
                      <Button className="bg-gradient-to-r from-[#005f73] to-[#0a9396]"><Plus className="ml-2 h-4 w-4" />موظف جديد</Button>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-gray-50">
                              <th className="text-right p-3 font-medium">#</th>
                              <th className="text-right p-3 font-medium">الاسم</th>
                              <th className="text-right p-3 font-medium">المنصب</th>
                              <th className="text-right p-3 font-medium">القسم</th>
                              <th className="text-right p-3 font-medium">الراتب</th>
                              <th className="text-right p-3 font-medium">تاريخ التعيين</th>
                              <th className="text-right p-3 font-medium">الحالة</th>
                              <th className="text-right p-3 font-medium">الإجراءات</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockEmployees.map((emp, idx) => (
                              <tr key={emp.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{idx + 1}</td>
                                <td className="p-3 font-medium">{emp.name}</td>
                                <td className="p-3">{emp.position}</td>
                                <td className="p-3">{emp.department}</td>
                                <td className="p-3 font-bold">{emp.salary.toLocaleString()} ج.م</td>
                                <td className="p-3">{emp.joinDate}</td>
                                <td className="p-3">
                                  <Badge className={emp.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                    {emp.status === 'active' ? 'نشط' : 'غير نشط'}
                                  </Badge>
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" title="عرض"><Eye className="w-4 h-4 text-blue-600" /></Button>
                                    <Button variant="ghost" size="icon" title="تعديل"><Edit2 className="w-4 h-4 text-purple-600" /></Button>
                                    <Button variant="ghost" size="icon" title="ملف الموظف"><UserCircle className="w-4 h-4 text-gray-600" /></Button>
                                    <Button variant="ghost" size="icon" title="حذف"><Trash2 className="w-4 h-4 text-red-600" /></Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="salaries">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>إدارة الرواتب</CardTitle>
                      <Button className="bg-gradient-to-r from-[#005f73] to-[#0a9396]"><Calculator className="ml-2 h-4 w-4" />حساب رواتب الشهر</Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div><Label>الشهر</Label><Select><SelectTrigger className="mt-1"><SelectValue placeholder="اختر الشهر" /></SelectTrigger><SelectContent><SelectItem value="1">يناير</SelectItem><SelectItem value="2">فبراير</SelectItem><SelectItem value="3">مارس</SelectItem></SelectContent></Select></div>
                        <div><Label>السنة</Label><Select><SelectTrigger className="mt-1"><SelectValue placeholder="اختر السنة" /></SelectTrigger><SelectContent><SelectItem value="2024">2024</SelectItem><SelectItem value="2025">2025</SelectItem></SelectContent></Select></div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-gray-50">
                              <th className="text-right p-3 font-medium">الموظف</th>
                              <th className="text-right p-3 font-medium">الراتب الأساسي</th>
                              <th className="text-right p-3 font-medium">الساعات الإضافية</th>
                              <th className="text-right p-3 font-medium">الخصومات</th>
                              <th className="text-right p-3 font-medium">صافي الراتب</th>
                              <th className="text-right p-3 font-medium">الحالة</th>
                              <th className="text-right p-3 font-medium">الإجراءات</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockEmployees.map(emp => (
                              <tr key={emp.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium">{emp.name}</td>
                                <td className="p-3">{emp.salary.toLocaleString()}</td>
                                <td className="p-3 text-green-600">+500</td>
                                <td className="p-3 text-red-600">-200</td>
                                <td className="p-3 font-bold">{(emp.salary + 500 - 200).toLocaleString()}</td>
                                <td className="p-3"><Badge className="bg-yellow-100 text-yellow-800">غير مدفوع</Badge></td>
                                <td className="p-3">
                                  <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="sm" title="تفاصيل"><Eye className="w-3 h-3" /></Button>
                                    <Button variant="ghost" size="sm" title="صرف"><HandCoins className="w-3 h-3 text-green-600" /></Button>
                                    <Button variant="ghost" size="sm" title="طباعة"><Printer className="w-3 h-3" /></Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="attendance">
                  <Card>
                    <CardHeader><CardTitle>سجل الحضور والانصراف</CardHeader></CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-gray-500">
                        <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>سجل الحضور والانصراف</p>
                        <p className="text-sm">يمكن تسجيل الحضور يدوياً أو عبر جهاز البصمة</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="loans">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>السلف والقروض</CardTitle>
                      <Button className="bg-gradient-to-r from-[#005f73] to-[#0a9396]"><Plus className="ml-2 h-4 w-4" />سلفة جديدة</Button>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-gray-500">
                        <HandCoins className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>إدارة السلف والقروض للموظفين</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="vacations">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>طلبات الإجازات</CardTitle>
                      <Button className="bg-gradient-to-r from-[#005f73] to-[#0a9396]"><Plus className="ml-2 h-4 w-4" />طلب إجازة</Button>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-gray-500">
                        <Plane className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>إدارة طلبات الإجازات</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* ============ EXPENSES MODULE ============ */}
          {activeModule === 'expenses' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"><Receipt className="w-6 h-6 text-red-600" /></div><div><p className="text-sm text-gray-500">إجمالي المصروفات</p><p className="text-xl font-bold text-red-600">26,000 ج.م</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center"><Repeat className="w-6 h-6 text-orange-600" /></div><div><p className="text-sm text-gray-500">مصروفات ثابتة</p><p className="text-xl font-bold text-orange-600">24,000 ج.م</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><Activity className="w-6 h-6 text-blue-600" /></div><div><p className="text-sm text-gray-500">مصروفات متغيرة</p><p className="text-xl font-bold text-blue-600">2,000 ج.م</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center"><Clock className="w-6 h-6 text-yellow-600" /></div><div><p className="text-sm text-gray-500">معلقة</p><p className="text-xl font-bold text-yellow-600">{mockExpenses.filter(e => e.status === 'pending').length}</p></div></div></CardContent></Card>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>المصروفات والإيرادات</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button className="bg-red-500 hover:bg-red-600"><Plus className="ml-2 h-4 w-4" />مصروف جديد</Button>
                    <Button className="bg-green-500 hover:bg-green-600"><Plus className="ml-2 h-4 w-4" />إيراد جديد</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-right p-3 font-medium">#</th>
                          <th className="text-right p-3 font-medium">التاريخ</th>
                          <th className="text-right p-3 font-medium">الفئة</th>
                          <th className="text-right p-3 font-medium">الوصف</th>
                          <th className="text-right p-3 font-medium">المبلغ</th>
                          <th className="text-right p-3 font-medium">النوع</th>
                          <th className="text-right p-3 font-medium">الحالة</th>
                          <th className="text-right p-3 font-medium">متكرر</th>
                          <th className="text-right p-3 font-medium">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockExpenses.map((exp, idx) => (
                          <tr key={exp.id} className="border-b hover:bg-gray-50">
                            <td className="p-3">{idx + 1}</td>
                            <td className="p-3">{exp.date}</td>
                            <td className="p-3">{exp.category}</td>
                            <td className="p-3">{exp.description}</td>
                            <td className="p-3 font-bold text-red-600">{exp.amount.toLocaleString()} ج.م</td>
                            <td className="p-3">
                              <Badge className="bg-red-100 text-red-800">مصروف</Badge>
                            </td>
                            <td className="p-3">
                              <Badge className={exp.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                {exp.status === 'paid' ? 'مدفوع' : 'معلق'}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <Badge className={exp.type === 'fixed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                                {exp.type === 'fixed' ? 'ثابت' : 'متغير'}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" title="عرض"><Eye className="w-4 h-4 text-blue-600" /></Button>
                                <Button variant="ghost" size="icon" title="تعديل"><Edit2 className="w-4 h-4 text-purple-600" /></Button>
                                {exp.status === 'pending' && (
                                  <Button variant="ghost" size="icon" title="دفع"><CheckSquare className="w-4 h-4 text-green-600" /></Button>
                                )}
                                <Button variant="ghost" size="icon" title="حذف"><Trash2 className="w-4 h-4 text-red-600" /></Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ============ JOURNAL ENTRIES MODULE ============ */}
          {activeModule === 'journal-entries' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card className="border-r-4 border-r-indigo-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">إجمالى القيود</p>
                        <p className="text-xl font-bold text-indigo-600">{journalEntries.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-r-4 border-r-green-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">إجمالى المدين</p>
                        <p className="text-xl font-bold text-green-600">{journalEntries.reduce((sum, e) => sum + e.totalDebit, 0).toLocaleString()} ج.م</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-r-4 border-r-red-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <TrendingDown className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">إجمالى الدائن</p>
                        <p className="text-xl font-bold text-red-600">{journalEntries.reduce((sum, e) => sum + e.totalCredit, 0).toLocaleString()} ج.م</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-r-4 border-r-blue-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">قيود مرحلة</p>
                        <p className="text-xl font-bold text-blue-600">{journalEntries.filter(e => e.status === 'posted').length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-r-4 border-r-yellow-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <FileText className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">قيود مسودة</p>
                        <p className="text-xl font-bold text-yellow-600">{journalEntries.filter(e => e.status === 'draft').length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Journal Entries Table */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                    القيود المحاسبية
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="بحث بالبيان أو الحساب..."
                        value={journalSearchTerm}
                        onChange={(e) => setJournalSearchTerm(e.target.value)}
                        className="pr-10 w-64"
                      />
                    </div>
                    <Input
                      type="date"
                      value={journalDateFilter}
                      onChange={(e) => setJournalDateFilter(e.target.value)}
                      className="w-40"
                    />
                    <Button 
                      onClick={() => openNewJournalDialog()}
                      className="bg-indigo-500 hover:bg-indigo-600"
                    >
                      <Plus className="ml-2 h-4 w-4" />قيد جديد
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 bg-gradient-to-l from-indigo-50 to-purple-50">
                          <th className="text-right p-3 font-bold text-indigo-700">#</th>
                          <th className="text-right p-3 font-bold text-indigo-700">التاريخ</th>
                          <th className="text-right p-3 font-bold text-indigo-700">البيان</th>
                          <th className="text-right p-3 font-bold text-indigo-700">الحسابات</th>
                          <th className="text-right p-3 font-bold text-indigo-700">المدين</th>
                          <th className="text-right p-3 font-bold text-indigo-700">الدائن</th>
                          <th className="text-right p-3 font-bold text-indigo-700">الحالة</th>
                          <th className="text-right p-3 font-bold text-indigo-700">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {journalEntries
                          .filter(entry => {
                            if (journalSearchTerm && !entry.description?.includes(journalSearchTerm) && 
                                !entry.lines.some(l => l.accountName.includes(journalSearchTerm))) {
                              return false
                            }
                            if (journalDateFilter && entry.date !== journalDateFilter) {
                              return false
                            }
                            return true
                          })
                          .sort((a, b) => b.entryNumber - a.entryNumber)
                          .map((entry) => (
                          <tr key={entry.id} className="border-b hover:bg-indigo-50/30 transition-colors">
                            <td className="p-3 font-bold text-indigo-600">#{entry.entryNumber}</td>
                            <td className="p-3">{entry.date}</td>
                            <td className="p-3 max-w-xs truncate" title={entry.description}>
                              {entry.description || '-'}
                            </td>
                            <td className="p-3">
                              <div className="flex flex-col gap-1">
                                {entry.lines.slice(0, 2).map((line, idx) => (
                                  <span key={idx} className={`text-xs px-2 py-1 rounded ${line.debit > 0 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                                    {line.accountName}
                                  </span>
                                ))}
                                {entry.lines.length > 2 && (
                                  <span className="text-xs text-gray-500">+{entry.lines.length - 2} حساب آخر</span>
                                )}
                              </div>
                            </td>
                            <td className="p-3 font-bold text-red-600">{entry.totalDebit.toLocaleString()}</td>
                            <td className="p-3 font-bold text-green-600">{entry.totalCredit.toLocaleString()}</td>
                            <td className="p-3">
                              <Badge className={
                                entry.status === 'posted' ? 'bg-blue-100 text-blue-800' :
                                entry.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }>
                                {entry.status === 'posted' ? 'مرحل' : entry.status === 'draft' ? 'مسودة' : 'ملغى'}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1 flex-wrap">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  title="عرض القيد"
                                  onClick={() => setViewingJournalEntry(entry)}
                                >
                                  <Eye className="w-4 h-4 text-blue-600" />
                                </Button>
                                
                                {/* زر التعديل - للقيود المسودة فقط */}
                                {entry.status === 'draft' && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    title="تعديل القيد"
                                    onClick={() => openEditJournal(entry)}
                                  >
                                    <Edit2 className="w-4 h-4 text-amber-600" />
                                  </Button>
                                )}
                                
                                {/* زر الحذف - للقيود المسودة فقط */}
                                {entry.status === 'draft' && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    title="حذف القيد"
                                    onClick={() => deleteJournalEntry(entry.id)}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </Button>
                                )}
                                
                                {/* زر الترحيل - للمسودة */}
                                {entry.status === 'draft' && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    title="ترحيل القيد"
                                    onClick={() => postJournalEntry(entry.id)}
                                  >
                                    <Send className="w-4 h-4 text-green-600" />
                                  </Button>
                                )}
                                
                                {/* زر إلغاء الترحيل - للمرحلة */}
                                {entry.status === 'posted' && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    title="إلغاء الترحيل"
                                    onClick={() => unpostJournalEntry(entry.id)}
                                  >
                                    <Undo2 className="w-4 h-4 text-orange-600" />
                                  </Button>
                                )}
                                
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  title="طباعة القيد"
                                  onClick={() => printJournalEntry(entry)}
                                >
                                  <Printer className="w-4 h-4 text-purple-600" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {journalEntries.filter(entry => {
                          if (journalSearchTerm && !entry.description?.includes(journalSearchTerm) && 
                              !entry.lines.some(l => l.accountName.includes(journalSearchTerm))) {
                            return false
                          }
                          if (journalDateFilter && entry.date !== journalDateFilter) {
                            return false
                          }
                          return true
                        }).length === 0 && (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-gray-500">
                              <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                              <p>لا توجد قيود محاسبية</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Journal Entry View Dialog */}
          <Dialog open={!!viewingJournalEntry} onOpenChange={() => setViewingJournalEntry(null)}>
            <DialogContent className="max-w-[90vw] w-[90vw] h-[85vh] max-h-[85vh] overflow-y-auto p-8" dir="rtl">
              <DialogHeader className="pb-6 border-b-2 border-indigo-200">
                <DialogTitle className="text-3xl font-bold text-indigo-700 flex items-center gap-3">
                  <BookOpen className="w-8 h-8" />
                  تفاصيل القيد المحاسبي #{viewingJournalEntry?.entryNumber}
                </DialogTitle>
                <DialogDescription className="text-lg mt-2 text-gray-600">
                  التاريخ: {viewingJournalEntry?.date} | الحالة: 
                  <Badge className="mr-2 bg-blue-100 text-blue-800">
                    {viewingJournalEntry?.status === 'posted' ? 'مرحل' : viewingJournalEntry?.status === 'draft' ? 'مسودة' : 'ملغى'}
                  </Badge>
                </DialogDescription>
              </DialogHeader>
              
              {viewingJournalEntry && (
                <div className="mt-6 space-y-6">
                  {/* Description Card */}
                  <Card className="bg-gradient-to-l from-indigo-50 to-purple-50 border-2 border-indigo-200">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <FileText className="w-6 h-6 text-indigo-600 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-700 mb-1">البيان:</p>
                          <p className="text-xl text-gray-900">{viewingJournalEntry.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Entry Lines Table */}
                  <Card>
                    <CardHeader className="bg-gradient-to-l from-gray-50 to-gray-100">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <ClipboardList className="w-5 h-5" />
                        تفاصيل القيد
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 bg-gray-100">
                            <th className="text-right p-4 font-bold">كود الحساب</th>
                            <th className="text-right p-4 font-bold">اسم الحساب</th>
                            <th className="text-right p-4 font-bold text-red-600">مدين</th>
                            <th className="text-right p-4 font-bold text-green-600">دائن</th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewingJournalEntry.lines.map((line, idx) => (
                            <tr key={idx} className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                              <td className="p-4 font-mono font-bold text-indigo-600">{line.accountCode}</td>
                              <td className="p-4 font-semibold">{line.accountName}</td>
                              <td className="p-4">
                                {line.debit > 0 ? (
                                  <span className="font-bold text-red-600 text-lg">{line.debit.toLocaleString()} ج.م</span>
                                ) : <span className="text-gray-300">-</span>}
                              </td>
                              <td className="p-4">
                                {line.credit > 0 ? (
                                  <span className="font-bold text-green-600 text-lg">{line.credit.toLocaleString()} ج.م</span>
                                ) : <span className="text-gray-300">-</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t-2 bg-gradient-to-l from-gray-100 to-gray-200">
                            <td colSpan={2} className="p-4 font-bold text-lg text-left">الإجمالي:</td>
                            <td className="p-4 font-bold text-xl text-red-600">
                              {viewingJournalEntry.totalDebit.toLocaleString()} ج.م
                            </td>
                            <td className="p-4 font-bold text-xl text-green-600">
                              {viewingJournalEntry.totalCredit.toLocaleString()} ج.م
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </CardContent>
                  </Card>

                  {/* Balance Verification */}
                  <div className={`p-4 rounded-xl border-2 ${
                    viewingJournalEntry.totalDebit === viewingJournalEntry.totalCredit 
                      ? 'bg-green-50 border-green-300' 
                      : 'bg-red-50 border-red-300'
                  }`}>
                    <div className="flex items-center justify-center gap-3">
                      {viewingJournalEntry.totalDebit === viewingJournalEntry.totalCredit ? (
                        <>
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          <span className="font-bold text-green-700 text-lg">القيد متوازن ✓</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-6 h-6 text-red-600" />
                          <span className="font-bold text-red-700 text-lg">القيد غير متوازن - الفرق: {Math.abs(viewingJournalEntry.totalDebit - viewingJournalEntry.totalCredit).toLocaleString()} ج.م</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4 flex-wrap">
                    {viewingJournalEntry?.status === 'draft' && (
                      <>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            openEditJournal(viewingJournalEntry!)
                            setViewingJournalEntry(null)
                          }}
                          className="px-6 py-3 text-lg border-amber-500 text-amber-600 hover:bg-amber-50"
                        >
                          <Edit2 className="ml-2 h-5 w-5" />
                          تعديل
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => deleteJournalEntry(viewingJournalEntry!.id)}
                          className="px-6 py-3 text-lg border-red-500 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="ml-2 h-5 w-5" />
                          حذف
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => postJournalEntry(viewingJournalEntry!.id)}
                          className="px-6 py-3 text-lg border-green-500 text-green-600 hover:bg-green-50"
                        >
                          <Send className="ml-2 h-5 w-5" />
                          ترحيل
                        </Button>
                      </>
                    )}
                    {viewingJournalEntry?.status === 'posted' && (
                      <Button 
                        variant="outline" 
                        onClick={() => unpostJournalEntry(viewingJournalEntry!.id)}
                        className="px-6 py-3 text-lg border-orange-500 text-orange-600 hover:bg-orange-50"
                      >
                        <Undo2 className="ml-2 h-5 w-5" />
                        إلغاء الترحيل
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      onClick={() => setViewingJournalEntry(null)}
                      className="px-8 py-3 text-lg"
                    >
                      إغلاق
                    </Button>
                    <Button 
                      className="bg-indigo-500 hover:bg-indigo-600 px-8 py-3 text-lg"
                      onClick={() => viewingJournalEntry && printJournalEntry(viewingJournalEntry)}
                    >
                      <Printer className="ml-2 h-5 w-5" />
                      طباعة القيد
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* ============ JOURNAL ENTRY FORM DIALOG (ADD/EDIT) ============ */}
          <Dialog open={showJournalFormDialog} onOpenChange={(open) => {
            setShowJournalFormDialog(open)
            if (!open) {
              setEditingJournalEntry(null)
              setJournalForm({
                date: new Date().toISOString().split('T')[0],
                description: '',
                lines: [{ accountCode: '', accountName: '', debit: 0, credit: 0 }]
              })
            }
          }}>
            <DialogContent className="max-w-[90vw] w-[90vw] h-[85vh] max-h-[85vh] overflow-y-auto p-0" dir="rtl">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-l from-indigo-600 to-purple-600 text-white p-6 z-10">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                    {editingJournalEntry ? (
                      <>
                        <Edit2 className="w-7 h-7" />
                        تعديل القيد رقم {editingJournalEntry.entryNumber}
                      </>
                    ) : (
                      <>
                        <Plus className="w-7 h-7" />
                        قيد محاسبي جديد
                      </>
                    )}
                  </DialogTitle>
                  <DialogDescription className="text-indigo-100 mt-2">
                    {editingJournalEntry ? 'يمكنك تعديل بيانات القيد المسودة فقط' : 'أدخل بيانات القيد المحاسبي الجديد'}
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="p-6 space-y-6">
                {/* معلومات أساسية */}
                <Card className="border-2 border-indigo-200">
                  <CardHeader className="bg-indigo-50 pb-4">
                    <CardTitle className="text-lg text-indigo-700 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      المعلومات الأساسية
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">التاريخ *</Label>
                        <Input
                          type="date"
                          value={journalForm.date}
                          onChange={(e) => setJournalForm(prev => ({ ...prev, date: e.target.value }))}
                          className="text-lg p-3"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">رقم القيد</Label>
                        <Input
                          value={editingJournalEntry ? `#${editingJournalEntry.entryNumber}` : `#${Math.max(...journalEntries.map(e => e.entryNumber), 0) + 1}`}
                          disabled
                          className="text-lg p-3 bg-gray-100"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label className="text-sm font-semibold text-gray-700 mb-2 block">البيان (وصف القيد) *</Label>
                      <Textarea
                        value={journalForm.description}
                        onChange={(e) => setJournalForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="اكتب وصفاً للقيد المحاسبي..."
                        className="min-h-[80px] text-lg p-3"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* بنود القيد */}
                <Card className="border-2 border-purple-200">
                  <CardHeader className="bg-purple-50 pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-purple-700 flex items-center gap-2">
                        <ClipboardList className="w-5 h-5" />
                        بنود القيد
                      </CardTitle>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addNewJournalLine}
                        className="border-green-500 text-green-600 hover:bg-green-50"
                      >
                        <Plus className="ml-1 h-4 w-4" />
                        إضافة بند
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 bg-gradient-to-l from-purple-100 to-indigo-100">
                            <th className="text-right p-3 font-bold text-purple-700 w-32">كود الحساب</th>
                            <th className="text-right p-3 font-bold text-purple-700">اسم الحساب</th>
                            <th className="text-right p-3 font-bold text-red-600 w-40">المدين</th>
                            <th className="text-right p-3 font-bold text-green-600 w-40">الدائن</th>
                            <th className="text-right p-3 font-bold w-20">إجراء</th>
                          </tr>
                        </thead>
                        <tbody>
                          {journalForm.lines.map((line, index) => (
                            <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                              <td className="p-2">
                                <Select
                                  value={line.accountCode}
                                  onValueChange={(value) => updateJournalLine(index, 'accountCode', value)}
                                >
                                  <SelectTrigger className="w-full font-mono text-sm">
                                    <SelectValue placeholder="اختر الحساب" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {mockAccounts.filter(acc => acc.level >= 2).map((account) => (
                                      <SelectItem key={account.id} value={account.code}>
                                        {account.code} - {account.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="p-2">
                                <Input
                                  value={line.accountName}
                                  readOnly
                                  className="bg-gray-100 text-sm"
                                  placeholder="يتم ملؤه تلقائياً"
                                />
                              </td>
                              <td className="p-2">
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={line.debit || ''}
                                  onChange={(e) => updateJournalLine(index, 'debit', parseFloat(e.target.value) || 0)}
                                  className="text-left font-bold text-red-600"
                                  placeholder="0.00"
                                />
                              </td>
                              <td className="p-2">
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={line.credit || ''}
                                  onChange={(e) => updateJournalLine(index, 'credit', parseFloat(e.target.value) || 0)}
                                  className="text-left font-bold text-green-600"
                                  placeholder="0.00"
                                />
                              </td>
                              <td className="p-2 text-center">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeJournalLine(index)}
                                  disabled={journalForm.lines.length <= 1}
                                  title="حذف البند"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <XCircle className="w-5 h-5" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* ملخص التوازن */}
                    <div className="mt-6 p-4 rounded-xl border-2 bg-gradient-to-l from-gray-50 to-gray-100">
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <div className="text-center">
                          <p className="text-sm text-gray-500 mb-1">إجمالي المدين</p>
                          <p className="text-2xl font-bold text-red-600">
                            {journalForm.lines.reduce((sum, line) => sum + (line.debit || 0), 0).toLocaleString()}
                            <span className="text-sm mr-1">ج.م</span>
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500 mb-1">إجمالي الدائن</p>
                          <p className="text-2xl font-bold text-green-600">
                            {journalForm.lines.reduce((sum, line) => sum + (line.credit || 0), 0).toLocaleString()}
                            <span className="text-sm mr-1">ج.م</span>
                          </p>
                        </div>
                        <div className={`text-center p-3 rounded-lg ${
                          journalForm.lines.reduce((sum, line) => sum + (line.debit || 0), 0) === 
                          journalForm.lines.reduce((sum, line) => sum + (line.credit || 0), 0)
                            ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <p className="text-sm text-gray-600 mb-1">الفرق</p>
                          <p className={`text-xl font-bold ${
                            Math.abs(journalForm.lines.reduce((sum, line) => sum + (line.debit || 0), 0) - 
                            journalForm.lines.reduce((sum, line) => sum + (line.credit || 0), 0)) === 0
                              ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {Math.abs(
                              journalForm.lines.reduce((sum, line) => sum + (line.debit || 0), 0) - 
                              journalForm.lines.reduce((sum, line) => sum + (line.credit || 0), 0)
                            ).toLocaleString()} ج.م
                          </p>
                          <p className={`text-xs mt-1 ${
                            journalForm.lines.reduce((sum, line) => sum + (line.debit || 0), 0) === 
                            journalForm.lines.reduce((sum, line) => sum + (line.credit || 0), 0)
                              ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {journalForm.lines.reduce((sum, line) => sum + (line.debit || 0), 0) === 
                            journalForm.lines.reduce((sum, line) => sum + (line.credit || 0), 0)
                              ? '✓ متوازن' : '✗ غير متوازن'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* أزرار الحفظ والإلغاء */}
                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => setShowJournalFormDialog(false)}
                    className="px-8 py-3 text-lg"
                  >
                    <XCircle className="ml-2 h-5 w-5" />
                    إلغاء
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    onClick={saveJournalEntry}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-3 text-lg"
                  >
                    <Save className="ml-2 h-5 w-5" />
                    {editingJournalEntry ? 'تحديث القيد' : 'حفظ القيد'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* ============ REPORTS MODULE ============ */}
                    {activeModule === 'reports' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#005f73]">التقارير المالية</h2>
              </div>
              
              {/* Report Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* قائمة الدخل */}
                <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-green-400">
                  <CardContent className="pt-6 pb-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BarChart3 className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">قائمة الدخل</h3>
                      <p className="text-sm text-gray-500 mb-4">الإيرادات والمصروفات وصافي الربح</p>
                      <Button 
                        className="w-full bg-green-500 hover:bg-green-600"
                        onClick={() => setShowIncomeStatement(true)}
                      >
                        <Eye className="ml-2 h-4 w-4" />
                        عرض التقرير
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* الميزانية العمومية */}
                <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-400">
                  <CardContent className="pt-6 pb-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <PieChart className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">الميزانية العمومية</h3>
                      <p className="text-sm text-gray-500 mb-4">الأصول والالتزامات وحقوق الملكية</p>
                      <Button 
                        className="w-full bg-blue-500 hover:bg-blue-600"
                        onClick={() => setShowBalanceSheet(true)}
                      >
                        <Eye className="ml-2 h-4 w-4" />
                        عرض التقرير
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* ميزان المراجعة */}
                <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-orange-400">
                  <CardContent className="pt-6 pb-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileBarChart className="w-8 h-8 text-orange-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">ميزان المراجعة</h3>
                      <p className="text-sm text-gray-500 mb-4">أرصدة جميع الحسابات</p>
                      <Button 
                        className="w-full bg-orange-500 hover:bg-orange-600"
                        onClick={() => setShowTrialBalance(true)}
                      >
                        <Eye className="ml-2 h-4 w-4" />
                        عرض التقرير
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Income Statement Dialog */}
              <Dialog open={showIncomeStatement} onOpenChange={setShowIncomeStatement}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-green-700 flex items-center gap-2">
                      <BarChart3 className="w-6 h-6" />
                      قائمة الدخل
                    </DialogTitle>
                    <DialogDescription>التاريخ: {new Date().toLocaleDateString('ar-SA')}</DialogDescription>
                  </DialogHeader>
                  <IncomeStatementReport entries={journalEntries} />
                </DialogContent>
              </Dialog>

              {/* Balance Sheet Dialog */}
              <Dialog open={showBalanceSheet} onOpenChange={setShowBalanceSheet}>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto" dir="rtl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                      <PieChart className="w-6 h-6" />
                      الميزانية العمومية
                    </DialogTitle>
                    <DialogDescription>التاريخ: {new Date().toLocaleDateString('ar-SA')}</DialogDescription>
                  </DialogHeader>
                  <BalanceSheetReport entries={journalEntries} />
                </DialogContent>
              </Dialog>

              {/* Trial Balance Dialog */}
              <Dialog open={showTrialBalance} onOpenChange={setShowTrialBalance}>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" dir="rtl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-orange-700 flex items-center gap-2">
                      <FileBarChart className="w-6 h-6" />
                      ميزان المراجعة
                    </DialogTitle>
                    <DialogDescription>التاريخ: {new Date().toLocaleDateString('ar-SA')}</DialogDescription>
                  </DialogHeader>
                  <TrialBalanceReport entries={journalEntries} />
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* ============ SETTINGS MODULE ============ */}
          {activeModule === 'settings' && (
            <div className="space-y-6">
              <Tabs defaultValue="general">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="general">عام</TabsTrigger>
                  <TabsTrigger value="company">الشركة</TabsTrigger>
                  <TabsTrigger value="invoice">الفواتير</TabsTrigger>
                  <TabsTrigger value="users">المستخدمون</TabsTrigger>
                  <TabsTrigger value="backup">النسخ الاحتياطي</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                  <Card>
                    <CardHeader><CardTitle>الإعدادات العامة</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div><Label>اللغة</Label><Select value={companySettings.language} onValueChange={(v) => setCompanySettings(prev => ({...prev, language: v}))}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ar">العربية</SelectItem><SelectItem value="en">English</SelectItem></SelectContent></Select></div>
                        <div><Label>العملة</Label><Select value={companySettings.currency} onValueChange={(v) => setCompanySettings(prev => ({...prev, currency: v}))}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="egp">جنيه مصري (ج.م)</SelectItem><SelectItem value="sar">ريال سعودي</SelectItem><SelectItem value="aed">درهم إماراتي</SelectItem><SelectItem value="usd">دولار أمريكي</SelectItem></SelectContent></Select></div>
                        <div><Label>السنة المالية</Label><Input type="number" className="mt-1" value={companySettings.fiscalYear} onChange={(e) => setCompanySettings(prev => ({...prev, fiscalYear: e.target.value}))} /></div>
                        <div><Label>بداية السنة</Label><Input type="month" className="mt-1" value={companySettings.fiscalYearStart} onChange={(e) => setCompanySettings(prev => ({...prev, fiscalYearStart: e.target.value}))} /></div>
                      </div>
                      <Button 
                        className="bg-gradient-to-r from-[#005f73] to-[#0a9396]"
                        onClick={() => {
                          localStorage.setItem('companySettings', JSON.stringify(companySettings))
                          syncDataToServer({ companySettings })
                          setSettingsSaved(true)
                          setTimeout(() => setSettingsSaved(false), 3000)
                          addLogEntry('حفظ الإعدادات', 'تم حفظ الإعدادات العامة')
                        }}
                      >
                        <Save className="ml-2 h-4 w-4" />حفظ الإعدادات
                      </Button>
                      {settingsSaved && <Badge className="bg-green-500 text-white mr-3">✓ تم الحفظ بنجاح</Badge>}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="company">
                  <Card>
                    <CardHeader><CardTitle>بيانات الشركة</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div><Label>اسم الشركة</Label><Input className="mt-1" value={companySettings.nameAr} onChange={(e) => setCompanySettings(prev => ({...prev, nameAr: e.target.value}))} /></div>
                        <div><Label>الاسم بالإنجليزية</Label><Input className="mt-1" value={companySettings.nameEn} dir="ltr" onChange={(e) => setCompanySettings(prev => ({...prev, nameEn: e.target.value}))} /></div>
                        <div><Label>السجل التجاري</Label><Input className="mt-1" value={companySettings.commercialRegister} onChange={(e) => setCompanySettings(prev => ({...prev, commercialRegister: e.target.value}))} /></div>
                        <div><Label>الضريبة</Label><Input className="mt-1" value={companySettings.taxNumber} onChange={(e) => setCompanySettings(prev => ({...prev, taxNumber: e.target.value}))} /></div>
                        <div className="col-span-2"><Label>العنوان</Label><Textarea className="mt-1" value={companySettings.address} onChange={(e) => setCompanySettings(prev => ({...prev, address: e.target.value}))} /></div>
                        <div><Label>الهاتف</Label><Input className="mt-1" value={companySettings.phone} onChange={(e) => setCompanySettings(prev => ({...prev, phone: e.target.value}))} /></div>
                        <div><Label>البريد الإلكتروني</Label><Input className="mt-1" value={companySettings.email} dir="ltr" onChange={(e) => setCompanySettings(prev => ({...prev, email: e.target.value}))} /></div>
                      </div>
                      <Button 
                        className="bg-gradient-to-r from-[#005f73] to-[#0a9396]"
                        onClick={() => {
                          localStorage.setItem('companySettings', JSON.stringify(companySettings))
                          syncDataToServer({ companySettings })
                          setSettingsSaved(true)
                          setTimeout(() => setSettingsSaved(false), 3000)
                          addLogEntry('حفظ بيانات الشركة', `تم تحديث بيانات: ${companySettings.nameAr}`)
                        }}
                      >
                        <Save className="ml-2 h-4 w-4" />حفظ البيانات
                      </Button>
                      {settingsSaved && <Badge className="bg-green-500 text-white mr-3">✓ تم الحفظ بنجاح</Badge>}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="invoice">
                  <Card>
                    <CardHeader><CardTitle>إعدادات الفواتير</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div><Label>بداية ترقيم الفواتير</Label><Input className="mt-1" defaultValue="1" /></div>
                        <div><Label>بادئة الفواتير</Label><Input className="mt-1" defaultValue="INV-" /></div>
                        <div><Label>شروط الدفع (بالأيام)</Label><Input type="number" className="mt-1" defaultValue="30" /></div>
                        <div><Label>الضريبة المضافة %</Label><Input type="number" className="mt-1" defaultValue="15" /></div>
                      </div>
                      <div><Label>ملاحظات الفاتورة الافتراضية</Label><Textarea className="mt-1" defaultValue="شكراً لتعاملكم معنا" /></div>
                      <Button className="bg-gradient-to-r from-[#005f73] to-[#0a9396]"><Save className="ml-2 h-4 w-4" />حفظ الإعدادات</Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="users">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>المستخدمون والصلاحيات</CardTitle>
                      <Button className="bg-gradient-to-r from-[#005f73] to-[#0a9396]"><Plus className="ml-2 h-4 w-4" />مستخدم جديد</Button>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-gray-50">
                              <th className="text-right p-3 font-medium">المستخدم</th>
                              <th className="text-right p-3 font-medium">الدور</th>
                              <th className="text-right p-3 font-medium">الحالة</th>
                              <th className="text-right p-3 font-medium">آخر دخول</th>
                              <th className="text-right p-3 font-medium">الإجراءات</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { name: 'مدير النظام', role: 'مدير', status: 'نشط', lastLogin: 'الآن' },
                              { name: 'أحمد محمد', role: 'محاسب', status: 'نشط', lastLogin: 'منذ ساعة' },
                              { name: 'سارة علي', role: 'مندوب مبيعات', status: 'نشط', lastLogin: 'منذ 3 ساعات' }
                            ].map((user, idx) => (
                              <tr key={idx} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium">{user.name}</td>
                                <td className="p-3"><Badge className="bg-blue-100 text-blue-800">{user.role}</Badge></td>
                                <td className="p-3"><Badge className="bg-green-100 text-green-800">{user.status}</Badge></td>
                                <td className="p-3 text-gray-500">{user.lastLogin}</td>
                                <td className="p-3">
                                  <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" title="تعديل"><Edit2 className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="icon" title="صلاحيات"><Shield className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="icon" title="حذف"><Trash2 className="w-4 h-4 text-red-600" /></Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="backup">
                  <Card>
                    <CardHeader><CardTitle>النسخ الاحتياطي والاستعادة</CardHeader></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="border-dashed"><CardContent className="pt-6 text-center"><Database className="w-12 h-12 mx-auto text-gray-400 mb-3" /><p className="font-medium">إنشاء نسخة احتياطية</p><p className="text-sm text-gray-500 mt-1">حفظ نسخة كاملة من البيانات</p><Button className="mt-3 bg-gradient-to-r from-[#005f73] to-[#0a9396]"><Upload className="ml-2 h-4 w-4" />نسخ احتياطي الآن</Button></CardContent></Card>
                        <Card className="border-dashed"><CardContent className="pt-6 text-center"><Database className="w-12 h-12 mx-auto text-gray-400 mb-3" /><p className="font-medium">استعادة نسخة احتياطية</p><p className="text-sm text-gray-500 mt-1">استرجاع البيانات من نسخة سابقة</p><Button className="mt-3" variant="outline"><Download className="ml-2 h-4 w-4" />استعادة</Button></CardContent></Card>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-3">النسخ الاحتياطية السابقة</h4>
                        <div className="space-y-2">
                          {['backup_2024_01_19.zip', 'backup_2024_01_12.zip', 'backup_2024_01_05.zip'].map((backup, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3"><Archive className="w-5 h-5 text-gray-400" /><span>{backup}</span></div>
                              <div className="flex items-center gap-2"><span className="text-sm text-gray-500">{(2.5 - idx * 0.5).toFixed(1)} MB</span><Button variant="ghost" size="sm" title="تحميل"><Download className="w-4 h-4" /></Button><Button variant="ghost" size="sm" title="استعادة"><Upload className="w-4 h-4" /></Button><Button variant="ghost" size="sm" title="حذف"><Trash2 className="w-4 h-4 text-red-600" /></Button></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>

      {/* ============ INVOICE DIALOG (MATCHING SCREENSHOT DESIGN) ============ */}
      <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
        <DialogContent className="max-w-[98%] w-[98%] h-[96vh] max-h-[96vh] overflow-y-auto p-8" dir="rtl" style={{ width: '98vw', maxWidth: '98vw' }}>
          <DialogHeader className="flex flex-row items-center justify-between pb-6 border-b-2">
            <div>
              <DialogTitle className="text-4xl font-bold text-[#005f73]">
                {editingInvoice ? '✏️ تعديل فاتورة مبيعات' : '📄 إشعار فاتورة مبيعات جديد'}
              </DialogTitle>
            </div>
            <Button 
              type="button"
              variant="outline" 
              size="lg"
              onClick={() => setShowInvoiceDialog(false)}
              className="h-14 w-14 text-2xl rounded-xl"
            >
              ✕
            </Button>
          </DialogHeader>
          
          <div className="space-y-8 mt-6">
            {/* Top Row: Date | Customer | Tax */}
            <div className="grid grid-cols-4 gap-8">
              <div>
                <Label className="text-2xl font-bold text-gray-800">📅 التاريخ</Label>
                <Input 
                  type="date" 
                  className="mt-3 border-3 border-gray-300 focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/20 text-2xl p-5 h-18 rounded-2xl"
                  value={invoiceForm.date}
                  onChange={(e) => setInvoiceForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-2xl font-bold text-gray-800">👤 اختر العميل</Label>
                <div className="flex gap-3 mt-3">
                  <Select value={invoiceForm.customerId} onValueChange={(value) => setInvoiceForm(prev => ({ ...prev, customerId: value }))}>
                    <SelectTrigger className="flex-1 border-3 border-gray-300 focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/20 h-18 text-2xl rounded-2xl">
                      <SelectValue placeholder="اختر العميل" />
                    </SelectTrigger>
                    <SelectContent>
                      {parties.filter(p => p.type === 'customer' || p.type === 'both').map(party => (
                        <SelectItem key={party.id} value={party.id}>{party.nameAr}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    type="button"
                    variant="outline" 
                    size="icon"
                    onClick={() => setShowAddCustomerDialog(true)}
                    title="إضافة عميل جديد"
                    className="border-dashed border-3 border-emerald-400 text-emerald-700 hover:bg-emerald-100 h-18 w-18 rounded-2xl"
                  >
                    <Plus className="w-7 h-7" />
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-2xl font-bold text-gray-800">🧾 الضريبة (%)</Label>
                <Select 
                  value={invoiceForm.taxRate.toString()} 
                  onValueChange={(value) => setInvoiceForm(prev => ({ ...prev, taxRate: parseInt(value) }))}
                >
                  <SelectTrigger className="mt-3 border-3 border-gray-300 focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/20 h-18 text-2xl rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">معفى</SelectItem>
                    <SelectItem value="5">5%</SelectItem>
                    <SelectItem value="10">10%</SelectItem>
                    <SelectItem value="15">15%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-2xl font-bold text-gray-800">💳 طريقة السداد</Label>
                <Select 
                  value={invoiceForm.paymentMethod} 
                  onValueChange={(value: any) => setInvoiceForm(prev => ({ ...prev, paymentMethod: value }))}
                >
                  <SelectTrigger className="mt-3 border-3 border-gray-300 focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/20 h-18 text-2xl rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">💵 نقدى</SelectItem>
                    <SelectItem value="bank">🏦 بنك</SelectItem>
                    <SelectItem value="check">📝 شيك</SelectItem>
                    <SelectItem value="partial">⏳ جزئي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Items Section with Summary Side by Side */}
            <div className="grid grid-cols-3 gap-10">
              {/* Items Table - Takes 2/3 width */}
              <div className="col-span-2">
                <div className="border-[3px] border-gray-400 rounded-3xl overflow-hidden shadow-lg">
                  {/* Table Header */}
                  <div className="grid grid-cols-[3fr_1.5fr_1.5fr_1.5fr_auto] bg-gradient-to-l from-[#005f73] to-[#0a9396] p-6">
                    <div className="text-white font-bold text-2xl">الصنف</div>
                    <div className="text-white font-bold text-2xl text-center">الكمية</div>
                    <div className="text-white font-bold text-2xl text-center">السعر</div>
                    <div className="text-white font-bold text-2xl text-center">الإجمالي</div>
                    <div className="w-14"></div>
                  </div>
                  
                  {/* Items List or Empty State */}
                  {invoiceForm.items.length === 0 ? (
                    <div className="p-10 text-center bg-gray-50">
                      <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-600 text-2xl font-bold mb-8">لم يتم إضافة أصناف بعد</p>
                      <div className="space-y-6 max-w-2xl mx-auto">
                        <div className="grid grid-cols-4 gap-5 px-4 py-6">
                          <Input placeholder="اسم الصنف" className="border-3 border-gray-300 h-20 text-xl rounded-2xl" disabled />
                          <Input type="number" placeholder="1" className="border-3 border-gray-300 h-20 text-2xl text-center font-bold rounded-2xl" disabled />
                          <Input type="number" placeholder="0.00" className="border-3 border-gray-300 h-20 text-2xl text-center font-bold rounded-2xl" disabled />
                          <Input type="number" placeholder="0.00" className="border-3 border-gray-300 h-20 text-2xl text-center font-bold rounded-2xl" disabled />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
                      {invoiceForm.items.map((item, idx) => {
                        const lineTotal = item.quantity * item.price
                        return (
                          <div key={idx} className="grid grid-cols-[3fr_1.5fr_1.5fr_1.5fr_auto] gap-6 p-6 hover:bg-blue-50 items-center transition-colors">
                            <div className="flex gap-4">
                              <Select value={item.itemId} onValueChange={(value) => {
                                updateInvoiceItem(idx, 'itemId', value)
                                const selected = items.find(i => i.id === value)
                                if (selected) {
                                  updateInvoiceItem(idx, 'price', selected.price)
                                }
                              }}>
                                <SelectTrigger className="w-full border-3 border-gray-300 text-xl h-20 rounded-2xl focus:ring-4 focus:ring-[#0a9396]/20">
                                  <SelectValue placeholder="اسم الصنف" />
                                </SelectTrigger>
                                <SelectContent>
                                  {items.map(itemOption => (
                                    <SelectItem key={itemOption.id} value={itemOption.id}>
                                      {itemOption.nameAr}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button 
                                type="button"
                                variant="outline" 
                                size="icon"
                                onClick={() => { setItemEditIndex(idx); setShowAddItemDialog(true); }}
                                title="إضافة صنف جديد"
                                className="h-20 w-20 border-dashed border-3 border-emerald-400 text-emerald-700 hover:bg-emerald-100 flex-shrink-0 rounded-2xl"
                              >
                                <Plus className="w-7 h-7" />
                              </Button>
                            </div>
                            <div>
                              <Input 
                                type="number" 
                                min="1"
                                className="border-3 border-gray-400 text-2xl h-20 text-center font-bold p-6 rounded-2xl focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/30 bg-white"
                                value={item.quantity || ''}
                                onChange={(e) => updateInvoiceItem(idx, 'quantity', parseInt(e.target.value) || 0)}
                                placeholder="1"
                              />
                            </div>
                            <div>
                              <Input 
                                type="number"
                                min="0"
                                step="0.01"
                                className="border-3 border-gray-400 text-2xl h-20 text-center font-bold p-6 rounded-2xl focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/30 bg-white"
                                value={item.price || ''}
                                onChange={(e) => updateInvoiceItem(idx, 'price', parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                              />
                            </div>
                            <div className="flex items-center justify-between bg-gray-100 rounded-2xl px-5 py-4">
                              <span className="font-bold text-2xl text-[#005f73]">{lineTotal.toLocaleString()}</span>
                              <Button 
                                type="button"
                                variant="ghost" 
                                size="icon"
                                className="h-14 w-14 text-red-500 hover:text-red-700 hover:bg-red-100"
                                onClick={() => removeInvoiceItem(idx)}
                              >
                                <Trash2 className="w-7 h-7" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  
                  {/* Add Item Button */}
                  <div className="p-6 border-t-[3px] bg-gradient-to-r from-gray-100 to-emerald-100">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-200 w-full justify-start py-6 text-2xl font-bold"
                      onClick={addInvoiceItem}
                    >
                      <Plus className="ml-3 h-8 w-8" />
                      ➕ إضافة صنف جديد
                    </Button>
                  </div>
                </div>
              </div>

              {/* Summary Section - Takes 1/3 width */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 space-y-6 h-fit border-[3px] border-gray-300 shadow-lg">
                <h3 className="font-bold text-3xl text-gray-800 border-b-[3px] border-gray-300 pb-5 mb-5 flex items-center gap-3">
                  📊 ملخص الفاتورة
                </h3>
                
                <div className="space-y-6 text-xl">
                  <div className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-md">
                    <span className="text-gray-800 font-bold text-xl">المجموع الفرعي:</span>
                    <span className="font-bold text-2xl text-gray-900">{getInvoiceTotal().toLocaleString()} ج.م</span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-md">
                    <span className="text-gray-800 font-bold text-xl">الخصم (%):</span>
                    <div className="flex items-center gap-4">
                      <Input 
                        type="number"
                        min="0"
                        max="100"
                        className="w-28 h-16 text-center border-3 border-gray-400 text-xl font-bold rounded-2xl focus:border-red-400 focus:ring-4 focus:ring-red-200"
                        value={invoiceForm.discount || 0}
                        onChange={(e) => setInvoiceForm(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                        placeholder="0"
                      />
                      <span className="font-bold text-red-600 text-xl">
                        -{((getInvoiceTotal() * invoiceForm.discount) / 100).toLocaleString()} ج.م
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-md">
                    <span className="text-gray-800 font-bold text-xl">الضريبة ({invoiceForm.taxRate}%):</span>
                    <span className="font-bold text-purple-700 text-xl">
                      +{(((getInvoiceTotal() * (100 - invoiceForm.discount)) / 100) * invoiceForm.taxRate / 100).toLocaleString()} ج.م
                    </span>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between items-center p-6 bg-gradient-to-r from-[#005f73] to-[#0a9396] rounded-2xl text-white shadow-xl">
                    <span className="font-bold text-2xl">الإجمالي الكلي:</span>
                    <span className="font-bold text-4xl">
                      {(
                        ((getInvoiceTotal() * (100 - invoiceForm.discount)) / 100) + 
                        (((getInvoiceTotal() * (100 - invoiceForm.discount)) / 100) * invoiceForm.taxRate / 100)
                      ).toLocaleString()} ج.م
                    </span>
                  </div>

                  <Separator className="my-4" />

                  {/* Payment Section */}
                  <div className="bg-yellow-100 rounded-2xl p-6 space-y-5 border-[3px] border-yellow-400 shadow-md">
                    <h4 className="font-bold text-2xl text-yellow-900 flex items-center gap-3">
                      💰 تفاصيل السداد
                    </h4>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 font-bold text-xl">المبلغ المدفوع:</span>
                      <Input 
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-40 h-16 text-left font-bold text-green-700 border-3 border-green-500 text-xl rounded-2xl focus:border-green-600 focus:ring-4 focus:ring-green-200"
                        value={invoiceForm.paidAmount || ''}
                        onChange={(e) => setInvoiceForm(prev => ({ ...prev, paidAmount: parseFloat(e.target.value) || 0 }))}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-md">
                      <span className="text-gray-800 font-bold text-xl">المتبقي:</span>
                      <span className={`font-bold text-2xl ${
                        Math.max(0, (
                          ((getInvoiceTotal() * (100 - invoiceForm.discount)) / 100) + 
                          (((getInvoiceTotal() * (100 - invoiceForm.discount)) / 100) * invoiceForm.taxRate / 100)
                        ) - (invoiceForm.paidAmount || 0)) > 0 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {Math.max(0, (
                          ((getInvoiceTotal() * (100 - invoiceForm.discount)) / 100) + 
                          (((getInvoiceTotal() * (100 - invoiceForm.discount)) / 100) * invoiceForm.taxRate / 100)
                        ) - (invoiceForm.paidAmount || 0)).toLocaleString()} ج.م
                      </span>
                    </div>

                    {invoiceForm.paidAmount > 0 && (
                      <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-md">
                        {(() => {
                          const total = ((getInvoiceTotal() * (100 - invoiceForm.discount)) / 100) + 
                                       (((getInvoiceTotal() * (100 - invoiceForm.discount)) / 100) * invoiceForm.taxRate / 100)
                          const paid = invoiceForm.paidAmount || 0
                          if (paid >= total) {
                            return <Badge className="bg-green-200 text-green-900 text-lg py-3 px-4 text-xl">✅ مدفوع بالكامل</Badge>
                          } else if (paid > 0) {
                            return <Badge className="bg-orange-200 text-orange-900 text-lg py-3 px-4 text-xl">⏳ دفع جزئي</Badge>
                          }
                          return null
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <Label className="text-2xl font-bold text-gray-800 block mb-4">📝 ملاحظات</Label>
              <Textarea 
                className="border-3 border-gray-400 focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/20 min-h-[150px] text-xl p-6 rounded-2xl"
                placeholder="أدخل ملاحظات إضافية على الفاتورة..."
                value={invoiceForm.notes}
                onChange={(e) => setInvoiceForm(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-start gap-6 pt-8 border-t-[3px] border-gray-300 flex-wrap">
              <Button 
                type="button"
                variant="outline" 
                className="px-14 border-3 border-gray-400 text-gray-800 hover:bg-gray-100 text-2xl py-6 rounded-2xl h-auto"
                onClick={() => {
                  setShowInvoiceDialog(false)
                  setInvoiceJustSaved(false)
                  setCurrentInvoiceForPrint(null)
                }}
              >
                ❌ إلغاء
              </Button>
              
              {invoiceJustSaved || editingInvoice ? (
                <Button 
                  type="button"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-14 text-2xl py-6 shadow-2xl rounded-2xl h-auto flex items-center gap-3"
                  onClick={printInvoice}
                >
                  <Printer className="w-8 h-8" />
                  🖨️ طباعة الفاتورة
                </Button>
              ) : (
                <Button 
                  type="button"
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-16 text-2xl py-6 shadow-2xl rounded-2xl h-auto"
                  onClick={saveInvoice}
                  disabled={!invoiceForm.customerId || invoiceForm.items.length === 0}
                >
                  💾 {editingInvoice ? 'تحديث الفاتورة' : 'إنشاء الفاتورة'}
                </Button>
              )}
              
              {invoiceJustSaved && (
                <Button 
                  type="button"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-14 text-2xl py-6 shadow-2xl rounded-2xl h-auto"
                  onClick={() => {
                    setShowInvoiceDialog(false)
                    setInvoiceJustSaved(false)
                    setCurrentInvoiceForPrint(null)
                    setEditingInvoice(null)
                  }}
                >
                  ✅ فاتورة جديدة
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============ PURCHASE INVOICE DIALOG ============ */}
      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent className="max-w-[98%] w-[98%] h-[96vh] max-h-[96vh] overflow-y-auto p-8" dir="rtl" style={{ width: '98vw', maxWidth: '98vw' }}>
          <DialogHeader className="flex flex-row items-center justify-between pb-6 border-b-2">
            <div>
              <DialogTitle className="text-4xl font-bold text-red-700">
                {editingPurchase ? '✏️ تعديل فاتورة مشتريات' : '📋 فاتورة مشتريات جديدة'}
              </DialogTitle>
            </div>
            <Button 
              type="button"
              variant="outline" 
              size="lg"
              onClick={() => setShowPurchaseDialog(false)}
              className="h-14 w-14 text-2xl rounded-xl"
            >
              ✕
            </Button>
          </DialogHeader>
          
          <div className="space-y-8 mt-6">
            {/* Top Row: Date | Supplier | Tax | Payment Method */}
            <div className="grid grid-cols-4 gap-8">
              <div>
                <Label className="text-2xl font-bold text-gray-800">📅 التاريخ</Label>
                <Input 
                  type="date" 
                  className="mt-3 border-3 border-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 text-2xl p-5 h-18 rounded-2xl"
                  value={purchaseForm.date}
                  onChange={(e) => setPurchaseForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-2xl font-bold text-gray-800">🏭 اختر المورد</Label>
                <div className="flex gap-3 mt-3">
                  <Select value={purchaseForm.supplierId} onValueChange={(value) => setPurchaseForm(prev => ({ ...prev, supplierId: value }))}>
                    <SelectTrigger className="flex-1 border-3 border-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 h-18 text-2xl rounded-2xl">
                      <SelectValue placeholder="اختر المورد" />
                    </SelectTrigger>
                    <SelectContent>
                      {parties.filter(p => p.type === 'supplier' || p.type === 'both').map(party => (
                        <SelectItem key={party.id} value={party.id}>{party.nameAr}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    type="button"
                    variant="outline" 
                    size="icon"
                    onClick={() => setShowAddSupplierDialog(true)}
                    title="إضافة مورد جديد"
                    className="border-dashed border-3 border-red-400 text-red-700 hover:bg-red-100 h-18 w-18 rounded-2xl"
                  >
                    <Plus className="w-7 h-7" />
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-2xl font-bold text-gray-800">🧾 الضريبة (%)</Label>
                <Select 
                  value={purchaseForm.taxRate.toString()} 
                  onValueChange={(value) => setPurchaseForm(prev => ({ ...prev, taxRate: parseInt(value) }))}
                >
                  <SelectTrigger className="mt-3 border-3 border-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 h-18 text-2xl rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">معفى</SelectItem>
                    <SelectItem value="5">5%</SelectItem>
                    <SelectItem value="10">10%</SelectItem>
                    <SelectItem value="15">15%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-2xl font-bold text-gray-800">💳 طريقة السداد</Label>
                <Select 
                  value={purchaseForm.paymentMethod} 
                  onValueChange={(value: any) => setPurchaseForm(prev => ({ ...prev, paymentMethod: value }))}
                >
                  <SelectTrigger className="mt-3 border-3 border-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 h-18 text-2xl rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">💵 نقدى</SelectItem>
                    <SelectItem value="bank">🏦 بنك</SelectItem>
                    <SelectItem value="check">📝 شيك</SelectItem>
                    <SelectItem value="partial">⏳ جزئي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Items Section with Summary Side by Side */}
            <div className="grid grid-cols-3 gap-10">
              {/* Items Table - Takes 2/3 width */}
              <div className="col-span-2">
                <div className="border-[3px] border-red-300 rounded-3xl overflow-hidden shadow-lg">
                  {/* Table Header */}
                  <div className="grid grid-cols-[3fr_1.5fr_1.5fr_1.5fr_auto] bg-gradient-to-l from-red-600 to-red-500 p-6">
                    <div className="text-white font-bold text-2xl">الصنف</div>
                    <div className="text-white font-bold text-2xl text-center">الكمية</div>
                    <div className="text-white font-bold text-2xl text-center">السعر</div>
                    <div className="text-white font-bold text-2xl text-center">الإجمالي</div>
                    <div className="w-14"></div>
                  </div>
                  
                  {/* Items List or Empty State */}
                  {purchaseForm.items.length === 0 ? (
                    <div className="p-10 text-center bg-red-50">
                      <Package className="w-16 h-16 mx-auto mb-4 text-red-300" />
                      <p className="text-gray-600 text-2xl font-bold mb-8">لم يتم إضافة أصناف بعد</p>
                      <div className="space-y-6 max-w-2xl mx-auto">
                        <div className="grid grid-cols-4 gap-5 px-4 py-6">
                          <Input placeholder="اسم الصنف" className="border-3 border-gray-300 h-20 text-xl rounded-2xl" disabled />
                          <Input type="number" placeholder="1" className="border-3 border-gray-300 h-20 text-2xl text-center font-bold rounded-2xl" disabled />
                          <Input type="number" placeholder="0.00" className="border-3 border-gray-300 h-20 text-2xl text-center font-bold rounded-2xl" disabled />
                          <Input type="number" placeholder="0.00" className="border-3 border-gray-300 h-20 text-2xl text-center font-bold rounded-2xl" disabled />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
                      {purchaseForm.items.map((item, idx) => {
                        const lineTotal = item.quantity * item.price
                        return (
                          <div key={idx} className="grid grid-cols-[3fr_1.5fr_1.5fr_1.5fr_auto] gap-6 p-6 hover:bg-red-50 items-center transition-colors">
                            <div className="flex gap-4">
                              <Select value={item.itemId} onValueChange={(value) => {
                                updatePurchaseItem(idx, 'itemId', value)
                                const selected = items.find(i => i.id === value)
                                if (selected) {
                                  updatePurchaseItem(idx, 'price', selected.price)
                                }
                              }}>
                                <SelectTrigger className="w-full border-3 border-gray-300 text-xl h-20 rounded-2xl focus:ring-4 focus:ring-red-500/20">
                                  <SelectValue placeholder="اسم الصنف" />
                                </SelectTrigger>
                                <SelectContent>
                                  {items.map(itemOption => (
                                    <SelectItem key={itemOption.id} value={itemOption.id}>
                                      {itemOption.nameAr}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button 
                                type="button"
                                variant="outline" 
                                size="icon"
                                onClick={() => { setItemEditIndex(idx); setShowAddItemDialog(true); }}
                                title="إضافة صنف جديد"
                                className="h-20 w-20 border-dashed border-3 border-red-400 text-red-700 hover:bg-red-100 flex-shrink-0 rounded-2xl"
                              >
                                <Plus className="w-7 h-7" />
                              </Button>
                            </div>
                            <div>
                              <Input 
                                type="number" 
                                min="1"
                                className="border-3 border-gray-400 text-2xl h-20 text-center font-bold p-6 rounded-2xl focus:border-red-500 focus:ring-4 focus:ring-red-500/30 bg-white"
                                value={item.quantity || ''}
                                onChange={(e) => updatePurchaseItem(idx, 'quantity', parseInt(e.target.value) || 0)}
                                placeholder="1"
                              />
                            </div>
                            <div>
                              <Input 
                                type="number"
                                min="0"
                                step="0.01"
                                className="border-3 border-gray-400 text-2xl h-20 text-center font-bold p-6 rounded-2xl focus:border-red-500 focus:ring-4 focus:ring-red-500/30 bg-white"
                                value={item.price || ''}
                                onChange={(e) => updatePurchaseItem(idx, 'price', parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                              />
                            </div>
                            <div className="flex items-center justify-between bg-gray-100 rounded-2xl px-5 py-4">
                              <span className="font-bold text-2xl text-red-700">{lineTotal.toLocaleString()}</span>
                              <Button 
                                type="button"
                                variant="ghost" 
                                size="icon"
                                className="h-14 w-14 text-red-500 hover:text-red-700 hover:bg-red-100"
                                onClick={() => removePurchaseItem(idx)}
                              >
                                <Trash2 className="w-7 h-7" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  
                  {/* Add Item Button */}
                  <div className="p-6 border-t-[3px] bg-gradient-to-r from-gray-100 to-red-100">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="text-red-700 hover:text-red-800 hover:bg-red-200 w-full justify-start py-6 text-2xl font-bold"
                      onClick={addPurchaseItem}
                    >
                      <Plus className="ml-3 h-8 w-8" />
                      ➕ إضافة صنف جديد
                    </Button>
                  </div>
                </div>
              </div>

              {/* Summary Section - Takes 1/3 width */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 space-y-6 h-fit border-[3px] border-red-200 shadow-lg">
                <h3 className="font-bold text-3xl text-gray-800 border-b-[3px] border-red-300 pb-5 mb-5 flex items-center gap-3">
                  📊 ملخص الفاتورة
                </h3>
                
                <div className="space-y-6 text-xl">
                  <div className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-md">
                    <span className="text-gray-800 font-bold text-xl">المجموع الفرعي:</span>
                    <span className="font-bold text-2xl text-gray-900">{getPurchaseTotal().toLocaleString()} ج.م</span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-md">
                    <span className="text-gray-800 font-bold text-xl">الخصم (%):</span>
                    <div className="flex items-center gap-4">
                      <Input 
                        type="number"
                        min="0"
                        max="100"
                        className="w-28 h-16 text-center border-3 border-gray-400 text-xl font-bold rounded-2xl focus:border-red-400 focus:ring-4 focus:ring-red-200"
                        value={purchaseForm.discount || 0}
                        onChange={(e) => setPurchaseForm(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                        placeholder="0"
                      />
                      <span className="font-bold text-red-600 text-xl">
                        -{((getPurchaseTotal() * purchaseForm.discount) / 100).toLocaleString()} ج.م
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-md">
                    <span className="text-gray-800 font-bold text-xl">الضريبة ({purchaseForm.taxRate}%):</span>
                    <span className="font-bold text-purple-700 text-xl">
                      +{(((getPurchaseTotal() * (100 - purchaseForm.discount)) / 100) * purchaseForm.taxRate / 100).toLocaleString()} ج.م
                    </span>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between items-center p-6 bg-gradient-to-r from-red-600 to-red-500 rounded-2xl text-white shadow-xl">
                    <span className="font-bold text-2xl">الإجمالي الكلي:</span>
                    <span className="font-bold text-4xl">
                      {(
                        ((getPurchaseTotal() * (100 - purchaseForm.discount)) / 100) + 
                        (((getPurchaseTotal() * (100 - purchaseForm.discount)) / 100) * purchaseForm.taxRate / 100)
                      ).toLocaleString()} ج.م
                    </span>
                  </div>

                  <Separator className="my-4" />

                  {/* Payment Section */}
                  <div className="bg-yellow-100 rounded-2xl p-6 space-y-5 border-[3px] border-yellow-400 shadow-md">
                    <h4 className="font-bold text-2xl text-yellow-900 flex items-center gap-3">
                      💰 تفاصيل السداد
                    </h4>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 font-bold text-xl">المبلغ المدفوع:</span>
                      <Input 
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-40 h-16 text-left font-bold text-green-700 border-3 border-green-500 text-xl rounded-2xl focus:border-green-600 focus:ring-4 focus:ring-green-200"
                        value={purchaseForm.paidAmount || ''}
                        onChange={(e) => setPurchaseForm(prev => ({ ...prev, paidAmount: parseFloat(e.target.value) || 0 }))}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-md">
                      <span className="text-gray-800 font-bold text-xl">المتبقي:</span>
                      <span className={`font-bold text-2xl ${
                        Math.max(0, (
                          ((getPurchaseTotal() * (100 - purchaseForm.discount)) / 100) + 
                          (((getPurchaseTotal() * (100 - purchaseForm.discount)) / 100) * purchaseForm.taxRate / 100)
                        ) - (purchaseForm.paidAmount || 0)) > 0 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {Math.max(0, (
                          ((getPurchaseTotal() * (100 - purchaseForm.discount)) / 100) + 
                          (((getPurchaseTotal() * (100 - purchaseForm.discount)) / 100) * purchaseForm.taxRate / 100)
                        ) - (purchaseForm.paidAmount || 0)).toLocaleString()} ج.م
                      </span>
                    </div>

                    {purchaseForm.paidAmount > 0 && (
                      <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-md">
                        {(() => {
                          const total = ((getPurchaseTotal() * (100 - purchaseForm.discount)) / 100) + 
                                       (((getPurchaseTotal() * (100 - purchaseForm.discount)) / 100) * purchaseForm.taxRate / 100)
                          const paid = purchaseForm.paidAmount || 0
                          if (paid >= total) {
                            return <Badge className="bg-green-200 text-green-900 text-lg py-3 px-4 text-xl">✅ مدفوع بالكامل</Badge>
                          } else if (paid > 0) {
                            return <Badge className="bg-orange-200 text-orange-900 text-lg py-3 px-4 text-xl">⏳ دفع جزئي</Badge>
                          }
                          return null
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <Label className="text-2xl font-bold text-gray-800 block mb-4">📝 ملاحظات</Label>
              <Textarea 
                className="border-3 border-gray-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 min-h-[150px] text-xl p-6 rounded-2xl"
                placeholder="أدخل ملاحظات إضافية على الفاتورة..."
                value={purchaseForm.notes}
                onChange={(e) => setPurchaseForm(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-start gap-6 pt-8 border-t-[3px] border-red-300 flex-wrap">
              <Button 
                type="button"
                variant="outline" 
                className="px-14 border-3 border-gray-400 text-gray-800 hover:bg-gray-100 text-2xl py-6 rounded-2xl h-auto"
                onClick={() => {
                  setShowPurchaseDialog(false)
                  setPurchaseJustSaved(false)
                  setCurrentPurchaseForPrint(null)
                }}
              >
                ❌ إلغاء
              </Button>
              
              {purchaseJustSaved || editingPurchase ? (
                <Button 
                  type="button"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-14 text-2xl py-6 shadow-2xl rounded-2xl h-auto flex items-center gap-3"
                  onClick={printPurchaseInvoice}
                >
                  <Printer className="w-8 h-8" />
                  🖨️ طباعة الفاتورة
                </Button>
              ) : (
                <Button 
                  type="button"
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-16 text-2xl py-6 shadow-2xl rounded-2xl h-auto"
                  onClick={savePurchase}
                  disabled={!purchaseForm.supplierId || purchaseForm.items.length === 0}
                >
                  💾 {editingPurchase ? 'تحديث الفاتورة' : 'إنشاء الفاتورة'}
                </Button>
              )}
              
              {purchaseJustSaved && (
                <Button 
                  type="button"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-14 text-2xl py-6 shadow-2xl rounded-2xl h-auto"
                  onClick={() => {
                    setShowPurchaseDialog(false)
                    setPurchaseJustSaved(false)
                    setCurrentPurchaseForPrint(null)
                    setEditingPurchase(null)
                  }}
                >
                  ✅ فاتورة جديدة
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============ ADD SUPPLIER DIALOG ============ */}
      <Dialog open={showAddSupplierDialog} onOpenChange={setShowAddSupplierDialog}>
        <DialogContent className="max-w-[98%] w-[98%] h-[80vh] max-h-[80vh] overflow-y-auto p-8" dir="rtl" style={{ width: '90vw', maxWidth: '90vw' }}>
          <DialogHeader className="pb-6 border-b-2 border-red-200">
            <DialogTitle className="text-4xl font-bold text-red-700 flex items-center gap-3">
              🏢 إضافة مورد جديد
            </DialogTitle>
            <DialogDescription className="text-xl mt-2 text-gray-600">أدخل بيانات المورد الجديد</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8 mt-8">
            <div>
              <Label className="text-xl font-semibold text-gray-700 mb-3 block">اسم المورد <span className="text-red-500">*</span></Label>
              <Input 
                className="mt-2 h-18 text-2xl p-6 border-3 border-gray-300 rounded-2xl focus:border-red-400 focus:ring-4 focus:ring-red-200 transition-all"
                placeholder="مثال: شركة الأمل للتجارة"
                value={newSupplier.nameAr}
                onChange={(e) => setNewSupplier(prev => ({ ...prev, nameAr: e.target.value }))}
              />
            </div>
            
            <div>
              <Label className="text-xl font-semibold text-gray-700 mb-3 block">نوع الطرف</Label>
              <Select value={newSupplier.type} onValueChange={(val: any) => setNewSupplier(prev => ({ ...prev, type: val }))}>
                <SelectTrigger className="mt-2 h-18 text-2xl p-6 border-3 border-gray-300 rounded-2xl focus:border-red-400 focus:ring-4 focus:ring-red-200 transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplier">مورد فقط</SelectItem>
                  <SelectItem value="both">مورد وعميل</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-xl font-semibold text-gray-700 mb-3 block">رقم الهاتف</Label>
              <Input 
                className="mt-2 h-18 text-2xl p-6 border-3 border-gray-300 rounded-2xl focus:border-red-400 focus:ring-4 focus:ring-red-200 transition-all"
                placeholder="05xxxxxxxx"
                value={newSupplier.phone}
                onChange={(e) => setNewSupplier(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div className="flex items-center justify-end gap-4 pt-8 border-t-2 border-gray-200">
              <Button variant="outline" onClick={() => setShowAddSupplierDialog(false)} className="px-10 text-xl py-6 rounded-2xl h-auto border-3 border-gray-300 hover:bg-gray-100">
                ❌ إلغاء
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 px-12 text-xl py-6 rounded-2xl h-auto shadow-lg" onClick={saveNewSupplier}>
                ✅ حفظ المورد
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============ ADD CUSTOMER DIALOG ============ */}
      <Dialog open={showAddCustomerDialog} onOpenChange={setShowAddCustomerDialog}>
        <DialogContent className="max-w-[98%] w-[98%] h-[80vh] max-h-[80vh] overflow-y-auto p-8" dir="rtl" style={{ width: '90vw', maxWidth: '90vw' }}>
          <DialogHeader className="pb-6 border-b-2 border-emerald-200">
            <DialogTitle className="text-4xl font-bold text-emerald-700 flex items-center gap-3">
              👤 إضافة عميل جديد
            </DialogTitle>
            <DialogDescription className="text-xl mt-2 text-gray-600">أدخل بيانات العميل الجديد</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8 mt-8">
            <div>
              <Label className="text-xl font-semibold text-gray-700 mb-3 block">اسم العميل <span className="text-red-500">*</span></Label>
              <Input 
                className="mt-2 h-18 text-2xl p-6 border-3 border-gray-300 rounded-2xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200 transition-all"
                placeholder="مثال: شركة النور"
                value={newCustomer.nameAr}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, nameAr: e.target.value }))}
              />
            </div>
            
            <div>
              <Label className="text-xl font-semibold text-gray-700 mb-3 block">نوع الطرف</Label>
              <Select value={newCustomer.type} onValueChange={(val: any) => setNewCustomer(prev => ({ ...prev, type: val }))}>
                <SelectTrigger className="mt-2 h-18 text-2xl p-6 border-3 border-gray-300 rounded-2xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200 transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">عميل</SelectItem>
                  <SelectItem value="supplier">مورد</SelectItem>
                  <SelectItem value="both">عميل ومورد</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-xl font-semibold text-gray-700 mb-3 block">رقم الهاتف</Label>
              <Input 
                className="mt-2 h-18 text-2xl p-6 border-3 border-gray-300 rounded-2xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200 transition-all"
                placeholder="05xxxxxxxx"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div className="flex items-center justify-end gap-4 pt-8 border-t-2 border-gray-200">
              <Button variant="outline" onClick={() => setShowAddCustomerDialog(false)} className="px-10 text-xl py-6 rounded-2xl h-auto border-3 border-gray-300 hover:bg-gray-100">
                ❌ إلغاء
              </Button>
              <Button 
                className="bg-emerald-500 hover:bg-emerald-600 px-12 text-xl py-6 rounded-2xl h-auto shadow-lg text-white"
                onClick={addNewCustomer}
              >
                ➕ إضافة العميل
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============ ADD ITEM DIALOG ============ */}
      <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
        <DialogContent className="max-w-[98%] w-[98%] h-[85vh] max-h-[85vh] overflow-y-auto p-8" dir="rtl" style={{ width: '90vw', maxWidth: '90vw' }}>
          <DialogHeader className="pb-6 border-b-2 border-cyan-200">
            <DialogTitle className="text-4xl font-bold text-cyan-700 flex items-center gap-3">
              📦 إضافة صنف جديد
            </DialogTitle>
            <DialogDescription className="text-xl mt-2 text-gray-600">أدخل بيانات الصنف الجديد</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8 mt-8">
            <div>
              <Label className="text-xl font-semibold text-gray-700 mb-3 block">اسم الصنف <span className="text-red-500">*</span></Label>
              <Input 
                className="mt-2 h-20 text-2xl p-6 border-3 border-gray-300 rounded-2xl focus:border-cyan-400 focus:ring-4 focus:ring-cyan-200 transition-all"
                placeholder="مثال: لابتوب Dell"
                value={newItem.nameAr}
                onChange={(e) => setNewItem(prev => ({ ...prev, nameAr: e.target.value }))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-xl font-semibold text-gray-700 mb-3 block">الكود</Label>
                <Input 
                  className="mt-2 h-18 text-2xl p-6 border-3 border-gray-300 rounded-2xl focus:border-cyan-400 focus:ring-4 focus:ring-cyan-200 transition-all"
                  placeholder="P001"
                  value={newItem.code}
                  onChange={(e) => setNewItem(prev => ({ ...prev, code: e.target.value }))}
                />
              </div>
              
              <div>
                <Label className="text-xl font-semibold text-gray-700 mb-3 block">الفئة</Label>
                <Input 
                  className="mt-2 h-18 text-2xl p-6 border-3 border-gray-300 rounded-2xl focus:border-cyan-400 focus:ring-4 focus:ring-cyan-200 transition-all"
                  placeholder="إلكترونيات"
                  value={newItem.category}
                  onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-xl font-semibold text-gray-700 mb-3 block">السعر (ج.م)</Label>
                <Input 
                  type="number"
                  min="0"
                  step="0.01"
                  className="mt-2 h-20 text-2xl p-6 border-3 border-green-300 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all font-bold"
                  placeholder="0.00"
                  value={newItem.price || ''}
                  onChange={(e) => setNewItem(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              
              <div>
                <Label className="text-xl font-semibold text-gray-700 mb-3 block">الكمية في المخزون</Label>
                <Input 
                  type="number"
                  min="0"
                  className="mt-2 h-20 text-2xl p-6 border-3 border-blue-300 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all font-bold"
                  placeholder="0"
                  value={newItem.stock || ''}
                  onChange={(e) => setNewItem(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-8 border-t-2 border-gray-200">
              <Button variant="outline" onClick={() => setShowAddItemDialog(false)} className="px-10 text-xl py-6 rounded-2xl h-auto border-3 border-gray-300 hover:bg-gray-100">
                ❌ إلغاء
              </Button>
              <Button 
                className="bg-cyan-600 hover:bg-cyan-700 px-12 text-xl py-6 rounded-2xl h-auto shadow-lg text-white"
                onClick={addNewItem}
              >
                ➕ إضافة الصنف
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============ PARTY DIALOG (Add/Edit) ============ */}
      <Dialog open={showPartyDialog} onOpenChange={setShowPartyDialog}>
        <DialogContent className="max-w-[98%] w-[98%] h-[85vh] max-h-[85vh] overflow-y-auto p-8" dir="rtl" style={{ width: '90vw', maxWidth: '90vw' }}>
          <DialogHeader className="pb-6 border-b-2 border-blue-200">
            <DialogTitle className="text-4xl font-bold text-[#005f73] flex items-center gap-3">
              👥 {editingParty ? '✏️ تعديل بيانات الطرف' : '➕ إضافة طرف جديد'}
            </DialogTitle>
            <DialogDescription className="text-xl mt-2 text-gray-600">
              {editingParty ? 'قم بتعديل بيانات الطرف' : 'أدخل بيانات الطرف الجديد'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8 mt-8">
            <div>
              <Label className="text-xl font-semibold text-gray-700 mb-3 block">الاسم <span className="text-red-500">*</span></Label>
              <Input 
                className="mt-2 h-18 text-2xl p-6 border-3 border-gray-300 rounded-2xl focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/30 transition-all"
                placeholder="مثال: شركة الأمل للتجارة"
                value={partyForm.nameAr}
                onChange={(e) => setPartyForm(prev => ({ ...prev, nameAr: e.target.value }))}
              />
            </div>

            <div>
              <Label className="text-xl font-semibold text-gray-700 mb-3 block">نوع الطرف</Label>
              <Select value={partyForm.type} onValueChange={(value: any) => setPartyForm(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="mt-2 h-18 text-2xl p-6 border-3 border-gray-300 rounded-2xl focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/30 transition-all"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">عميل</SelectItem>
                  <SelectItem value="supplier">مورد</SelectItem>
                  <SelectItem value="both">عميل ومورد</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-xl font-semibold text-gray-700 mb-3 block">رقم الهاتف</Label>
              <Input 
                className="mt-2 h-18 text-2xl p-6 border-3 border-gray-300 rounded-2xl focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/30 transition-all"
                placeholder="05xxxxxxxx"
                value={partyForm.phone}
                onChange={(e) => setPartyForm(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div>
              <Label className="text-xl font-semibold text-gray-700 mb-3 block">الرصيد الافتتاحي (ج.م)</Label>
              <Input 
                type="number"
                min="0"
                step="0.01"
                className="mt-2 h-20 text-2xl p-6 border-3 border-purple-300 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all font-bold"
                placeholder="0.00"
                value={partyForm.balance || ''}
                onChange={(e) => setPartyForm(prev => ({ ...prev, balance: parseFloat(e.target.value) || 0 }))}
              />
            </div>

            <div className="flex items-center justify-end gap-4 pt-8 border-t-2 border-gray-200">
              <Button variant="outline" onClick={() => setShowPartyDialog(false)} className="px-10 text-xl py-6 rounded-2xl h-auto border-3 border-gray-300 hover:bg-gray-100">
                ❌ إلغاء
              </Button>
              <Button 
                className="bg-gradient-to-r from-[#005f73] to-[#0a9396] px-12 text-xl py-6 rounded-2xl h-auto shadow-lg text-white"
                onClick={saveParty}
              >
                {editingParty ? (
                  <>
                    💾 حفظ التعديلات
                  </>
                ) : (
                  <>
                    ➕ إضافة الطرف
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============ TRANSACTION DIALOG (Add/Edit) ============ */}
      <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
        <DialogContent className="max-w-[98%] w-[98%] h-[85vh] max-h-[85vh] overflow-y-auto p-8" dir="rtl" style={{ width: '90vw', maxWidth: '90vw' }}>
          <DialogHeader className={`pb-6 border-b-2 ${transactionForm.type === 'income' ? 'border-green-200' : 'border-orange-200'}`}>
            <DialogTitle className={`text-4xl font-bold flex items-center gap-3 ${transactionForm.type === 'income' ? 'text-green-700' : 'text-orange-700'}`}>
              {transactionForm.type === 'income' ? '💰' : '💸'} {editingTransaction 
                ? (transactionForm.type === 'income' ? 'تعديل الإيراد' : 'تعديل المصروف')
                : (transactionForm.type === 'income' ? 'إيراد جديد' : 'مصروف جديد')
              }
            </DialogTitle>
            <DialogDescription className="text-xl mt-2 text-gray-600">
              {editingTransaction ? 'قم بتعديل بيانات العملية' : 'أدخل بيانات العملية الجديدة'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8 mt-8">
            <div>
              <Label className="text-xl font-semibold text-gray-700 mb-3 block">التاريخ</Label>
              <Input 
                type="date"
                className="mt-2 h-18 text-2xl p-6 border-3 border-gray-300 rounded-2xl focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/30 transition-all"
                value={transactionForm.date}
                onChange={(e) => setTransactionForm(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <div>
              <Label className="text-xl font-semibold text-gray-700 mb-3 block">الوصف <span className="text-red-500">*</span></Label>
              <Input 
                className="mt-2 h-18 text-2xl p-6 border-3 border-gray-300 rounded-2xl focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/30 transition-all"
                placeholder={transactionForm.type === 'income' ? 'مثال: مبيعات نقدية' : 'مثال: إيجار المحل'}
                value={transactionForm.description}
                onChange={(e) => setTransactionForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-xl font-semibold text-gray-700 mb-3 block">المبلغ (ج.م)</Label>
                <Input 
                  type="number"
                  min="0"
                  step="0.01"
                  className={`mt-2 h-20 text-2xl p-6 border-3 rounded-2xl focus:ring-4 transition-all font-bold ${transactionForm.type === 'income' ? 'border-green-300 focus:border-green-500 focus:ring-green-200' : 'border-orange-300 focus:border-orange-500 focus:ring-orange-200'}`}
                  placeholder="0.00"
                  value={transactionForm.amount || ''}
                  onChange={(e) => setTransactionForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              
              <div>
                <Label className="text-xl font-semibold text-gray-700 mb-3 block">الفئة</Label>
                <Select value={transactionForm.category} onValueChange={(value) => setTransactionForm(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className={`mt-2 h-18 text-2xl p-6 border-3 border-gray-300 rounded-2xl focus:ring-4 transition-all ${transactionForm.type === 'income' ? 'focus:border-green-500 focus:ring-green-200' : 'focus:border-orange-500 focus:ring-orange-200'}`}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {transactionForm.type === 'income' ? (
                      <>
                        <SelectItem value="مبيعات نقدية">مبيعات نقدية</SelectItem>
                        <SelectItem value="مبيعات آجلة">مبيعات آجلة</SelectItem>
                        <SelectItem value="إيرادات أخرى">إيرادات أخرى</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="رواتب">رواتب</SelectItem>
                        <SelectItem value="إيجار">إيجار</SelectItem>
                        <SelectItem value="فواتير">فواتير</SelectItem>
                        <SelectItem value="مصروفات أخرى">مصروفات أخرى</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-8 border-t-2 border-gray-200">
              <Button variant="outline" onClick={() => setShowTransactionDialog(false)} className="px-10 text-xl py-6 rounded-2xl h-auto border-3 border-gray-300 hover:bg-gray-100">
                ❌ إلغاء
              </Button>
              <Button 
                className={`${transactionForm.type === 'income' ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'} px-12 text-xl py-6 rounded-2xl h-auto shadow-lg text-white`}
                onClick={saveTransaction}
              >
                {editingTransaction ? (
                  <>
                    💾 حفظ التعديلات
                  </>
                ) : (
                  <>
                    ➕ {transactionForm.type === 'income' ? 'إضافة الإيراد' : 'إضافة المصروف'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* = TRANSACTION VIEW DIALOG ============ */}
      <Dialog open={!!viewingTransaction} onOpenChange={() => setViewingTransaction(null)}>
        <DialogContent className="max-w-[98%] w-[98%] h-[80vh] max-h-[80vh] overflow-y-auto p-8" dir="rtl" style={{ width: '85vw', maxWidth: '85vw' }}>
          <DialogHeader className={`pb-6 border-b-2 ${viewingTransaction?.type === 'income' ? 'border-green-200' : 'border-orange-200'}`}>
            <DialogTitle className={`text-4xl font-bold flex items-center gap-3 ${viewingTransaction?.type === 'income' ? 'text-green-700' : 'text-orange-700'}`}>
              {viewingTransaction?.type === 'income' ? '💰 تفاصيل الإيراد' : '💸 تفاصيل المصروف'}
            </DialogTitle>
          </DialogHeader>
          
          {viewingTransaction && (
            <div className="space-y-8 mt-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 shadow-sm">
                  <p className="text-lg text-gray-500 mb-2">رقم العملية</p>
                  <p className="font-bold text-3xl font-mono text-[#005f73]">#{viewingTransaction.id.slice(-6)}</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 shadow-sm">
                  <p className="text-lg text-gray-500 mb-2">التاريخ</p>
                  <p className="font-bold text-2xl">{viewingTransaction.date}</p>
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 shadow-sm">
                <p className="text-lg text-gray-500 mb-2">الوصف</p>
                <p className="font-medium text-2xl">{viewingTransaction.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 shadow-sm">
                  <p className="text-lg text-gray-500 mb-2">الفئة</p>
                  <p className="font-bold text-2xl">{viewingTransaction.category}</p>
                </div>
                <div className={`p-6 rounded-2xl border-3 shadow-lg ${viewingTransaction.type === 'income' ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-300' : 'bg-gradient-to-br from-orange-50 to-red-100 border-orange-300'}`}>
                  <p className="text-lg text-gray-500 mb-2">المبلغ</p>
                  <p className={`font-bold text-4xl ${viewingTransaction.type === 'income' ? 'text-green-700' : 'text-orange-700'}`}>
                    {viewingTransaction.type === 'income' ? '+' : '-'}{viewingTransaction.amount.toLocaleString()} ج.م
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-8 border-t-2 border-gray-200">
                <Button variant="outline" onClick={() => setViewingTransaction(null)} className="px-10 text-xl py-6 rounded-2xl h-auto border-3 border-gray-300 hover:bg-gray-100">
                  ❌ إغلاق
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    printTransaction(viewingTransaction)
                    setViewingTransaction(null)
                  }}
                  className="px-10 text-xl py-6 rounded-2xl h-auto border-3 border-blue-400 text-blue-600 hover:bg-blue-50"
                >
                  🖨️ طباعة
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ============ INVENTORY ITEM DIALOG (Add/Edit) ============ */}
      <Dialog open={showInventoryItemDialog} onOpenChange={setShowInventoryItemDialog}>
        <DialogContent className="max-w-[98%] w-[98%] h-[85vh] max-h-[85vh] overflow-y-auto p-8" dir="rtl" style={{ width: '90vw', maxWidth: '90vw' }}>
          <DialogHeader className="pb-6 border-b-2 border-indigo-200">
            <DialogTitle className="text-4xl font-bold text-[#005f73] flex items-center gap-3">
              📦 {editingInventoryItem ? '✏️ تعديل الصنف' : '➕ إضافة صنف جديد'}
            </DialogTitle>
            <DialogDescription className="text-xl mt-2 text-gray-600">
              {editingInventoryItem ? 'قم بتعديل بيانات الصنف' : 'أدخل بيانات الصنف الجديد'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8 mt-8">
            <div>
              <Label className="text-xl font-semibold text-gray-700 mb-3 block">اسم الصنف <span className="text-red-500">*</span></Label>
              <Input 
                className="mt-2 h-20 text-2xl p-6 border-3 border-gray-300 rounded-2xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-200 transition-all"
                placeholder="مثال: مطبخ مودرن"
                value={inventoryItemForm.nameAr}
                onChange={(e) => setInventoryItemForm(prev => ({ ...prev, nameAr: e.target.value }))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-xl font-semibold text-gray-700 mb-3 block">الكود</Label>
                <Input 
                  className="mt-2 h-18 text-2xl p-6 border-3 border-gray-300 rounded-2xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-200 transition-all"
                  placeholder="MK-001"
                  value={inventoryItemForm.code}
                  onChange={(e) => setInventoryItemForm(prev => ({ ...prev, code: e.target.value }))}
                />
              </div>
              
              <div>
                <Label className="text-xl font-semibold text-gray-700 mb-3 block">الفئة</Label>
                <Input 
                  className="mt-2 h-18 text-2xl p-6 border-3 border-gray-300 rounded-2xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-200 transition-all"
                  placeholder="أثاث مطابخ"
                  value={inventoryItemForm.category}
                  onChange={(e) => setInventoryItemForm(prev => ({ ...prev, category: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-xl font-semibold text-gray-700 mb-3 block">السعر (ج.م)</Label>
                <Input 
                  type="number"
                  min="0"
                  step="0.01"
                  className="mt-2 h-20 text-2xl p-6 border-3 border-green-300 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all font-bold"
                  placeholder="0.00"
                  value={inventoryItemForm.price || ''}
                  onChange={(e) => setInventoryItemForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              
              <div>
                <Label className="text-xl font-semibold text-gray-700 mb-3 block">الكمية في المخزون</Label>
                <Input 
                  type="number"
                  min="0"
                  className="mt-2 h-20 text-2xl p-6 border-3 border-blue-300 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all font-bold"
                  placeholder="0"
                  value={inventoryItemForm.stock || ''}
                  onChange={(e) => setInventoryItemForm(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-8 border-t-2 border-gray-200">
              <Button variant="outline" onClick={() => setShowInventoryItemDialog(false)} className="px-10 text-xl py-6 rounded-2xl h-auto border-3 border-gray-300 hover:bg-gray-100">
                ❌ إلغاء
              </Button>
              <Button 
                className="bg-gradient-to-r from-[#005f73] to-[#0a9396] px-12 text-xl py-6 rounded-2xl h-auto shadow-lg text-white"
                onClick={saveInventoryItem}
              >
                {editingInventoryItem ? (
                  <>💾 حفظ التعديلات</>
                ) : (
                  <>➕ إضافة الصنف</>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============ DELETE CONFIRMATION DIALOG ============ */}
      <Dialog open={deleteConfirm.show} onOpenChange={(open) => !open && setDeleteConfirm({ show: false, type: '', id: '', name: '' })}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              تأكيد الحذف
            </DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف <strong>{deleteConfirm.name}</strong>؟
              <br />
              <span className="text-red-500 text-sm">لا يمكن التراجع عن هذا الإجراء.</span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirm({ show: false, type: '', id: '', name: '' })}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash2 className="ml-2 h-4 w-4" />
              تأكيد الحذف
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Fix for Repeat icon import
function Repeat(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 2l4 4-4 4"/>
      <path d="M3 11v-1a4 4 0 0 1 4-4h14"/>
      <path d="M7 22l-4-4 4-4"/>
      <path d="M21 13v1a4 4 0 0 1-4 4H3"/>
    </svg>
  )
}

// Export with Error Boundary
export default function App() {
  return (
    <ErrorBoundary>
      <AccountingApp />
    </ErrorBoundary>
  )
}
