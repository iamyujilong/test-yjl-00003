import { useState, useEffect } from 'react'
import { MapPin, Clock, Navigation } from 'lucide-react'
import { api } from '../api'

export function WarehouseTracking() {
  const [orders, setOrders] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [trackingData, setTrackingData] = useState<any>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const [purchaseRes, salesRes] = await Promise.all([
      api.orders.purchase.list(),
      api.orders.sales.list(),
    ])
    const allOrders = [...(purchaseRes.data || []), ...(salesRes.data || [])]
    setOrders(allOrders.filter(o => o.status === 'transporting'))
  }

  const handleTrack = async (order: any) => {
    setSelectedOrder(order)
    const res = await api.warehouse.tracking(order.id)
    setTrackingData(res.data)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">在途跟踪</h1>
        <p className="text-gray-500 mt-1">实时查看运输轨迹</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">运输中订单</h2>
          <div className="space-y-3">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => handleTrack(order)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedOrder?.id === order.id ? 'bg-primary text-white' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <p className={`font-medium ${selectedOrder?.id === order.id ? 'text-white' : 'text-gray-900'}`}>
                    {order.order_no}
                  </p>
                  <p className={`text-sm mt-1 ${selectedOrder?.id === order.id ? 'text-white/80' : 'text-gray-500'}`}>
                    {order.type === 'purchase' ? '采购订单' : '销售订单'}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">暂无运输中订单</p>
            )}
          </div>
        </div>

        <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {trackingData ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{trackingData.order_no}</h2>
                  <p className="text-gray-500 mt-1">预计到达: {trackingData.estimated_arrival}</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg">
                  <Navigation className="w-5 h-5" />
                  <span className="font-medium">运输中</span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
                <div className="space-y-6">
                  {trackingData.tracking.map((step: any, index: number) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                        index === trackingData.tracking.length - 1 ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {index === trackingData.tracking.length - 1 ? (
                          <MapPin className="w-5 h-5" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{step.status}</h3>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            {step.time}
                          </div>
                        </div>
                        <p className="text-gray-500 mt-1">{step.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <MapPin className="w-16 h-16 mb-4" />
              <p>选择订单查看运输轨迹</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
