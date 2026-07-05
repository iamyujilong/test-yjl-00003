const fs = require("fs");
const p = "E:\\AI Coding\\test-yjl-00003\\api\\routes\\orders.ts";
const content = `import express from 'express'
import { db } from '../database'

const router = express.Router()

router.get('/orders/purchase', (req, res) => {
  db.all('SELECT * FROM orders WHERE type = ? ORDER BY created_at DESC', ['purchase'], (err, orders) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ status: 'ok', data: orders })
  })
})

router.post('/orders/purchase', (req, res) => {
  const { supplier_id, items, total_amount } = req.body
  const order_no = \`PO\${Date.now()}\`
  db.run('INSERT INTO orders (order_no, type, user_id, supplier_id, total_amount) VALUES (?, ?, ?, ?, ?)',
    [order_no, 'purchase', 1, supplier_id, total_amount],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      if (items && items.length > 0) {
        items.forEach((item) => {
          db.run('INSERT INTO order_items (order_id, car_id, price, quantity) VALUES (?, ?, ?, ?)',
            [this.lastID, item.car_id, item.price, item.quantity])
        })
      }
      res.json({ status: 'ok', data: { id: this.lastID, order_no } })
    })
})

router.get('/orders/purchase/:id', (req, res) => {
  db.get('SELECT * FROM orders WHERE id = ?', [req.params.id], (err, order) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    if (!order) {
      return res.status(404).json({ error: '订单不存在' })
    }
    db.all('SELECT * FROM order_items WHERE order_id = ?', [req.params.id], (err, items) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json({ status: 'ok', data: { ...order, items } })
    })
  })
})

router.put('/orders/purchase/:id/status', (req, res) => {
  const { status } = req.body
  db.run('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [status, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json({ status: 'ok', data: { id: req.params.id, status, changes: this.changes } })
    })
})

router.get('/orders/sales', (req, res) => {
  db.all('SELECT * FROM orders WHERE type = ? ORDER BY created_at DESC', ['sales'], (err, orders) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ status: 'ok', data: orders })
  })
})

router.post('/orders/sales', (req, res) => {
  const { customer_id, items, total_amount } = req.body
  const order_no = \`SO\${Date.now()}\`
  db.run('INSERT INTO orders (order_no, type, user_id, customer_id, total_amount) VALUES (?, ?, ?, ?, ?)',
    [order_no, 'sales', 1, customer_id, total_amount],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      if (items && items.length > 0) {
        items.forEach((item) => {
          db.run('INSERT INTO order_items (order_id, car_id, price, quantity) VALUES (?, ?, ?, ?)',
            [this.lastID, item.car_id, item.price, item.quantity])
        })
      }
      res.json({ status: 'ok', data: { id: this.lastID, order_no } })
    })
})

router.get('/orders/sales/:id', (req, res) => {
  db.get('SELECT * FROM orders WHERE id = ?', [req.params.id], (err, order) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    if (!order) {
      return res.status(404).json({ error: '订单不存在' })
    }
    db.all('SELECT * FROM order_items WHERE order_id = ?', [req.params.id], (err, items) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json({ status: 'ok', data: { ...order, items } })
    })
  })
})

router.put('/orders/sales/:id/status', (req, res) => {
  const { status } = req.body
  db.run('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [status, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json({ status: 'ok', data: { id: req.params.id, status, changes: this.changes } })
    })
})

router.get('/orders/abnormal', (req, res) => {
  db.all('SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC', ['abnormal'], (err, orders) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ status: 'ok', data: orders })
  })
})

router.put('/orders/abnormal/:id/handle', (req, res) => {
  const { status, reason } = req.body
  db.run('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [status, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json({ status: 'ok', data: { id: req.params.id, status, reason, changes: this.changes } })
    })
})

export default router
`;
fs.writeFileSync(p, content, "utf8");
console.log("Rewrote orders.ts");
