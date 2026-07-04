import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { api } from '../api'

export function WarehouseInventory() {
  const [inventory, setInventory] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const res = await api.warehouse.inventory()
    setInventory(res.data || [])
  }

  const filteredInventory = inventory.filter(item => {
    return item.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.license_plate?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">库存盘点</h1>
        <p className="text-gray-500 mt-1">管理库存车辆信息</p>
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
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">年份</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">颜色</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">里程</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">价格</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">仓库</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">库位</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredInventory.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.vin}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.license_plate || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.brand_name} {item.model_name} {item.series_name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.year}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.color}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.mileage?.toLocaleString()} km</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">¥{Number(item.price).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.warehouse_name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.location_code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
