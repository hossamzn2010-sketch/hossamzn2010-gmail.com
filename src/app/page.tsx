'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { 
  LayoutDashboard, ShoppingCart, Package, Users, Wallet, FileText, Settings,
  Menu, X, Plus, Search, Filter, Download, Printer, Eye, Edit2, Trash2,
  TrendingUp, TrendingDown, DollarSign, AlertCircle, CheckCircle, Clock,
  ArrowUpRight, ArrowDownLeft, Receipt, Send, BarChart3, PieChart as PieChartIcon,
  ChevronDown, ChevronLeft, RefreshCw, Save, XCircle, Calendar, Building2,
  Phone, Mail, MapPin, Hash, Percent, CreditCard, Banknote, Calculator
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

// ==================== Types ====================
type ModuleType = 'dashboard' | 'sales' | 'purchases' | 'inventory' | 'parties' | 'treasury' | 'reports' | 'settings'

interface Invoice {
  id: string
  invoiceNumber: string
  type: 'sale' | 'purchase' | 'sale_return' | 'purchase_return'
  partyName: string
  date: string
  total: number
  paidAmount: number
  remainingAmount: number
  status: 'draft' | 'confirmed' | 'cancelled'
  paymentStatus: 'unpaid' | 'partial' | 'paid'
}

interface Item {
  id: string
  code: string
  name: string
  nameAr: string
  category: string
  unit: string
  costPrice: number
  salePrice: number
  quantity: number
  minStock: number
}

interface Party {
  id: string
  type: 'customer' | 'supplier' | 'both'
  name: string
  nameAr: string
  phone: string
  email: string
  balance: number
}

interface Transaction {
  id: string
  type: 'income' | 'expense' | 'payment_received' | 'payment_sent'
  category: string
  amount: number
  date: string
  description: string
  partyName?: string
}

// ==================== Mock Data ====================
const mockInvoices: Invoice[] = [
  { id: '1', invoiceNumber: 'INV-2024-001', type: 'sale', partyName: 'شركة النور للتجارة', date: '2024-01-15', total: 15000, paidAmount: 10000, remainingAmount: 5000, status: 'confirmed', paymentStatus: 'partial' },
  { id: '2', invoiceNumber: 'INV-2024-002', type: 'sale', partyName: 'مؤسسة الأمل', date: '2024-01-14', total: 8500, paidAmount: 8500, remainingAmount: 0, status: 'confirmed', paymentStatus: 'paid' },
  { id: '3', invoiceNumber: 'PUR-2024-001', type: 'purchase', partyName: 'مورد الخير', date: '2024-01-13', total: 25000, paidAmount: 25000, remainingAmount: 0, status: 'confirmed', paymentStatus: 'paid' },
  { id: '4', invoiceNumber: 'INV-2024-003', type: 'sale', partyName: 'محلات السعادة', date: '2024-01-12', total: 4200, paidAmount: 0, remainingAmount: 4200, status: 'draft', paymentStatus: 'unpaid' },
  { id: '5', invoiceNumber: 'INV-2024-004', type: 'sale_return', partyName: 'شركة النور للتجارة', date: '2024-01-11', total: 2000, paidAmount: 2000, remainingAmount: 0, status: 'confirmed', paymentStatus: 'paid' },
]

const mockItems: Item[] = [
  { id: '1', code: 'ITM-001', name: 'Laptop Dell', nameAr: 'لابتوب ديل', category: 'إلكترونيات', unit: 'قطعة', costPrice: 12000, salePrice: 14500, quantity: 25, minStock: 5 },
  { id: '2', code: 'ITM-002', name: 'Mouse Wireless', nameAr: 'ماوس لاسلكي', category: 'إكسسوارات', unit: 'قطعة', costPrice: 80, salePrice: 150, quantity: 150, minStock: 20 },
  { id: '3', code: 'ITM-003', name: 'Keyboard Mechanical', nameAr: 'كيبورد ميكانيكي', category: 'إكسسوارات', unit: 'قطعة', costPrice: 250, salePrice: 400, quantity: 45, minStock: 10 },
  { id: '4', code: 'ITM-004', name: 'Monitor 27"', nameAr: 'شاشة 27 بوصة', category: 'إلكترونيات', unit: 'قطعة', costPrice: 3500, salePrice: 4500, quantity: 12, minStock: 3 },
  { id: '5', code: 'ITM-005', name: 'USB Cable', nameAr: 'كابل USB', category: 'إكسسوارات', unit: 'قطعة', costPrice: 15, salePrice: 35, quantity: 300, minStock: 50 },
]

const mockParties: Party[] = [
  { id: '1', type: 'customer', name: 'Al-Nour Trading Co.', nameAr: 'شركة النور للتجارة', phone: '+966501234567', email: 'info@alnour.com', balance: 5000 },
  { id: '2', type: 'supplier', name: 'Al-Khair Supplier', nameAr: 'مورد الخير', phone: '+966509876543', email: 'supply@alkhair.com', balance: -8000 },
  { id: '3', type: 'customer', name: 'Al-Amal Establishment', nameAr: 'مؤسسة الأمل', phone: '+966501112233', email: 'amal@est.com', balance: 0 },
  { id: '4', type: 'both', name: 'Al-Saada Stores', nameAr: 'محلات السعادة', phone: '+966504445566', email: 'saada@store.com', balance: 4200 },
  { id: '5', type: 'supplier', name: 'Tech Wholesale', nameAr: 'تقنية الجملة', phone: '+966506677889', email: 'sales@techwh.com', balance: -15000 },
]

const mockTransactions: Transaction[] = [
  { id: '1', type: 'income', category: 'مبيعات', amount: 15000, date: '2024-01-15', description: 'تحصيل فاتورة مبيعات INV-2024-001', partyName: 'شركة النور للتجارة' },
  { id: '2', type: 'expense', category: 'مشتريات', amount: 25000, date: '2024-01-13', description: 'دفع فاتورة مشتريات PUR-2024-001', partyName: 'مورد الخير' },
  { id: '3', type: 'payment_received', category: 'تحصيل', amount: 8500, date: '2024-01-14', description: 'تحصيل كامل الفاتورة', partyName: 'مؤسسة الأمل' },
  { id: '4', type: 'expense', category: 'رواتب', amount: 18000, date: '2024-01-10', description: 'رواتب شهر يناير' },
  { id: '5', type: 'income', category: 'أخرى', amount: 2000, date: '2024-01-11', description: 'مرتجع مبيعات - شركة النور' },
]

