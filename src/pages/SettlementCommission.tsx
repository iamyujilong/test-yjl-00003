import { useState, useEffect } from 'react'
import { api } from '../api'

export function SettlementCommission() {
  const [commissions, setCommissions] = useState<any[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const res = await api.settlement.commission.list()
    setCommissions(res.data || [])
  }

  const totalCommission = commissions.reduce((sum, c) => sum + Number(c.amount), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">佣金结算</h1>
        <p className="text-gray-500 mt-1">管理销售佣金计算与结算</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">本月佣金总额</p>
            <p className="text-3xl font-bold text-primary mt-1">¥{totalCommission.toLocaleString()}</p>
          </div>
          <div className="px-6 py-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-gray-500">结算周期</p>
            <p className="font-medium text-gray-900 mt-1">每月15日</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">订单号</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">销售员</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">销售金额</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">佣金比例</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">佣金金额</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {commissions.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.order_no}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{c.salesperson_name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">¥{Number(c.sales_amount).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{c.rate}%</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">¥{Number(c.amount).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    c.status === 'calculated' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {c.status === 'calculated' ? '已计算' : '已结算'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
