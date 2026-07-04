import { useState, useEffect } from 'react'
import { AlertTriangle, Check, X } from 'lucide-react'
import { api } from '../api'

export function AbnormalOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [handleReason, setHandleReason] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const res = await api.orders.abnormal.list()
    setOrders(res.data || [])
  }

  const handleProcess = (order: any) => {
    setSelectedOrder(order)
    setHandleReason('')
    setShowModal(true)
  }

  const confirmProcess = async () => {
    if (!selectedOrder || !handleReason) return
    await api.orders.abnormal.handle(selectedOrder.id, { status: 'completed', reason: handleReason })
    fetchOrders()
    setShowModal(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">异常订单</h1>
        <p className="text-gray-500 mt-1">处理异常订单，记录处理原因</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-red-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-red-500 uppercase">订单号</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-red-500 uppercase">类型</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-red-500 uppercase">金额</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-red-500 uppercase">创建时间</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-red-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-red-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.order_no}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.type === 'purchase' ? '采购订单' : '销售订单'}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">¥{Number(order.total_amount).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{order.created_at?.split('T')[0]}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleProcess(order)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        处理
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>暂无异常订单</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">处理异常订单</h2>
              <p className="text-gray-500 mt-1">订单号: {selectedOrder.order_no}</p>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">处理原因</label>
                <textarea
                  value={handleReason}
                  onChange={(e) => setHandleReason(e.target.value)}
                  placeholder="请输入处理原因..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  rows={4}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={confirmProcess}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors"
                >
                  确认处理
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
