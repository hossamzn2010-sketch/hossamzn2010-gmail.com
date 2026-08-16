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

// ============ TYPES ============
type ModuleType = 'dashboard' | 'sales' | 'purchases' | 'inventory' | 'parties' | 'treasury' | 'reports' | 'settings' | 'accounts' | 'banks' | 'hr' | 'expenses'

interface Invoice {
  id: string
  number: string
  date: string
  customerName: string
  total: number
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

// ============ MOCK DATA ============
const mockInvoices: Invoice[] = [
  { id: '1', number: 'INV-001', date: '2024-01-15', customerName: 'شركة النور', total: 15000, status: 'posted', items: [{ id: '1', name: 'منتج أ', quantity: 10, price: 1000, total: 10000 }, { id: '2', name: 'منتج ب', quantity: 5, price: 1000, total: 5000 }] },
  { id: '2', number: 'INV-002', date: '2024-01-16', customerName: 'مؤسسة الأمل', total: 8500, status: 'paid', items: [{ id: '3', name: 'منتج ج', quantity: 5, price: 1700, total: 8500 }] },
  { id: '3', number: 'INV-003', date: '2024-01-17', customerName: 'شركة الرائد', total: 22000, status: 'draft', items: [{ id: '4', name: 'منتج د', quantity: 20, price: 1100, total: 22000 }] },
  { id: '4', number: 'INV-004', date: '2024-01-18', customerName: 'مؤسسة البناء', total: 12300, status: 'posted', items: [{ id: '5', name: 'منتج هـ', quantity: 3, price: 4100, total: 12300 }] },
  { id: '5', number: 'INV-005', date: '2024-01-19', customerName: 'شركة المستقبل', total: 18500, status: 'cancelled', items: [] }
]

const mockQuotations = [
  { id: 'Q1', number: 'QUO-001', date: '2024-01-15', customerName: 'شركة التقنية', total: 25000, status: 'pending', validUntil: '2024-02-15' },
  { id: 'Q2', number: 'QUO-002', date: '2024-01-16', customerName: 'مؤسسة التقدم', total: 18000, status: 'accepted', validUntil: '2024-02-16' },
  { id: 'Q3', number: 'QUO-003', date: '2024-01-17', customerName: 'شركة النجاح', total: 32000, status: 'expired', validUntil: '2024-01-17' }
]

const mockSalesReturns = [
  { id: 'SR1', number: 'SR-001', date: '2024-01-18', customerName: 'شركة النور', invoiceNumber: 'INV-001', total: 5000, reason: 'عيب في المنتج', status: 'approved' },
  { id: 'SR2', number: 'SR-002', date: '2024-01-19', customerName: 'مؤسسة الأمل', invoiceNumber: 'INV-002', total: 2000, reason: 'إرجاع جزئي', status: 'pending' }
]

const mockItems: Item[] = [
  { id: '1', nameAr: 'منتج أ', code: 'P001', category: 'إلكترونيات', stock: 150, price: 1000 },
  { id: '2', nameAr: 'منتج ب', code: 'P002', category: 'إلكترونيات', stock: 80, price: 1000 },
  { id: '3', nameAr: 'منتج ج', code: 'P003', category: 'أثاث', stock: 25, price: 1700 },
  { id: '4', nameAr: 'منتج د', code: 'P004', category: 'أثاث', stock: 45, price: 1100 },
  { id: '5', nameAr: 'منتج هـ', code: 'P005', category: 'ملابس', stock: 200, price: 4100 }
]

const mockParties: Party[] = [
  { id: '1', nameAr: 'شركة النور', type: 'customer', phone: '0501234567', balance: 15000 },
  { id: '2', nameAr: 'مؤسسة الأمل', type: 'customer', phone: '0559876543', balance: -5000 },
  { id: '3', nameAr: 'شركة الرائد', type: 'supplier', phone: '0541112233', balance: -25000 },
  { id: '4', nameAr: 'مؤسسة البناء', type: 'both', phone: '0507778899', balance: 8000 },
  { id: '5', nameAr: 'شركة المستقبل', type: 'customer', phone: '0563334455', balance: 0 }
]

const mockTransactions: Transaction[] = [
  { id: '1', date: '2024-01-15', description: 'تحصيل من شركة النور', amount: 10000, type: 'income', category: 'تحصيل' },
  { id: '2', date: '2024-01-16', description: 'إيجار المكتب', amount: 5000, type: 'expense', category: 'إيجار' },
  { id: '3', date: '2024-01-17', description: 'مبيعات نقدية', amount: 3500, type: 'income', category: 'مبيعات' },
  { id: '4', date: '2024-01-18', description: 'مشتريات مستلزمات', amount: 1200, type: 'expense', category: 'مشتريات' },
  { id: '5', date: '2024-01-19', description: 'تحصيل من مؤسسة البناء', amount: 8000, type: 'income', category: 'تحصيل' }
]

const mockPurchaseOrders = [
  { id: 'PO1', number: 'PO-001', date: '2024-01-15', supplierName: 'شركة الرائد', total: 35000, status: 'pending', expectedDate: '2024-01-25' },
  { id: 'PO2', number: 'PO-002', date: '2024-01-16', supplierName: 'المورد العالمي', total: 18000, status: 'received', expectedDate: '2024-01-20' },
  { id: 'PO3', number: 'PO-003', date: '2024-01-17', supplierName: 'شركة الرائد', total: 42000, status: 'ordered', expectedDate: '2024-02-01' }
]

const mockAccounts = [
  { id: '1', code: '1000', name: 'الأصول', type: 'asset', parentId: null, balance: 150000 },
  { id: '2', code: '1001', name: 'الصندوق', type: 'asset', parentId: '1', balance: 25000 },
  { id: '3', code: '1002', name: 'البنوك', type: 'asset', parentId: '1', balance: 125000 },
  { id: '4', code: '2000', name: 'الخصوم', type: 'liability', parentId: null, balance: 75000 },
  { id: '5', code: '2001', name: 'الموردون', type: 'liability', parentId: '4', balance: 75000 },
  { id: '6', code: '3000', name: 'حقوق الملكية', type: 'equity', parentId: null, balance: 100000 },
  { id: '7', code: '4000', name: 'الإيرادات', type: 'revenue', parentId: null, balance: 200000 },
  { id: '8', code: '5000', name: 'المصروفات', type: 'expense', parentId: null, balance: 120000 }
]

const mockBankAccounts = [
  { id: '1', bankName: 'البنك الأهلي', accountNumber: '1234567890', accountType: 'جاري', balance: 85000, currency: 'ريال' },
  { id: '2', bankName: 'بنك الراجحي', accountNumber: '0987654321', accountType: 'جاري', balance: 40000, currency: 'ريال' }
]

const mockChecks = [
  { id: '1', checkNumber: 'CHQ-001', bankName: 'البنك الأهلي', amount: 15000, dueDate: '2024-02-01', status: 'pending', beneficiary: 'شركة النور' },
  { id: '2', checkNumber: 'CHQ-002', bankName: 'بنك الراجحي', amount: 8000, dueDate: '2024-01-25', status: 'deposited', beneficiary: 'مؤسسة البناء' }
]

const mockEmployees = [
  { id: '1', name: 'أحمد محمد', position: 'محاسب', department: 'المالية', salary: 8000, status: 'active', joinDate: '2023-01-15' },
  { id: '2', name: 'سارة علي', position: 'مندوب مبيعات', department: 'المبيعات', salary: 6000, status: 'active', joinDate: '2023-03-01' },
  { id: '3', name: 'خالد عبدالله', position: 'مخزني', department: 'المخزون', salary: 5000, status: 'active', joinDate: '2023-06-15' }
]

const mockExpenses = [
  { id: '1', date: '2024-01-15', category: 'إيجار', description: 'إيجار شهر يناير', amount: 5000, type: 'fixed', status: 'paid' },
  { id: '2', date: '2024-01-16', category: 'مرتبات', description: 'رواتب الموظفين', amount: 19000, type: 'fixed', status: 'paid' },
  { id: '3', date: '2024-01-17', category: 'مواد', description: 'مشتريات مستلزمات مكتبية', amount: 1200, type: 'variable', status: 'paid' },
  { id: '4', date: '2024-01-18', category: 'صيانة', description: 'صيانة أجهزة', amount: 800, type: 'variable', status: 'pending' }
]

// ============ MAIN COMPONENT ============
export default function AccountingApp() {
  const [activeModule, setActiveModule] = useState<ModuleType>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [items] = useState<Item[]>(mockItems)
  const [parties] = useState<Party[]>(mockParties)
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Invoice Form States
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [invoiceForm, setInvoiceForm] = useState({
    customerId: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    items: [] as { itemId: string; quantity: number; price: number; discount: number }[]
  })

  // Delete Confirmation State
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; type: string; id: string; name: string }>({ show: false, type: '', id: '', name: '' })

