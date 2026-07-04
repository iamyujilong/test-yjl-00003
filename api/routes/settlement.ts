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
  const { order_id, amount, user_id } = req.body
  db.run('INSERT INTO settlements (type, order_id, user_id, amount) VALUES (?, ?, ?, ?)',
    ['commission', order_id, user_id || 1, amount],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json({ status: 'ok', data: { id: this.lastID, order_id, amount } })
    })
})

router.get('/settlement/commission', (req, res) => {
  db.all(`SELECT s.*, o.order_no, u.username 
          FROM settlements s 
          LEFT JOIN orders o ON s.order_id = o.id
          LEFT JOIN users u ON s.user_id = u.id
          WHERE s.type = ?
          ORDER BY s.created_at DESC`, ['commission'], (err, records) => {
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
  db.all(`SELECT i.*, s.type as settlement_type, s.amount as settlement_amount
          FROM invoices i 
          LEFT JOIN settlements s ON i.settlement_id = s.id
          ORDER BY i.created_at DESC`, (err, records) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ status: 'ok', data: records })
  })
})

router.get('/settlement/statement', (req, res) => {
  const { type, target_id } = req.query as { type?: string; target_id?: string }
  if (type === 'supplier') {
    db.get('SELECT * FROM suppliers WHERE id = ?', [target_id], (err, supplier: any) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      db.all(`SELECT o.*, s.amount as settled_amount
              FROM orders o
              LEFT JOIN settlements s ON o.id = s.order_id
              WHERE o.supplier_id = ? AND o.type = 'purchase'`, [target_id], (err, orders) => {
        if (err) {
          return res.status(500).json({ error: err.message })
        }
        const totalAmount = orders.reduce((sum: number, o: any) => sum + Number(o.total_amount), 0)
        const settledAmount = orders.reduce((sum: number, o: any) => sum + Number(o.settled_amount || 0), 0)
        res.json({
          status: 'ok',
          data: {
            type: 'supplier',
            target: supplier,
            period: '2026-07',
            total_amount: totalAmount,
            settled_amount: settledAmount,
            unpaid_amount: totalAmount - settledAmount,
            orders
          }
        })
      })
    })
  } else if (type === 'customer') {
    db.get('SELECT * FROM customers WHERE id = ?', [target_id], (err, customer: any) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      db.all(`SELECT o.*, s.amount as settled_amount
              FROM orders o
              LEFT JOIN settlements s ON o.id = s.order_id
              WHERE o.customer_id = ? AND o.type = 'sales'`, [target_id], (err, orders) => {
        if (err) {
          return res.status(500).json({ error: err.message })
        }
        const totalAmount = orders.reduce((sum: number, o: any) => sum + Number(o.total_amount), 0)
        const settledAmount = orders.reduce((sum: number, o: any) => sum + Number(o.settled_amount || 0), 0)
        res.json({
          status: 'ok',
          data: {
            type: 'customer',
            target: customer,
            period: '2026-07',
            total_amount: totalAmount,
            settled_amount: settledAmount,
            unpaid_amount: totalAmount - settledAmount,
            orders
          }
        })
      })
    })
  } else {
    res.status(400).json({ error: '缺少参数' })
  }
})

export default router
