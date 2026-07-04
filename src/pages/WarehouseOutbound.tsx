import { useState, useEffect } from 'react'
import { Plus, Search, Truck } from 'lucide-react'
import { api } from '../api'

export function WarehouseOutbound() {
  const [inventory, setInventory] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedCar, setSelectedCar] = useState<any>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const res = await api.warehouse.inventory()
    setInventory(res.data || [])
  }

  const inStockInventory = inventory.filter(item => item.status === 'in_stock')

  const handleOutbound = async () => {
    if (!selectedCar) return
    await api.warehouse.outbound({ car_id: selectedCar.car_id })
    fetchData()
    setShowModal(false)
    setSelectedCar(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">出库管理</h1>
          <p className="text-gray-500 mt-1">车辆出库申请与审批</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索VIN码或车牌号..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">VIN码</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">车牌号</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">品牌型号</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">仓库</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">库位</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inStockInventory.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.vin}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.license_plate || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.brand_name} {item.model_name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.warehouse_name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.location_code}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => { setSelectedCar(item); setShowModal(true) }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm hover:bg-orange-200 transition-colors"
                    >
                      <Truck className="w-4 h-4" />
                      出库
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedCar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">车辆出库确认</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">VIN码</span>
                  <span className="text-sm font-medium text-gray-900">{selectedCar.vin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">车牌号</span>
                  <span className="text-sm font-medium text-gray-900">{selectedCar.license_plate || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">仓库</span>
                  <span className="text-sm font-medium text-gray-900">{selectedCar.warehouse_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">库位</span>
                  <span className="text-sm font-medium text-gray-900">{selectedCar.location_code}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleOutbound}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  确认出库
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
