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
  Upload, Database, Key, EyeOff, ToggleLeft, ToggleRight, Zap
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

// Types
type ModuleType = 'dashboard' | 'sales' | 'purchases' | 'inventory' | 'accounts' | 'banks' | 'parties' | 'treasury' | 'hr' | 'expenses' | 'reports' | 'settings'

interface Invoice {
  id: string; invoiceNumber: string; type: 'sale' | 'purchase' | 'sale_return' | 'purchase_return';
  partyName: string; date: string; total: number; status: 'draft' | 'posted' | 'paid' | 'partial' | 'cancelled';
  paymentStatus: 'unpaid' | 'partial' | 'paid'; remaining: number
}

interface Item {
  id: string; code: string; barcode: string; nameAr: string; category: string; unit: string;
  costPrice: number; salePrice: number; wholesalePrice?: number; stock: number; minStock: number;
  warehouse: string; expiryDate?: string
}

interface Party {
  id: string; code: string; nameAr: string; type: 'customer' | 'supplier' | 'both';
  phone: string; email: string; balance: number; city: string; rating?: number
}

interface Transaction {
  id: string; type: 'income' | 'expense' | 'payment_received' | 'payment_sent';
  amount: number; category: string; description: string; date: string; reference?: string
}

interface Account {
  id: string; code: string; nameAr: string; type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  parentId?: string; balance: number; children?: Account[]
}

interface Employee {
  id: string; employeeCode: string; fullNameAr: string; department: string; position: string;
  phone: string; baseSalary: number; status: 'active' | 'on_leave' | 'suspended' | 'terminated'; hireDate: string
}

interface Quotation {
  id: string; quotationNumber: string; partyName: string; date: string; validUntil: string;
  total: number; status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'converted'
}

interface PurchaseOrder {
  id: string; orderNumber: string; supplierName: string; date: string; expectedDelivery: string;
  total: number; status: 'draft' | 'sent' | 'approved' | 'received' | 'cancelled' | 'converted'
}

interface JournalEntry {
  id: string; entryNumber: string; date: string; description: string;
  totalDebit: number; totalCredit: number; status: 'draft' | 'posted' | 'reversed'
}

interface BankAccount {
  id: string; bankName: string; accountNumber: string; accountName: string;
  type: 'current' | 'savings' | 'investment'; balance: number; currency: string
}

interface Check {
  id: string; checkNumber: string; type: 'issued' | 'received'; amount: number;
  dueDate: string; payeeName?: string; status: 'pending' | 'cleared' | 'bounced' | 'cancelled'
}

interface SalaryRecord {
  id: string; employeeName: string; month: number; year: number;
  baseSalary: number; allowances: number; deductions: number; netSalary: number;
  status: 'draft' | 'approved' | 'paid'
}

interface AttendanceRecord {
  id: string; employeeName: string; date: string; clockIn: string; clockOut: string;
  workingHours: number; status: 'present' | 'absent' | 'late' | 'leave'
}

interface Expense {
  id: string; category: string; subcategory: string; amount: number;
  date: string; description: string; isRecurring: boolean
}

// Mock Data
const mockUsers = [
  { id: '1', name: 'مدير النظام', email: 'admin@injaz.com', password: 'admin123', role: 'admin', isActive: true },
  { id: '2', name: 'أحمد محمد', email: 'accountant@injaz.com', password: 'acc123', role: 'accountant', isActive: true },
  { id: '3', name: 'سارة علي', email: 'cashier@injaz.com', password: 'cash123', role: 'cashier', isActive: true },
  { id: '4', name: 'خالد عبدالله', email: 'viewer@injaz.com', password: 'view123', role: 'viewer', isActive: true },
]

const mockAccounts = [
  { id: '1', code: '1', nameAr: 'الأصول', type: 'asset', balance: 850000, children: [
    { id: '11', code: '11', nameAr: 'أصول متداولة', type: 'asset', parentId: '1', balance: 405000, children: [
      { id: '111', code: '111', nameAr: 'الصندوق', type: 'asset', parentId: '11', balance: 50000 },
      { id: '112', code: '112', nameAr: 'البنوك', type: 'asset', parentId: '11', balance: 250000 },
      { id: '113', code: '113', nameAr: 'العملاء', type: 'asset', parentId: '11', balance: 85000 },
      { id: '114', code: '114', nameAr: 'المخزون', type: 'asset', parentId: '11', balance: 120000 },
    ]},
    { id: '12', code: '12', nameAr: 'أصول ثابتة', type: 'asset', parentId: '1', balance: 445000, children: [
      { id: '121', code: '121', nameAr: 'المباني والإنشاءات', type: 'asset', parentId: '12', balance: 300000 },
      { id: '122', code: '122', nameAr: 'المعدات والأجهزة', type: 'asset', parentId: '12', balance: 80000 },
      { id: '123', code: '123', nameAr: 'السيارات', type: 'asset', parentId: '12', balance: 65000 },
    ]},
  ]},
  { id: '2', code: '2', nameAr: 'الخصوم', type: 'liability', balance: 185000, children: [
    { id: '21', code: '21', nameAr: 'خصوم متداولة', type: 'liability', parentId: '2', balance: 85000, children: [
      { id: '211', code: '211', nameAr: 'الموردون', type: 'liability', parentId: '21', balance: 45000 },
      { id: '212', code: '212', nameAr: 'مصروفات مستحقة', type: 'liability', parentId: '21', balance: 15000 },
      { id: '213', code: '213', nameAr: 'أجور مستحقة', type: 'liability', parentId: '21', balance: 25000 },
    ]},
    { id: '22', code: '22', nameAr: 'خصوم طويلة الأجل', type: 'liability', parentId: '2', balance: 100000, children: [
      { id: '221', code: '221', nameAr: 'قروض بنكية', type: 'liability', parentId: '22', balance: 100000 },
    ]},
  ]},
  { id: '3', code: '3', nameAr: 'حقوق الملكية', type: 'equity', balance: 625000, children: [
    { id: '31', code: '31', nameAr: 'رأس المال', type: 'equity', parentId: '3', balance: 400000 },
    { id: '32', code: '32', nameAr: 'الأرباح المحتجزة', type: 'equity', parentId: '3', balance: 225000 },
  ]},
  { id: '4', code: '4', nameAr: 'الإيرادات', type: 'revenue', balance: 465000, children: [
    { id: '41', code: '41', nameAr: 'إيرادات المبيعات', type: 'revenue', parentId: '4', balance: 450000 },
    { id: '42', code: '42', nameAr: 'إيرادات أخرى', type: 'revenue', parentId: '4', balance: 15000 },
  ]},
  { id: '5', code: '5', nameAr: 'المصروفات', type: 'expense', balance: 456000, children: [
    { id: '51', code: '51', nameAr: 'تكلفة المبيعات', type: 'expense', parentId: '5', balance: 280000 },
    { id: '52', code: '52', nameAr: 'مصروفات الرواتب', type: 'expense', parentId: '5', balance: 95000 },
    { id: '53', code: '53', nameAr: 'مصروفات إدارية', type: 'expense', parentId: '5', balance: 35000 },
    { id: '54', code: '54', nameAr: 'مصروفات تشغيلية', type: 'expense', parentId: '5', balance: 28000 },
    { id: '55', code: '55', nameAr: 'مصروفات تسويقية', type: 'expense', parentId: '5', balance: 18000 },
  ]},
]

const mockInvoices = [
  { id: '1', invoiceNumber: 'INV-2024-001', type: 'sale', partyName: 'شركة النور للتجارة', date: '2024-01-15', total: 15500, status: 'posted', paymentStatus: 'partial', remaining: 5500 },
  { id: '2', invoiceNumber: 'INV-2024-002', type: 'sale', partyName: 'مؤسسة الأمل', date: '2024-01-16', total: 8750, status: 'posted', paymentStatus: 'paid', remaining: 0 },
  { id: '3', invoiceNumber: 'INV-2024-003', type: 'purchase', partyName: 'مصنع الخليج', date: '2024-01-17', total: 32000, status: 'posted', paymentStatus: 'unpaid', remaining: 32000 },
  { id: '4', invoiceNumber: 'INV-2024-004', type: 'sale', partyName: 'شركة الرائد', date: '2024-01-18', total: 22800, status: 'draft', paymentStatus: 'unpaid', remaining: 22800 },
  { id: '5', invoiceNumber: 'INV-2024-005', type: 'sale_return', partyName: 'شركة النور للتجارة', date: '2024-01-19', total: 2500, status: 'posted', paymentStatus: 'paid', remaining: 0 },
  { id: '6', invoiceNumber: 'INV-2024-006', type: 'sale', partyName: 'المخازن الذكية', date: '2024-01-20', total: 18500, status: 'posted', paymentStatus: 'partial', remaining: 8500 },
]

const mockQuotations = [
  { id: '1', quotationNumber: 'QT-2024-001', partyName: 'شركة المستقبل', date: '2024-01-18', validUntil: '2024-02-18', total: 45000, status: 'sent' },
  { id: '2', quotationNumber: 'QT-2024-002', partyName: 'مؤسسة التقدم', date: '2024-01-19', validUntil: '2024-02-19', total: 12500, status: 'accepted' },
  { id: '3', quotationNumber: 'QT-2024-003', partyName: 'شركة الابتكار', date: '2024-01-20', validUntil: '2024-02-20', total: 67800, status: 'draft' },
  { id: '4', quotationNumber: 'QT-2024-004', partyName: 'المحلات التجارية', date: '2024-01-10', validUntil: '2024-02-10', total: 8900, status: 'expired' },
]

