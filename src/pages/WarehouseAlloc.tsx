import { useState, useEffect } from 'react'
import { Package } from 'lucide-react'
import { api } from '../api'

export function WarehouseAlloc() {
  const [locations, setLocations] = useState<any[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const [locationsRes, warehousesRes] = await Promise.all([
      api.warehouse.locations(),
      api.master.warehouses.list(),
    ])
    setLocations(locationsRes.data || [])
    setWarehouses(warehousesRes.data || [])
  }

  const filteredLocations = selectedWarehouse
    ? locations.filter(l => l.warehouse_id === selectedWarehouse)
    : locations

  const getLocationColor = (status: string) => {
    switch (status) {
      case 'empty': return 'bg-green-100 border-green-300'
      case 'occupied': return 'bg-red-100 border-red-300'
      default: return 'bg-gray-100 border-gray-300'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'empty': return '空闲'
      case 'occupied': return '占用'
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">库位分配</h1>
        <p className="text-gray-500 mt-1">管理仓库库位状态</p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">选择仓库:</label>
          <select
            value={selectedWarehouse || ''}
            onChange={(e) => setSelectedWarehouse(e.target.value ? Number(e.target.value) : null)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">全部仓库</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-6 gap-3">
          {filteredLocations.map((loc) => (
            <div
              key={loc.id}
              className={`p-3 rounded-lg border-2 transition-all hover:scale-105 cursor-pointer ${getLocationColor(loc.status)}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Package className={`w-4 h-4 ${loc.status === 'empty' ? 'text-green-600' : 'text-red-600'}`} />
                <span className="text-sm font-medium text-gray-700">{loc.code}</span>
              </div>
              <p className="text-xs text-gray-500">{loc.warehouse_name}</p>
              <p className={`text-xs font-medium mt-1 ${loc.status === 'empty' ? 'text-green-600' : 'text-red-600'}`}>
                {getStatusLabel(loc.status)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
