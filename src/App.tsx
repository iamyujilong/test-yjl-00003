import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { PurchaseOrders } from './pages/PurchaseOrders'
import { SalesOrders } from './pages/SalesOrders'
import { AbnormalOrders } from './pages/AbnormalOrders'
import { WarehouseInbound } from './pages/WarehouseInbound'
import { WarehouseAlloc } from './pages/WarehouseAlloc'
import { WarehouseInventory } from './pages/WarehouseInventory'
import { WarehouseOutbound } from './pages/WarehouseOutbound'
import { WarehouseTracking } from './pages/WarehouseTracking'
import { SettlementPurchase } from './pages/SettlementPurchase'
import { SettlementSales } from './pages/SettlementSales'
import { SettlementCommission } from './pages/SettlementCommission'
import { SettlementInvoice } from './pages/SettlementInvoice'
import { SettlementStatement } from './pages/SettlementStatement'
import { MasterCar } from './pages/MasterCar'
import { MasterCustomer } from './pages/MasterCustomer'
import { MasterSupplier } from './pages/MasterSupplier'
import { MasterWarehouse } from './pages/MasterWarehouse'
import { MasterUser } from './pages/MasterUser'
import { OpenApiTest } from './pages/OpenApiTest'
import { useAuthStore } from './store'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore(state => state.token)
  if (!token) {
    return <Navigate to="/login" />
  }
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore(state => state.token)
  if (token) {
    return <Navigate to="/" />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="orders">
            <Route path="purchase" element={<PurchaseOrders />} />
            <Route path="sales" element={<SalesOrders />} />
            <Route path="abnormal" element={<AbnormalOrders />} />
          </Route>
          <Route path="warehouse">
            <Route path="inbound" element={<WarehouseInbound />} />
            <Route path="alloc" element={<WarehouseAlloc />} />
            <Route path="inventory" element={<WarehouseInventory />} />
            <Route path="outbound" element={<WarehouseOutbound />} />
            <Route path="tracking" element={<WarehouseTracking />} />
          </Route>
          <Route path="settlement">
            <Route path="purchase" element={<SettlementPurchase />} />
            <Route path="sales" element={<SettlementSales />} />
            <Route path="service" element={<SettlementPurchase />} />
            <Route path="commission" element={<SettlementCommission />} />
            <Route path="invoice" element={<SettlementInvoice />} />
            <Route path="statement" element={<SettlementStatement />} />
          </Route>
          <Route path="master">
            <Route path="cars" element={<MasterCar />} />
            <Route path="customers" element={<MasterCustomer />} />
            <Route path="suppliers" element={<MasterSupplier />} />
            <Route path="warehouses" element={<MasterWarehouse />} />
            <Route path="users" element={<MasterUser />} />
          </Route>
          <Route path="api/test" element={<OpenApiTest />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