const mockPurchaseOrders = [
  { id: '1', orderNumber: 'PO-2024-001', supplierName: 'مصنع الخليج', date: '2024-01-15', expectedDelivery: '2024-01-25', total: 45000, status: 'approved' },
  { id: '2', orderNumber: 'PO-2024-002', supplierName: 'شركة الشرق للأدوات', date: '2024-01-18', expectedDelivery: '2024-02-01', total: 28500, status: 'sent' },
  { id: '3', orderNumber: 'PO-2024-003', supplierName: 'مستودعات الرياض', date: '2024-01-20', expectedDelivery: '2024-01-30', total: 32000, status: 'received' },
]

const mockItems = [
  { id: '1', code: 'ITM-001', barcode: '6281001901018', nameAr: 'لابتوب ديل XPS 15', category: 'أجهزة إلكترونية', unit: 'قطعة', costPrice: 4500, salePrice: 5200, wholesalePrice: 4900, stock: 25, minStock: 5, warehouse: 'المخزن الرئيسي' },
  { id: '2', code: 'ITM-002', barcode: '6281001901025', nameAr: 'ماوس لوجيتك MX Master', category: 'إكسسوارات', unit: 'قطعة', costPrice: 180, salePrice: 250, wholesalePrice: 220, stock: 150, minStock: 20, warehouse: 'المخزن الرئيسي' },
  { id: '3', code: 'ITM-003', barcode: '6281001901032', nameAr: 'كيبورد ميكانيكي RGB', category: 'إكسسوارات', unit: 'قطعة', costPrice: 85, salePrice: 140, wholesalePrice: 120, stock: 8, minStock: 15, warehouse: 'المخزن الفرعي', expiryDate: '2025-06-15' },
  { id: '4', code: 'ITM-004', barcode: '6281001901049', nameAr: 'شاشة سامسونغ 27 بوصة', category: 'شاشات', unit: 'قطعة', costPrice: 1200, salePrice: 1650, wholesalePrice: 1500, stock: 12, minStock: 3, warehouse: 'المخزن الرئيسي' },
  { id: '5', code: 'ITM-005', barcode: '6281001901056', nameAr: 'طابعة HP LaserJet', category: 'طابعات', unit: 'قطعة', costPrice: 850, salePrice: 1150, wholesalePrice: 1050, stock: 3, minStock: 5, warehouse: 'المخزن الفرعي' },
  { id: '6', code: 'ITM-006', barcode: '6281001901063', nameAr: 'USB Flash 64GB', category: 'تخزين', unit: 'قطعة', costPrice: 25, salePrice: 45, wholesalePrice: 35, stock: 200, minStock: 50, warehouse: 'المخزن الرئيسي' },
  { id: '7', code: 'ITM-007', barcode: '', nameAr: 'كابل HDMI 2 متر', category: 'كابلات', unit: 'قطعة', costPrice: 15, salePrice: 35, wholesalePrice: 25, stock: 2, minStock: 30, warehouse: 'المخزن الرئيسي' },
  { id: '8', code: 'ITM-008', barcode: '6281001901087', nameAr: 'جوال سامسونغ S24', category: 'جوالات', unit: 'قطعة', costPrice: 3200, salePrice: 3800, wholesalePrice: 3600, stock: 18, minStock: 5, warehouse: 'المخزن الرئيسي' },
]

const mockParties = [
  { id: '1', code: 'CUS-001', nameAr: 'شركة النور للتجارة', type: 'customer', phone: '0501234567', email: 'info@alnoor.com', balance: 5500, city: 'الرياض', rating: 5 },
  { id: '2', code: 'CUS-002', nameAr: 'مؤسسة الأمل', type: 'customer', phone: '0559876543', email: 'contact@alamal.com', balance: 0, city: 'جدة' },
  { id: '3', code: 'SUP-001', nameAr: 'مصنع الخليج', type: 'supplier', phone: '0501112233', email: 'sales@gulf-factory.com', balance: -32000, city: 'الدمام', rating: 4 },
  { id: '4', code: 'CUS-003', nameAr: 'شركة الرائد', type: 'customer', phone: '0544445555', email: 'info@raed.com', balance: 22800, city: 'الرياض', rating: 4 },
  { id: '5', code: 'SUP-002', nameAr: 'شركة الشرق للأدوات', type: 'supplier', phone: '0506667788', email: 'order@sharq-tools.com', balance: -15000, city: 'جدة', rating: 5 },
  { id: '6', code: 'CUS-004', nameAr: 'المخازن الذكية', type: 'customer', phone: '0577788899', email: 'sales@smart-stores.com', balance: 8500, city: 'الدمام', rating: 3 },
  { id: '7', code: 'BOTH-001', nameAr: 'شركة الابتكار', type: 'both', phone: '0509990000', email: 'info@innovation.com', balance: -5000, city: 'الرياض', rating: 5 },
]

const mockTransactions = [
  { id: '1', type: 'income', amount: 15500, category: 'مبيعات', description: 'فاتورة مبيعات INV-2024-001', date: '2024-01-15', reference: 'INV-2024-001' },
  { id: '2', type: 'expense', amount: 32000, category: 'مشتريات', description: 'فاتورة مشتريات INV-2024-003', date: '2024-01-17', reference: 'INV-2024-003' },
  { id: '3', type: 'payment_received', amount: 10000, category: 'تحصيل', description: 'سداد من شركة النور', date: '2024-01-16', reference: 'PAY-001' },
  { id: '4', type: 'expense', amount: 3500, category: 'إيجار', description: 'إيجار شهر يناير', date: '2024-01-01' },
  { id: '5', type: 'income', amount: 8750, category: 'مبيعات', description: 'فاتورة مبيعات INV-2024-002', date: '2024-01-16', reference: 'INV-2024-002' },
  { id: '6', type: 'expense', amount: 2800, category: 'رواتب', description: 'رواتب الموظفين', date: '2024-01-30' },
  { id: '7', type: 'payment_sent', amount: 5000, category: 'دفوعات', description: 'دفع لمورد مصنع الخليج', date: '2024-01-18', reference: 'PAY-002' },
  { id: '8', type: 'income', amount: 2200, category: 'مرتجع مبيعات', description: 'مرتجع مبيعات INV-2024-005', date: '2024-01-19' },
]

const mockEmployees = [
  { id: '1', employeeCode: 'EMP-001', fullNameAr: 'أحمد محمد العلي', department: 'المحاسبة', position: 'محاسب أول', phone: '0501112233', baseSalary: 8500, status: 'active', hireDate: '2022-03-15' },
  { id: '2', employeeCode: 'EMP-002', fullNameAr: 'سارة أحمد حسن', department: 'المبيعات', position: 'مندوبة مبيعات', phone: '0554445566', baseSalary: 6000, status: 'active', hireDate: '2023-01-10' },
  { id: '3', employeeCode: 'EMP-003', fullNameAr: 'خالد عبدالله السعيد', department: 'المخزون', position: 'مشرف مخزون', phone: '0547778899', baseSalary: 7000, status: 'active', hireDate: '2022-08-20' },
  { id: '4', employeeCode: 'EMP-004', fullNameAr: 'فاطمة محمود علي', department: 'خدمة العملاء', position: 'موظفة خدمة عملاء', phone: '0563334455', baseSalary: 5500, status: 'on_leave', hireDate: '2023-06-01' },
  { id: '5', employeeCode: 'EMP-005', fullNameAr: 'محمد سعد الدين', department: 'تقنية المعلومات', position: 'فني دعم فني', phone: '0572223344', baseSalary: 7500, status: 'active', hireDate: '2023-03-15' },
  { id: '6', employeeCode: 'EMP-006', fullNameAr: 'نورة خالد الأحمد', department: 'الإدارة', position: 'مديرة موارد بشرية', phone: '0581112233', baseSalary: 9000, status: 'active', hireDate: '2021-11-01' },
]

const mockJournalEntries = [
  { id: '1', entryNumber: 'JE-2024-001', date: '2024-01-15', description: 'تسجيل فاتورة مبيعات INV-2024-001', totalDebit: 15500, totalCredit: 15500, status: 'posted' },
  { id: '2', entryNumber: 'JE-2024-002', date: '2024-01-16', description: 'تسجيل فاتورة مبيعات INV-2024-002', totalDebit: 8750, totalCredit: 8750, status: 'posted' },
  { id: '3', entryNumber: 'JE-2024-003', date: '2024-01-17', description: 'تسجيل فاتورة مشتريات INV-2024-003', totalDebit: 32000, totalCredit: 32000, status: 'posted' },
  { id: '4', entryNumber: 'JE-2024-004', date: '2024-01-18', description: 'قيود تصحيحية - توزيع مصروفات', totalDebit: 5000, totalCredit: 5000, status: 'draft' },
]

const mockBankAccounts = [
  { id: '1', bankName: 'البنك الأهلي', accountNumber: 'SA1234567890123456', accountName: 'الحساب الجاري الرئيسي', type: 'current', balance: 125000, currency: 'SAR' },
  { id: '2', bankName: 'بنك الراجحي', accountNumber: 'SA9876543210987654', accountName: 'حساب الادخار', type: 'savings', balance: 75000, currency: 'SAR' },
  { id: '3', bankName: 'بنك الإنماء', accountNumber: 'SA1122334455667788', accountName: 'حساب الاستثمار', type: 'investment', balance: 50000, currency: 'SAR' },
]

