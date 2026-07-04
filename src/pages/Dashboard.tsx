import { useState, useEffect } from 'react'
import { ShoppingCart, Truck, DollarSign, BarChart3, AlertCircle, ChevronRight } from 'lucide-react'
import { api } from '../api'

const statCards = [
  { icon: ShoppingCart, label: '今日订单量', key: 'orders', color: 'bg-blue-500' },
  { icon: Truck, label: '在途车辆数', key: 'transporting', color: 'bg-green-500' },
  { icon: DollarSign, label: '待结算金额', key: 'pendingAmount', color: 'bg-orange-500' },
  { icon: BarChart3, label: '库存周转率', key: 'turnover', color: 'bg-purple-500' },
]

export function Dashboard() {
  const [stats, setStats] = useState({ orders: 0, transporting: 0, pendingAmount: 0, turnover: 0 })
  const [tasks, setTasks] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const [purchaseRes, salesRes, settlementRes] = await Promise.all([
        api.orders.purchase.list(),
        api.orders.sales.list(),
        api.settlement.purchase.list(),
      ])

      const allOrders = [...(purchaseRes.data || []), ...(salesRes.data || [])]
      const today = new Date().toISOString().split('T')[0]
      const todayOrders = allOrders.filter(o => o.created_at?.startsWith(today))
      const transporting = allOrders.filter(o => o.status === 'transporting').length
      const pendingSettlements = (settlementRes.data || []).filter(s => s.status === 'pending')
      const pendingAmount = pendingSettlements.reduce((sum, s) => sum + Number(s.amount), 0)

      setStats({
        orders: todayOrders.length,
        transporting,
        pendingAmount,
        turnover: 3.2,
      })

      setTasks([
        { id: 1, title: '采购订单 PO20260704001 待审核', type: 'purchase', priority: 'high' },
        { id: 2, title: '销售订单 SO20260704001 在途跟踪', type: 'sales', priority: 'medium' },
        { id: 3, title: '库存盘点任务待处理', type: 'warehouse', priority: 'medium' },
        { id: 4, title: '供应商对账单待确认', type: 'settlement', priority: 'low' },
      ])
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">工作台</h1>
          <p className="text-gray-500 mt-1">欢迎回来，查看今日经营数据</p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {statCards.map(({ icon: Icon, label, key, color }) => (
          <div key={key} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`text-2xl font-bold text-gray-900 mt-1 ${key === 'pendingAmount' ? '' : ''}`}>
              {key === 'pendingAmount' ? `¥${stats[key as keyof typeof stats].toLocaleString()}` : stats[key as keyof typeof stats]}
              {key === 'turnover' && '次/月'}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">订单趋势</h2>
          <div className="h-64 flex items-end justify-between gap-4">
            {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day, i) => (
              <div key={day} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-primary/10 rounded-t-lg transition-all hover:bg-primary/20" style={{ height: `${20 + Math.random() * 80}%` }} />
                <span className="text-xs text-gray-500 mt-2">{day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            待办提醒
          </h2>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <span className={`w-2 h-2 rounded-full ${
                  task.priority === 'high' ? 'bg-red-500' :
                  task.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'
                }`} />
                <span className="flex-1 text-sm text-gray-700">{task.title}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors">
            查看全部待办
          </button>
        </div>
      </div>
    </div>
  )
}
