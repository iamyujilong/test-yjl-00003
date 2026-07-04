import { useState, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import { api } from '../api'

export function WarehouseInbound() {
  const [records, setRecords] = useState<any[]>([])
  const [cars, setCars] = useState<any[]>([])
  const [locations, setLocations] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ car_id: '', location_id: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const [recordsRes, carsRes, locationsRes] = await Promise.all([
      api.warehouse.inbound.list(),
      api.master.cars.list(),
      api.warehouse.locations(),
    ])
    setRecords(recordsRes.data || [])
    setCars(carsRes.data || [])
    setLocations(locationsRes.data || [])
  }

  const handleSubmit = async () => {
    await api.warehouse.inbound.create({
      car_id: Number(formData.car_id),
      location_id: Number(formData.location_id),
    })
    fetchData()
    setShowModal(false)
    setFormData({ car_id: '', location_id: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">入库登记</h1>
          <p className="text-gray-500 mt-1">车辆入库信息录入</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primaryDark transition-colors"
        >
          <Plus className="w-5 h-5" />
          入库登记
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索车辆VIN码..."
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
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">库位</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">状态</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">入库时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{record.vin}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{record.license_plate || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{record.location_code || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    record.status === 'in_stock' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {record.status === 'in_stock' ? '在库' : '已出库'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{record.inbound_at?.split('T')[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">车辆入库</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">选择车辆</label>
                <select
                  value={formData.car_id}
                  onChange={(e) => setFormData({ ...formData, car_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="">请选择车辆</option>
                  {cars.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.vin} - {car.license_plate || '无牌照'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">选择库位</label>
                <select
                  value={formData.location_id}
                  onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="">请选择库位</option>
                  {locations.filter(l => l.status === 'empty').map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.warehouse_name} - {loc.code}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors"
                >
                  确认入库
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
