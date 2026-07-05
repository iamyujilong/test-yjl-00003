import sqlite3 from 'sqlite3'
import path from 'path'
import fs from 'fs'
import bcrypt from 'bcryptjs'

const dataDir = path.join(__dirname, '../data')

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

export const db = new sqlite3.Database(path.join(dataDir, 'database.db'), (err) => {
  if (err) {
    console.error('Database connection error:', err.message)
    process.exit(1)
  } else {
    console.log('Connected to SQLite database')
    db.run("PRAGMA encoding = 'UTF-8'", (err) => {
      if (err) console.error('Failed to set UTF-8 encoding:', err.message)
    })
    db.run("PRAGMA foreign_keys = ON", (err) => {
      if (err) console.error('Failed to enable foreign keys:', err.message)
    })
  }
})

export const initDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const adminPasswordHash = bcrypt.hashSync('admin123', 10)

    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL,
        email VARCHAR(100),
        name VARCHAR(50),
        status VARCHAR(20) DEFAULT 'active',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) console.error('Error creating users table:', err.message)
      })

      db.run(`CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(50) NOT NULL UNIQUE,
        permissions TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) console.error('Error creating roles table:', err.message)
      })

      db.run(`CREATE TABLE IF NOT EXISTS car_brands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(50) NOT NULL UNIQUE,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) console.error('Error creating car_brands table:', err.message)
      })

      db.run(`CREATE TABLE IF NOT EXISTS car_models (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        brand_id INTEGER NOT NULL,
        name VARCHAR(50) NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (brand_id) REFERENCES car_brands(id)
      )`, (err) => {
        if (err) console.error('Error creating car_models table:', err.message)
      })

      db.run(`CREATE TABLE IF NOT EXISTS car_series (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        model_id INTEGER NOT NULL,
        name VARCHAR(50) NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (model_id) REFERENCES car_models(id)
      )`, (err) => {
        if (err) console.error('Error creating car_series table:', err.message)
      })

      db.run(`CREATE TABLE IF NOT EXISTS cars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vin VARCHAR(17) NOT NULL UNIQUE,
        license_plate VARCHAR(20),
        brand_id INTEGER NOT NULL,
        model_id INTEGER NOT NULL,
        series_id INTEGER NOT NULL,
        year INTEGER,
        color VARCHAR(20),
        mileage INTEGER,
        price DECIMAL(12,2),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (brand_id) REFERENCES car_brands(id),
        FOREIGN KEY (model_id) REFERENCES car_models(id),
        FOREIGN KEY (series_id) REFERENCES car_series(id)
      )`, (err) => {
        if (err) console.error('Error creating cars table:', err.message)
      })

      db.run(`CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type VARCHAR(10) NOT NULL,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(100),
        address TEXT,
        tax_id VARCHAR(50),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) console.error('Error creating customers table:', err.message)
      })

      db.run(`CREATE TABLE IF NOT EXISTS suppliers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        contact VARCHAR(50),
        phone VARCHAR(20),
        address TEXT,
        tax_id VARCHAR(50),
        cooperation_brands TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) console.error('Error creating suppliers table:', err.message)
      })

      db.run(`CREATE TABLE IF NOT EXISTS warehouses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        address TEXT,
        manager VARCHAR(50),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) console.error('Error creating warehouses table:', err.message)
      })

      db.run(`CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        warehouse_id INTEGER NOT NULL,
        code VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'empty',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
      )`, (err) => {
        if (err) console.error('Error creating locations table:', err.message)
      })

      db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_no VARCHAR(50) NOT NULL UNIQUE,
        type VARCHAR(20) NOT NULL,
        user_id INTEGER NOT NULL,
        customer_id INTEGER,
        supplier_id INTEGER,
        status VARCHAR(20) DEFAULT 'pending',
        total_amount DECIMAL(12,2) NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id),
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`, (err) => {
        if (err) console.error('Error creating orders table:', err.message)
      })

      db.run(`CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        car_id INTEGER NOT NULL,
        price DECIMAL(12,2) NOT NULL,
        quantity INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (car_id) REFERENCES cars(id)
      )`, (err) => {
        if (err) console.error('Error creating order_items table:', err.message)
      })

      db.run(`CREATE TABLE IF NOT EXISTS order_attachments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id)
      )`, (err) => {
        if (err) console.error('Error creating order_attachments table:', err.message)
      })

      db.run(`CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        car_id INTEGER NOT NULL UNIQUE,
        location_id INTEGER,
        status VARCHAR(20) DEFAULT 'in_stock',
        inbound_at TEXT,
        outbound_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (car_id) REFERENCES cars(id),
        FOREIGN KEY (location_id) REFERENCES locations(id)
      )`, (err) => {
        if (err) console.error('Error creating inventory table:', err.message)
      })

      db.run(`CREATE TABLE IF NOT EXISTS settlements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type VARCHAR(20) NOT NULL,
        order_id INTEGER,
        user_id INTEGER NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (order_id) REFERENCES orders(id)
      )`, (err) => {
        if (err) console.error('Error creating settlements table:', err.message)
      })

      db.run(`CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_no VARCHAR(50) NOT NULL UNIQUE,
        settlement_id INTEGER NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        type VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'issued',
        issued_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (settlement_id) REFERENCES settlements(id)
      )`, (err) => {
        if (err) console.error('Error creating invoices table:', err.message)
      })

      db.run(`CREATE TABLE IF NOT EXISTS commissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        sales_amount DECIMAL(12,2) NOT NULL,
        rate DECIMAL(5,2) NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'calculated',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`, (err) => {
        if (err) console.error('Error creating commissions table:', err.message)
      })

      db.run(`CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source VARCHAR(50) NOT NULL,
        phone VARCHAR(20),
        name VARCHAR(50),
        car_info TEXT,
        status VARCHAR(20) DEFAULT 'new',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) console.error('Error creating leads table:', err.message)
      })

      db.run(`INSERT OR REPLACE INTO users (id, username, password, role, email, name, status) 
        VALUES (1, 'admin', ?, 'admin', 'admin@example.com', ?, 'active')`, [adminPasswordHash, '管理员'], (err) => {
        if (err) console.error('Error inserting admin user:', err.message)
      })

      const brands = ['宝马', '奔驰', '奥迪', '大众', '丰田', '本田']
      brands.forEach((brand) => {
        db.run(`INSERT OR IGNORE INTO car_brands (name) VALUES (?)`, [brand], (err) => {
          if (err) console.error('Error inserting car brand:', brand, err.message)
        })
      })

      const carModels = [
        { brand_id: 1, name: '3系' }, { brand_id: 1, name: '5系' }, { brand_id: 1, name: 'X3' },
        { brand_id: 2, name: 'C级' }, { brand_id: 2, name: 'E级' }, { brand_id: 2, name: 'GLC' },
        { brand_id: 3, name: 'A4' }, { brand_id: 3, name: 'A6' }, { brand_id: 3, name: 'Q5' },
        { brand_id: 4, name: '朗逸' }, { brand_id: 4, name: '帕萨特' }, { brand_id: 4, name: '途观' },
        { brand_id: 5, name: '凯美瑞' }, { brand_id: 5, name: '卡罗拉' }, { brand_id: 5, name: 'RAV4' },
        { brand_id: 6, name: '雅阁' }, { brand_id: 6, name: '思域' }, { brand_id: 6, name: 'CR-V' }
      ]
      carModels.forEach((model) => {
        db.run(`INSERT OR IGNORE INTO car_models (brand_id, name) VALUES (?, ?)`, [model.brand_id, model.name], (err) => {
          if (err) console.error('Error inserting car model:', model.name, err.message)
        })
      })

      const carSeries = [
        { model_id: 1, name: '320Li' }, { model_id: 1, name: '325Li' }, { model_id: 1, name: '330Li' },
        { model_id: 2, name: '525Li' }, { model_id: 2, name: '530Li' }, { model_id: 2, name: '530Le' },
        { model_id: 3, name: 'xDrive25i' }, { model_id: 3, name: 'xDrive30i' },
        { model_id: 4, name: 'C200L' }, { model_id: 4, name: 'C260L' },
        { model_id: 5, name: 'E260L' }, { model_id: 5, name: 'E300L' },
        { model_id: 6, name: 'GLC260L' }, { model_id: 6, name: 'GLC300L' }
      ]
      carSeries.forEach((series) => {
        db.run(`INSERT OR IGNORE INTO car_series (model_id, name) VALUES (?, ?)`, [series.model_id, series.name], (err) => {
          if (err) console.error('Error inserting car series:', series.name, err.message)
        })
      })

      const customers = [
        { type: 'personal', name: '张三', phone: '13800138001', email: 'zhangsan@example.com' },
        { type: 'enterprise', name: '北京汽车销售有限公司', phone: '010-12345678', email: 'sales@bjcar.com' },
        { type: 'personal', name: '李四', phone: '13900139002', email: 'lisi@example.com' }
      ]
      customers.forEach((customer) => {
        db.run(`INSERT OR IGNORE INTO customers (type, name, phone, email) VALUES (?, ?, ?, ?)`, 
          [customer.type, customer.name, customer.phone, customer.email], (err) => {
          if (err) console.error('Error inserting customer:', customer.name, err.message)
        })
      })

      const suppliers = [
        { name: '上海车源供应商', contact: '王经理', phone: '021-87654321', address: '上海市浦东新区张江高科技园区', brands: '宝马,奔驰' },
        { name: '广州二手车批发', contact: '李总监', phone: '020-11223344', address: '广州市天河区珠江新城', brands: '奥迪,大众' },
        { name: '成都汽车贸易', contact: '张总', phone: '028-55667788', address: '成都市高新区天府大道', brands: '丰田,本田' }
      ]
      suppliers.forEach((supplier) => {
        db.run(`INSERT OR IGNORE INTO suppliers (name, contact, phone, address, cooperation_brands) VALUES (?, ?, ?, ?, ?)`,
          [supplier.name, supplier.contact, supplier.phone, supplier.address, supplier.brands], (err) => {
          if (err) console.error('Error inserting supplier:', supplier.name, err.message)
        })
      })

      const warehouses = [
        { name: '北京仓库', address: '北京市朝阳区物流园A区', manager: '赵经理' },
        { name: '上海仓库', address: '上海市闵行区物流中心', manager: '钱经理' },
        { name: '广州仓库', address: '广州市白云区仓储基地', manager: '孙经理' }
      ]
      warehouses.forEach((warehouse) => {
        db.run(`INSERT OR IGNORE INTO warehouses (name, address, manager) VALUES (?, ?, ?)`,
          [warehouse.name, warehouse.address, warehouse.manager], (err) => {
          if (err) console.error('Error inserting warehouse:', warehouse.name, err.message)
        })
      })

      const locations = [
        { warehouse_id: 1, code: 'A-001', status: 'empty' }, { warehouse_id: 1, code: 'A-002', status: 'empty' }, { warehouse_id: 1, code: 'A-003', status: 'empty' },
        { warehouse_id: 1, code: 'B-001', status: 'empty' }, { warehouse_id: 1, code: 'B-002', status: 'empty' }, { warehouse_id: 1, code: 'B-003', status: 'empty' },
        { warehouse_id: 2, code: 'A-001', status: 'empty' }, { warehouse_id: 2, code: 'A-002', status: 'empty' }, { warehouse_id: 2, code: 'A-003', status: 'empty' },
        { warehouse_id: 3, code: 'A-001', status: 'empty' }, { warehouse_id: 3, code: 'A-002', status: 'empty' }, { warehouse_id: 3, code: 'A-003', status: 'empty' }
      ]
      locations.forEach((location) => {
        db.run(`INSERT OR IGNORE INTO locations (warehouse_id, code, status) VALUES (?, ?, ?)`,
          [location.warehouse_id, location.code, location.status], (err) => {
          if (err) console.error('Error inserting location:', location.code, err.message)
        })
      })

      const cars = [
        { vin: 'LBV2B210XKM123456', license_plate: '京A12345', brand_id: 1, model_id: 1, series_id: 1, year: 2020, color: '白色', mileage: 35000, price: 258000 },
        { vin: 'LBV3B210XLM234567', license_plate: '京B23456', brand_id: 1, model_id: 2, series_id: 4, year: 2021, color: '黑色', mileage: 28000, price: 388000 },
        { vin: 'WDDWF4EB0LR345678', license_plate: '沪C34567', brand_id: 2, model_id: 4, series_id: 10, year: 2019, color: '银色', mileage: 42000, price: 298000 },
        { vin: 'LFV3A23C0M4567890', license_plate: '粤D45678', brand_id: 3, model_id: 7, series_id: 13, year: 2022, color: '蓝色', mileage: 15000, price: 328000 },
        { vin: 'LSGBL5331KF567890', license_plate: '川E56789', brand_id: 4, model_id: 10, series_id: 16, year: 2020, color: '红色', mileage: 48000, price: 128000 }
      ]
      cars.forEach((car) => {
        db.run(`INSERT OR IGNORE INTO cars (vin, license_plate, brand_id, model_id, series_id, year, color, mileage, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [car.vin, car.license_plate, car.brand_id, car.model_id, car.series_id, car.year, car.color, car.mileage, car.price], (err) => {
          if (err) console.error('Error inserting car:', car.vin, err.message)
        })
      })

      const orders = [
        { order_no: 'PO20260704001', type: 'purchase', user_id: 1, customer_id: null, supplier_id: 1, status: 'pending', total_amount: 258000 },
        { order_no: 'PO20260704002', type: 'purchase', user_id: 1, customer_id: null, supplier_id: 2, status: 'paid', total_amount: 298000 },
        { order_no: 'SO20260704001', type: 'sales', user_id: 1, customer_id: 1, supplier_id: null, status: 'transporting', total_amount: 328000 },
        { order_no: 'SO20260704002', type: 'sales', user_id: 1, customer_id: 2, supplier_id: null, status: 'delivered', total_amount: 388000 }
      ]
      orders.forEach((order) => {
        db.run(`INSERT OR IGNORE INTO orders (order_no, type, user_id, customer_id, supplier_id, status, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [order.order_no, order.type, order.user_id, order.customer_id, order.supplier_id, order.status, order.total_amount], (err) => {
          if (err) console.error('Error inserting order:', order.order_no, err.message)
        })
      })

      const orderItems = [
        { order_id: 1, car_id: 1, price: 258000, quantity: 1 },
        { order_id: 2, car_id: 3, price: 298000, quantity: 1 },
        { order_id: 3, car_id: 4, price: 328000, quantity: 1 },
        { order_id: 4, car_id: 2, price: 388000, quantity: 1 }
      ]
      orderItems.forEach((item) => {
        db.run(`INSERT OR IGNORE INTO order_items (order_id, car_id, price, quantity) VALUES (?, ?, ?, ?)`,
          [item.order_id, item.car_id, item.price, item.quantity], (err) => {
          if (err) console.error('Error inserting order item:', err.message)
        })
      })

      const inventoryItems = [
        { car_id: 1, location_id: 1, status: 'in_stock', inbound_at: '2026-07-01 10:00:00' },
        { car_id: 2, location_id: 2, status: 'in_stock', inbound_at: '2026-07-02 14:00:00' },
        { car_id: 5, location_id: 3, status: 'in_stock', inbound_at: '2026-07-03 09:00:00' }
      ]
      inventoryItems.forEach((item) => {
        db.run(`INSERT OR IGNORE INTO inventory (car_id, location_id, status, inbound_at) VALUES (?, ?, ?, ?)`,
          [item.car_id, item.location_id, item.status, item.inbound_at], (err) => {
          if (err) console.error('Error inserting inventory:', err.message)
        })
      })

      const settlements = [
        { type: 'purchase', order_id: 2, user_id: 1, amount: 298000, status: 'paid' },
        { type: 'sales', order_id: 4, user_id: 1, amount: 388000, status: 'paid' },
        { type: 'purchase', order_id: 1, user_id: 1, amount: 258000, status: 'pending' },
        { type: 'sales', order_id: 3, user_id: 1, amount: 328000, status: 'pending' }
      ]
      settlements.forEach((settlement) => {
        db.run(`INSERT OR IGNORE INTO settlements (type, order_id, user_id, amount, status) VALUES (?, ?, ?, ?, ?)`,
          [settlement.type, settlement.order_id, settlement.user_id, settlement.amount, settlement.status], (err) => {
          if (err) console.error('Error inserting settlement:', err.message)
        })
      })

      const invoices = [
        { invoice_no: 'FP20260704001', settlement_id: 1, amount: 298000, type: 'purchase', status: 'verified', issued_at: '2026-07-04 10:00:00' },
        { invoice_no: 'FP20260704002', settlement_id: 2, amount: 388000, type: 'sales', status: 'verified', issued_at: '2026-07-04 11:00:00' },
        { invoice_no: 'FP20260704003', settlement_id: 3, amount: 258000, type: 'purchase', status: 'pending', issued_at: null }
      ]
      invoices.forEach((invoice) => {
        db.run(`INSERT OR IGNORE INTO invoices (invoice_no, settlement_id, amount, type, status, issued_at) VALUES (?, ?, ?, ?, ?, ?)`,
          [invoice.invoice_no, invoice.settlement_id, invoice.amount, invoice.type, invoice.status, invoice.issued_at], (err) => {
          if (err) console.error('Error inserting invoice:', invoice.invoice_no, err.message)
        })
      })

      const commissions = [
        { order_id: 3, user_id: 1, sales_amount: 328000, rate: 3.00, amount: 9840, status: 'calculated' },
        { order_id: 4, user_id: 1, sales_amount: 388000, rate: 3.00, amount: 11640, status: 'paid' }
      ]
      commissions.forEach((commission) => {
        db.run(`INSERT OR IGNORE INTO commissions (order_id, user_id, sales_amount, rate, amount, status) VALUES (?, ?, ?, ?, ?, ?)`,
          [commission.order_id, commission.user_id, commission.sales_amount, commission.rate, commission.amount, commission.status], (err) => {
          if (err) console.error('Error inserting commission:', err.message)
        })
      })

      const leads = [
        { source: '抖音', phone: '13700137001', name: '王五', car_info: '宝马3系 2020款', status: 'new' },
        { source: '快手', phone: '13600136002', name: '赵六', car_info: '奔驰C级 2019款', status: 'contacted' },
        { source: '小红书', phone: '13500135003', name: '孙七', car_info: '奥迪A4 2022款', status: 'qualified' }
      ]
      leads.forEach((lead) => {
        db.run(`INSERT OR IGNORE INTO leads (source, phone, name, car_info, status) VALUES (?, ?, ?, ?, ?)`,
          [lead.source, lead.phone, lead.name, lead.car_info, lead.status], (err) => {
          if (err) console.error('Error inserting lead:', lead.name, err.message)
        })
      })

      db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", [], (err, tables) => {
        if (err) {
          console.error('Error verifying tables:', err.message)
          reject(err)
          return
        }
        const tableNames = tables.map((t: any) => t.name)
        console.log('Created tables:', tableNames.join(', '))

        const requiredTables = ['users', 'orders', 'cars', 'customers', 'suppliers', 'warehouses', 'locations', 'inventory', 'settlements', 'invoices', 'commissions', 'leads']
        const missingTables = requiredTables.filter(t => !tableNames.includes(t))
        
        if (missingTables.length > 0) {
          console.error('Missing required tables:', missingTables.join(', '))
          reject(new Error(`Missing required tables: ${missingTables.join(', ')}`))
          return
        }

        console.log('Database initialization completed')
        resolve()
      })
    })
  })
}