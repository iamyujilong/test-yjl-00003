import { useState, useEffect } from 'react'
import { Search, MapPin } from 'lucide-react'
import { api } from '../api'

export function MasterWarehouse() {
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const res = await api.master.warehouse.list()
    setWarehouses(res.data || [])
  }

  const filteredWarehouses = warehouses.filter(w => {
    return w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           w.location?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">仓库管理</h1>
        <p className="text-gray-500 mt-1">管理仓库和库位信息</p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索仓库名称或地址..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWarehouses.map((w) => (
          <div key={w.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{w.name}</h3>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {w.location}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-500">总库位数</p>
                <p className="text-lg font-bold text-gray-900">{w.total_locations}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">已用库位数</p>
                <p className="text-lg font-bold text-primary">{w.used_locations}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">使用率</span>
                <span className="text-sm font-medium text-gray-900">{Math.round((w.used_locations / w.total_locations) * 100)}%</span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${(w.used_locations / w.total_locations) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