  // Notification State
  const [notifications] = useState([
    { id: 1, message: 'فاتورة INV-001 تم ترحيلها بنجاح', time: 'منذ 5 دقائق', type: 'success' as const },
    { id: 2, message: 'تنبيه: مخزون منتج ج منخفض', time: 'منذ ساعة', type: 'warning' as const },
    { id: 3, message: 'دفعة مستحقة غداً لمؤسسة البناء', time: 'منذ ساعتين', type: 'info' as const }
  ])

  // Login Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggedIn(true)
  }

  // ============ INVOICE ACTIONS ============
  const openNewInvoice = () => {
    setEditingInvoice(null)
    setInvoiceForm({ customerId: '', date: new Date().toISOString().split('T')[0], notes: '', items: [] })
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
    const invoiceTotal = invoiceForm.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)

    if (editingInvoice) {
      setInvoices(prev => prev.map(inv => inv.id === editingInvoice.id ? {
        ...inv,
        customerName: selectedCustomer?.nameAr || '',
        date: invoiceForm.date,
        total: invoiceTotal,
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
        total: invoiceTotal,
        status: 'draft',
        items: invoiceForm.items.map((item, idx) => ({
          id: `new-${idx}`,
          name: items.find(i => i.id === item.itemId)?.nameAr || 'منتج',
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price
        }))
      }
      setInvoices(prev => [...prev, newInvoice])
    }
    
    setShowInvoiceDialog(false)
    setEditingInvoice(null)
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
    }
    setDeleteConfirm({ show: false, type: '', id: '', name: '' })
  }

  const printInvoice = (invoice: Invoice) => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html dir="rtl">
        <head><title>فاتورة ${invoice.number}</title>
        <style>
          body { font-family: Arial; padding: 20px; direction: rtl; }
          .header { text-align: center; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
          th { background: #f5f5f5; }
          .total { font-size: 18px; font-weight: bold; margin-top: 20px; }
        </style>
        </head>
        <body>
        <div class="header">
          <h1>نظام إنجاز المحاسبي</h1>
          <h2>فاتورة مبيعات</h2>
        </div>
        <p><strong>رقم الفاتورة:</strong> ${invoice.number}</p>
        <p><strong>التاريخ:</strong> ${invoice.date}</p>
        <p><strong>العميل:</strong> ${invoice.customerName}</p>
        <p><strong>الحالة:</strong> ${invoice.status === 'draft' ? 'مسودة' : invoice.status === 'posted' ? 'مرحلة' : invoice.status === 'paid' ? 'مدفوعة' : 'ملغاة'}</p>
        <table>
          <tr><th>#</th><th>الصنف</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr>
          ${invoice.items.map((item, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>${item.total.toFixed(2)}</td>
            </tr>
          `).join('')}
        </table>
        <div class="total">الإجمالي الكلي: ${invoice.total.toFixed(2)} ريال</div>
        </body></html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
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

  // ============ SIDEBAR MENU ITEMS ============
  const menuItems = [
    { id: 'dashboard' as ModuleType, icon: LayoutDashboard, label: 'لوحة التحكم' },
    { id: 'sales' as ModuleType, icon: ShoppingCart, label: 'المبيعات' },
    { id: 'purchases' as ModuleType, icon: Package, label: 'المشتريات' },
    { id: 'inventory' as ModuleType, icon: Package, label: 'المخزون' },
    { id: 'parties' as ModuleType, icon: Users, label: 'الأطراف' },
    { id: 'treasury' as ModuleType, icon: Wallet, label: 'الخزينة' },
    { id: 'accounts' as ModuleType, icon: BookOpen, label: 'دليل الحسابات' },
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
          <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/20 rounded-lg text-red-200 transition-colors">
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
          {/* ============ DASHBOARD MODULE ============ */}
          {activeModule === 'dashboard' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-r-4 border-r-green-500"><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">إجمالي المبيعات</p><p className="text-2xl font-bold text-green-600">76,300 ر.س</p></div><div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"><TrendingUp className="w-6 h-6 text-green-600" /></div></div><p className="text-xs text-green-600 mt-2">↑ 12% عن الشهر السابق</p></CardContent></Card>
                
                <Card className="border-r-4 border-r-red-500"><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">إجمالي المشتريات</p><p className="text-2xl font-bold text-red-600">95,000 ر.س</p></div><div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"><TrendingDown className="w-6 h-6 text-red-600" /></div></div><p className="text-xs text-red-600 mt-2">↑ 5% عن الشهر السابق</p></CardContent></Card>
                
                <Card className="border-r-4 border-r-blue-500"><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">صافي الربح</p><p className="text-2xl font-bold text-blue-600">18,700 ر.س</p></div><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><DollarSign className="w-6 h-6 text-blue-600" /></div></div><p className="text-xs text-blue-600 mt-2">↑ 8% عن الشهر السابق</p></CardContent></Card>
                
                <Card className="border-r-4 border-r-orange-500"><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">الفواتير المعلقة</p><p className="text-2xl font-bold text-orange-600">7 فواتير</p></div><div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center"><Clock className="w-6 h-6 text-orange-600" /></div></div><p className="text-xs text-orange-600 mt-2">3 تحتاج متابعة عاجلة</p></CardContent></Card>
              </div>

              {/* Additional KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-r-4 border-r-purple-500"><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">العملاء النشطون</p><p className="text-2xl font-bold text-purple-600">24 عميل</p></div><div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center"><Users className="w-6 h-6 text-purple-600" /></div></div></CardContent></Card>
                
                <Card className="border-r-4 border-r-cyan-500"><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">الموردين</p><p className="text-2xl font-bold text-cyan-600">18 مورد</p></div><div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center"><Truck className="w-6 h-6 text-cyan-600" /></div></div></CardContent></Card>
                
                <Card className="border-r-4 border-r-pink-500"><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">المصروفات الشهرية</p><p className="text-2xl font-bold text-pink-600">26,000 ر.س</p></div><div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center"><Receipt className="w-6 h-6 text-pink-600" /></div></div></CardContent></Card>
                
                <Card className="border-r-4 border-r-indigo-500"><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">رصيد الخزينة</p><p className="text-2xl font-bold text-indigo-600">125,000 ر.س</p></div><div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center"><Wallet className="w-6 h-6 text-indigo-600" /></div></div></CardContent></Card>
              </div>

              {/* Charts and Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader><CardTitle>المبيعات والمشتريات (آخر 6 أشهر)</CardTitle></CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-end justify-around gap-4 px-4">
                      {['أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر','يناير'].map((month, idx) => {
                        const sh = [65,72,68,85,90,100][idx], ph = [45,55,50,60,70,75][idx]
                        return (<div key={month} className="flex-1 flex flex-col items-center gap-2"><div className="w-full flex gap-1 items-end justify-center h-48"><div className="w-5 bg-gradient-to-t from-[#005f73] to-[#0a9396] rounded-t" style={{height:`${sh}%`}}/><div className="w-5 bg-gradient-to-t from-red-400 to-red-500 rounded-t" style={{height:`${ph}%`}}/></div><span className="text-xs text-gray-500">{month}</span></div>)
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>إجراءات سريعة</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={() => setActiveModule('sales')} className="w-full justify-start bg-green-50 text-green-700 hover:bg-green-100" variant="outline"><Plus className="ml-2 h-4 w-4" />فاتورة مبيعات جديدة</Button>
                    <Button onClick={() => setActiveModule('purchases')} className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100" variant="outline"><Plus className="ml-2 h-4 w-4" />طلب شراء جديد</Button>
                    <Button onClick={() => setActiveModule('treasury')} className="w-full justify-start bg-purple-50 text-purple-700 hover:bg-purple-100" variant="outline"><Wallet className="ml-2 h-4 w-4" />تحصيل جديد</Button>
                    <Button onClick={() => setActiveModule('expenses')} className="w-full justify-start bg-orange-50 text-orange-700 hover:bg-orange-100" variant="outline"><Receipt className="ml-2 h-4 w-4" />مصروف جديد</Button>
                    <Button onClick={() => setActiveModule('reports')} className="w-full justify-start bg-gray-50 text-gray-700 hover:bg-gray-100" variant="outline"><FileText className="ml-2 h-4 w-4" />عرض التقارير</Button>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Invoices & Transactions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between"><CardTitle>آخر الفواتير</CardTitle><Button variant="ghost" size="sm" onClick={() => setActiveModule('sales')}>عرض الكل</Button></CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {invoices.slice(0, 5).map(inv => (
                        <div key={inv.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div><p className="font-medium">{inv.number}</p><p className="text-xs text-gray-500">{inv.customerName}</p></div>
                          <div className="text-left"><p className="font-bold">{inv.total.toLocaleString()} ر.س</p><Badge variant={inv.status === 'paid' ? 'default' : inv.status === 'posted' ? 'secondary' : 'outline'}>{inv.status === 'draft' ? 'مسودة' : inv.status === 'posted' ? 'مرحلة' : inv.status === 'paid' ? 'مدفوعة' : 'ملغاة'}</Badge></div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between"><CardTitle>آخر العمليات المالية</CardTitle><Button variant="ghost" size="sm" onClick={() => setActiveModule('treasury')}>عرض الكل</Button></CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {transactions.slice(0, 5).map(trans => (
                        <div key={trans.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-full flex items-center justify-center ${trans.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>{trans.type === 'income' ? <ArrowDownLeft className="w-5 h-5 text-green-600" /> : <ArrowUpRight className="w-5 h-5 text-red-600" />}</div><div><p className="font-medium">{trans.description}</p><p className="text-xs text-gray-500">{trans.category}</p></div></div>
                          <p className={`font-bold ${trans.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{trans.type === 'income' ? '+' : '-'}{trans.amount.toLocaleString()} ر.س</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* ============ SALES MODULE (ENHANCED) ============ */}
          {activeModule === 'sales' && (
            <div className="space-y-6">
              {/* Sales Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"><DollarSign className="w-6 h-6 text-green-600" /></div><div><p className="text-sm text-gray-500">مبيعات اليوم</p><p className="text-xl font-bold text-green-600">5,200 ر.س</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><FileText className="w-6 h-6 text-blue-600" /></div><div><p className="text-sm text-gray-500">الفواتير</p><p className="text-xl font-bold text-blue-600">{invoices.length}</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center"><Clock className="w-6 h-6 text-yellow-600" /></div><div><p className="text-sm text-gray-500">غير المدفوعة</p><p className="text-xl font-bold text-yellow-600">{invoices.filter(i => i.status !== 'paid').length}</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center"><Eye className="w-6 h-6 text-purple-600" /></div><div><p className="text-sm text-gray-500">عروض الأسعار</p><p className="text-xl font-bold text-purple-600">{mockQuotations.length}</p></div></div></CardContent></Card>
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
                                <td className="p-3 font-bold">{invoice.total.toLocaleString()} ر.س</td>
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
                                <td className="p-3 font-bold">{quote.total.toLocaleString()} ر.س</td>
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
                                <td className="p-3 font-bold text-red-600">{ret.total.toLocaleString()} ر.س</td>
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
            </div>
          )}

          {/* ============ PURCHASES MODULE ============ */}
          {activeModule === 'purchases' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"><TrendingDown className="w-6 h-6 text-red-600" /></div><div><p className="text-sm text-gray-500">مشتريات اليوم</p><p className="text-xl font-bold text-red-600">12,500 ر.س</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><ClipboardList className="w-6 h-6 text-blue-600" /></div><div><p className="text-sm text-gray-500">طلبات الشراء</p><p className="text-xl font-bold text-blue-600">{mockPurchaseOrders.length}</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center"><Clock className="w-6 h-6 text-yellow-600" /></div><div><p className="text-sm text-gray-500">قيد الانتظار</p><p className="text-xl font-bold text-yellow-600">{mockPurchaseOrders.filter(p => p.status === 'pending').length}</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center"><Truck className="w-6 h-6 text-purple-600" /></div><div><p className="text-sm text-gray-500">تم الاستلام</p><p className="text-xl font-bold text-purple-600">{mockPurchaseOrders.filter(p => p.status === 'received').length}</p></div></div></CardContent></Card>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Button className="bg-gradient-to-r from-[#005f73] to-[#0a9396]"><Plus className="ml-2 h-4 w-4" />طلب شراء جديد</Button>
                      <Button variant="outline"><Plus className="ml-2 h-4 w-4" />فاتورة مشتريات</Button>
                      <Button variant="outline"><RotateCcw className="ml-2 h-4 w-4" />مرتجع مشتريات</Button>
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
                          <th className="text-right p-3 font-medium">رقم الطلب</th>
                          <th className="text-right p-3 font-medium">التاريخ</th>
                          <th className="text-right p-3 font-medium">المورد</th>
                          <th className="text-right p-3 font-medium">الإجمالي</th>
                          <th className="text-right p-3 font-medium">الحالة</th>
                          <th className="text-right p-3 font-medium">تاريخ الاستلام المتوقع</th>
                          <th className="text-right p-3 font-medium">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockPurchaseOrders.map((po, idx) => (
                          <tr key={po.id} className="border-b hover:bg-gray-50">
                            <td className="p-3">{idx + 1}</td>
                            <td className="p-3 font-medium">{po.number}</td>
                            <td className="p-3">{po.date}</td>
                            <td className="p-3">{po.supplierName}</td>
                            <td className="p-3 font-bold">{po.total.toLocaleString()} ر.س</td>
                            <td className="p-3">
                              <Badge className={
                                po.status === 'received' ? 'bg-green-100 text-green-800' :
                                po.status === 'ordered' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }>
                                {po.status === 'pending' ? 'قيد الانتظار' : po.status === 'ordered' ? 'تم الطلب' : 'تم الاستلام'}
                              </Badge>
                            </td>
                            <td className="p-3">{po.expectedDate}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" title="عرض"><Eye className="w-4 h-4 text-blue-600" /></Button>
                                <Button variant="ghost" size="icon" title="تعديل"><Edit2 className="w-4 h-4 text-purple-600" /></Button>
                                <Button variant="ghost" size="icon" title="طباعة"><Printer className="w-4 h-4 text-gray-600" /></Button>
                                <Button variant="ghost" size="icon" title="استلام"><CheckSquare className="w-4 h-4 text-green-600" /></Button>
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
                      <Button className="bg-gradient-to-r from-[#005f73] to-[#0a9396]"><Plus className="ml-2 h-4 w-4" />صنف جديد</Button>
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
                            <td className="p-3">{item.price.toLocaleString()} ر.س</td>
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
                                <Button variant="ghost" size="icon" title="عرض"><Eye className="w-4 h-4 text-blue-600" /></Button>
                                <Button variant="ghost" size="icon" title="تعديل"><Edit2 className="w-4 h-4 text-purple-600" /></Button>
                                <Button variant="ghost" size="icon" title="طباعة باركود"><QrCode className="w-4 h-4 text-gray-600" /></Button>
                                <Button variant="ghost" size="icon" title="حركة مخزون"><Activity className="w-4 h-4 text-green-600" /></Button>
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

          {/* ============ PARTIES MODULE ============ */}
          {activeModule === 'parties' && (
            <div className="space-y-6">
              <Tabs defaultValue="all">
                <TabsList><TabsTrigger value="all">الكل</TabsTrigger><TabsTrigger value="customers">العملاء</TabsTrigger><TabsTrigger value="suppliers">الموردون</TabsTrigger></TabsList>
                
                <TabsContent value="all">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <Button className="bg-gradient-to-r from-[#005f73] to-[#0a9396]"><Plus className="ml-2 h-4 w-4" />طرف جديد</Button>
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
                                  {party.balance >= 0 ? '' : '-'}{Math.abs(party.balance).toLocaleString()} ر.س
                                </span>
                              </div>
                              <div className="flex items-center gap-1 mt-3">
                                <Button variant="ghost" size="sm" title="عرض"><Eye className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="sm" title="تعديل"><Edit2 className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="sm" title="كشف حساب"><Receipt className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="sm" title="حذف"><Trash2 className="w-4 h-4 text-red-600" /></Button>
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
                <Card className="border-r-4 border-r-green-500"><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"><TrendingUp className="w-6 h-6 text-green-600" /></div><div><p className="text-sm text-gray-500">الإيرادات</p><p className="text-xl font-bold text-green-600">21,500 ر.س</p></div></div></CardContent></Card>
                <Card className="border-r-4 border-r-red-500"><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"><TrendingDown className="w-6 h-6 text-red-600" /></div><div><p className="text-sm text-gray-500">المصروفات</p><p className="text-xl font-bold text-red-600">7,000 ر.س</p></div></div></CardContent></Card>
                <Card className="border-r-4 border-r-blue-500"><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><Wallet className="w-6 h-6 text-blue-600" /></div><div><p className="text-sm text-gray-500">الرصيد</p><p className="text-xl font-bold text-blue-600">14,500 ر.س</p></div></div></CardContent></Card>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Button className="bg-green-500 hover:bg-green-600"><Plus className="ml-2 h-4 w-4" />إيراد جديد</Button>
                      <Button className="bg-red-500 hover:bg-red-600"><Plus className="ml-2 h-4 w-4" />مصروف جديد</Button>
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
                              {trans.type === 'income' ? '+' : '-'}{trans.amount.toLocaleString()} ر.س
                            </td>
                            <td className="p-3">
                              <Badge className={trans.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {trans.type === 'income' ? 'إيراد' : 'مصروف'}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" title="عرض"><Eye className="w-4 h-4 text-blue-600" /></Button>
                                <Button variant="ghost" size="icon" title="تعديل"><Edit2 className="w-4 h-4 text-purple-600" /></Button>
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
            </div>
          )}

          {/* ============ CHART OF ACCOUNTS MODULE ============ */}
          {activeModule === 'accounts' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><BookOpen className="w-6 h-6 text-blue-600" /></div><div><p className="text-sm text-gray-500">إجمالي الحسابات</p><p className="text-xl font-bold text-blue-600">{mockAccounts.length}</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"><TrendingUp className="w-6 h-6 text-green-600" /></div><div><p className="text-sm text-gray-500">الأصول</p><p className="text-xl font-bold text-green-600">150,000 ر.س</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"><TrendingDown className="w-6 h-6 text-red-600" /></div><div><p className="text-sm text-gray-500">الخصوم</p><p className="text-xl font-bold text-red-600">75,000 ر.س</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center"><DollarSign className="w-6 h-6 text-purple-600" /></div><div><p className="text-sm text-gray-500">حقوق الملكية</p><p className="text-xl font-bold text-purple-600">100,000 ر.س</p></div></div></CardContent></Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Account Tree */}
                <Card className="lg:col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>شجرة الحسابات</CardTitle>
                    <Button className="bg-gradient-to-r from-[#005f73] to-[#0a9396]"><Plus className="ml-2 h-4 w-4" />حساب جديد</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {mockAccounts.filter(a => a.parentId === null).map(account => (
                        <div key={account.id} className="border rounded-lg">
                          <div className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100">
                            <div className="flex items-center gap-3">
                              <ChevronLeft className="w-4 h-4" />
                              <span className="font-mono text-sm text-gray-500">{account.code}</span>
                              <span className="font-medium">{account.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{account.balance.toLocaleString()} ر.س</span>
                              <Badge className={
                                account.type === 'asset' ? 'bg-blue-100 text-blue-800' :
                                account.type === 'liability' ? 'bg-red-100 text-red-800' :
                                account.type === 'equity' ? 'bg-purple-100 text-purple-800' :
                                account.type === 'revenue' ? 'bg-green-100 text-green-800' :
                                'bg-orange-100 text-orange-800'
                              }>
                                {account.type === 'asset' ? 'أصل' : account.type === 'liability' ? 'خصم' : account.type === 'equity' ? 'ملكية' : account.type === 'revenue' ? 'إيراد' : 'مصروف'}
                              </Badge>
                              <Button variant="ghost" size="icon" title="تعديل"><Edit2 className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="icon" title="حذف"><Trash2 className="w-4 h-4 text-red-600" /></Button>
                            </div>
                          </div>
                          {/* Sub Accounts */}
                          {mockAccounts.filter(sub => sub.parentId === account.id).map(sub => (
                            <div key={sub.id} className="flex items-center justify-between p-3 pr-10 border-t hover:bg-gray-50">
                              <div className="flex items-center gap-3">
                                <GitBranch className="w-4 h-4 text-gray-400" />
                                <span className="font-mono text-sm text-gray-500">{sub.code}</span>
                                <span>{sub.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold">{sub.balance.toLocaleString()} ر.س</span>
                                <Button variant="ghost" size="icon" title="تعديل"><Edit2 className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" title="حذف"><Trash2 className="w-4 h-4 text-red-600" /></Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Journal Entry Form */}
                <Card>
                  <CardHeader><CardTitle>قيود محاسبية</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full bg-gradient-to-r from-[#005f73] to-[#0a9396]"><Plus className="ml-2 h-4 w-4" />قيده جديد</Button>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">آخر القيود</h4>
                      {[1, 2, 3].map(i => (
                        <div key={i} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-sm">JE-{String(i).padStart(3, '0')}</span>
                            <span className="text-xs text-gray-500">2024-01-{15 + i}</span>
                          </div>
                          <p className="text-sm text-gray-600">قيود يومية - مبيعات نقدية</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-green-600">مدين: 5,000</span>
                            <span className="text-sm text-red-600">دائن: 5,000</span>
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            <Button variant="ghost" size="sm" title="عرض"><Eye className="w-3 h-3" /></Button>
                            <Button variant="ghost" size="sm" title="طباعة"><Printer className="w-3 h-3" /></Button>
                            <Button variant="ghost" size="sm" title="حذف"><Trash2 className="w-3 h-3 text-red-600" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* ============ BANKS MODULE ============ */}
          {activeModule === 'banks' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><Landmark className="w-6 h-6 text-blue-600" /></div><div><p className="text-sm text-gray-500">إجمالي الحسابات البنكية</p><p className="text-xl font-bold text-blue-600">125,000 ر.س</p></div></div></CardContent></Card>
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
                                <td className="p-3 font-bold">{check.amount.toLocaleString()} ر.س</td>
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
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center"><HandCoins className="w-6 h-6 text-yellow-600" /></div><div><p className="text-sm text-gray-500">إجمالي الرواتب</p><p className="text-xl font-bold text-yellow-600">{mockEmployees.reduce((sum, e) => sum + e.salary, 0).toLocaleString()} ر.س</p></div></div></CardContent></Card>
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
                                <td className="p-3 font-bold">{emp.salary.toLocaleString()} ر.س</td>
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
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"><Receipt className="w-6 h-6 text-red-600" /></div><div><p className="text-sm text-gray-500">إجمالي المصروفات</p><p className="text-xl font-bold text-red-600">26,000 ر.س</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center"><Repeat className="w-6 h-6 text-orange-600" /></div><div><p className="text-sm text-gray-500">مصروفات ثابتة</p><p className="text-xl font-bold text-orange-600">24,000 ر.س</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><Activity className="w-6 h-6 text-blue-600" /></div><div><p className="text-sm text-gray-500">مصروفات متغيرة</p><p className="text-xl font-bold text-blue-600">2,000 ر.س</p></div></div></CardContent></Card>
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
                            <td className="p-3 font-bold text-red-600">{exp.amount.toLocaleString()} ر.س</td>
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

          {/* ============ REPORTS MODULE ============ */}
          {activeModule === 'reports' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: BarChart3, title: 'قائمة الدخل', desc: 'الإيرادات والمصروفات وصافي الربح', color: 'green' },
                  { icon: PieChart, title: 'الميزانية العمومية', desc: 'الأصول والخصوم وحقوق الملكية', color: 'blue' },
                  { icon: LineChart, title: 'التدفقات النقدية', desc: 'مصادر واستخدامات النقدية', color: 'purple' },
                  { icon: FileBarChart, title: 'ميزان المراجعة', desc: 'أرصدة جميع الحسابات', color: 'orange' },
                  { icon: BookOpen, title: 'الأستاذ العام', desc: 'تفصيل حركات كل حساب', color: 'pink' },
                  { icon: ClipboardList, title: 'تقرير العمر', desc: 'أرصدة العملاء والموردين', color: 'cyan' }
                ].map((report, idx) => (
                  <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 bg-${report.color}-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <report.icon className={`w-7 h-7 text-${report.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{report.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{report.desc}</p>
                          <div className="flex items-center gap-2 mt-4">
                            <Button size="sm" variant="outline" className="text-xs"><Eye className="ml-1 h-3 w-3" />عرض</Button>
                            <Button size="sm" variant="outline" className="text-xs"><Printer className="ml-1 h-3 w-3" />طباعة</Button>
                            <Button size="sm" variant="outline" className="text-xs"><Download className="ml-1 h-3 w-3" />تصدير</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader><CardTitle>إعدادات التقرير</CardHeader></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div><Label>من تاريخ</Label><Input type="date" className="mt-1" /></div>
                    <div><Label>إلى تاريخ</Label><Input type="date" className="mt-1" /></div>
                    <div><Label>نوع التقرير</Label><Select><SelectTrigger className="mt-1"><SelectValue placeholder="اختر النوع" /></SelectTrigger><SelectContent><SelectItem value="detailed">تفصيلي</SelectItem><SelectItem value="summary">ملخص</SelectItem></SelectContent></Select></div>
                    <div className="flex items-end"><Button className="w-full bg-gradient-to-r from-[#005f73] to-[#0a9396]"><BarChart3 className="ml-2 h-4 w-4" />عرض التقرير</Button></div>
                  </div>
                </CardContent>
              </Card>
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
                        <div><Label>اللغة</Label><Select><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ar">العربية</SelectItem><SelectItem value="en">English</SelectItem></SelectContent></Select></div>
                        <div><Label>العملة</Label><Select><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="sar">ريال سعودي</SelectItem><SelectItem value="aed">درهم إماراتي</SelectItem><SelectItem value="egp">جنيه مصري</SelectItem></SelectContent></Select></div>
                        <div><Label>السنة المالية</Label><Input type="number" className="mt-1" defaultValue="2024" /></div>
                        <div><Label>بداية السنة</Label><Input type="month" className="mt-1" defaultValue="2024-01" /></div>
                      </div>
                      <Button className="bg-gradient-to-r from-[#005f73] to-[#0a9396]"><Save className="ml-2 h-4 w-4" />حفظ الإعدادات</Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="company">
                  <Card>
                    <CardHeader><CardTitle>بيانات الشركة</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div><Label>اسم الشركة</Label><Input className="mt-1" defaultValue="شركة إنجاز للحلول المحاسبية" /></div>
                        <div><Label>الاسم بالإنجليزية</Label><Input className="mt-1" defaultValue="Injaz Accounting Solutions" dir="ltr" /></div>
                        <div><Label>السجل التجاري</Label><Input className="mt-1" defaultValue="1010123456" /></div>
                        <div><Label>الضريبة</Label><Input className="mt-1" defaultValue="300123456789003" /></div>
                        <div className="col-span-2"><Label>العنوان</Label><Textarea className="mt-1" defaultValue="الرياض، المملكة العربية السعودية" /></div>
                        <div><Label>الهاتف</Label><Input className="mt-1" defaultValue="+966501234567" /></div>
                        <div><Label>البريد الإلكتروني</Label><Input className="mt-1" defaultValue="info@injaz-sa.com" /></div>
                      </div>
                      <Button className="bg-gradient-to-r from-[#005f73] to-[#0a9396]"><Save className="ml-2 h-4 w-4" />حفظ البيانات</Button>
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

      {/* ============ INVOICE DIALOG (COMPLETE FORM) ============ */}
      <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingInvoice ? 'تعديل فاتورة' : 'فاتورة مبيعات جديدة'}</DialogTitle>
            <DialogDescription>أدخل تفاصيل الفاتورة بشكل كامل</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Customer & Date Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>العميل <span className="text-red-500">*</span></Label>
                <Select value={invoiceForm.customerId} onValueChange={(value) => setInvoiceForm(prev => ({ ...prev, customerId: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="اختر العميل" />
                  </SelectTrigger>
                  <SelectContent>
                    {parties.filter(p => p.type === 'customer' || p.type === 'both').map(party => (
                      <SelectItem key={party.id} value={party.id}>{party.nameAr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>التاريخ <span className="text-red-500">*</span></Label>
                <Input 
                  type="date" 
                  className="mt-1"
                  value={invoiceForm.date}
                  onChange={(e) => setInvoiceForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>

            {/* Items Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-semibold">بنود الفاتورة</Label>
                <Button type="button" variant="outline" size="sm" onClick={addInvoiceItem}>
                  <Plus className="ml-2 h-4 w-4" />إضافة بند
                </Button>
              </div>
              
              {invoiceForm.items.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                  <Package className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">لم يتم إضافة أي بنود بعد</p>
                  <Button type="button" variant="outline" className="mt-3" onClick={addInvoiceItem}>
                    <Plus className="ml-2 h-4 w-4" />أضف أول بند
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-right p-2 font-medium">الصنف</th>
                        <th className="text-right p-2 font-medium">الكمية</th>
                        <th className="text-right p-2 font-medium">السعر</th>
                        <th className="text-right p-2 font-medium">الخصم</th>
                        <th className="text-right p-2 font-medium">الإجمالي</th>
                        <th className="text-right p-2 font-medium">حذف</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceForm.items.map((item, idx) => {
                        const selectedItem = items.find(i => i.id === item.itemId)
                        const lineTotal = item.quantity * item.price - item.discount
                        return (
                          <tr key={idx} className="border-b">
                            <td className="p-2">
                              <Select value={item.itemId} onValueChange={(value) => {
                                updateInvoiceItem(idx, 'itemId', value)
                                const selected = items.find(i => i.id === value)
                                if (selected) {
                                  updateInvoiceItem(idx, 'price', selected.price)
                                }
                              }}>
                                <SelectTrigger className="w-40">
                                  <SelectValue placeholder="اختر الصنف" />
                                </SelectTrigger>
                                <SelectContent>
                                  {items.map(itemOption => (
                                    <SelectItem key={itemOption.id} value={itemOption.id}>
                                      {itemOption.nameAr}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="p-2">
                              <Input 
                                type="number" 
                                min="1"
                                className="w-20"
                                value={item.quantity}
                                onChange={(e) => updateInvoiceItem(idx, 'quantity', parseInt(e.target.value) || 0)}
                              />
                            </td>
                            <td className="p-2">
                              <Input 
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-28"
                                value={item.price}
                                onChange={(e) => updateInvoiceItem(idx, 'price', parseFloat(e.target.value) || 0)}
                              />
                            </td>
                            <td className="p-2">
                              <Input 
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-24"
                                value={item.discount}
                                onChange={(e) => updateInvoiceItem(idx, 'discount', parseFloat(e.target.value) || 0)}
                              />
                            </td>
                            <td className="p-2 font-bold">
                              {lineTotal.toLocaleString()} ر.س
                            </td>
                            <td className="p-2">
                              <Button 
                                type="button"
                                variant="ghost" 
                                size="icon"
                                onClick={() => removeInvoiceItem(idx)}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Totals Section */}
            {invoiceForm.items.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>المجموع الفرعي:</span>
                  <span className="font-medium">{getInvoiceSubtotal().toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>الخصم:</span>
                  <span className="font-medium text-red-600">-{getInvoiceDiscount().toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>الضريبة (15%):</span>
                  <span className="font-medium">{(getInvoiceTotal() * 0.15).toLocaleString()} ر.س</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>الإجمالي الكلي:</span>
                  <span className="text-[#005f73]">{(getInvoiceTotal() * 1.15).toLocaleString()} ر.س</span>
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <Label>ملاحظات</Label>
              <Textarea 
                className="mt-1"
                placeholder="أضف ملاحظات على الفاتورة..."
                value={invoiceForm.notes}
                onChange={(e) => setInvoiceForm(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setShowInvoiceDialog(false)}>
                إلغاء
              </Button>
              <div className="flex items-center gap-2">
                {editingInvoice && (
                  <Button variant="outline" onClick={() => printInvoice(editingInvoice)}>
                    <Printer className="ml-2 h-4 w-4" />طباعة
                  </Button>
                )}
                <Button 
                  className="bg-gradient-to-r from-[#005f73] to-[#0a9396]"
                  onClick={saveInvoice}
                  disabled={!invoiceForm.customerId || invoiceForm.items.length === 0}
                >
                  <Save className="ml-2 h-4 w-4" />
                  {editingInvoice ? 'تحديث الفاتورة' : 'حفظ الفاتورة'}
                </Button>
              </div>
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
