import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { api } from '../api'

export function MasterSupplier() {
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const res = await api.master.supplier.list()
    setSuppliers(res.data || [])
  }

  const filteredSuppliers = suppliers.filter(s => {
    return s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           s.contact?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">供应商</h1>
        <p className="text-gray-500 mt-1">管理车源供应商信息</p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索供应商名称或联系人..."
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
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">供应商名称</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">联系人</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">电话</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">地址</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">合作车型</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">创建时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSuppliers.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{s.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{s.contact}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{s.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{s.address || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{s.cooperation_brands || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{s.created_at?.split('T')[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
