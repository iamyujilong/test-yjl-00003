import express from 'express'
import { db } from '../database'

const router = express.Router()

router.post('/warehouse/inbound', (req, res) => {
  const { car_id, location_id } = req.body
  db.run('INSERT OR REPLACE INTO inventory (car_id, location_id, status, inbound_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
    [car_id, location_id, 'in_stock'],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      db.run('UPDATE locations SET status = ? WHERE id = ?', ['occupied', location_id])
      res.json({ status: 'ok', data: { id: this.lastID, car_id, location_id } })
    })
})

router.get('/warehouse/inbound', (req, res) => {
  db.all(`SELECT i.*, c.vin, c.license_plate, l.code as location_code 
          FROM inventory i 
          LEFT JOIN cars c ON i.car_id = c.id 
          LEFT JOIN locations l ON i.location_id = l.id
          ORDER BY i.inbound_at DESC`, (err, records) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ status: 'ok', data: records })
  })
})

router.post('/warehouse/alloc', (req, res) => {
  const { car_id, warehouse_id } = req.body
  db.get('SELECT id FROM locations WHERE warehouse_id = ? AND status = ? LIMIT 1', [warehouse_id, 'empty'], (err, location: any) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    if (!location) {
      return res.status(400).json({ error: 'No empty location in this warehouse' })
    }
    db.run('UPDATE inventory SET location_id = ? WHERE car_id = ?', [location.id, car_id], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      db.run('UPDATE locations SET status = ? WHERE id = ?', ['occupied', location.id])
      res.json({ status: 'ok', data: { car_id, location_id: location.id, location_code: location.code } })
    })
  })
})

router.get('/warehouse/locations', (req, res) => {
  db.all(`SELECT l.*, w.name as warehouse_name 
          FROM locations l 
          LEFT JOIN warehouses w ON l.warehouse_id = w.id
          ORDER BY w.name, l.code`, (err, locations) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ status: 'ok', data: locations })
  })
})

router.get('/warehouse/inventory', (req, res) => {
  db.all(`SELECT i.*, c.vin, c.license_plate, c.year, c.color, c.mileage, c.price, 
          l.code as location_code, w.name as warehouse_name
          FROM inventory i 
          LEFT JOIN cars c ON i.car_id = c.id 
          LEFT JOIN locations l ON i.location_id = l.id
          LEFT JOIN warehouses w ON l.warehouse_id = w.id
          ORDER BY i.created_at DESC`, (err, records) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ status: 'ok', data: records })
  })
})

router.post('/warehouse/outbound', (req, res) => {
  const { car_id } = req.body
  db.get('SELECT location_id FROM inventory WHERE car_id = ?', [car_id], (err, record: any) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    db.run('UPDATE inventory SET status = ?, outbound_at = CURRENT_TIMESTAMP WHERE car_id = ?', ['out_stock', car_id], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      if (record && record.location_id) {
        db.run('UPDATE locations SET status = ? WHERE id = ?', ['empty', record.location_id])
      }
      res.json({ status: 'ok', data: { car_id, changes: this.changes } })
    })
  })
})

router.get('/warehouse/tracking/:orderId', (req, res) => {
  db.get('SELECT * FROM orders WHERE id = ?', [req.params.orderId], (err, order: any) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }
    res.json({
      status: 'ok',
      data: {
        order_id: order.id,
        order_no: order.order_no,
        tracking: [
          { time: '2026-07-04 10:00:00', location: 'Beijing Warehouse', status: 'shipped' },
          { time: '2026-07-04 14:00:00', location: 'Beijing Logistics Center', status: 'in_transit' },
          { time: '2026-07-04 18:00:00', location: 'Tianjin Transit Station', status: 'transiting' },
          { time: '2026-07-05 08:00:00', location: 'Shanghai Logistics Center', status: 'arriving' }
        ],
        estimated_arrival: '2026-07-05 14:00:00'
      }
    })
  })
})

export default router