// ==================== Sidebar Component ====================
const Sidebar: React.FC<{
  activeModule: ModuleType
  setActiveModule: (module: ModuleType) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}> = ({ activeModule, setActiveModule, isOpen, setIsOpen }) => {
  
  const menuItems: { id: ModuleType; icon: React.ReactNode; label: string; labelAr: string }[] = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard', labelAr: 'لوحة التحكم' },
    { id: 'sales', icon: <ShoppingCart size={20} />, label: 'Sales', labelAr: 'المبيعات' },
    { id: 'purchases', icon: <Package size={20} />, label: 'Purchases', labelAr: 'المشتريات' },
    { id: 'inventory', icon: <Package size={20} />, label: 'Inventory', labelAr: 'المخزون' },
    { id: 'parties', icon: <Users size={20} />, label: 'Parties', labelAr: 'الأطراف' },
    { id: 'treasury', icon: <Wallet size={20} />, label: 'Treasury', labelAr: 'الخزينة' },
    { id: 'reports', icon: <BarChart3 size={20} />, label: 'Reports', labelAr: 'التقارير' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings', labelAr: 'الإعدادات' },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 z-50 h-full w-72 bg-gradient-to-b from-[#005f73] to-[#0a9396] text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0`}>
        {/* Logo Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Wallet className="text-[#005f73]" size={28} />
              </div>
              <div>
                <h1 className="text-xl font-bold">Accounting Pro</h1>
                <p className="text-xs text-white/70">نظام المحاسبة الاحترافي</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-white hover:bg-white/20"
              onClick={() => setIsOpen(false)}
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveModule(item.id)
                setIsOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeModule === item.id 
                  ? 'bg-white text-[#005f73] shadow-lg scale-[1.02]' 
                  : 'text-white hover:bg-white/10 hover:translate-x-1'
              }`}
            >
              <span className={`${activeModule === item.id ? 'text-[#005f73]' : 'text-white/80 group-hover:text-white'}`}>
                {item.icon}
              </span>
              <div className="text-right flex-1">
                <span className="block font-semibold text-sm">{item.labelAr}</span>
                <span className={`block text-xs ${activeModule === item.id ? 'text-[#005f73]/70' : 'text-white/60'}`}>{item.label}</span>
              </div>
              {activeModule === item.id && (
                <ChevronDown size={16} className="rotate-[-90deg] text-[#005f73]" />
              )}
            </button>
          ))}
        </nav>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-xs text-white/70 mb-1">الإصدار 1.0.0</p>
            <p className="text-xs text-white/50">© 2024 Accounting Pro</p>
          </div>
        </div>
      </aside>
    </>
  )
}

// ==================== Dashboard Module ====================
const Dashboard: React.FC = () => {
  const kpis = [
    { title: 'إجمالي المبيعات', titleEn: 'Total Sales', value: '127,500 ر.س', change: '+12.5%', trend: 'up', icon: <TrendingUp size={24} />, color: 'from-emerald-500 to-green-600' },
    { title: 'إجمالي المشتريات', titleEn: 'Total Purchases', value: '85,000 ر.س', change: '-3.2%', trend: 'down', icon: <TrendingDown size={24} />, color: 'from-orange-500 to-red-600' },
    { title: 'صافي الربح', titleEn: 'Net Profit', value: '42,500 ر.س', change: '+8.7%', trend: 'up', icon: <DollarSign size={24} />, color: 'from-blue-500 to-indigo-600' },
    { title: 'الفواتير المستحقة', titleEn: 'Pending Invoices', value: '9,200 ر.س', change: '+2', trend: 'up', icon: <Clock size={24} />, color: 'from-amber-500 to-yellow-600' },
  ]

  const recentInvoices = mockInvoices.slice(0, 5)
  const recentTransactions = mockTransactions.slice(0, 5)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#005f73]">لوحة التحكم</h1>
          <p className="text-gray-500 mt-1">نظرة عامة على أداء أعمالك المالية</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-[#005f73] hover:bg-[#0a9396] text-white gap-2">
            <RefreshCw size={18} />
            تحديث
          </Button>
          <Button variant="outline" className="gap-2">
            <Download size={18} />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-0">
              <div className={`bg-gradient-to-l ${kpi.color} p-6 text-white`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm opacity-90">{kpi.title}</p>
                    <p className="text-2xl font-bold mt-2">{kpi.value}</p>
                    <div className={`flex items-center gap-1 mt-2 text-sm ${kpi.trend === 'up' ? 'text-green-100' : 'text-red-100'}`}>
                      {kpi.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                      <span>{kpi.change}</span>
                      <span className="opacity-75">من الشهر الماضي</span>
                    </div>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    {kpi.icon}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart Placeholder */}
        <Card className="shadow-lg">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-[#005f73]">
              <BarChart3 size={20} />
              نظرة على المبيعات
            </CardTitle>
            <CardDescription>آخر 6 أشهر</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-64 flex items-end justify-around gap-2 px-4">
              {[65, 85, 45, 90, 70, 95].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-gradient-to-t from-[#005f73] to-[#94d2bd] rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-gray-500">
                    {['يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'][i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expense Categories */}
        <Card className="shadow-lg">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-[#005f73]">
              <PieChartIcon size={20} />
              توزيع المصروفات
            </CardTitle>
            <CardDescription>هذا الشهر</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[
                { label: 'مشتريات', percent: 45, color: '#005f73', amount: '38,250 ر.س' },
                { label: 'رواتب', percent: 30, color: '#0a9396', amount: '25,500 ر.س' },
                { label: 'إيجار', percent: 15, color: '#94d2bd', amount: '12,750 ر.س' },
                { label: 'أخرى', percent: 10, color: '#f8f9fa', amount: '8,500 ر.س' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-gray-500">{item.amount}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Invoices & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <Card className="shadow-lg">
          <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-[#005f73]">
                <Receipt size={20} />
                آخر الفواتير
              </CardTitle>
              <CardDescription>أحدث 5 فواتير</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-[#0a9396]">
              عرض الكل
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم الفاتورة</TableHead>
                  <TableHead className="text-right">الطرف</TableHead>
                  <TableHead className="text-right">المبلغ</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.partyName}</TableCell>
                    <TableCell>{invoice.total.toLocaleString()} ر.س</TableCell>
                    <TableCell>
                      <Badge variant={
                        invoice.paymentStatus === 'paid' ? 'default' :
                        invoice.paymentStatus === 'partial' ? 'secondary' : 'destructive'
                      }>
                        {invoice.paymentStatus === 'paid' ? 'مدفوعة' :
                         invoice.paymentStatus === 'partial' ? 'جزئية' : 'غير مدفوعة'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="shadow-lg">
          <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-[#005f73]">
                <Wallet size={20} />
                آخر المعاملات المالية
              </CardTitle>
              <CardDescription>أحدث 5 معاملات</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-[#0a9396]">
              عرض الكل
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${tx.type.includes('income') || tx.type === 'payment_received' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                      {tx.type.includes('income') || tx.type === 'payment_received' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{tx.description}</p>
                      <p className="text-xs text-gray-500">{tx.partyName || tx.category}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className={`font-bold ${tx.type.includes('income') || tx.type === 'payment_received' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {tx.type.includes('income') || tx.type === 'payment_received' ? '+' : '-'}{tx.amount.toLocaleString()} ر.س
                    </p>
                    <p className="text-xs text-gray-400">{tx.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ==================== Sales Module ====================
const Sales: React.FC = () => {
  const [showNewInvoice, setShowNewInvoice] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredInvoices = mockInvoices.filter(inv => {
    const matchesSearch = inv.partyName.includes(searchTerm) || inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || inv.status === filterStatus || inv.paymentStatus === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#005f73]">المبيعات</h1>
          <p className="text-gray-500 mt-1">إدارة فواتير المبيعات والمرتجعات</p>
        </div>
        <Dialog open={showNewInvoice} onOpenChange={setShowNewInvoice}>
          <DialogTrigger asChild>
            <Button className="bg-[#005f73] hover:bg-[#0a9396] text-white gap-2">
              <Plus size={18} />
              فاتورة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl text-[#005f73]">إنشاء فاتورة مبيعات جديدة</DialogTitle>
              <DialogDescription>قم بملء بيانات الفاتورة وإضافة المنتجات</DialogDescription>
            </DialogHeader>
            <InvoiceForm type="sale" onClose={() => setShowNewInvoice(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="بحث بالرقم أو اسم العميل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="paid">مدفوعة</SelectItem>
                <SelectItem value="partial">جزئية</SelectItem>
                <SelectItem value="unpaid">غير مدفوعة</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter size={18} />
              فلترة متقدمة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card className="shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#005f73] text-white hover:bg-[#005f73]">
                <TableHead className="text-white">رقم الفاتورة</TableHead>
                <TableHead className="text-white">التاريخ</TableHead>
                <TableHead className="text-white">العميل</TableHead>
                <TableHead className="text-white">الإجمالي</TableHead>
                <TableHead className="text-white">المدفوع</TableHead>
                <TableHead className="text-white">المتبقي</TableHead>
                <TableHead className="text-white">حالة الدفع</TableHead>
                <TableHead className="text-white">حالة الفاتورة</TableHead>
                <TableHead className="text-white text-center">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.filter(inv => inv.type === 'sale' || inv.type === 'sale_return').map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium font-mono">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell className="font-medium">{invoice.partyName}</TableCell>
                  <TableCell className="font-bold">{invoice.total.toLocaleString()} ر.س</TableCell>
                  <TableCell className="text-emerald-600">{invoice.paidAmount.toLocaleString()} ر.س</TableCell>
                  <TableCell className={invoice.remainingAmount > 0 ? 'text-amber-600' : ''}>
                    {invoice.remainingAmount.toLocaleString()} ر.س
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      invoice.paymentStatus === 'paid' ? 'default' :
                      invoice.paymentStatus === 'partial' ? 'secondary' : 'destructive'
                    } className={
                      invoice.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                      invoice.paymentStatus === 'partial' ? 'bg-amber-100 text-amber-700' : ''
                    }>
                      {invoice.paymentStatus === 'paid' ? '✓ مدفوعة' :
                       invoice.paymentStatus === 'partial' ? '◐ جزئية' : '✗ غير مدفوعة'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      invoice.status === 'confirmed' ? 'border-blue-500 text-blue-700' :
                      invoice.status === 'cancelled' ? 'border-red-500 text-red-700' : ''
                    }>
                      {invoice.status === 'confirmed' ? 'مؤكدة' :
                       invoice.status === 'cancelled' ? 'ملغاة' : 'مسودة'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:bg-amber-50">
                        <Edit2 size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50">
                        <Printer size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// ==================== Purchases Module ====================
const Purchases: React.FC = () => {
  const [showNewPurchase, setShowNewPurchase] = useState(false)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#005f73]">المشتريات</h1>
          <p className="text-gray-500 mt-1">إدارة فواتير المشتريات ومرتجعات المشتريات</p>
        </div>
        <Dialog open={showNewPurchase} onOpenChange={setShowNewPurchase}>
          <DialogTrigger asChild>
            <Button className="bg-[#005f73] hover:bg-[#0a9396] text-white gap-2">
              <Plus size={18} />
              فاتورة مشتريات
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl text-[#005f73]">إنشاء فاتورة مشتريات جديدة</DialogTitle>
              <DialogDescription>قم بملء بيانات فاتورة المشتريات من المورد</DialogDescription>
            </DialogHeader>
            <InvoiceForm type="purchase" onClose={() => setShowNewPurchase(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-l from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">إجمالي المشتريات</p>
                <p className="text-3xl font-bold mt-1">25,000 ر.س</p>
              </div>
              <Package size={40} className="opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-l from-emerald-500 to-emerald-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">مرتجعات المشتريات</p>
                <p className="text-3xl font-bold mt-1">0 ر.س</p>
              </div>
              <RefreshCw size={40} className="opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-l from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">عدد الموردين</p>
                <p className="text-3xl font-bold mt-1">3</p>
              </div>
              <Users size={40} className="opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purchases Table */}
      <Card className="shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#005f73] text-white hover:bg-[#005f73]">
                <TableHead className="text-white">رقم الفاتورة</TableHead>
                <TableHead className="text-white">التاريخ</TableHead>
                <TableHead className="text-white">المورد</TableHead>
                <TableHead className="text-white">الإجمالي</TableHead>
                <TableHead className="text-white">حالة الدفع</TableHead>
                <TableHead className="text-white">الحالة</TableHead>
                <TableHead className="text-white text-center">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInvoices.filter(inv => inv.type === 'purchase').map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium font-mono">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell className="font-medium">{invoice.partyName}</TableCell>
                  <TableCell className="font-bold">{invoice.total.toLocaleString()} ر.س</TableCell>
                  <TableCell>
                    <Badge variant={invoice.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                      {invoice.paymentStatus === 'paid' ? '✓ مدفوعة' : '◐ جزئية'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-blue-500 text-blue-700">
                      مؤكدة
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:bg-amber-50">
                        <Edit2 size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50">
                        <Printer size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// ==================== Invoice Form Component ====================
const InvoiceForm: React.FC<{ type: 'sale' | 'purchase'; onClose: () => void }> = ({ type, onClose }) => {
  const [items, setItems] = useState([{ itemId: '', quantity: 1, price: 0, total: 0 }])
  const [discount, setDiscount] = useState(0)
  const [tax, setTax] = useState(15)

  const addItem = () => {
    setItems([...items, { itemId: '', quantity: 1, price: 0, total: 0 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  const discountAmount = subtotal * (discount / 100)
  const taxableAmount = subtotal - discountAmount
  const taxAmount = taxableAmount * (tax / 100)
  const total = taxableAmount + taxAmount

  return (
    <div className="space-y-6 pt-4">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>رقم الفاتورة</Label>
          <Input defaultValue={type === 'sale' ? 'INV-2024-005' : 'PUR-2024-002'} className="font-mono" />
        </div>
        <div className="space-y-2">
          <Label>التاريخ</Label>
          <Input type="date" defaultValue="2024-01-16" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>{type === 'sale' ? 'العميل' : 'المورد'}</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={`اختر ${type === 'sale' ? 'العميل' : 'المورد'}`} />
            </SelectTrigger>
            <SelectContent>
              {mockParties
                .filter(p => type === 'sale' ? p.type === 'customer' || p.type === 'both' : p.type === 'supplier' || p.type === 'both')
                .map(party => (
                  <SelectItem key={party.id} value={party.id}>{party.nameAr}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>ملاحظات</Label>
          <Textarea placeholder="أضف ملاحظات إضافية..." rows={2} />
        </div>
      </div>

      <Separator />

      {/* Items Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">بنود الفاتورة</Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-1">
            <Plus size={16} />
            إضافة بند
          </Button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5 space-y-1">
                <Label className="text-xs">الصنف</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر الصنف" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockItems.map(item => (
                      <SelectItem key={item.id} value={item.id}>{item.nameAr} ({item.code})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1">
                <Label className="text-xs">الكمية</Label>
                <Input type="number" min="1" defaultValue={item.quantity} />
              </div>
              <div className="col-span-2 space-y-1">
                <Label className="text-xs">السعر</Label>
                <Input type="number" min="0" step="0.01" placeholder="0.00" />
              </div>
              <div className="col-span-2 space-y-1">
                <Label className="text-xs">الإجمالي</Label>
                <Input value="0.00" readOnly className="bg-gray-50" />
              </div>
              <div className="col-span-1">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <XCircle size={18} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Totals */}
      <div className="space-y-3">
        <div className="flex items-center justify-end gap-4">
          <Label className="w-32">الخصم (%)</Label>
          <Input 
            type="number" 
            min="0" 
            max="100" 
            value={discount} 
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="w-24"
          />
        </div>
        <div className="flex items-center justify-end gap-4">
          <Label className="w-32">الضريبة (%)</Label>
          <Input 
            type="number" 
            min="0" 
            max="100" 
            value={tax} 
            onChange={(e) => setTax(Number(e.target.value))}
            className="w-24"
          />
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>المجموع الفرعي:</span>
            <span>{subtotal.toFixed(2)} ر.س</span>
          </div>
          <div className="flex justify-between text-sm text-amber-600">
            <span>الخصم ({discount}%):</span>
            <span>-{discountAmount.toFixed(2)} ر.س</span>
          </div>
          <div className="flex justify-between text-sm text-blue-600">
            <span>الضريبة ({tax}%):</span>
            <span>+{taxAmount.toFixed(2)} ر.س</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold text-[#005f73]">
            <span>الإجمالي:</span>
            <span>{total.toFixed(2)} ر.س</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>إلغاء</Button>
        <Button variant="outline" className="gap-2">
          <Save size={18} />
          حفظ كمسودة
        </Button>
        <Button className="bg-[#005f73] hover:bg-[#0a9396] text-white gap-2">
          <CheckCircle size={18} />
          تأكيد وحفظ
        </Button>
      </div>
    </div>
  )
}

// ==================== Inventory Module ====================
const Inventory: React.FC = () => {
  const [showAddItem, setShowAddItem] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')

  const lowStockItems = mockItems.filter(item => item.quantity <= item.minStock)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#005f73]">إدارة المخزون</h1>
          <p className="text-gray-500 mt-1">إدارة الأصناف والمخازن والكميات</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
            <DialogTrigger asChild>
              <Button className="bg-[#005f73] hover:bg-[#0a9396] text-white gap-2">
                <Plus size={18} />
                صنف جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl text-[#005f73]">إضافة صنف جديد</DialogTitle>
                <DialogDescription>أدخل بيانات الصنف الجديد</DialogDescription>
              </DialogHeader>
              <ItemForm onClose={() => setShowAddItem(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="shadow-md">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Package className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">إجمالي الأصناف</p>
              <p className="text-2xl font-bold text-[#005f73]">{mockItems.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <CheckCircle className="text-emerald-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">متوفر</p>
              <p className="text-2xl font-bold text-emerald-600">{mockItems.length - lowStockItems.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <AlertCircle className="text-amber-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">مخزون منخفض</p>
              <p className="text-2xl font-bold text-amber-600">{lowStockItems.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Building2 className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">المخازن</p>
              <p className="text-2xl font-bold text-purple-600">1</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-amber-600" size={24} />
              <div>
                <p className="font-semibold text-amber-800">تنبيه: أصناف بمخزون منخفض</p>
                <p className="text-sm text-amber-700">
                  لديك {lowStockItems.length} أصناف وصلت للحد الأدنى أو أقل: {lowStockItems.map(i => i.nameAr).join('، ')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Toggle & Search */}
      <Card className="shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input placeholder="بحث بالاسم أو الكود..." className="pr-10" />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
                className={viewMode === 'table' ? 'bg-[#005f73]' : ''}
              >
                جدول
              </Button>
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-[#005f73]' : ''}
              >
                شبكة
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Display */}
      {viewMode === 'table' ? (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#005f73] text-white hover:bg-[#005f73]">
                  <TableHead className="text-white">الكود</TableHead>
                  <TableHead className="text-white">اسم الصنف</TableHead>
                  <TableHead className="text-white">الفئة</TableHead>
                  <TableHead className="text-white">الوحدة</TableHead>
                  <TableHead className="text-white">سعر الشراء</TableHead>
                  <TableHead className="text-white">سعر البيع</TableHead>
                  <TableHead className="text-white">الكمية</TableHead>
                  <TableHead className="text-white">الحد الأدنى</TableHead>
                  <TableHead className="text-center text-white">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-mono font-medium">{item.code}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.nameAr}</p>
                        <p className="text-xs text-gray-500">{item.name}</p>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.costPrice.toLocaleString()} ر.س</TableCell>
                    <TableCell className="font-medium text-emerald-600">{item.salePrice.toLocaleString()} ر.س</TableCell>
                    <TableCell>
                      <span className={`font-bold ${item.quantity <= item.minStock ? 'text-red-600' : 'text-[#005f73]'}`}>
                        {item.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-500">{item.minStock}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:bg-amber-50">
                          <Edit2 size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mockItems.map((item) => (
            <Card key={item.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-[#005f73]/10 rounded-lg">
                    <Package className="text-[#005f73]" size={24} />
                  </div>
                  <Badge variant={item.quantity <= item.minStock ? 'destructive' : 'secondary'}>
                    {item.quantity <= item.minStock ? 'منخفض' : 'متوفر'}
                  </Badge>
                </div>
                <h3 className="font-bold text-[#005f73]">{item.nameAr}</h3>
                <p className="text-sm text-gray-500 mb-2">{item.name}</p>
                <p className="text-xs font-mono text-gray-400 mb-3">{item.code}</p>
                
                <Separator className="my-3" />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">الكمية:</span>
                    <span className={`font-bold ${item.quantity <= item.minStock ? 'text-red-600' : ''}`}>{item.quantity} {item.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">سعر البيع:</span>
                    <span className="font-medium text-emerald-600">{item.salePrice.toLocaleString()} ر.س</span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit2 size={14} className="ml-1" />
                    تعديل
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:bg-red-50">
                    <Trash2 size={14} className="ml-1" />
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ==================== Item Form Component ====================
const ItemForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="space-y-4 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>كود الصنف *</Label>
          <Input placeholder="مثال: ITM-006" className="font-mono" dir="ltr" />
        </div>
        <div className="space-y-2">
          <Label>اسم الصنف (عربي) *</Label>
          <Input placeholder="اسم الصنف بالعربية" />
        </div>
        <div className="space-y-2">
          <Label>اسم الصنف (إنجليزي)</Label>
          <Input placeholder="Item name in English" dir="ltr" />
        </div>
        <div className="space-y-2">
          <Label>الباركود</Label>
          <Input placeholder="اختياري" className="font-mono" dir="ltr" />
        </div>
        <div className="space-y-2">
          <Label>الفئة *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="اختر الفئة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electronics">إلكترونيات</SelectItem>
              <SelectItem value="accessories">إكسسوارات</SelectItem>
              <SelectItem value="other">أخرى</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>الوحدة *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="اختر الوحدة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="piece">قطعة</SelectItem>
              <SelectItem value="kg">كيلوجرام</SelectItem>
              <SelectItem value="box">علبة</SelectItem>
              <SelectItem value="meter">متر</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>المخزن *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="اختر المخزن" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main">المخزن الرئيسي</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>سعر الشراء *</Label>
          <Input type="number" min="0" step="0.01" placeholder="0.00" dir="ltr" />
        </div>
        <div className="space-y-2">
          <Label>سعر البيع *</Label>
          <Input type="number" min="0" step="0.01" placeholder="0.00" dir="ltr" />
        </div>
        <div className="space-y-2">
          <Label>الحد الأدنى للمخزون</Label>
          <Input type="number" min="0" placeholder="0" />
        </div>
        <div className="space-y-2">
          <Label>الحد الأقصى للمخزون</Label>
          <Input type="number" min="0" placeholder="0" />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label>الوصف</Label>
          <Textarea placeholder="وصف الصنف..." rows={2} />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>إلغاء</Button>
        <Button className="bg-[#005f73] hover:bg-[#0a9396] text-white gap-2">
          <CheckCircle size={18} />
          حفظ الصنف
        </Button>
      </div>
    </div>
  )
}

// ==================== Parties Module ====================
const Parties: React.FC = () => {
  const [showAddParty, setShowAddParty] = useState(false)
  const [partyType, setPartyType] = useState<'all' | 'customer' | 'supplier'>('all')

  const filteredParties = partyType === 'all' 
    ? mockParties 
    : mockParties.filter(p => p.type === partyType || p.type === 'both')

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#005f73]">إدارة الأطراف</h1>
          <p className="text-gray-500 mt-1">إدارة العملاء والموردين</p>
        </div>
        <Dialog open={showAddParty} onOpenChange={setShowAddParty}>
          <DialogTrigger asChild>
            <Button className="bg-[#005f73] hover:bg-[#0a9396] text-white gap-2">
              <Plus size={18} />
              طرف جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl text-[#005f73]">إضافة طرف جديد</DialogTitle>
              <DialogDescription>أدخل بيانات العميل أو المورد</DialogDescription>
            </DialogHeader>
            <PartyForm onClose={() => setShowAddParty(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Type Filter Tabs */}
      <Tabs value={partyType} onValueChange={(v) => setPartyType(v as typeof partyType)}>
        <TabsList className="bg-[#005f73]/10">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#005f73] data-[state=active]:text-white">
            <Users size={16} className="ml-2" />
            الكل ({mockParties.length})
          </TabsTrigger>
          <TabsTrigger value="customer" className="data-[state=active]:bg-[#005f73] data-[state=active]:text-white">
            <ShoppingCart size={16} className="ml-2" />
            العملاء ({mockParties.filter(p => p.type === 'customer' || p.type === 'both').length})
          </TabsTrigger>
          <TabsTrigger value="supplier" className="data-[state=active]:bg-[#005f73] data-[state=active]:text-white">
            <Package size={16} className="ml-2" />
            الموردون ({mockParties.filter(p => p.type === 'supplier' || p.type === 'both').length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Parties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredParties.map((party) => (
          <Card key={party.id} className="shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className={`h-2 ${
              party.type === 'customer' ? 'bg-blue-500' :
              party.type === 'supplier' ? 'bg-emerald-500' : 'bg-purple-500'
            }`} />
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    party.type === 'customer' ? 'bg-blue-500' :
                    party.type === 'supplier' ? 'bg-emerald-500' : 'bg-purple-500'
                  }`}>
                    {party.nameAr.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#005f73]">{party.nameAr}</h3>
                    <p className="text-sm text-gray-500">{party.name}</p>
                  </div>
                </div>
                <Badge variant="outline" className={
                  party.type === 'customer' ? 'border-blue-500 text-blue-700' :
                  party.type === 'supplier' ? 'border-emerald-500 text-emerald-700' : 'border-purple-500 text-purple-700'
                }>
                  {party.type === 'customer' ? 'عميل' : party.type === 'supplier' ? 'مورد' : 'كلاهما'}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={14} />
                  <span dir="ltr">{party.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={14} />
                  <span dir="ltr">{party.email}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">الرصيد الحالي</p>
                  <p className={`font-bold text-lg ${
                    party.balance > 0 ? 'text-emerald-600' :
                    party.balance < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {party.balance > 0 ? '+' : ''}{party.balance.toLocaleString()} ر.س
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                    <Eye size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:bg-amber-50">
                    <Edit2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ==================== Party Form Component ====================
const PartyForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="space-y-4 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 space-y-2">
          <Label>نوع الطرف *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="اختر النوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer">عميل</SelectItem>
              <SelectItem value="supplier">مورد</SelectItem>
              <SelectItem value="both">عميل ومورد</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>الاسم (عربي) *</Label>
          <Input placeholder="الاسم بالعربية" />
        </div>
        <div className="space-y-2">
          <Label>الاسم (إنجليزي)</Label>
          <Input placeholder="Name in English" dir="ltr" />
        </div>
        <div className="space-y-2">
          <Label>الهاتف</Label>
          <Input placeholder="+9665XXXXXXXX" dir="ltr" />
        </div>
        <div className="space-y-2">
          <Label>البريد الإلكتروني</Label>
          <Input type="email" placeholder="email@example.com" dir="ltr" />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label>العنوان</Label>
          <Input placeholder="العنوان الكامل" />
        </div>
        <div className="space-y-2">
          <Label>الرقم الضريبي</Label>
          <Input placeholder="اختياري" dir="ltr" />
        </div>
        <div className="space-y-2">
          <Label>حد الائتمان</Label>
          <Input type="number" min="0" step="0.01" placeholder="0.00" dir="ltr" />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label>ملاحظات</Label>
          <Textarea placeholder="ملاحظات إضافية..." rows={2} />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>إلغاء</Button>
        <Button className="bg-[#005f73] hover:bg-[#0a9396] text-white gap-2">
          <CheckCircle size={18} />
          حفظ الطرف
        </Button>
      </div>
    </div>
  )
}

// ==================== Treasury Module ====================
const Treasury: React.FC = () => {
  const [showNewTransaction, setShowNewTransaction] = useState(false)

  const totalIncome = mockTransactions
    .filter(t => t.type === 'income' || t.type === 'payment_received')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = mockTransactions
    .filter(t => t.type === 'expense' || t.type === 'payment_sent')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#005f73]">الخزينة</h1>
          <p className="text-gray-500 mt-1">إدارة المعاملات المالية والحركات</p>
        </div>
        <Dialog open={showNewTransaction} onOpenChange={setShowNewTransaction}>
          <DialogTrigger asChild>
            <Button className="bg-[#005f73] hover:bg-[#0a9396] text-white gap-2">
              <Plus size={18} />
              معاملة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl text-[#005f73]">إضافة معاملة مالية</DialogTitle>
              <DialogDescription>سجل إيراد أو مصروف جديد</DialogDescription>
            </DialogHeader>
            <TransactionForm onClose={() => setShowNewTransaction(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-l from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">إجمالي الإيرادات</p>
                <p className="text-3xl font-bold mt-1">{totalIncome.toLocaleString()} ر.س</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <TrendingUp size={28} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-l from-red-500 to-red-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">إجمالي المصروفات</p>
                <p className="text-3xl font-bold mt-1">{totalExpense.toLocaleString()} ر.س</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <TrendingDown size={28} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`bg-gradient-to-l ${balance >= 0 ? 'from-blue-500 to-indigo-600' : 'from-orange-500 to-red-600'} text-white border-0 shadow-lg`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">الرصيد الحالي</p>
                <p className="text-3xl font-bold mt-1">{balance.toLocaleString()} ر.س</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <Wallet size={28} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card className="shadow-lg">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-[#005f73]">
            <Receipt size={20} />
            سجل المعاملات المالية
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#005f73] text-white hover:bg-[#005f73]">
                <TableHead className="text-white">#</TableHead>
                <TableHead className="text-white">التاريخ</TableHead>
                <TableHead className="text-white">النوع</TableHead>
                <TableHead className="text-white">التصنيف</TableHead>
                <TableHead className="text-white">الوصف</TableHead>
                <TableHead className="text-white">الطرف</TableHead>
                <TableHead className="text-white">المبلغ</TableHead>
                <TableHead className="text-center text-white">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((tx, index) => (
                <TableRow key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-mono">{index + 1}</TableCell>
                  <TableCell>{tx.date}</TableCell>
                  <TableCell>
                    <Badge variant={
                      tx.type === 'income' || tx.type === 'payment_received' ? 'default' : 'destructive'
                    } className={
                      tx.type === 'income' || tx.type === 'payment_received' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-red-100 text-red-700'
                    }>
                      {tx.type === 'income' ? 'إيراد' :
                       tx.type === 'expense' ? 'مصروف' :
                       tx.type === 'payment_received' ? 'تحصيل' : 'دفع'}
                    </Badge>
                  </TableCell>
                  <TableCell>{tx.category}</TableCell>
                  <TableCell className="max-w-xs truncate">{tx.description}</TableCell>
                  <TableCell>{tx.partyName || '-'}</TableCell>
                  <TableCell>
                    <span className={`font-bold ${
                      tx.type === 'income' || tx.type === 'payment_received' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {tx.type === 'income' || tx.type === 'payment_received' ? '+' : '-'}{tx.amount.toLocaleString()} ر.س
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:bg-amber-50">
                        <Edit2 size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// ==================== Transaction Form Component ====================
const TransactionForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="space-y-4 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>نوع المعاملة *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="اختر النوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">إيراد</SelectItem>
              <SelectItem value="expense">مصروف</SelectItem>
              <SelectItem value="payment_received">تحصيل</SelectItem>
              <SelectItem value="payment_sent">دفع</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>التصنيف *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="اختر التصنيف" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">مبيعات</SelectItem>
              <SelectItem value="purchases">مشتريات</SelectItem>
              <SelectItem value="salary">رواتب</SelectItem>
              <SelectItem value="rent">إيجار</SelectItem>
              <SelectItem value="utilities">مرافق</SelectItem>
              <SelectItem value="other">أخرى</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>المبلغ *</Label>
          <Input type="number" min="0" step="0.01" placeholder="0.00" dir="ltr" />
        </div>
        <div className="space-y-2">
          <Label>طريقة الدفع *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="اختر الطريقة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">نقدي</SelectItem>
              <SelectItem value="bank_transfer">تحويل بنكي</SelectItem>
              <SelectItem value="check">شيك</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>التاريخ *</Label>
          <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
        </div>
        <div className="space-y-2">
          <Label>الطرف (اختياري)</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="اختر إن وجد" />
            </SelectTrigger>
            <SelectContent>
              {mockParties.map(party => (
                <SelectItem key={party.id} value={party.id}>{party.nameAr}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label>الوصف *</Label>
          <Textarea placeholder="وصف المعاملة..." rows={3} />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>إلغاء</Button>
        <Button className="bg-[#005f73] hover:bg-[#0a9396] text-white gap-2">
          <CheckCircle size={18} />
          تسجيل المعاملة
        </Button>
      </div>
    </div>
  )
}

// ==================== Reports Module ====================
const Reports: React.FC = () => {
  const reportTypes = [
    { id: 'sales', title: 'تقرير المبيعات', titleEn: 'Sales Report', icon: <TrendingUp size={32} />, color: 'from-blue-500 to-blue-600', desc: 'تقرير شامل عن المبيعات لفترة محددة' },
    { id: 'purchases', title: 'تقرير المشتريات', titleEn: 'Purchases Report', icon: <Package size={32} />, color: 'from-emerald-500 to-emerald-600', desc: 'تقرير شامل عن المشتريات لفترة محددة' },
    { id: 'inventory', title: 'تقرير المخزون', titleEn: 'Inventory Report', icon: <Building2 size={32} />, color: 'from-purple-500 to-purple-600', desc: 'حالة المخزون الحالية والأصناف' },
    { id: 'profit_loss', title: 'تقرير الأرباح والخسائر', titleEn: 'Profit & Loss', icon: <DollarSign size={32} />, color: 'from-amber-500 to-orange-600', desc: 'تحليل الأرباح والخسائر' },
    { id: 'parties', title: 'تقرير الأطراف', titleEn: 'Parties Report', icon: <Users size={32} />, color: 'from-pink-500 to-pink-600', desc: 'كشوف حسابات العملاء والموردين' },
    { id: 'treasury', title: 'تقرير الخزينة', titleEn: 'Treasury Report', icon: <Wallet size={32} />, color: 'from-cyan-500 to-cyan-600', desc: 'حركة الخزينة والإيرادات والمصروفات' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#005f73]">التقارير</h1>
          <p className="text-gray-500 mt-1">تقارير مالية وتحليلات شاملة</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar size={18} />
            اختر الفترة
          </Button>
        </div>
      </div>

      {/* Date Range Selector */}
      <Card className="shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1">
              <Label>من تاريخ</Label>
              <Input type="date" defaultValue="2024-01-01" />
            </div>
            <div className="space-y-2 flex-1">
              <Label>إلى تاريخ</Label>
              <Input type="date" defaultValue="2024-12-31" />
            </div>
            <Button className="bg-[#005f73] hover:bg-[#0a9396] text-white gap-2">
              <Search size={18} />
              عرض التقرير
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => (
          <Card key={report.id} className="shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
            <div className={`bg-gradient-to-l ${report.color} p-6 text-white`}>
              <div className="flex items-center justify-between">
                {report.icon}
                <div className="bg-white/20 p-2 rounded-lg group-hover:scale-110 transition-transform">
                  <FileText size={20} />
                </div>
              </div>
            </div>
            <CardContent className="p-5">
              <h3 className="font-bold text-lg text-[#005f73] mb-1">{report.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{report.desc}</p>
              <Button variant="outline" className="w-full gap-2 hover:bg-[#005f73] hover:text-white transition-colors">
                <Download size={16} />
                إنشاء التقرير
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <Card className="shadow-lg">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-[#005f73]">
            <PieChartIcon size={20} />
            ملخص سريع - هذا الشهر
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">إجمالي المبيعات</p>
              <p className="text-2xl font-bold text-blue-600">127,500 ر.س</p>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">إجمالي المشتريات</p>
              <p className="text-2xl font-bold text-emerald-600">85,000 ر.س</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">صافي الربح</p>
              <p className="text-2xl font-bold text-purple-600">42,500 ر.س</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">عدد الفواتير</p>
              <p className="text-2xl font-bold text-amber-600">24</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ==================== Settings Module ====================
const SettingsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general')

  const settingsSections = [
    { id: 'general', label: 'عام', labelEn: 'General', icon: <Settings size={18} /> },
    { id: 'company', label: 'بيانات الشركة', labelEn: 'Company', icon: <Building2 size={18} /> },
    { id: 'invoice', label: 'إعدادات الفواتير', labelEn: 'Invoice', icon: <Receipt size={18} /> },
    { id: 'users', label: 'المستخدمين', labelEn: 'Users', icon: <Users size={18} /> },
    { id: 'backup', label: 'النسخ الاحتياطي', labelEn: 'Backup', icon: <RefreshCw size={18} /> },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#005f73]">الإعدادات</h1>
        <p className="text-gray-500 mt-1">إعدادات النظام والتخصيصات</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <Card className="shadow-md h-fit">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-right ${
                    activeTab === section.id 
                      ? 'bg-[#005f73] text-white shadow-md' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {section.icon}
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeTab === 'general' && (
            <Card className="shadow-lg">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-[#005f73]">الإعدادات العامة</CardTitle>
                <CardDescription>إعدادات أساسية للنظام</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>لغة الواجهة</Label>
                    <Select defaultValue="ar">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>العملة</Label>
                    <Select defaultValue="sar">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sar">ريال سعودي (ر.س)</SelectItem>
                        <SelectItem value="aed">درهم إماراتي (د.إ)</SelectItem>
                        <SelectItem value="egp">جنيه مصري (ج.م)</SelectItem>
                        <SelectItem value="usd">دولار أمريكي ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>تنسيق التاريخ</Label>
                    <Select defaultValue="dd/mm/yyyy">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/mm/yyyy">يوم/شهر/سنة</SelectItem>
                        <SelectItem value="mm/dd/yyyy">شهر/يوم/سنة</SelectItem>
                        <SelectItem value="yyyy-mm-dd">سنة-شهر-يوم</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>المنطقة الزمنية</Label>
                    <Select defaultValue="asia_riyadh">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asia_riyadh">الرياض (GMT+3)</SelectItem>
                        <SelectItem value="asia_dubai">دبي (GMT+4)</SelectItem>
                        <SelectItem value="africa_cairo">القاهرة (GMT+2)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-[#005f73]">تفضيلات العرض</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                      <span>تشغيل الإشعارات</span>
                      <input type="checkbox" defaultChecked className="h-5 w-5 accent-[#005f73]" />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                      <span>تنبيهات المخزون المنخفض</span>
                      <input type="checkbox" defaultChecked className="h-5 w-5 accent-[#005f73]" />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                      <span>الوضع الداكن</span>
                      <input type="checkbox" className="h-5 w-5 accent-[#005f73]" />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button className="bg-[#005f73] hover:bg-[#0a9396] text-white gap-2">
                    <Save size={18} />
                    حفظ الإعدادات
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'company' && (
            <Card className="shadow-lg">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-[#005f73]">بيانات الشركة</CardTitle>
                <CardDescription>معلومات الشركة التي تظهر في الفواتير</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>اسم الشركة (عربي)</Label>
                    <Input defaultValue="شركة التقنية المتقدمة" />
                  </div>
                  <div className="space-y-2">
                    <Label>اسم الشركة (إنجليزي)</Label>
                    <Input defaultValue="Advanced Tech Company" dir="ltr" />
                  </div>
                  <div className="space-y-2">
                    <Label>السجل التجاري</Label>
                    <Input defaultValue="1010XXXXX" dir="ltr" />
                  </div>
                  <div className="space-y-2">
                    <Label>الرقم الضريبي</Label>
                    <Input defaultValue="3XXXXXXXXXX" dir="ltr" />
                  </div>
                  <div className="space-y-2">
                    <Label>الهاتف</Label>
                    <Input defaultValue="+966XXXXXXXXX" dir="ltr" />
                  </div>
                  <div className="space-y-2">
                    <Label>البريد الإلكتروني</Label>
                    <Input type="email" defaultValue="info@company.com" dir="ltr" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>العنوان</Label>
                    <Input defaultValue="المملكة العربية السعودية، الرياض" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>شعار الشركة</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                        <Building2 size={32} className="text-gray-400" />
                      </div>
                      <Button variant="outline">رفع شعار</Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button className="bg-[#005f73] hover:bg-[#0a9396] text-white gap-2">
                    <Save size={18} />
                    حفظ البيانات
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'invoice' && (
            <Card className="shadow-lg">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-[#005f73]">إعدادات الفواتير</CardTitle>
                <CardDescription>تخصيص مظهر وسلوك الفواتير</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>بادئة رقم فاتورة المبيعات</Label>
                    <Input defaultValue="INV-" className="font-mono" dir="ltr" />
                  </div>
                  <div className="space-y-2">
                    <Label>بادئة رقم فاتورة المشتريات</Label>
                    <Input defaultValue="PUR-" className="font-mono" dir="ltr" />
                  </div>
                  <div className="space-y-2">
                    <Label>نسبة الضريبة الافتراضية (%)</Label>
                    <Input type="number" defaultValue="15" min="0" max="100" dir="ltr" />
                  </div>
                  <div className="space-y-2">
                    <Label>شروط الدفع الافتراضية (يوم)</Label>
                    <Input type="number" defaultValue="30" min="0" dir="ltr" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-[#005f73]">حقول الفاتورة</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                      <span>إظهار الباركود</span>
                      <input type="checkbox" defaultChecked className="h-5 w-5 accent-[#005f73]" />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                      <span>إظهار الضريبة بشكل منفصل</span>
                      <input type="checkbox" defaultChecked className="h-5 w-5 accent-[#005f73]" />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                      <span>إضافة ملاحظات أسفل الفاتورة</span>
                      <input type="checkbox" defaultChecked className="h-5 w-5 accent-[#005f73]" />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                      <span>إظهار شعار الشركة</span>
                      <input type="checkbox" defaultChecked className="h-5 w-5 accent-[#005f73]" />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button className="bg-[#005f73] hover:bg-[#0a9396] text-white gap-2">
                    <Save size={18} />
                    حفظ الإعدادات
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'users' && (
            <Card className="shadow-lg">
              <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-[#005f73]">إدارة المستخدمين</CardTitle>
                  <CardDescription>إدارة صلاحيات المستخدمين</CardDescription>
                </div>
                <Button size="sm" className="bg-[#005f73] hover:bg-[#0a9396] text-white gap-1">
                  <Plus size={16} />
                  مستخدم جديد
                </Button>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {[
                    { name: 'أحمد محمد', email: 'ahmed@company.com', role: 'مدير', roleEn: 'Admin', status: 'نشط' },
                    { name: 'سارة علي', email: 'sara@company.com', role: 'محاسب', roleEn: 'Accountant', status: 'نشط' },
                    { name: 'خالد عبدالله', email: 'khaled@company.com', role: 'مشاهد', roleEn: 'Viewer', status: 'معطل' },
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#005f73] rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-[#005f73]">{user.name}</p>
                          <p className="text-sm text-gray-500" dir="ltr">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="border-[#005f73] text-[#005f73]">
                          {user.role}
                        </Badge>
                        <Badge variant={user.status === 'نشط' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600">
                          <Edit2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'backup' && (
            <Card className="shadow-lg">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-[#005f73]">النسخ الاحتياطي</CardTitle>
                <CardDescription>إدارة نسخ البيانات الاحتياطية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-blue-600 mt-0.5" size={20} />
                    <div>
                      <p className="font-semibold text-blue-800">نسخ احتياطي تلقائي</p>
                      <p className="text-sm text-blue-700">يتم إنشاء نسخة احتياطية تلقائياً كل يوم عند الساعة 12:00 صباحاً</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-2 border-dashed border-gray-200">
                    <CardContent className="p-6 text-center">
                      <Download className="mx-auto text-[#005f73] mb-3" size={40} />
                      <h3 className="font-semibold text-[#005f73] mb-2">إنشاء نسخة احتياطية</h3>
                      <p className="text-sm text-gray-500 mb-4">تحميل نسخة كاملة من قاعدة البيانات</p>
                      <Button className="bg-[#005f73] hover:bg-[#0a9396] text-white w-full gap-2">
                        <Download size={18} />
                        تحميل الآن
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2 border-dashed border-gray-200">
                    <CardContent className="p-6 text-center">
                      <RefreshCw className="mx-auto text-emerald-600 mb-3" size={40} />
                      <h3 className="font-semibold text-emerald-600 mb-2">استعادة نسخة احتياطية</h3>
                      <p className="text-sm text-gray-500 mb-4">استرجاع البيانات من نسخة احتياطية سابقة</p>
                      <Button variant="outline" className="w-full gap-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                        <Upload size={18} />
                        رفع واستعادة
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-[#005f73] mb-4">النسخ الاحتياطية السابقة</h3>
                  <div className="space-y-2">
                    {[
                      { date: '2024-01-16 00:00', size: '2.4 MB', type: 'تلقائي' },
                      { date: '2024-01-15 00:00', size: '2.3 MB', type: 'تلقائي' },
                      { date: '2024-01-14 12:30', size: '2.3 MB', type: 'يدوي' },
                    ].map((backup, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-[#005f73]/10 rounded-lg">
                            <FileText className="text-[#005f73]" size={18} />
                          </div>
                          <div>
                            <p className="font-medium text-sm" dir="ltr">{backup.date}</p>
                            <p className="text-xs text-gray-500">{backup.size} • {backup.type}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-[#005f73]">
                            تحميل
                          </Button>
                          <Button variant="ghost" size="sm" className="text-emerald-600">
                            استعادة
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

// Upload icon for backup section
const Upload: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)

// ==================== Main Application ====================
export default function Home() {
  const [activeModule, setActiveModule] = useState<ModuleType>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderModule = useCallback(() => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />
      case 'sales':
        return <Sales />
      case 'purchases':
        return <Purchases />
      case 'inventory':
        return <Inventory />
      case 'parties':
        return <Parties />
      case 'treasury':
        return <Treasury />
      case 'reports':
        return <Reports />
      case 'settings':
        return <SettingsModule />
      default:
        return <Dashboard />
    }
  }, [activeModule])

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Sidebar */}
      <Sidebar 
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 lg:mr-72 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 lg:px-6 py-3 no-print">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={22} />
              </Button>
              
              {/* Breadcrumb / Title */}
              <div className="hidden sm:block">
                <h2 className="text-lg font-bold text-[#005f73]">
                  {{
                    dashboard: 'لوحة التحكم',
                    sales: 'المبيعات',
                    purchases: 'المشتريات',
                    inventory: 'إدارة المخزون',
                    parties: 'الأطراف',
                    treasury: 'الخزينة',
                    reports: 'التقارير',
                    settings: 'الإعدادات'
                  }[activeModule]}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Quick Actions */}
              <Button 
                size="sm" 
                className="hidden sm:flex bg-[#005f73] hover:bg-[#0a9396] text-white gap-1"
                onClick={() => {
                  if (activeModule === 'sales') {
                    // Trigger new invoice dialog
                    document.querySelector('[data-state="open"]')?.closest('button')?.click()
                  }
                }}
              >
                <Plus size={16} />
                سريع
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </Button>

              {/* User Avatar */}
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="w-8 h-8 bg-[#005f73] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  م
                </div>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-6 pb-12">
          {renderModule()}
        </div>
      </main>
    </div>
  )
}

// Bell icon for notifications
const Bell: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
  </svg>
)
