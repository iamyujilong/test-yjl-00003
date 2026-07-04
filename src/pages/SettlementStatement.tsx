import { useState, useEffect } from 'react'
import { Download, Calendar } from 'lucide-react'
import { api } from '../api'

export function SettlementStatement() {
  const [statements, setStatements] = useState<any[]>([])
  const [filterType, setFilterType] = useState('supplier')

  useEffect(() => {
    fetchData()
  }, [filterType])

  const fetchData = async () => {
    const res = await api.settlement.statement.list({ type: filterType })
    setStatements(res.data || [])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">对账单</h1>
          <p className="text-gray-500 mt-1">按供应商或客户维度查看对账单</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primaryDark transition-colors">
          <Calendar className="w-5 h-5" />
          生成对账单
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex gap-4">
          <button
            onClick={() => setFilterType('supplier')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'supplier' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            供应商对账单
          </button>
          <button
            onClick={() => setFilterType('customer')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'customer' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            客户对账单
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {statements.map((statement) => (
          <div key={statement.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">{statement.name}</h3>
                  <span className="text-sm text-gray-500">{statement.period}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{statement.type === 'supplier' ? '供应商' : '客户'} · {statement.contact}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">总金额</p>
                <p className="text-xl font-bold text-primary">¥{Number(statement.total_amount).toLocaleString()}</p>
              </div>
            </div>
            <div className="p-6">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">订单号</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">金额</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {statement.items.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.order_no}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">¥{Number(item.amount).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          item.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {item.status === 'paid' ? '已结算' : '待结算'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 flex justify-end">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Download className="w-4 h-4" />
                  下载对账单
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