const mockChecks = [
  { id: '1', checkNumber: 'CHK-001', type: 'issued', amount: 15000, dueDate: '2024-02-15', payeeName: 'مصنع الخليج', status: 'pending' },
  { id: '2', checkNumber: 'CHK-002', type: 'received', amount: 8000, dueDate: '2024-02-01', payeeName: 'شركة النور للتجارة', status: 'pending' },
  { id: '3', checkNumber: 'CHK-003', type: 'issued', amount: 5500, dueDate: '2024-01-25', payeeName: 'شركة الشرق للأدوات', status: 'cleared' },
  { id: '4', checkNumber: 'CHK-004', type: 'received', amount: 12000, dueDate: '2024-01-20', status: 'bounced' },
]

const mockSalaries = [
  { id: '1', employeeName: 'أحمد محمد العلي', month: 1, year: 2024, baseSalary: 8500, allowances: 2000, deductions: 1450, netSalary: 9050, status: 'approved' },
  { id: '2', employeeName: 'سارة أحمد حسن', month: 1, year: 2024, baseSalary: 6000, allowances: 1500, deductions: 980, netSalary: 6520, status: 'approved' },
  { id: '3', employeeName: 'خالد عبدالله السعيد', month: 1, year: 2024, baseSalary: 7000, allowances: 1800, deductions: 1100, netSalary: 7700, status: 'draft' },
  { id: '4', employeeName: 'محمد سعد الدين', month: 1, year: 2024, baseSalary: 7500, allowances: 1700, deductions: 1200, netSalary: 8000, status: 'paid' },
]

const mockAttendance = [
  { id: '1', employeeName: 'أحمد محمد العلي', date: '2024-01-20', clockIn: '07:55', clockOut: '17:05', workingHours: 9.1, status: 'present' },
  { id: '2', employeeName: 'سارة أحمد حسن', date: '2024-01-20', clockIn: '08:15', clockOut: '17:00', workingHours: 8.7, status: 'late' },
  { id: '3', employeeName: 'خالد عبدالله السعيد', date: '2024-01-20', clockIn: '07:50', clockOut: '17:10', workingHours: 9.3, status: 'present' },
  { id: '4', employeeName: 'فاطمة محمود علي', date: '2024-01-20', clockIn: '-', clockOut: '-', workingHours: 0, status: 'leave' },
  { id: '5', employeeName: 'محمد سعد الدين', date: '2024-01-20', clockIn: '08:30', clockOut: '17:30', workingHours: 9, status: 'late' },
]

const mockExpenses = [
  { id: '1', category: 'مصروفات إدارية', subcategory: 'إيجار', amount: 5000, date: '2024-01-01', description: 'إيجار المكتب - يناير 2024', isRecurring: true },
  { id: '2', category: 'مصروفات تشغيلية', subcategory: 'كهرباء', amount: 1800, date: '2024-01-05', description: 'فاتورة كهرباء', isRecurring: false },
  { id: '3', category: 'مصروفات تشغيلية', subcategory: 'مياه', amount: 350, date: '2024-01-05', description: 'فاتورة مياه', isRecurring: false },
  { id: '4', category: 'مصروفات تسويقية', subcategory: 'إعلانات', amount: 3000, date: '2024-01-10', description: 'حملة إعلانية يناير', isRecurring: false },
  { id: '5', category: 'مصروفات إدارية', subcategory: 'إنترنت', amount: 600, date: '2024-01-01', description: 'اشتراك إنترنت', isRecurring: true },
  { id: '6', category: 'مصروفات سفر', subcategory: 'تذاكر طيران', amount: 2500, date: '2024-01-15', description: 'سفر - معرض الرياض', isRecurring: false },
  { id: '7', category: 'مصروفات صيانة', subcategory: 'صيانة أجهزة', amount: 1200, date: '2024-01-18', description: 'صيانة طابعات', isRecurring: false },
]

