import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { api } from '../api'

export function MasterCar() {
  const [cars, setCars] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const res = await api.master.car.list()
    setCars(res.data || [])
  }

  const filteredCars = cars.filter(car => {
    return car.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
           car.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           car.brand_name?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">车辆信息</h1>
        <p className="text-gray-500 mt-1">管理车源基础信息</p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索VIN码、车牌号或品牌..."
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
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">品牌</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">车系</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">年款</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">颜色</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">里程</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">价格</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCars.map((car) => (
              <tr key={car.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{car.vin}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{car.license_plate || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{car.brand_name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{car.series_name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{car.year}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{car.color}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{car.mileage?.toLocaleString()} km</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">¥{Number(car.price).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
