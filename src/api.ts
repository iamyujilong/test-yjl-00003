import { useAuthStore } from './store'

const BASE_URL = '/api'

export const api = {
  auth: {
    login: (data: { username: string; password: string }) =>
      fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    me: () => {
      const token = useAuthStore.getState().token
      return fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json())
    },
    logout: () => fetch(`${BASE_URL}/auth/logout`, { method: 'POST' }).then(res => res.json()),
  },
  orders: {
    purchase: {
      list: () => fetch(`${BASE_URL}/orders/purchase`).then(res => res.json()),
      create: (data: any) =>
        fetch(`${BASE_URL}/orders/purchase`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }).then(res => res.json()),
      detail: (id: number) => fetch(`${BASE_URL}/orders/purchase/${id}`).then(res => res.json()),
      status: (id: number, status: string) =>
        fetch(`${BASE_URL}/orders/purchase/${id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        }).then(res => res.json()),
    },
    sales: {
      list: () => fetch(`${BASE_URL}/orders/sales`).then(res => res.json()),
      create: (data: any) =>
        fetch(`${BASE_URL}/orders/sales`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }).then(res => res.json()),
      detail: (id: number) => fetch(`${BASE_URL}/orders/sales/${id}`).then(res => res.json()),
      status: (id: number, status: string) =>
        fetch(`${BASE_URL}/orders/sales/${id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        }).then(res => res.json()),
    },
    abnormal: {
      list: () => fetch(`${BASE_URL}/orders/abnormal`).then(res => res.json()),
      handle: (id: number, data: { status: string; reason: string }) =>
        fetch(`${BASE_URL}/orders/abnormal/${id}/handle`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }).then(res => res.json()),
    },
  },
  warehouse: {
    inbound: {
      list: () => fetch(`${BASE_URL}/warehouse/inbound`).then(res => res.json()),
      create: (data: { car_id: number; location_id: number }) =>
        fetch(`${BASE_URL}/warehouse/inbound`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }).then(res => res.json()),
    },
    alloc: (data: { car_id: number; warehouse_id: number }) =>
      fetch(`${BASE_URL}/warehouse/alloc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    locations: () => fetch(`${BASE_URL}/warehouse/locations`).then(res => res.json()),
    inventory: () => fetch(`${BASE_URL}/warehouse/inventory`).then(res => res.json()),
    outbound: (data: { car_id: number }) =>
      fetch(`${BASE_URL}/warehouse/outbound`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    tracking: (orderId: number) => fetch(`${BASE_URL}/warehouse/tracking/${orderId}`).then(res => res.json()),
  },
  settlement: {
    purchase: {
      list: () => fetch(`${BASE_URL}/settlement/purchase`).then(res => res.json()),
      create: (data: { order_id: number; amount: number }) =>
        fetch(`${BASE_URL}/settlement/purchase`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }).then(res => res.json()),
    },
    sales: {
      list: () => fetch(`${BASE_URL}/settlement/sales`).then(res => res.json()),
      create: (data: { order_id: number; amount: number }) =>
        fetch(`${BASE_URL}/settlement/sales`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }).then(res => res.json()),
    },
    service: {
      list: () => fetch(`${BASE_URL}/settlement/service`).then(res => res.json()),
      create: (data: { order_id: number; amount: number }) =>
        fetch(`${BASE_URL}/settlement/service`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }).then(res => res.json()),
    },
    commission: {
      list: () => fetch(`${BASE_URL}/settlement/commission`).then(res => res.json()),
      create: (data: { order_id: number; amount: number; user_id?: number }) =>
        fetch(`${BASE_URL}/settlement/commission`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }).then(res => res.json()),
    },
    invoice: {
      list: () => fetch(`${BASE_URL}/settlement/invoice`).then(res => res.json()),
      create: (data: { settlement_id: number; amount: number; type: string }) =>
        fetch(`${BASE_URL}/settlement/invoice`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }).then(res => res.json()),
    },
    statement: (type: string, target_id: number) =>
      fetch(`${BASE_URL}/settlement/statement?type=${type}&target_id=${target_id}`).then(res => res.json()),
  },
  master: {
    carBrands: {
      list: () => fetch(`${BASE_URL}/master/car-brands`).then(res => res.json()),
      create: (data: { name: string }) =>
        fetch(`${BASE_URL}/master/car-brands`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }).then(res => res.json()),
    },
    carModels: {
      list: (brand_id?: number) =>
        fetch(`${BASE_URL}/master/car-models${brand_id ? `?brand_id=${brand_id}` : ''}`).then(res => res.json()),
      create: (data: { brand_id: number; name: string }) =>
        fetch(`${BASE_URL}/master/car-models`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }).then(res => res.json()),
    },
    carSeries: {
      list: (model_id?: number) =>
        fetch(`${BASE_URL}/master/car-series${model_id ? `?model_id=${model_id}` : ''}`).then(res => res.json()),
      create: (data: { model_id: number; name: string }) =>
        fetch(`${BASE_URL}/master/car-series`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }).then(res => res.json()),
    },
    cars: {
      list: () => fetch(`${BASE_URL}/master/cars`).then(res => res.json()),
      create: (data: any) =>
        fetch(`${BASE_URL}/master/cars`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }).then(res => res.json()),
    },
    customers: {
      list: () => fetch(`${BASE_URL}/master/customers`).then(res => res.json()),
      create: (data: any) =>
        fetch(`${BASE_URL}/master/customers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }).then(res => res.json()),
    },
    suppliers: {
      list: () => fetch(`${BASE_URL}/master/suppliers`).then(res => res.json()),
      create: (data: any) =>
        fetch(`${BASE_URL}/master/suppliers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }).then(res => res.json()),
    },
    warehouses: {
      list: () => fetch(`${BASE_URL}/master/warehouses`).then(res => res.json()),
      create: (data: any) =>
        fetch(`${BASE_URL}/master/warehouses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }).then(res => res.json()),
    },
    users: {
      list: () => fetch(`${BASE_URL}/master/users`).then(res => res.json()),
      create: (data: any) =>
        fetch(`${BASE_URL}/master/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }).then(res => res.json()),
    },
  },
  open: {
    test: () => fetch(`${BASE_URL}/open/test`).then(res => res.json()),
    lead: {
      create: (data: any) =>
        fetch(`${BASE_URL}/open/lead`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }).then(res => res.json()),
      detail: (id: number) => fetch(`${BASE_URL}/open/lead/${id}`).then(res => res.json()),
      status: (id: number, status: string) =>
        fetch(`${BASE_URL}/open/lead/${id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        }).then(res => res.json()),
    },
  },
}