// Main Component
export default function AccountingApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeModule, setActiveModule] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [invoices] = useState(mockInvoices)
  const [items] = useState(mockItems)
  const [parties] = useState(mockParties)
  const [transactions] = useState(mockTransactions)
  const [employees] = useState(mockEmployees)
  const [quotations] = useState(mockQuotations)
  const [purchaseOrders] = useState(mockPurchaseOrders)
  const [journalEntries] = useState(mockJournalEntries)
  const [bankAccounts] = useState(mockBankAccounts)
  const [checks] = useState(mockChecks)
  const [salaries] = useState(mockSalaries)
  const [attendance] = useState(mockAttendance)
  const [expenses] = useState(mockExpenses)

  const handleLogin = useCallback(() => {
    const user = mockUsers.find(u => u.email === loginEmail && u.password === loginPassword)
    if (user) {
      if (!user.isActive) { setLoginError('الحساب معطل'); return }
      setCurrentUser(user); setIsLoggedIn(true); setLoginError('')
      localStorage.setItem('injaz_user', JSON.stringify(user))
    } else {
      setLoginError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
    }
  }, [loginEmail, loginPassword])

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false); setCurrentUser(null); localStorage.removeItem('injaz_user')
  }, [])

  useEffect(() => {
    const savedUser = localStorage.getItem('injaz_user')
    if (savedUser) { try { const user = JSON.parse(savedUser); setCurrentUser(user); setIsLoggedIn(true) } catch { localStorage.removeItem('injaz_user') } }
  }, [])

  // Stats
  const totalSales = invoices.filter(i => i.type === 'sale').reduce((sum, i) => sum + i.total, 0)
  const totalPurchases = invoices.filter(i => i.type === 'purchase').reduce((sum, i) => sum + i.total, 0)
  const totalInventoryValue = items.reduce((sum, item) => sum + (item.costPrice * item.stock), 0)
  const dueInvoices = invoices.filter(i => i.paymentStatus !== 'paid').reduce((sum, i) => sum + i.remaining, 0)
  const treasuryBalance = transactions.filter(t => t.type === 'income' || t.type === 'payment_received').reduce((sum, t) => sum + t.amount, 0)
    - transactions.filter(t => t.type === 'expense' || t.type === 'payment_sent').reduce((sum, t) => sum + t.amount, 0)
  const customerCount = parties.filter(p => p.type === 'customer' || p.type === 'both').length
  const employeeCount = employees.filter(e => e.status === 'active').length
  const lowStockItems = items.filter(item => item.stock <= item.minStock)

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#005f73] via-[#0a9396] to-[#94d2bd] flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-scaleIn">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#005f73] to-[#0a9396] rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Calculator className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#005f73]">نظام إنجاز المحاسبي</h1>
            <p className="text-gray-500 mt-2">نظام محاسبي متكامل لإدارة أعمالك</p>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-right block mb-2">البريد الإلكتروني</Label>
              <div className="relative"><Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" /><Input type="email" placeholder="admin@injaz.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="pr-10 text-right" onKeyDown={(e) => e.key === 'Enter' && handleLogin()} /></div>
            </div>
            <div>
              <Label className="text-right block mb-2">كلمة المرور</Label>
              <div className="relative"><Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" /><Input type="password" placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="pr-10 text-right" onKeyDown={(e) => e.key === 'Enter' && handleLogin()} /></div>
            </div>
            {loginError && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2"><AlertCircle className="w-5 h-5" /><span>{loginError}</span></div>}
            <Button onClick={handleLogin} className="w-full bg-gradient-to-r from-[#005f73] to-[#0a9396] hover:from-[#004d5c] hover:to-[#087778] h-12 text-lg"><LogOut className="ml-2 h-5 w-5 rotate-180" />تسجيل الدخول</Button>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center mb-3">بيانات تجريبية:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[{r:'مدير',e:'admin@injaz.com',p:'admin123'},{r:'محاسب',e:'accountant@injaz.com',p:'acc123'},{r:'أمين صندوق',e:'cashier@injaz.com',p:'cash123'},{r:'مشاهد',e:'viewer@injaz.com',p:'view123'}].map(u=><button key={u.e} onClick={() => {setLoginEmail(u.e);setLoginPassword(u.p)}} className="p-2 bg-gray-50 rounded hover:bg-gray-100 text-right"><Badge variant="outline" className="mb-1">{u.r}</Badge><p>{u.e}</p></button>)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'لوحة التحكم' },
    { id: 'sales', icon: ShoppingCart, label: 'المبيعات' },
    { id: 'purchases', icon: ShoppingCart, label: 'المشتريات' },
    { id: 'inventory', icon: Package, label: 'المخزون' },
    { id: 'accounts', icon: GitBranch, label: 'الحسابات' },
    { id: 'banks', icon: Landmark, label: 'البنوك والخزينة' },
    { id: 'parties', icon: Users, label: 'العملاء والموردين' },
    { id: 'treasury', icon: Wallet, label: 'الحركات المالية' },
    { id: 'hr', icon: UserCheck, label: 'الموارد البشرية' },
    { id: 'expenses', icon: Receipt, label: 'المصروفات' },
    { id: 'reports', icon: FileText, label: 'التقارير' },
    { id: 'settings', icon: Settings, label: 'الإعدادات' },
  ]

  return (
    <div className="min-h-screen bg-[#f8f9fa]" dir="rtl">
      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 h-full bg-gradient-to-b from-[#005f73] to-[#0a9396] text-white transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 flex items-center justify-between border-b border-white/20">
          {sidebarOpen && <h1 className="text-xl font-bold">إنجاز</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg">{sidebarOpen ? <X /> : <Menu />}</button>
        </div>
        <nav className="mt-4 px-2 space-y-1">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveModule(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeModule === item.id ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white/80'}`}>
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-200 transition-colors">
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'mr-64' : 'mr-20'} p-6`}>
        {/* Header */}
        <header className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"><Menu /></button>
            <div><h2 className="text-xl font-bold text-gray-800">{menuItems.find(m=>m.id===activeModule)?.label}</h2><p className="text-sm text-gray-500">مرحباً {currentUser?.name || 'مستخدم'}</p></div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-full"><Bell className="w-5 h-5" /><span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{lowStockItems.length}</span></button>
            <div className="flex items-center gap-2"><div className="w-8 h-8 bg-[#0a9396] rounded-full flex items-center justify-center text-white font-bold">{currentUser?.name?.[0]||'U'}</div></div>
          </div>
        </header>

        {/* Module Content */}
        {activeModule === 'dashboard' && <DashboardModule invoices={invoices} items={items} transactions={transactions} parties={parties} employees={employees} checks={checks} totalSales={totalSales} totalPurchases={totalPurchases} totalInventoryValue={totalInventoryValue} dueInvoices={dueInvoices} treasuryBalance={treasuryBalance} customerCount={customerCount} employeeCount={employeeCount} lowStockItems={lowStockItems} />}
        {activeModule === 'sales' && <SalesModule invoices={invoices} quotations={quotations} parties={parties} />}
        {activeModule === 'purchases' && <PurchasesModule invoices={invoices} purchaseOrders={purchaseOrders} parties={parties} totalPurchases={totalPurchases} />}
        {activeModule === 'inventory' && <InventoryModule items={items} lowStockItems={lowStockItems} />}
        {activeModule === 'accounts' && <AccountsModule accounts={mockAccounts} journalEntries={journalEntries} />}
        {activeModule === 'banks' && <BanksModule bankAccounts={bankAccounts} checks={checks} transactions={transactions} treasuryBalance={treasuryBalance} />}
        {activeModule === 'parties' && <PartiesModule parties={parties} />}
        {activeModule === 'treasury' && <TreasuryModule transactions={transactions} treasuryBalance={treasuryBalance} />}
        {activeModule === 'hr' && <HRModule employees={employees} salaries={salaries} attendance={attendance} />}
        {activeModule === 'expenses' && <ExpensesModule expenses={expenses} />}
        {activeModule === 'reports' && <ReportsModule />}
        {activeModule === 'settings' && <SettingsModule users={mockUsers} />}
      </main>
    </div>
  )
}

// ==================== DASHBOARD MODULE ====================
function DashboardModule({ invoices, items, transactions, parties, employees, checks, totalSales, totalPurchases, totalInventoryValue, dueInvoices, treasuryBalance, customerCount, employeeCount, lowStockItems }: any) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'إجمالي المبيعات', value: `${totalSales.toLocaleString()} ر.س`, change: '+12%', icon: TrendingUp, color: 'green' },
          { title: 'إجمالي المشتريات', value: `${totalPurchases.toLocaleString()} ر.س`, change: '+5%', icon: TrendingDown, color: 'red' },
          { title: 'صافي الربح التقديري', value: `${(totalSales - totalPurchases * 0.7).toLocaleString()} ر.س`, change: '~30%', icon: DollarSign, color: 'blue' },
          { title: 'قيمة المخزون', value: `${totalInventoryValue.toLocaleString()} ر.س`, change: `${items.length} صنف`, icon: Package, color: 'purple' },
          { title: 'الفواتير المستحقة', value: `${dueInvoices.toLocaleString()} ر.س`, change: `${invoices.filter(i=>i.paymentStatus!=='paid').length} فاتورة`, icon: Clock, color: 'orange' },
          { title: 'رصيد الخزينة', value: `${treasuryBalance.toLocaleString()} ر.س`, change: 'صافي الحركات', icon: Wallet, color: 'cyan' },
          { title: 'عدد العملاء', value: customerCount.toString(), change: 'عميل نشط', icon: Users, color: 'indigo' },
          { title: 'الموظفون النشطون', value: employeeCount.toString(), change: `من أصل ${employees.length}`, icon: UserCheck, color: 'teal' },
        ].map((kpi, idx) => (
          <Card key={idx} className={`hover:shadow-lg transition-shadow`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-gray-500">{kpi.title}</p><p className="text-2xl font-bold">{kpi.value}</p><p className="text-xs text-gray-500 mt-1 flex items-center"><kpi.icon className="h-3 w-3 ml-1" />{kpi.change}</p></div>
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center"><kpi.icon className="w-7 h-7 text-gray-600" /></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
            <Button className="w-full justify-start bg-green-50 text-green-700" variant="outline"><Plus className="ml-2 h-4 w-4" />فاتورة جديدة</Button>
            <Button className="w-full justify-start bg-blue-50 text-blue-700" variant="outline"><Plus className="ml-2 h-4 w-4" />طلب شراء</Button>
            <Button className="w-full justify-start bg-purple-50 text-purple-700" variant="outline"><Wallet className="ml-2 h-4 w-4" />تحصيل</Button>
            <Button className="w-full justify-start bg-orange-50 text-orange-700" variant="outline"><Receipt className="ml-2 h-4 w-4" />مصروف</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>آخر المعاملات</CardTitle></CardHeader>
          <CardContent>
            <Table><TableHeader><TableRow><TableHead>المرجع</TableHead><TableHead>الوصف</TableHead><TableHead>المبلغ</TableHead><TableHead>التاريخ</TableHead></TableRow></TableHeader><TableBody>{transactions.slice(0,5).map(t => (<TableRow key={t.id}><TableCell><Badge variant="outline">{t.reference||'-'}</Badge></TableCell><TableCell>{t.description}</TableCell><TableCell className={t.type.startsWith('income')?'text-green-600':'text-red-600'}>{t.amount.toLocaleString()}</TableCell><TableCell>{t.date}</TableCell></TableRow>))}</TableBody></Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>تنبيهات هامة</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {lowStockItems.length > 0 && (<div className="bg-orange-50 border border-orange-200 rounded-lg p-3"><p className="font-medium text-orange-800">أصناف نفدت ({lowStockItems.length})</p><div className="mt-2 space-y-1">{lowStockItems.map(item => (<div key={item.id} className="text-sm text-orange-700 flex justify-between"><span>{item.nameAr}</span><span>متبقي: {item.stock}</span></div>))}</div></div>)}
            {checks.filter(c => c.status === 'pending').length > 0 && (<div className="bg-blue-50 border border-blue-200 rounded-lg p-3"><p className="font-medium text-blue-800">شيكات مستحقة ({checks.filter(c=>c.status==='pending').length})</p></div>)}
            {invoices.filter(i => i.paymentStatus !== 'paid').length > 0 && (<div className="bg-red-50 border border-red-200 rounded-lg p-3"><p className="font-medium text-red-800">فواتير غير مسددة ({invoices.filter(i=>i.paymentStatus!=='paid').length}) - {dueInvoices.toLocaleString()} ر.س</p></div>)}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ==================== SALES MODULE ====================
function SalesModule({ invoices, quotations, parties }: any) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#005f73]">المبيعات</h1>
        <Dialog><DialogTrigger asChild><Button className="bg-gradient-to-r from-[#005f73] to-[#0a9396]"><Plus className="ml-2 h-4 w-4" />فاتورة جديدة</Button></DialogTrigger><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>فاتورة مبيعات جديدة</DialogTitle></DialogHeader><div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><Label>العميل</Label><Select><SelectTrigger><SelectValue placeholder="اختر العميل" /></SelectTrigger><SelectContent>{parties.filter(p=>p.type==='customer'||p.type==='both').map(p=><SelectItem key={p.id} value={p.id}>{p.nameAr}</SelectItem>)}</SelectContent></Select></div><div><Label>التاريخ</Label><Input type="date" defaultValue={new Date().toISOString().split('T')[0]} /></div></div><Button className="w-full bg-[#005f73]">حفظ الفاتورة</Button></div></DialogContent></Dialog>
      </div>
      <Tabs defaultValue="invoices">
        <TabsList className="grid w-full grid-cols-3"><TabsTrigger value="invoices">الفواتير</TabsTrigger><TabsTrigger value="quotations">عروض الأسعار</TabsTrigger><TabsTrigger value="returns">المرتجعات</TabsTrigger></TabsList>
        <TabsContent value="invoices"><Card><CardContent className="pt-6"><Table><TableHeader><TableRow><TableHead>رقم الفاتورة</TableHead><TableHead>العميل</TableHead><TableHead>التاريخ</TableHead><TableHead>الإجمالي</TableHead><TableHead>الحالة</TableHead><TableHead>إجراءات</TableHead></TableRow></TableHeader><TableBody>{invoices.filter(i=>i.type==='sale'||i.type==='sale_return').map(inv => (<TableRow key={inv.id}><TableCell className="font-medium">{inv.invoiceNumber}</TableCell><TableCell>{inv.partyName}</TableCell><TableCell>{inv.date}</TableCell><TableCell>{inv.total.toLocaleString()} ر.س</TableCell><TableCell><Badge>{inv.status==='posted'?'مرحلة':'مسودة'}</Badge></TableCell><TableCell><div className="flex gap-1"><Button size="sm" variant="ghost"><Eye /></Button><Button size="sm" variant="ghost"><Printer /></Button></div></TableCell></TableRow>))}</TableBody></Table></CardContent></Card></TabsContent>
        <TabsContent value="quotations"><Card><CardContent className="pt-6"><Table><TableHeader><TableRow><TableHead>رقم العرض</TableHead><TableHead>العميل</TableHead><TableHead>التاريخ</TableHead><TableHead>الإجمالي</TableHead><TableHead>الحالة</TableHead></TableRow></TableHeader><TableBody>{quotations.map(q => (<TableRow key={q.id}><TableCell>{q.quotationNumber}</TableCell><TableCell>{q.partyName}</TableCell><TableCell>{q.date}</TableCell><TableCell>{q.total.toLocaleString()} ر.س</TableCell><TableCell><Badge variant={q.status==='accepted'?'default':q.status==='expired'?'destructive':'outline'}>{q.status==='sent'?'مرسل':q.status==='accepted'?'مقبول':q.status==='expired'?'منتهي':'مسودة'}</Badge></TableCell></TableRow>))}</TableBody></Table></CardContent></Card></TabsContent>
        <TabsContent value="returns"><Card><CardContent className="pt-6"><p className="text-gray-500 text-center py-8">لا توجد مرتجعات حالياً</p></CardContent></Card></TabsContent>
      </Tabs>
    </div>
  )
}

// ==================== PURCHASES MODULE ====================
function PurchasesModule({ invoices, purchaseOrders, parties, totalPurchases }: any) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#005f73]">المشتريات</h1>
        <Dialog><DialogTrigger asChild><Button className="bg-gradient-to-r from-blue-600 to-blue-700"><Plus className="ml-2 h-4 w-4" />فاتورة مشتريات</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>فاتورة مشتريات جديدة</DialogTitle></DialogHeader><div className="space-y-4"><div><Label>المورد</Label><Select><SelectTrigger><SelectValue placeholder="اختر المورد" /></SelectTrigger><SelectContent>{parties.filter(p=>p.type==='supplier'||p.type==='both').map(p=><SelectItem key={p.id} value={p.id}>{p.nameAr}</SelectItem>)}</SelectContent></Select></div><Button className="w-full bg-blue-600">حفظ الفاتورة</Button></div></DialogContent></Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="pt-6 pb-6 text-center"><p className="text-sm text-gray-500">إجمالي المشتريات</p><p className="text-2xl font-bold text-red-600">{totalPurchases.toLocaleString()} ر.س</p></CardContent></Card>
        <Card><CardContent className="pt-6 pb-6 text-center"><p className="text-sm text-gray-500">طلبات معلقة</p><p className="text-2xl font-bold text-orange-600">{purchaseOrders.filter(o=>o.status==='sent'||o.status==='approved').length}</p></CardContent></Card>
        <Card><CardContent className="pt-6 pb-6 text-center"><p className="text-sm text-gray-500">الموردون</p><p className="text-2xl font-bold text-blue-600">{parties.filter(p=>p.type==='supplier'||p.type==='both').length}</p></CardContent></Card>
      </div>
      <Tabs defaultValue="invoices">
        <TabsList className="grid w-full grid-cols-3"><TabsTrigger value="invoices">الفواتير</TabsTrigger><TabsTrigger value="orders">أوامر الشراء</TabsTrigger><TabsTrigger value="returns">المرتجعات</TabsTrigger></TabsList>
        <TabsContent value="invoices"><Card><CardContent className="pt-6"><Table><TableHeader><TableRow><TableHead>رقم الفاتورة</TableHead><TableHead>المورد</TableHead><TableHead>التاريخ</TableHead><TableHead>الإجمالي</TableHead><TableHead>الحالة</TableHead></TableRow></TableHeader><TableBody>{invoices.filter(i=>i.type==='purchase').map(inv => (<TableRow key={inv.id}><TableCell>{inv.invoiceNumber}</TableCell><TableCell>{inv.partyName}</TableCell><TableCell>{inv.date}</TableCell><TableCell>{inv.total.toLocaleString()} ر.س</TableCell><TableCell><Badge variant="outline">{inv.status}</Badge></TableCell></TableRow>))}</TableBody></Table></CardContent></Card></TabsContent>
        <TabsContent value="orders"><Card><CardContent className="pt-6"><Table><TableHeader><TableRow><TableHead>رقم الأمر</TableHead><TableHead>المورد</TableHead><TableHead>التاريخ</TableHead><TableHead>الإجمالي</TableHead><TableHead>الحالة</TableHead></TableRow></TableHeader><TableBody>{purchaseOrders.map(po => (<TableRow key={po.id}><TableCell>{po.orderNumber}</TableCell><TableCell>{po.supplierName}</TableCell><TableCell>{po.date}</TableCell><TableCell>{po.total.toLocaleString()} ر.س</TableCell><TableCell><Badge variant={po.status==='approved'?'default':po.status==='sent'?'secondary':'outline'}>{po.status==='sent'?'مرسل':po.status==='approved'?'موافق عليه':po.status==='received'?'تم الاستلام':'مسودة'}</Badge></TableCell></TableRow>))}</TableBody></Table></CardContent></Card></TabsContent>
        <TabsContent value="returns"><Card><CardContent className="pt-6"><p className="text-gray-500 text-center py-8">لا توجد مرتجعات مشتريات</p></CardContent></Card></TabsContent>
      </Tabs>
    </div>
  )
}

// ==================== INVENTORY MODULE ====================
function InventoryModule({ items, lowStockItems }: any) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#005f73]">المخزون</h1>
        <Dialog><DialogTrigger asChild><Button className="bg-gradient-to-r from-purple-600 to-purple-700"><Plus className="ml-2 h-4 w-4" />صنف جديد</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>إضافة صنف جديد</DialogTitle></DialogHeader><div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><Label>اسم الصنف (عربي)</Label><Input placeholder="اسم الصنف بالعربية" /></div><div><Label>الكود</Label><Input placeholder="ITM-XXX" /></div></div><div className="grid grid-cols-3 gap-4"><div><Label>سعر التكلفة</Label><Input type="number" placeholder="0" /></div><div><Label>سعر البيع</Label><Input type="number" placeholder="0" /></div><div><Label>الحد الأدنى</Label><Input type="number" placeholder="0" /></div></div><Button className="w-full bg-purple-600">حفظ الصنف</Button></div></DialogContent></Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6 pb-6 text-center"><Package className="w-8 h-8 mx-auto mb-2 text-purple-500" /><p className="text-sm text-gray-500">إجمالي الأصناف</p><p className="text-2xl font-bold">{items.length}</p></CardContent></Card>
        <Card><CardContent className="pt-6 pb-6 text-center"><CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" /><p className="text-sm text-gray-500">متوفر</p><p className="text-2xl font-bold text-green-600">{items.filter(i=>i.stock>i.minStock).length}</p></CardContent></Card>
        <Card><CardContent className="pt-6 pb-6 text-center"><AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" /><p className="text-sm text-gray-500">نفد المخزون</p><p className="text-2xl font-bold text-red-600">{lowStockItems.length}</p></CardContent></Card>
        <Card><CardContent className="pt-6 pb-6 text-center"><Building2 className="w-8 h-8 mx-auto mb-2 text-blue-500" /><p className="text-sm text-gray-500">المخازن</p><p className="text-2xl font-bold">2</p></CardContent></Card>
      </div>
      {lowStockItems.length > 0 && (<Card className="border-r-4 border-r-red-500"><CardContent className="pt-6"><h3 className="font-bold text-red-600 mb-3 flex items-center gap-2"><AlertTriangle />تنبيه نفاد المخزون</h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">{lowStockItems.map(item => (<div key={item.id} className="bg-red-50 p-3 rounded-lg"><p className="font-medium">{item.nameAr}</p><p className="text-sm text-red-600">متبقي: {item.stock} | الحد الأدنى: {item.minStock}</p></div>))}</div></CardContent></Card>)}
      <Card><CardContent className="pt-6"><Table><TableHeader><TableRow><TableHead>الكود</TableHead><TableHead>الصنف</TableHead><TableHead>التصنيف</TableHead><TableHead>المخزن</TableHead><TableHead>الكمية</TableHead><TableHead>سعر البيع</TableHead></TableRow></TableHeader><TableBody>{items.map(item => (<TableRow key={item.id}><TableCell className="font-medium">{item.code}</TableCell><TableCell>{item.nameAr}</TableCell><TableCell>{item.category}</TableCell><TableCell>{item.warehouse}</TableCell><TableCell><Badge variant={item.stock<=item.minStock?'destructive':'secondary'}>{item.stock}</Badge></TableCell><TableCell>{item.salePrice.toLocaleString()} ر.س</TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
    </div>
  )
}

// ==================== ACCOUNTS MODULE ====================
function AccountsModule({ accounts, journalEntries }: any) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#005f73]">شجرة الحسابات</h1>
        <Dialog><DialogTrigger asChild><Button className="bg-gradient-to-r from-indigo-600 to-indigo-700"><Plus className="ml-2 h-4 w-4" />حساب جديد</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>إضافة حساب جديد</DialogTitle></DialogHeader><div className="space-y-4"><div><Label>نوع الحساب</Label><Select><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="asset">أصل</SelectItem><SelectItem value="liability">خصم</SelectItem><SelectItem value="equity">حقوق ملكية</SelectItem><SelectItem value="revenue">إيراد</SelectItem><SelectItem value="expense">مصروف</SelectItem></SelectContent></Select></div><Button className="w-full bg-indigo-600">إضافة الحساب</Button></div></DialogContent></Dialog>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>هيكل الحسابات</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {accounts.map(acc => (
                <div key={acc.id} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-3 flex items-center justify-between cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center gap-2"><ChevronRight className="w-4 h-4" /><Badge variant="outline">{acc.code}</Badge><span className="font-medium">{acc.nameAr}</span></div>
                    <span className="text-sm text-gray-500">{acc.balance.toLocaleString()} ر.س</span>
                  </div>
                  {acc.children && (
                    <div className="border-t">
                      {acc.children.map(child => (
                        <div key={child.id} className="p-3 pr-8 hover:bg-gray-50 flex items-center justify-between border-b last:border-b-0">
                          <div className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-gray-400" /><Badge variant="outline" className="text-xs">{child.code}</Badge><span>{child.nameAr}</span></div>
                          <span className="text-sm font-medium">{child.balance.toLocaleString()} ر.س</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>القيود المحاسبية</CardTitle></CardHeader>
          <CardContent>
            <Table><TableHeader><TableRow><TableHead>رقم القيد</TableHead><TableHead>التاريخ</TableHead><TableHead>الوصف</TableHead><TableHead>مدين</TableHead><TableHead>دائن</TableHead><TableHead>الحالة</TableHead></TableRow></TableHeader><TableBody>{journalEntries.map(je => (<TableRow key={je.id}><TableCell className="font-medium">{je.entryNumber}</TableCell><TableCell>{je.date}</TableCell><TableCell>{je.description}</TableCell><TableCell className="text-red-600">{je.totalDebit.toLocaleString()}</TableCell><TableCell className="text-green-600">{je.totalCredit.toLocaleString()}</TableCell><TableCell><Badge variant={je.status==='posted'?'default':'outline'}>{je.status==='posted'?'مرحلة':'مسودة'}</Badge></TableCell></TableRow>))}</TableBody></Table>
            <Dialog><DialogTrigger asChild><Button className="w-full mt-4" variant="outline"><Plus className="ml-2 h-4 w-4" />قييد جديد</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>إنشاء قيد محاسبي</DialogTitle></DialogHeader><div className="space-y-4"><div><Label>وصف القيد</Label><Textarea placeholder="وصف القيد..." /></div><Button className="w-full bg-indigo-600">حفظ القيد</Button></div></DialogContent></Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ==================== BANKS MODULE ====================
function BanksModule({ bankAccounts, checks, transactions, treasuryBalance }: any) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-bold text-[#005f73]">البنوك والخزينة</h1>
      <Tabs defaultValue="banks">
        <TabsList className="grid w-full grid-cols-3"><TabsTrigger value="banks">الحسابات البنكية</TabsTrigger><TabsTrigger value="checks">الشيكات</TabsTrigger><TabsTrigger value="treasury">الخزينة</TabsTrigger></TabsList>
        <TabsContent value="banks">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {bankAccounts.map(bank => (
              <Card key={bank.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4"><Landmark className="w-8 h-8 text-[#0a9396]" /><Badge variant="outline">{bank.type === 'current' ? 'جاري' : bank.type === 'savings' ? 'ادخار' : 'استثمار'}</Badge></div>
                  <h3 className="font-bold text-lg">{bank.bankName}</h3>
                  <p className="text-sm text-gray-500 mt-1">{bank.accountName}</p>
                  <Separator className="my-3" />
                  <p className="text-2xl font-bold text-[#005f73]">{bank.balance.toLocaleString()} {bank.currency}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="checks">
          <Card><CardContent className="pt-6"><Table><TableHeader><TableRow><TableHead>رقم الشيك</TableHead><TableHead>النوع</TableHead><TableHead>المبلغ</TableHead><TableHead>المستفيد</TableHead><TableHead>استحقاق</TableHead><TableHead>الحالة</TableHead></TableRow></TableHeader><TableBody>{checks.map(check => (<TableRow key={check.id}><TableCell className="font-medium">{check.checkNumber}</TableCell><TableCell><Badge variant={check.type==='issued'?'destructive':'default'}>{check.type==='issued'?'صادر':'وارد'}</Badge></TableCell><TableCell>{check.amount.toLocaleString()} ر.س</TableCell><TableCell>{check.payeeName||'-'}</TableCell><TableCell>{check.dueDate}</TableCell><TableCell><Badge variant={check.status==='cleared'?'default':check.status==='bounced'?'destructive':'outline'}>{check.status==='cleared'?'محقق':check.status==='bounced'?'مرتجع':'معلق'}</Badge></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
        </TabsContent>
        <TabsContent value="treasury">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card><CardContent className="pt-6 pb-6 text-center"><Wallet className="w-8 h-8 mx-auto mb-2 text-green-500" /><p className="text-sm text-gray-500">الإيرادات</p><p className="text-2xl font-bold text-green-600">{transactions.filter(t=>t.type==='income'||t.type==='payment_received').reduce((s,t)=>s+t.amount,0).toLocaleString()}</p></CardContent></Card>
            <Card><CardContent className="pt-6 pb-6 text-center"><Wallet className="w-8 h-8 mx-auto mb-2 text-red-500" /><p className="text-sm text-gray-500">المصروفات</p><p className="text-2xl font-bold text-red-600">{transactions.filter(t=>t.type==='expense'||t.type==='payment_sent').reduce((s,t)=>s+t.amount,0).toLocaleString()}</p></CardContent></Card>
            <Card><CardContent className="pt-6 pb-6 text-center"><DollarSign className="w-8 h-8 mx-auto mb-2 text-blue-500" /><p className="text-sm text-gray-500">الرصيد</p><p className="text-2xl font-bold text-blue-600">{treasuryBalance.toLocaleString()}</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ==================== PARTIES MODULE ====================
function PartiesModule({ parties }: any) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#005f73]">العملاء والموردين</h1>
        <Dialog><DialogTrigger asChild><Button className="bg-gradient-to-r from-[#005f73] to-[#0a9396]"><Plus className="ml-2 h-4 w-4" />إضافة طرف جديد</Button></DialogTrigger><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>إضافة عميل/مورد جديد</DialogTitle></DialogHeader><div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><Label>النوع</Label><Select><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="customer">عميل</SelectItem><SelectItem value="supplier">مورد</SelectItem><SelectItem value="both">كلاهما</SelectItem></SelectContent></Select></div><div><Label>الكود</Label><Input placeholder="CUS/SUP-XXX" /></div></div><div className="grid grid-cols-2 gap-4"><div><Label>الاسم (عربي)</Label><Input placeholder="الاسم بالعربية" /></div><div><Label>الهاتف</Label><Input placeholder="05XXXXXXXX" /></div></div><Button className="w-full bg-[#005f73]">حفظ</Button></div></DialogContent></Dialog>
      </div>
      <Tabs defaultValue="all">
        <TabsList><TabsTrigger value="all">الكل</TabsTrigger><TabsTrigger value="customer">العملاء</TabsTrigger><TabsTrigger value="supplier">الموردون</TabsTrigger></TabsList>
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {parties.map(party => (
              <Card key={party.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div><h3 className="font-bold">{party.nameAr}</h3><p className="text-sm text-gray-500">{party.code}</p></div>
                    <Badge variant={party.type==='customer'?'default':party.type==='supplier'?'secondary':'outline'}>{party.type==='customer'?'عميل':party.type==='supplier'?'مورد':'كلاهما'}</Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600"><div className="flex items-center gap-2"><Phone className="w-4 h-4" />{party.phone||'-'}</div><div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{party.city||'-'}</div></div>
                  <Separator className="my-3" />
                  <div className="flex justify-between items-center"><span className="text-sm text-gray-500">الرصيد</span><span className={`font-bold ${party.balance > 0 ? 'text-green-600' : party.balance < 0 ? 'text-red-600' : ''}`}>{Math.abs(party.balance).toLocaleString()} ر.س {party.balance > 0 ? '(له)' : party.balance < 0 ? '(عليه)' : ''}</span></div>
                  {party.rating && (<div className="mt-2 flex items-center gap-1">{Array(5).fill(0).map((_,i) => (<Star key={i} className={`w-4 h-4 ${i < party.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />))}</div>)}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ==================== TREASURY MODULE ====================
