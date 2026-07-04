import express from 'express'
import { db } from '../database'

const router = express.Router()

router.post('/settlement/purchase', (req, res) => {
  const { order_id, amount } = req.body
  db.run('INSERT INTO settlements (type, order_id, user_id, amount) VALUES (?, ?, ?, ?)',
    ['purchase', order_id, 1, amount],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json({ status: 'ok', data: { id: this.lastID, order_id, amount } })
    })
})

router.get('/settlement/purchase', (req, res) => {
  db.all(`SELECT s.*, o.order_no 
          FROM settlements s 
          LEFT JOIN orders o ON s.order_id = o.id
          WHERE s.type = ?
          ORDER BY s.created_at DESC`, ['purchase'], (err, records) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ status: 'ok', data: records })
  })
})

router.post('/settlement/sales', (req, res) => {
  const { order_id, amount } = req.body
  db.run('INSERT INTO settlements (type, order_id, user_id, amount) VALUES (?, ?, ?, ?)',
    ['sales', order_id, 1, amount],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json({ status: 'ok', data: { id: this.lastID, order_id, amount } })
    })
})

router.get('/settlement/sales', (req, res) => {
  db.all(`SELECT s.*, o.order_no 
          FROM settlements s 
          LEFT JOIN orders o ON s.order_id = o.id
          WHERE s.type = ?
          ORDER BY s.created_at DESC`, ['sales'], (err, records) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ status: 'ok', data: records })
  })
})

router.post('/settlement/service', (req, res) => {
  const { order_id, amount } = req.body
  db.run('INSERT INTO settlements (type, order_id, user_id, amount) VALUES (?, ?, ?, ?)',
    ['service', order_id, 1, amount],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json({ status: 'ok', data: { id: this.lastID, order_id, amount } })
    })
})

router.get('/settlement/service', (req, res) => {
  db.all(`SELECT s.*, o.order_no 
          FROM settlements s 
          LEFT JOIN orders o ON s.order_id = o.id
          WHERE s.type = ?
          ORDER BY s.created_at DESC`, ['service'], (err, records) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ status: 'ok', data: records })
  })
})

router.post('/settlement/commission', (req, res) => {
  const { order_id, amount, user_id, rate, sales_amount } = req.body
  db.run('INSERT INTO commissions (order_id, user_id, sales_amount, rate, amount) VALUES (?, ?, ?, ?, ?)',
    [order_id, user_id || 1, sales_amount || 0, rate || 3.00, amount],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json({ status: 'ok', data: { id: this.lastID, order_id, amount } })
    })
})

router.get('/settlement/commission', (req, res) => {
  db.all(`SELECT c.*, o.order_no, u.username as salesperson_name
          FROM commissions c 
          LEFT JOIN orders o ON c.order_id = o.id
          LEFT JOIN users u ON c.user_id = u.id
          ORDER BY c.created_at DESC`, (err, records) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ status: 'ok', data: records })
  })
})

router.post('/settlement/invoice', (req, res) => {
  const { settlement_id, amount, type } = req.body
  const invoice_no = `FP${Date.now()}`
  db.run('INSERT INTO invoices (invoice_no, settlement_id, amount, type, issued_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)',
    [invoice_no, settlement_id, amount, type],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json({ status: 'ok', data: { id: this.lastID, invoice_no } })
    })
})

router.get('/settlement/invoice', (req, res) => {
  db.all(`SELECT i.*, s.type as settlement_type, s.amount as settlement_amount, o.order_no
          FROM invoices i 
          LEFT JOIN settlements s ON i.settlement_id = s.id
          LEFT JOIN orders o ON s.order_id = o.id
          ORDER BY i.created_at DESC`, (err, records) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ status: 'ok', data: records })
  })
})

router.get('/settlement/statement', (req, res) => {
  const { type } = req.query as { type?: string }
  if (type === 'supplier') {
    db.all(`SELECT s.id, s.name, s.contact, s.phone, 
                   SUM(o.total_amount) as total_amount,
                   SUM(CASE WHEN st.status = 'paid' THEN st.amount ELSE 0 END) as settled_amount
            FROM suppliers s
            LEFT JOIN orders o ON s.id = o.supplier_id AND o.type = 'purchase'
            LEFT JOIN settlements st ON o.id = st.order_id AND st.type = 'purchase'
            GROUP BY s.id
            ORDER BY s.name`, (err, suppliers) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      const statements = suppliers.map((s: any) => ({
        id: s.id,
        name: s.name,
        contact: s.contact,
        phone: s.phone,
        type: 'supplier',
        period: '2026-07',
        total_amount: Number(s.total_amount) || 0,
        settled_amount: Number(s.settled_amount) || 0,
        items: []
      }))
      res.json({ status: 'ok', data: statements })
    })
  } else if (type === 'customer') {
    db.all(`SELECT c.id, c.name, c.phone, c.type as customer_type,
                   SUM(o.total_amount) as total_amount,
                   SUM(CASE WHEN st.status = 'paid' THEN st.amount ELSE 0 END) as settled_amount
            FROM customers c
            LEFT JOIN orders o ON c.id = o.customer_id AND o.type = 'sales'
            LEFT JOIN settlements st ON o.id = st.order_id AND st.type = 'sales'
            GROUP BY c.id
            ORDER BY c.name`, (err, customers) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      const statements = customers.map((c: any) => ({
        id: c.id,
        name: c.name,
        contact: c.phone,
        type: 'customer',
        period: '2026-07',
        total_amount: Number(c.total_amount) || 0,
        settled_amount: Number(c.settled_amount) || 0,
        items: []
      }))
      res.json({ status: 'ok', data: statements })
    })
  } else {
    res.status(400).json({ error: '缺少参数' })
  }
})

export default router
