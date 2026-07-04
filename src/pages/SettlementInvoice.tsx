import { useState, useEffect } from 'react'
import { Plus, FileText } from 'lucide-react'
import { api } from '../api'

export function SettlementInvoice() {
  const [invoices, setInvoices] = useState<any[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const res = await api.settlement.invoice.list()
    setInvoices(res.data || [])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">发票管理</h1>
          <p className="text-gray-500 mt-1">管理采购和销售发票</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primaryDark transition-colors">
          <Plus className="w-5 h-5" />
          上传发票
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">发票编号</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">订单号</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">类型</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">金额</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">状态</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.invoice_no}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{invoice.order_no || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {invoice.type === 'purchase' ? '采购发票' : '销售发票'}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">¥{Number(invoice.amount).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {invoice.status === 'pending' ? '待审核' : '已审核'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                      <FileText className="w-4 h-4" />
                      查看
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
