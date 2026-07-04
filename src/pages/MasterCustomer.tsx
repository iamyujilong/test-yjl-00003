import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { api } from '../api'

export function MasterCustomer() {
  const [customers, setCustomers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const res = await api.master.customer.list()
    setCustomers(res.data || [])
  }

  const filteredCustomers = customers.filter(c => {
    return c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           c.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           c.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">客户信息</h1>
        <p className="text-gray-500 mt-1">管理个人和企业客户信息</p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索客户名称、电话或公司名称..."
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
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">名称</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">类型</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">电话</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">公司名称</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">地址</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">创建时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCustomers.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.name}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    c.type === 'personal' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {c.type === 'personal' ? '个人' : '企业'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{c.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{c.company_name || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{c.address || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{c.created_at?.split('T')[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
