'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, Printer } from 'lucide-react'
import { JournalEntry } from '@/app/page'

// ============ HELPER FUNCTIONS ============
const calculateBalances = (entries: JournalEntry[]) => {
  const balances: { [key: string]: { debit: number; credit: number; name: string } } = {}
  
  entries.forEach(entry => {
    entry.lines.forEach(line => {
      const code = String(line.accountCode || '')
      if (!balances[code]) {
        balances[code] = { debit: 0, credit: 0, name: String(line.accountName || '') }
      }
      balances[code].debit += Number(line.debit) || 0
      balances[code].credit += Number(line.credit) || 0
    })
  })
  
  return balances
}

const getAccountType = (code: string): string => {
  const c = String(code || '')
  if (c.startsWith('1')) return 'أصل'
  if (c.startsWith('2')) return 'التزام'
  if (c.startsWith('3')) return 'حقوق ملكية'
  if (c.startsWith('4')) return 'إيراد'
  if (c.startsWith('5')) return 'مصروف'
  return 'أخرى'
}

// ============ INCOME STATEMENT COMPONENT ============
interface IncomeStatementProps {
  entries: JournalEntry[]
}

export const IncomeStatementReport: React.FC<IncomeStatementProps> = ({ entries }) => {
  const balances = calculateBalances(entries)
  
  let totalRevenue = 0
  let totalExpenses = 0
  const revenueItems: { name: string; amount: number }[] = []
  const expenseItems: { name: string; amount: number }[] = []

  Object.entries(balances).forEach(([code, data]) => {
    const codeStr = String(code)
    
    // الإيرادات (تبدأ بـ 4)
    if (codeStr.startsWith('4')) {
      const net = data.credit - data.debit
      if (net !== 0) {
        revenueItems.push({ name: data.name, amount: net })
        totalRevenue += net
      }
    }
    
    // المصروفات (تبدأ بـ 5)
    if (codeStr.startsWith('5')) {
      const net = data.debit - data.credit
      if (net !== 0) {
        expenseItems.push({ name: data.name, amount: net })
        totalExpenses += net
      }
    }
  })

  const netIncome = totalRevenue - totalExpenses

  const exportToCSV = () => {
    let csv = '\uFEFFقائمة الدخل\n'
    csv += `التاريخ:,${new Date().toLocaleDateString('ar-SA')}\n\n`
    csv += 'الإيرادات\nالبند,المبلغ (ج.م)\n'
    revenueItems.forEach(item => { csv += `"${item.name}",${item.amount}\n` })
    csv += `إجمالي الإيرادات,${totalRevenue}\n\n`
    csv += 'المصروفات\nالبند,المبلغ (ج.م)\n'
    expenseItems.forEach(item => { csv += `"${item.name}",${item.amount}\n` })
    csv += `إجمالي المصروفات,${totalExpenses}\n\n`
    csv += `صافي الربح,${netIncome}\n`
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `income_statement_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-100 border-2 border-green-300">
        <CardContent className="py-6">
          <div className="flex items-center justify-around text-center">
            <div>
              <p className="text-sm text-green-700">إجمالي الإيرادات</p>
              <p className="text-3xl font-bold text-green-800">{totalRevenue.toLocaleString()} ج.م</p>
            </div>
            <div className="text-4xl text-gray-400">-</div>
            <div>
              <p className="text-sm text-red-700">إجمالي المصروفات</p>
              <p className="text-3xl font-bold text-red-800">{totalExpenses.toLocaleString()} ج.م</p>
            </div>
            <div className="text-4xl text-gray-400">=</div>
            <div>
              <p className={`text-sm ${netIncome >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                صافي {netIncome >= 0 ? 'الربح' : 'الخسارة'}
              </p>
              <p className={`text-3xl font-bold ${netIncome >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                {Math.abs(netIncome).toLocaleString()} ج.م
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <div className="grid grid-cols-2 gap-6">
        {/* Revenue */}
        <Card>
          <CardHeader className="bg-green-100">
            <CardTitle className="text-green-800">💰 الإيرادات</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr><th className="text-right p-2 font-bold">البند</th><th className="text-left p-2 font-bold">المبلغ</th></tr>
              </thead>
              <tbody>
                {revenueItems.length > 0 ? (
                  revenueItems.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{item.name}</td>
                      <td className="p-2 text-left font-bold text-green-600">{item.amount.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={2} className="p-4 text-center text-gray-500">لا توجد إيرادات</td></tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-green-50 font-bold">
                  <td className="p-2">الإجمالي</td>
                  <td className="p-2 text-left text-green-700">{totalRevenue.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </CardContent>
        </Card>

        {/* Expenses */}
        <Card>
          <CardHeader className="bg-red-100">
            <CardTitle className="text-red-800">💸 المصروفات</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr><th className="text-right p-2 font-bold">البند</th><th className="text-left p-2 font-bold">المبلغ</th></tr>
              </thead>
              <tbody>
                {expenseItems.length > 0 ? (
                  expenseItems.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{item.name}</td>
                      <td className="p-2 text-left font-bold text-red-600">{item.amount.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={2} className="p-4 text-center text-gray-500">لا توجد مصروفات</td></tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-red-50 font-bold">
                  <td className="p-2">الإجمالي</td>
                  <td className="p-2 text-left text-red-700">{totalExpenses.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={exportToCSV}>
          <Download className="ml-2 h-4 w-4" />
          تصدير CSV
        </Button>
        <Button onClick={() => window.print()}>
          <Printer className="ml-2 h-4 w-4" />
          طباعة
        </Button>
      </div>
    </div>
  )
}

// ============ BALANCE SHEET COMPONENT ============
interface BalanceSheetProps {
  entries: JournalEntry[]
}

export const BalanceSheetReport: React.FC<BalanceSheetProps> = ({ entries }) => {
  const balances = calculateBalances(entries)
  
  const assets: { name: string; amount: number }[] = []
  const liabilities: { name: string; amount: number }[] = []
  const equity: { name: string; amount: number }[] = []
  let totalAssets = 0
  let totalLiabilities = 0
  let totalEquity = 0

  Object.entries(balances).forEach(([code, data]) => {
    const codeStr = String(code)
    const net = data.debit - data.credit
    
    // الأصول (تبدأ بـ 1)
    if (codeStr.startsWith('1')) {
      if (net !== 0) {
        assets.push({ name: data.name, amount: Math.abs(net) })
        totalAssets += Math.abs(net)
      }
    }
    
    // الالتزامات (تبدأ بـ 2)
    if (codeStr.startsWith('2')) {
      if (net !== 0) {
        liabilities.push({ name: data.name, amount: Math.abs(net) })
        totalLiabilities += Math.abs(net)
      }
    }
    
    // حقوق الملكية (تبدأ بـ 3)
    if (codeStr.startsWith('3')) {
      if (net !== 0) {
        equity.push({ name: data.name, amount: Math.abs(net) })
        totalEquity += Math.abs(net)
      }
    }
  })

  const isBalanced = totalAssets === (totalLiabilities + totalEquity)

  const exportToCSV = () => {
    let csv = '\uFEFFالميزانية العمومية\n'
    csv += `التاريخ:,${new Date().toLocaleDateString('ar-SA')}\n\n`
    csv += 'الأصول\nالبند,المبلغ (ج.م)\n'
    assets.forEach(item => { csv += `"${item.name}",${item.amount}\n` })
    csv += `إجمالي الأصول,${totalAssets}\n\n`
    csv += 'الالتزامات\nالبند,المبلغ (ج.م)\n'
    liabilities.forEach(item => { csv += `"${item.name}",${item.amount}\n` })
    csv += `إجمالي الالتزامات,${totalLiabilities}\n\n`
    csv += 'حقوق الملكية\nالبند,المبلغ (ج.م)\n'
    equity.forEach(item => { csv += `"${item.name}",${item.amount}\n` })
    csv += `إجمالي حقوق الملكية,${totalEquity}\n`
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `balance_sheet_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* Equation Card */}
      <Card className={`bg-gradient-to-r from-blue-50 to-indigo-100 border-2 ${isBalanced ? 'border-green-400' : 'border-red-400'}`}>
        <CardContent className="py-6">
          <h3 className="text-xl font-bold text-center text-blue-800 mb-4">معادلة الميزانية</h3>
          <div className="flex items-center justify-center gap-4 text-xl md:text-2xl font-bold flex-wrap">
            <span className="text-blue-700">الأصول: {totalAssets.toLocaleString()} ج.م</span>
            <span className="text-gray-500">=</span>
            <span className="text-purple-700">الالتزامات: {totalLiabilities.toLocaleString()} ج.م</span>
            <span className="text-gray-500">+</span>
            <span className="text-green-700">حقوق الملكية: {totalEquity.toLocaleString()} ج.م</span>
          </div>
          <div className={`mt-4 p-3 rounded-lg text-center font-bold ${isBalanced ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isBalanced ? '✅ الميزانية متوازنة' : `⚠️ غير متوازنة - الفرق: ${Math.abs(totalAssets - totalLiabilities - totalEquity).toLocaleString()} ج.م`}
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assets */}
        <Card>
          <CardHeader className="bg-blue-100">
            <CardTitle className="text-blue-800">🏢 الأصول</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <tbody>
                {assets.length > 0 ? (
                  assets.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{item.name}</td>
                      <td className="p-2 text-left font-bold">{item.amount.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={2} className="p-4 text-center text-gray-500">لا توجد أصول</td></tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-blue-50 font-bold">
                  <td className="p-2">الإجمالي</td>
                  <td className="p-2 text-left text-blue-700">{totalAssets.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </CardContent>
        </Card>

        {/* Liabilities & Equity */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="bg-purple-100">
              <CardTitle className="text-purple-800">📋 الالتزامات</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <tbody>
                  {liabilities.length > 0 ? (
                    liabilities.map((item, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2">{item.name}</td>
                        <td className="p-2 text-left font-bold">{item.amount.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={2} className="p-4 text-center text-gray-500">لا التزامات</td></tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-purple-50 font-bold">
                    <td className="p-2">الإجمالي</td>
                    <td className="p-2 text-left text-purple-700">{totalLiabilities.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-green-100">
              <CardTitle className="text-green-800">👥 حقوق الملكية</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <tbody>
                  {equity.length > 0 ? (
                    equity.map((item, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2">{item.name}</td>
                        <td className="p-2 text-left font-bold">{item.amount.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={2} className="p-4 text-center text-gray-500">لا توجد</td></tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-green-50 font-bold">
                    <td className="p-2">الإجمالي</td>
                    <td className="p-2 text-left text-green-700">{totalEquity.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={exportToCSV}>
          <Download className="ml-2 h-4 w-4" />
          تصدير CSV
        </Button>
        <Button onClick={() => window.print()}>
          <Printer className="ml-2 h-4 w-4" />
          طباعة
        </Button>
      </div>
    </div>
  )
}

// ============ TRIAL BALANCE COMPONENT ============
interface TrialBalanceProps {
  entries: JournalEntry[]
}

export const TrialBalanceReport: React.FC<TrialBalanceProps> = ({ entries }) => {
  const balances = calculateBalances(entries)
  
  interface AccountRow {
    code: string
    name: string
    debit: number
    credit: number
    type: string
  }
  
  const accounts: AccountRow[] = []
  let totalDebit = 0
  let totalCredit = 0

  Object.entries(balances).forEach(([code, data]) => {
    const codeStr = String(code)
    const net = data.debit - data.credit
    
    if (net !== 0) {
      const row: AccountRow = {
        code: codeStr,
        name: data.name,
        debit: net > 0 ? net : 0,
        credit: net < 0 ? Math.abs(net) : 0,
        type: getAccountType(codeStr)
      }
      
      accounts.push(row)
      totalDebit += row.debit
      totalCredit += row.credit
    }
  })

  const isBalanced = totalDebit === totalCredit

  const exportToCSV = () => {
    let csv = '\uFEFFميزان المراجعة\n'
    csv += `التاريخ:,${new Date().toLocaleDateString('ar-SA')}\n\n`
    csv += 'كود الحساب,اسم الحساب,النوع,مدين (ج.م),دائن (ج.م)\n'
    accounts.forEach(acc => {
      csv += `${acc.code},"${acc.name}","${acc.type}",${acc.debit},${acc.credit}\n`
    })
    csv += `الإجمالي,,${totalDebit},${totalCredit}\n`
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `trial_balance_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className={`bg-gradient-to-r from-orange-50 to-amber-100 border-2 ${isBalanced ? 'border-green-400' : 'border-red-400'}`}>
        <CardContent className="py-6">
          <div className="flex items-center justify-around text-center">
            <div>
              <p className="text-sm text-orange-700">إجمالي المدين</p>
              <p className="text-3xl font-bold text-orange-800">{totalDebit.toLocaleString()} ج.م</p>
            </div>
            <div className={`text-4xl font-bold ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
              {isBalanced ? '=' : '≠'}
            </div>
            <div>
              <p className="text-sm text-orange-700">إجمالي الدائن</p>
              <p className="text-3xl font-bold text-orange-800">{totalCredit.toLocaleString()} ج.م</p>
            </div>
          </div>
          <div className={`mt-4 p-3 rounded-lg text-center font-bold ${isBalanced ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isBalanced 
              ? '✅ ميزان المراجعة متوازن' 
              : `❌ غير متوازن - الفرق: ${Math.abs(totalDebit - totalCredit).toLocaleString()} ج.م`}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="bg-orange-100">
          <CardTitle className="text-orange-800">⚖️ تفاصيل الحسابات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-orange-200">
                <tr>
                  <th className="text-right p-3 font-bold">كود الحساب</th>
                  <th className="text-right p-3 font-bold">اسم الحساب</th>
                  <th className="text-right p-3 font-bold">النوع</th>
                  <th className="text-left p-3 font-bold">مدين</th>
                  <th className="text-left p-3 font-bold">دائن</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc, idx) => (
                  <tr key={idx} className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-orange-50'}`}>
                    <td className="p-3 font-mono font-bold text-orange-700">{acc.code}</td>
                    <td className="p-3">{acc.name}</td>
                    <td className="p-3">
                      <Badge className="bg-orange-100 text-orange-800">{acc.type}</Badge>
                    </td>
                    <td className="p-3 text-left font-bold text-red-600">
                      {acc.debit > 0 ? acc.debit.toLocaleString() : '-'}
                    </td>
                    <td className="p-3 text-left font-bold text-green-600">
                      {acc.credit > 0 ? acc.credit.toLocaleString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-orange-100 font-bold">
                <tr>
                  <td colSpan={3} className="p-3 text-left">الإجمالي:</td>
                  <td className="p-3 text-left text-red-700">{totalDebit.toLocaleString()}</td>
                  <td className="p-3 text-left text-green-700">{totalCredit.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={exportToCSV}>
          <Download className="ml-2 h-4 w-4" />
          تصدير CSV
        </Button>
        <Button onClick={() => window.print()}>
          <Printer className="ml-2 h-4 w-4" />
          طباعة
        </Button>
      </div>
    </div>
  )
}
