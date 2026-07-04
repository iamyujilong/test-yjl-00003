import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Eye, Check, X } from 'lucide-react'
import { api } from '../api'

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: '待审核', color: 'bg-yellow-100 text-yellow-700' },
  approved: { label: '已审核', color: 'bg-blue-100 text-blue-700' },
  unpaid: { label: '待付款', color: 'bg-orange-100 text-orange-700' },
  paid: { label: '已付款', color: 'bg-green-100 text-green-700' },
  transporting: { label: '运输中', color: 'bg-purple-100 text-purple-700' },
  delivered: { label: '已交付', color: 'bg-cyan-100 text-cyan-700' },
  completed: { label: '已完成', color: 'bg-gray-100 text-gray-700' },
}

export function PurchaseOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const res = await api.orders.purchase.list()
    setOrders(res.data || [])
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_no.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = async (id: number, status: string) => {
    await api.orders.purchase.status(id, status)
    fetchOrders()
  }

  const handleView = async (order: any) => {
    const res = await api.orders.purchase.detail(order.id)
    setSelectedOrder(res.data)
    setShowModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">采购订单</h1>
          <p className="text-gray-500 mt-1">管理采购订单全流程</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primaryDark transition-colors">
          <Plus className="w-5 h-5" />
          创建订单
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索订单号..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm appearance-none bg-white"
            >
              <option value="">全部状态</option>
              {Object.entries(statusMap).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">订单号</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">供应商</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">金额</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">状态</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">创建时间</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.order_no}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {order.supplier_id ? `供应商 ${order.supplier_id}` : '-'}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">¥{Number(order.total_amount).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusMap[order.status]?.color || 'bg-gray-100 text-gray-700'}`}>
                    {statusMap[order.status]?.label || order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{order.created_at?.split('T')[0]}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleView(order)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-primary transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(order.id, 'approved')}
                          className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(order.id, 'abnormal')}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">订单详情</h2>
              <button onClick={() => setShowModal(false)} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">订单号</p>
                  <p className="font-medium text-gray-900">{selectedOrder.order_no}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">状态</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusMap[selectedOrder.status]?.color || 'bg-gray-100 text-gray-700'}`}>
                    {statusMap[selectedOrder.status]?.label || selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">供应商</p>
                  <p className="font-medium text-gray-900">{selectedOrder.supplier_id ? `供应商 ${selectedOrder.supplier_id}` : '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">总金额</p>
                  <p className="font-medium text-gray-900">¥{Number(selectedOrder.total_amount).toLocaleString()}</p>
                </div>
              </div>
              {selectedOrder.items && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">订单商品</h3>
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">车辆信息</th>
                        <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500">单价</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedOrder.items.map((item: any) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 text-sm text-gray-600">车辆 {item.car_id}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">¥{Number(item.price).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
