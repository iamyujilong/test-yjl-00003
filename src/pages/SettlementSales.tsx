import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { api } from '../api'

export function SettlementSales() {
  const [records, setRecords] = useState<any[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const res = await api.settlement.sales.list()
    setRecords(res.data || [])
  }

  const totalPending = records.filter(r => r.status === 'pending').reduce((sum, r) => sum + Number(r.amount), 0)
  const totalPaid = records.filter(r => r.status === 'paid').reduce((sum, r) => sum + Number(r.amount), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">销售收款</h1>
          <p className="text-gray-500 mt-1">管理销售订单收款</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primaryDark transition-colors">
          <Plus className="w-5 h-5" />
          创建收款
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">待收款金额</p>
          <p className="text-2xl font-bold text-orange-500 mt-1">¥{totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">已收款金额</p>
          <p className="text-2xl font-bold text-green-500 mt-1">¥{totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">收款笔数</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{records.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">订单号</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">金额</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">状态</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">创建时间</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{record.order_no || '-'}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">¥{Number(record.amount).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    record.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {record.status === 'pending' ? '待收款' : '已收款'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{record.created_at?.split('T')[0]}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end">
                    {record.status === 'pending' && (
                      <button className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors">
                        确认收款
                      </button>
                    )}
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
