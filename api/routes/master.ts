import express from 'express'
import bcrypt from 'bcryptjs'
import { db } from '../database'

const router = express.Router()

router.get('/master/car-brands', (req, res) => {
  db.all('SELECT * FROM car_brands ORDER BY name', (err, brands) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ status: 'ok', data: brands })
  })
})

router.post('/master/car-brands', (req, res) => {
  const { name } = req.body
  db.run('INSERT INTO car_brands (name) VALUES (?)', [name], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ status: 'ok', data: { id: this.lastID, name } })
})

router.get('/master/car-models', (req, res) => {
  const { brand_id } = req.query as { brand_id?: string }
  if (brand_id) {
    db.all('SELECT * FROM car_models WHERE brand_id = ? ORDER BY name', [brand_id], (err, models) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json({ status: 'ok', data: models })
    })
  } else {
    db.all(`SELECT cm.*, cb.name as brand_name 
            FROM car_models cm 
            LEFT JOIN car_brands cb ON cm.brand_id = cb.id
            ORDER BY cb.name, cm.name`, (err, models) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json({ status: 'ok', data: models })
    })
  }
})

router.post('/master/car-models', (req, res) => {
  const { brand_id, name } = req.body
  db.run('INSERT INTO car_models (brand_id, name) VALUES (?, ?)', [brand_id, name], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ status: 'ok', data: { id: this.lastID, brand_id, name } })
})

router.get('/master/car-series', (req, res) => {
  const { model_id } = req.query as { model_id?: string }
  if (model_id) {
    db.all('SELECT * FROM car_series WHERE model_id = ? ORDER BY name', [model_id], (err, series) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json({ status: 'ok', data: series })
    })
  } else {
    db.all(`SELECT cs.*, cm.name as model_name, cb.name as brand_name 
            FROM car_series cs 
            LEFT JOIN car_models cm ON cs.model_id = cm.id
            LEFT JOIN car_brands cb ON cm.brand_id = cb.id
            ORDER BY cb.name, cm.name, cs.name`, (err, series) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json({ status: 'ok', data: series })
    })
  }
})

router.post('/master/car-series', (req, res) => {
  const { model_id, name } = req.body
  db.run('INSERT INTO car_series (model_id, name) VALUES (?, ?)', [model_id, name], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ status: 'ok', data: { id: this.lastID, model_id, name } })
})

router.get('/master/cars', (req, res) => {
  db.all(`SELECT c.*, cb.name as brand_name, cm.name as model_name, cs.name as series_name
          FROM cars c 
          LEFT JOIN car_brands cb ON c.brand_id = cb.id
          LEFT JOIN car_models cm ON c.model_id = cm.id
          LEFT JOIN car_series cs ON c.series_id = cs.id
          ORDER BY c.created_at DESC`, (err, cars) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ status: 'ok', data: cars })
  })
})

router.post('/master/cars', (req, res) => {
  const { vin, license_plate, brand_id, model_id, series_id, year, color, mileage, price } = req.body
  db.run('INSERT INTO cars (vin, license_plate, brand_id, model_id, series_id, year, color, mileage, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [vin, license_plate, brand_id, model_id, series_id, year, color, mileage, price],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json({ status: 'ok', data: { id: this.lastID, vin } })
})

router.get('/master/customers', (req, res) => {
  db.all('SELECT * FROM customers ORDER BY created_at DESC', (err, customers) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ status: 'ok', data: customers })
  })
})

router.post('/master/customers', (req, res) => {
  const { type, name, phone, email, address, tax_id } = req.body
  db.run('INSERT INTO customers (type, name, phone, email, address, tax_id) VALUES (?, ?, ?, ?, ?, ?)',
    [type, name, phone, email, address, tax_id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json({ status: 'ok', data: { id: this.lastID, name } })
})

router.get('/master/suppliers', (req, res) => {
  db.all('SELECT * FROM suppliers ORDER BY created_at DESC', (err, suppliers) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ status: 'ok', data: suppliers })
  })
})

router.post('/master/suppliers', (req, res) => {
  const { name, contact, phone, address, tax_id, cooperation_brands } = req.body
  db.run('INSERT INTO suppliers (name, contact, phone, address, tax_id, cooperation_brands) VALUES (?, ?, ?, ?, ?, ?)',
    [name, contact, phone, address, tax_id, cooperation_brands],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json({ status: 'ok', data: { id: this.lastID, name } })
})

router.get('/master/warehouses', (req, res) => {
  db.all(`SELECT w.*, 
                 COUNT(l.id) as total_locations,
                 SUM(CASE WHEN l.status = 'occupied' THEN 1 ELSE 0 END) as used_locations
          FROM warehouses w
          LEFT JOIN locations l ON w.id = l.warehouse_id
          GROUP BY w.id
          ORDER BY w.name`, (err, warehouses) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ status: 'ok', data: warehouses })
  })
})

router.post('/master/warehouses', (req, res) => {
  const { name, address, manager } = req.body
  db.run('INSERT INTO warehouses (name, address, manager) VALUES (?, ?, ?)',
    [name, address, manager],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json({ status: 'ok', data: { id: this.lastID, name } })
})

router.get('/master/users', (req, res) => {
  db.all('SELECT id, username, name, role, email, created_at, status FROM users ORDER BY created_at DESC', (err, users) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ status: 'ok', data: users })
  })
})

  const hash = bcrypt.hashSync(password, 10);
  db.run('INSERT INTO users (username, password, role, email, name, status) VALUES (?, ?, ?, ?, ?, ?)',
    [username, hash, role, email, name, status],
    function (err) {
})
router.get('/master/roles', (req, res) => {
  db.all('SELECT * FROM roles ORDER BY name', (err, roles) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ status: 'ok', data: roles })
  })
})

router.post('/master/roles', (req, res) => {
  const { name, permissions } = req.body
  db.run('INSERT INTO roles (name, permissions) VALUES (?, ?)', [name, JSON.stringify(permissions)], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ status: 'ok', data: { id: this.lastID, name } })
})

export default router