function TreasuryModule({ transactions, treasuryBalance }: any) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#005f73]">الحركات المالية</h1>
        <Dialog><DialogTrigger asChild><Button className="bg-gradient-to-r from-[#005f73] to-[#0a9396]"><Plus className="ml-2 h-4 w-4" />حركة جديدة</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>إضافة حركة مالية</DialogTitle></DialogHeader><div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><Label>نوع الحركة</Label><Select><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="income">إيراد</SelectItem><SelectItem value="expense">مصروف</SelectItem><SelectItem value="payment_received">تحصيل</SelectItem><SelectItem value="payment_sent">دفع</SelectItem></SelectContent></Select></div><div><Label>المبلغ</Label><Input type="number" placeholder="0.00" /></div></div><Button className="w-full bg-[#005f73]">حفظ الحركة</Button></div></DialogContent></Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 border-green-200"><CardContent className="pt-6 pb-6 text-center"><TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" /><p className="text-sm text-green-700">إجمالي الإيرادات</p><p className="text-2xl font-bold text-green-600">{transactions.filter(t=>t.type==='income'||t.type==='payment_received').reduce((s,t)=>s+t.amount,0).toLocaleString()} ر.س</p></CardContent></Card>
        <Card className="bg-red-50 border-red-200"><CardContent className="pt-6 pb-6 text-center"><TrendingDown className="w-8 h-8 mx-auto mb-2 text-red-600" /><p className="text-sm text-red-700">إجمالي المصروفات</p><p className="text-2xl font-bold text-red-600">{transactions.filter(t=>t.type==='expense'||t.type==='payment_sent').reduce((s,t)=>s+t.amount,0).toLocaleString()} ر.س</p></CardContent></Card>
        <Card className="bg-blue-50 border-blue-200"><CardContent className="pt-6 pb-6 text-center"><DollarSign className="w-8 h-8 mx-auto mb-2 text-blue-600" /><p className="text-sm text-blue-700">صافي الرصيد</p><p className="text-2xl font-bold text-blue-600">{treasuryBalance.toLocaleString()} ر.س</p></CardContent></Card>
      </div>
      <Card><CardContent className="pt-6"><Table><TableHeader><TableRow><TableHead>المرجع</TableHead><TableHead>النوع</TableHead><TableHead>التصنيف</TableHead><TableHead>الوصف</TableHead><TableHead>المبلغ</TableHead><TableHead>التاريخ</TableHead></TableRow></TableHeader><TableBody>{transactions.map(t => (<TableRow key={t.id}><TableCell><Badge variant="outline">{t.reference||'-'}</Badge></TableCell><TableCell><Badge variant={t.type.startsWith('income')||t.type==='payment_received'?'default':'destructive'}>{t.type==='income'?'إيراد':t.type==='expense'?'مصروف':t.type==='payment_received'?'تحصيل':'دفع'}</Badge></TableCell><TableCell>{t.category}</TableCell><TableCell>{t.description}</TableCell><TableCell className={t.type.startsWith('income')||t.type==='payment_received'?'text-green-600':'text-red-600'}>{t.type.startsWith('income')||t.type==='payment_received'?'+':'-'}{t.amount.toLocaleString()}</TableCell><TableCell>{t.date}</TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
    </div>
  )
}

// ==================== HR MODULE ====================
function HRModule({ employees, salaries, attendance }: any) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#005f73]">الموارد البشرية والرواتب</h1>
        <Dialog><DialogTrigger asChild><Button className="bg-gradient-to-r from-teal-600 to-teal-700"><Plus className="ml-2 h-4 w-4" />موظف جديد</Button></DialogTrigger><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>إضافة موظف جديد</DialogTitle></DialogHeader><div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><Label>الاسم الكامل (عربي)</Label><Input placeholder="الاسم بالعربية" /></div><div><Label>الرقم الوظيفي</Label><Input placeholder="EMP-XXX" /></div></div><div className="grid grid-cols-2 gap-4"><div><Label>القسم</Label><Select><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="accounts">المحاسبة</SelectItem><SelectItem value="sales">المبيعات</SelectItem><SelectItem value="inventory">المخزون</SelectItem><SelectItem value="it">تقنية المعلومات</SelectItem><SelectItem value="hr">الموارد البشرية</SelectItem></SelectContent></Select></div><div><Label>الراتب الأساسي</Label><Input type="number" placeholder="0" /></div></div><Button className="w-full bg-teal-600">إضافة الموظف</Button></div></DialogContent></Dialog>
      </div>
      <Tabs defaultValue="employees">
        <TabsList className="grid w-full grid-cols-4"><TabsTrigger value="employees">الموظفون</TabsTrigger><TabsTrigger value="salaries">الرواتب</TabsTrigger><TabsTrigger value="attendance">الحضور</TabsTrigger><TabsTrigger value="loans">السلف</TabsTrigger></TabsList>
        <TabsContent value="employees">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map(emp => (
              <Card key={emp.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">{emp.fullNameAr[0]}</div>
                    <div><h3 className="font-bold">{emp.fullNameAr}</h3><p className="text-sm text-gray-500">{emp.employeeCode}</p></div>
                  </div>
                  <div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-gray-500">القسم</span><span>{emp.department}</span></div><div className="flex justify-between"><span className="text-gray-500">المنصب</span><span>{emp.position}</span></div><div className="flex justify-between"><span className="text-gray-500">الراتب الأساسي</span><span className="font-medium">{emp.baseSalary.toLocaleString()} ر.س</span></div></div>
                  <Separator className="my-3" />
                  <div className="flex justify-between items-center"><Badge variant={emp.status==='active'?'default':emp.status==='on_leave'?'secondary':'outline'}>{emp.status==='active'?'نشط':emp.status==='on_leave'?'في إجازة':'معطل'}</Badge><Phone className="w-4 h-4 text-gray-400" /></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="salaries">
          <Card><CardContent className="pt-6"><Table><TableHeader><TableRow><TableHead>الموظف</TableHead><TableHead>الشهر</TableHead><TableHead>الأساسي</TableHead><TableHead>البدلات</TableHead><TableHead>الخصومات</TableHead><TableHead>الصافي</TableHead><TableHead>الحالة</TableHead></TableRow></TableHeader><TableBody>{salaries.map(sal => (<TableRow key={sal.id}><TableCell>{sal.employeeName}</TableCell><TableCell>{sal.month}/{sal.year}</TableCell><TableCell>{sal.baseSalary.toLocaleString()}</TableCell><TableCell className="text-green-600">+{sal.allowances.toLocaleString()}</TableCell><TableCell className="text-red-600">-{sal.deductions.toLocaleString()}</TableCell><TableCell className="font-bold">{sal.netSalary.toLocaleString()} ر.س</TableCell><TableCell><Badge variant={sal.status==='paid'?'default':sal.status==='approved'?'secondary':'outline'}>{sal.status==='paid'?'مدفوع':sal.status==='approved'?'موافق عليه':'مسودة'}</Badge></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
        </TabsContent>
        <TabsContent value="attendance">
          <Card><CardContent className="pt-6"><Table><TableHeader><TableRow><TableHead>الموظف</TableHead><TableHead>التاريخ</TableHead><TableHead>حضور</TableHead><TableHead>انصراف</TableHead><TableHead>ساعات العمل</TableHead><TableHead>الحالة</TableHead></TableRow></TableHeader><TableBody>{attendance.map(att => (<TableRow key={att.id}><TableCell>{att.employeeName}</TableCell><TableCell>{att.date}</TableCell><TableCell>{att.clockIn}</TableCell><TableCell>{att.clockOut}</TableCell><TableCell>{att.workingHours}</TableCell><TableCell><Badge variant={att.status==='present'?'default':att.status==='late'?'destructive':'outline'}>{att.status==='present'?'حاضر':att.status==='late'?'متأخر':att.status==='leave'?'إجازة':'غائب'}</Badge></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
        </TabsContent>
        <TabsContent value="loans">
          <Card><CardContent className="pt-6"><p className="text-gray-500 text-center py-8">لا توجد سلف حالياً</p></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ==================== EXPENSES MODULE ====================
function ExpensesModule({ expenses }: any) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#005f73]">المصروفات والإيرادات</h1>
        <Dialog><DialogTrigger asChild><Button className="bg-gradient-to-r from-orange-600 to-orange-700"><Plus className="ml-2 h-4 w-4" />مصروف جديد</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>إضافة مصروف جديد</DialogTitle></DialogHeader><div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><Label>التصنيف</Label><Select><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="admin">مصروفات إدارية</SelectItem><SelectItem value="operating">مصروفات تشغيلية</SelectItem><SelectItem value="marketing">مصروفات تسويقية</SelectItem><SelectItem value="travel">مصروفات سفر</SelectItem><SelectItem value="maintenance">مصروفات صيانة</SelectItem></SelectContent></Select></div><div><Label>المبلغ</Label><Input type="number" placeholder="0.00" /></div></div><Button className="w-full bg-orange-600">حفظ المصروف</Button></div></DialogContent></Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="pt-6 pb-6 text-center"><Receipt className="w-8 h-8 mx-auto mb-2 text-orange-500" /><p className="text-sm text-gray-500">إجمالي المصروفات</p><p className="text-2xl font-bold text-orange-600">{expenses.reduce((s,e)=>s+e.amount,0).toLocaleString()} ر.س</p></CardContent></Card>
        <Card><CardContent className="pt-6 pb-6 text-center"><RefreshCw className="w-8 h-8 mx-auto mb-2 text-blue-500" /><p className="text-sm text-gray-500">مصروفات دورية</p><p className="text-2xl font-bold text-blue-600">{expenses.filter(e=>e.isRecurring).length}</p></CardContent></Card>
        <Card><CardContent className="pt-6 pb-6 text-center"><Calendar className="w-8 h-8 mx-auto mb-2 text-green-500" /><p className="text-sm text-gray-500">هذا الشهر</p><p className="text-2xl font-bold text-green-600">{expenses.filter(e=>e.date.startsWith('2024-01')).reduce((s,e)=>s+e.amount,0).toLocaleString()} ر.س</p></CardContent></Card>
        <Card><CardContent className="pt-6 pb-6 text-center"><PieChart className="w-8 h-8 mx-auto mb-2 text-purple-500" /><p className="text-sm text-gray-500">تصنيفات</p><p className="text-2xl font-bold text-purple-600">{new Set(expenses.map(e=>e.category)).size}</p></CardContent></Card>
      </div>
      <Card><CardContent className="pt-6"><Table><TableHeader><TableRow><TableHead>التصنيف</TableHead><TableHead>الفرعي</TableHead><TableHead>الوصف</TableHead><TableHead>المبلغ</TableHead><TableHead>التاريخ</TableHead><TableHead>دوري</TableHead></TableRow></TableHeader><TableBody>{expenses.map(exp => (<TableRow key={exp.id}><TableCell><Badge variant="outline">{exp.category}</Badge></TableCell><TableCell>{exp.subcategory}</TableCell><TableCell>{exp.description}</TableCell><TableCell className="text-red-600 font-medium">{exp.amount.toLocaleString()} ر.س</TableCell><TableCell>{exp.date}</TableCell><TableCell>{exp.isRecurring ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-gray-300" />}</TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
    </div>
  )
}

// ==================== REPORTS MODULE ====================
function ReportsModule() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#005f73]">التقارير المالية</h1>
        <div className="flex gap-2"><Input type="date" className="w-40" defaultValue="2024-01-01" /><Input type="date" className="w-40" defaultValue="2024-01-31" /><Button variant="outline"><Filter className="ml-2 h-4 w-4" />تطبيق</Button></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: 'قائمة الدخل', desc: 'الإيرادات والمصروفات وصافي الربح', icon: BarChart3 },
          { title: 'قائمة الميزانية', desc: 'الأصول والخصوم وحقوق الملكية', icon: PieChart },
          { title: 'التدفقات النقدية', desc: 'التدفقات من الأنشطة المختلفة', icon: Activity },
          { title: 'ميزان المراجعة', desc: 'أرصدة جميع الحسابات', icon: BookOpen },
          { title: 'الأستاذ العام', desc: 'تفاصيل حركات كل حساب', icon: FileBarChart },
          { title: 'تقرير المبيعات', desc: 'تحليل المبيعات حسب الفترة', icon: TrendingUp },
          { title: 'تقرير المشتريات', desc: 'تحليل المشتريات حسب المورد', icon: TrendingDown },
          { title: 'تقرير المخزون', desc: 'حركة وقيمة المخزون', icon: Package },
          { title: 'أعمار العملاء', desc: 'مستحقات العملاء حسب العمر', icon: Users },
        ].map((report, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-all cursor-pointer group">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><report.icon className="w-6 h-6 text-gray-600" /></div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button><Button size="sm" variant="ghost"><Printer className="h-4 w-4" /></Button><Button size="sm" variant="ghost"><Download className="h-4 w-4" /></Button></div>
              </div>
              <h3 className="font-bold text-lg">{report.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{report.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sample Income Statement Preview */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-green-600" />قائمة الدخل - يناير 2024</CardTitle></CardHeader>
        <CardContent>
          <div className="max-w-2xl mx-auto">
            <Table><TableHeader><TableRow><TableHead colSpan={2} className="text-center">الإيرادات</TableHead></TableRow></TableHeader><TableBody>
              <TableRow><TableCell>إيرادات المبيعات</TableCell><TableCell className="text-left font-medium">450,000 ر.س</TableCell></TableRow>
              <TableRow><TableCell>إيرادات أخرى</TableCell><TableCell className="text-left">15,000 ر.س</TableCell></TableRow>
              <TableRow className="bg-green-50 font-bold"><TableCell>إجمالي الإيرادات</TableCell><TableCell className="text-left text-green-600">465,000 ر.س</TableCell></TableRow>
              <TableRow><TableHead colSpan={2} className="text-center pt-4">المصروفات</TableHead></TableRow>
              <TableRow><TableCell>تكلفة المبيعات</TableCell><TableCell className="text-left">(280,000) ر.س</TableCell></TableRow>
              <TableRow><TableCell>مصروفات الرواتب</TableCell><TableCell className="text-left">(95,000) ر.س</TableCell></TableRow>
              <TableRow><TableCell>مصروفات إدارية</TableCell><TableCell className="text-left">(35,000) ر.س</TableCell></TableRow>
              <TableRow><TableCell>مصروفات تشغيلية</TableCell><TableCell className="text-left">(28,000) ر.س</TableCell></TableRow>
              <TableRow><TableCell>مصروفات تسويقية</TableCell><TableCell className="text-left">(18,000) ر.س</TableCell></TableRow>
              <TableRow className="bg-red-50 font-bold"><TableCell>إجمالي المصروفات</TableCell><TableCell className="text-left text-red-600">(456,000) ر.س</TableCell></TableRow>
              <TableRow className="bg-blue-50 text-lg"><TableCell className="font-bold">صافي الربح</TableCell><TableCell className="text-left font-bold text-blue-600">9,000 ر.س</TableCell></TableRow>
            </TableBody></Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ==================== SETTINGS MODULE ====================
function SettingsModule({ users }: any) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-bold text-[#005f73]">الإعدادات</h1>
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-5"><TabsTrigger value="general">عام</TabsTrigger><TabsTrigger value="company">الشركة</TabsTrigger><TabsTrigger value="invoice">الفواتير</TabsTrigger><TabsTrigger value="users">المستخدمين</TabsTrigger><TabsTrigger value="backup">النسخ الاحتياطي</TabsTrigger></TabsList>
        <TabsContent value="general">
          <Card><CardContent className="pt-6 space-y-4"><div className="grid grid-cols-2 gap-4"><div><Label>لغة النظام</Label><Select defaultValue="ar"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ar">العربية</SelectItem><SelectItem value="en">English</SelectItem></SelectContent></Select></div><div><Label>العملة</Label><Select defaultValue="sar"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="sar">ريال سعودي (SAR)</SelectItem><SelectItem value="aed">درهم إماراتي (AED)</SelectItem><SelectItem value="egp">جنيه مصري (EGP)</SelectItem></SelectContent></Select></div></div><Button className="bg-[#005f73]">حفظ الإعدادات</Button></CardContent></Card>
        </TabsContent>
        <TabsContent value="company">
          <Card><CardContent className="pt-6 space-y-4"><div className="grid grid-cols-2 gap-4"><div><Label>اسم الشركة</Label><Input defaultValue="شركة إنجاز للمحاسبة" /></div><div><Label>الاسم بالإنجليزية</Label><Input defaultValue="Injaz Accounting Co." /></div></div><div className="grid grid-cols-2 gap-4"><div><Label>الرقم الضريبي</Label><Input placeholder="الرقم الضريبي" /></div><div><Label>السجل التجاري</Label><Input placeholder="السجل التجاري" /></div></div><Button className="bg-[#005f73]">حفظ بيانات الشركة</Button></CardContent></Card>
        </TabsContent>
        <TabsContent value="invoice">
          <Card><CardContent className="pt-6 space-y-4"><div className="grid grid-cols-2 gap-4"><div><Label>بادئة رقم فاتورة المبيعات</Label><Input defaultValue="INV-" /></div><div><Label>بادئة رقم فاتورة المشتريات</Label><Input defaultValue="PUR-" /></div></div><div className="grid grid-cols-2 gap-4"><div><Label>شروط الدفع (يوم)</Label><Input type="number" defaultValue="30" /></div><div><Label>ضريبة القيمة المضافة %</Label><Input type="number" defaultValue="15" /></div></div><Button className="bg-[#005f73]">حفظ إعدادات الفواتير</Button></CardContent></Card>
        </TabsContent>
        <TabsContent value="users">
          <Card><CardContent className="pt-6"><div className="flex justify-between items-center mb-4"><h3 className="font-semibold">إدارة المستخدمين</h3><Dialog><DialogTrigger asChild><Button variant="outline" size="sm"><Plus className="ml-2 h-4 w-4" />مستخدم جديد</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>إضافة مستخدم جديد</DialogTitle></DialogHeader><div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><Label>الاسم</Label><Input placeholder="اسم المستخدم" /></div><div><Label>البريد الإلكتروني</Label><Input type="email" placeholder="email@example.com" /></div></div><div className="grid grid-cols-2 gap-4"><div><Label>كلمة المرور</Label><Input type="password" /></div><div><Label>الدور</Label><Select><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="admin">مدير</SelectItem><SelectItem value="accountant">محاسب</SelectItem><SelectItem value="cashier">أمين صندوق</SelectItem><SelectItem value="viewer">مشاهد</SelectItem></SelectContent></Select></div></div><Button className="w-full bg-[#005f73]">إضافة المستخدم</Button></div></DialogContent></Dialog></div><Table><TableHeader><TableRow><TableHead>الاسم</TableHead><TableHead>البريد</TableHead><TableHead>الدور</TableHead><TableHead>الحالة</TableHead><TableHead>إجراءات</TableHead></TableRow></TableHeader><TableBody>{users.map(user => (<TableRow key={user.id}><TableCell className="font-medium">{user.name}</TableCell><TableCell>{user.email}</TableCell><TableCell><Badge variant={user.role==='admin'?'default':user.role==='accountant'?'secondary':'outline'}>{user.role==='admin'?'مدير':user.role==='accountant'?'محاسب':user.role==='cashier'?'أمين صندوق':'مشاهد'}</Badge></TableCell><TableCell><Badge variant={user.isActive?'default':'destructive'}>{user.isActive?'نشط':'معطل'}</Badge></TableCell><TableCell><div className="flex gap-1"><Button size="sm" variant="ghost"><Edit2 className="h-4 w-4" /></Button><Button size="sm" variant="ghost" className="text-red-500"><Trash2 className="h-4 w-4" /></Button></div></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
        </TabsContent>
        <TabsContent value="backup">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Database className="w-5 h-5" />نسخ احتياطي</CardTitle><CardDescription>قم بإنشاء نسخة احتياطية من جميع بيانات النظام</CardDescription></CardHeader><CardContent className="space-y-4"><Button className="w-full bg-green-600"><Download className="ml-2 h-4 w-4" />إنشاء نسخة احتياطية الآن</Button><p className="text-sm text-gray-500">آخر نسخة: 2024-01-20 14:30</p></CardContent></Card>
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Upload className="w-5 h-5" />استعادة</CardTitle><CardDescription>استعادة بيانات من نسخة احتياطية سابقة</CardDescription></CardHeader><CardContent className="space-y-4"><Button className="w-full bg-blue-600" variant="outline"><Upload className="ml-2 h-4 w-4" />اختيار ملف النسخة الاحتياطية</Button><p className="text-sm text-red-500">تحذير: سيتم استبدال جميع البيانات الحالية</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
