import { useState } from 'react'
import { LayoutDashboard, ShoppingCart, Package, FileText, Database, Settings, Truck, DollarSign, Users, Car, ExternalLink } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const menuItems = [
  { icon: LayoutDashboard, path: '/', label: '工作台' },
  { icon: ShoppingCart, path: '/orders/purchase', label: '采购订单', children: [
    { path: '/orders/purchase', label: '采购订单' },
    { path: '/orders/sales', label: '销售订单' },
    { path: '/orders/abnormal', label: '异常订单' },
  ]},
  { icon: Truck, path: '/warehouse/inbound', label: '物流仓储', children: [
    { path: '/warehouse/inbound', label: '入库登记' },
    { path: '/warehouse/alloc', label: '库位分配' },
    { path: '/warehouse/inventory', label: '库存盘点' },
    { path: '/warehouse/outbound', label: '出库管理' },
    { path: '/warehouse/tracking', label: '在途跟踪' },
  ]},
  { icon: DollarSign, path: '/settlement/purchase', label: '结算管理', children: [
    { path: '/settlement/purchase', label: '采购付款' },
    { path: '/settlement/sales', label: '销售收款' },
    { path: '/settlement/service', label: '服务费结算' },
    { path: '/settlement/commission', label: '佣金计算' },
    { path: '/settlement/invoice', label: '发票管理' },
    { path: '/settlement/statement', label: '对账单' },
  ]},
  { icon: Database, path: '/master/cars', label: '基础资料', children: [
    { path: '/master/cars', label: '车源信息' },
    { path: '/master/customers', label: '客户信息' },
    { path: '/master/suppliers', label: '供应商' },
    { path: '/master/warehouses', label: '仓库管理' },
    { path: '/master/users', label: '用户权限' },
  ]},
  { icon: ExternalLink, path: '/api/test', label: '开放 API' },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/')

  const toggleExpand = (label: string) => {
    setExpanded(prev => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <aside className="w-64 bg-primary text-white min-h-screen flex flex-col">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold">二手车 SaaS</h1>
            <p className="text-xs text-white/60">管理后台</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => (
          <div key={item.label}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleExpand(item.label)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                    isActive(item.path) ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                  <svg className={`w-4 h-4 transition-transform ${expanded[item.label] ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expanded[item.label] && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <button
                        key={child.path}
                        onClick={() => navigate(child.path)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-all ${
                          location.pathname === child.path ? 'bg-white/20' : 'hover:bg-white/10 text-white/80'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  isActive(item.path) ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}
