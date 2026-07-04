import sqlite3 from 'sqlite3'
import path from 'path'
import bcrypt from 'bcryptjs'

const dataDir = path.join(__dirname, '../data')

export const db = new sqlite3.Database(path.join(dataDir, 'database.db'), sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Database connection error:', err.message)
    process.exit(1)
  } else {
    console.log('Connected to SQLite database')
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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`)

      db.run(`CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(50) NOT NULL UNIQUE,
        permissions TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`)

      db.run(`CREATE TABLE IF NOT EXISTS car_brands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(50) NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`)

      db.run(`CREATE TABLE IF NOT EXISTS car_models (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        brand_id INTEGER NOT NULL,
        name VARCHAR(50) NOT NULL,
        FOREIGN KEY (brand_id) REFERENCES car_brands(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`)

      db.run(`CREATE TABLE IF NOT EXISTS car_series (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        model_id INTEGER NOT NULL,
        name VARCHAR(50) NOT NULL,
        FOREIGN KEY (model_id) REFERENCES car_models(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`)

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
        FOREIGN KEY (brand_id) REFERENCES car_brands(id),
        FOREIGN KEY (model_id) REFERENCES car_models(id),
        FOREIGN KEY (series_id) REFERENCES car_series(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`)

      db.run(`CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type VARCHAR(10) NOT NULL,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(100),
        address TEXT,
        tax_id VARCHAR(50),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`)

      db.run(`CREATE TABLE IF NOT EXISTS suppliers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        contact VARCHAR(50),
        phone VARCHAR(20),
        address TEXT,
        tax_id VARCHAR(50),
        cooperation_brands TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`)

      db.run(`CREATE TABLE IF NOT EXISTS warehouses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        address TEXT,
        manager VARCHAR(50),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`)

      db.run(`CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        warehouse_id INTEGER NOT NULL,
        code VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'empty',
        FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`)

      db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_no VARCHAR(50) NOT NULL UNIQUE,
        type VARCHAR(20) NOT NULL,
        user_id INTEGER NOT NULL,
        customer_id INTEGER,
        supplier_id INTEGER,
        status VARCHAR(20) DEFAULT 'pending',
        total_amount DECIMAL(12,2) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (customer_id) REFERENCES customers(id),
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`)

      db.run(`CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        car_id INTEGER NOT NULL,
        price DECIMAL(12,2) NOT NULL,
        quantity INTEGER DEFAULT 1,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (car_id) REFERENCES cars(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`)

      db.run(`CREATE TABLE IF NOT EXISTS order_attachments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`)

      db.run(`CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        car_id INTEGER NOT NULL UNIQUE,
        location_id INTEGER,
        status VARCHAR(20) DEFAULT 'in_stock',
        inbound_at DATETIME,
        outbound_at DATETIME,
        FOREIGN KEY (car_id) REFERENCES cars(id),
        FOREIGN KEY (location_id) REFERENCES locations(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`)

      db.run(`CREATE TABLE IF NOT EXISTS settlements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type VARCHAR(20) NOT NULL,
        order_id INTEGER,
        user_id INTEGER NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`)

      db.run(`CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_no VARCHAR(50) NOT NULL UNIQUE,
        settlement_id INTEGER NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        type VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'issued',
        issued_at DATETIME,
        FOREIGN KEY (settlement_id) REFERENCES settlements(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`)

      db.run(`CREATE TABLE IF NOT EXISTS commissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        sales_amount DECIMAL(12,2) NOT NULL,
        rate DECIMAL(5,2) NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'calculated',
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`)

      db.run(`CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source VARCHAR(50) NOT NULL,
        phone VARCHAR(20),
        name VARCHAR(50),
        car_info TEXT,
        status VARCHAR(20) DEFAULT 'new',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`)

      db.run(`INSERT OR REPLACE INTO users (id, username, password, role, email, name, status) 
        VALUES (1, 'admin', ?, 'admin', 'admin@example.com', '管理员', 'active')`, [adminPasswordHash])

      db.run(`INSERT OR IGNORE INTO car_brands (name) VALUES ('宝马'), ('奔驰'), ('奥迪'), ('大众'), ('丰田'), ('本田')`)

      db.run(`INSERT OR IGNORE INTO car_models (brand_id, name) VALUES 
        (1, '3系'), (1, '5系'), (1, 'X3'), 
        (2, 'C级'), (2, 'E级'), (2, 'GLC'),
        (3, 'A4'), (3, 'A6'), (3, 'Q5'),
        (4, '朗逸'), (4, '帕萨特'), (4, '途观'),
        (5, '凯美瑞'), (5, '卡罗拉'), (5, 'RAV4'),
        (6, '雅阁'), (6, '思域'), (6, 'CR-V')`)

      db.run(`INSERT OR IGNORE INTO car_series (model_id, name) VALUES 
        (1, '320Li'), (1, '325Li'), (1, '330Li'),
        (2, '525Li'), (2, '530Li'), (2, '530Le'),
        (3, 'xDrive25i'), (3, 'xDrive30i'),
        (4, 'C200L'), (4, 'C260L'),
        (5, 'E260L'), (5, 'E300L'),
        (6, 'GLC260L'), (6, 'GLC300L')`)

      db.run(`INSERT OR IGNORE INTO customers (type, name, phone, email) VALUES 
        ('personal', '张三', '13800138001', 'zhangsan@example.com'),
        ('enterprise', '北京汽车销售有限公司', '010-12345678', 'sales@bjcar.com'),
        ('personal', '李四', '13900139002', 'lisi@example.com')`)

      db.run(`INSERT OR IGNORE INTO suppliers (name, contact, phone, address, cooperation_brands) VALUES 
        ('上海车源供应商', '王经理', '021-87654321', '上海市浦东新区张江高科技园区', '宝马,奔驰'),
        ('广州二手车批发', '李总监', '020-11223344', '广州市天河区珠江新城', '奥迪,大众'),
        ('成都汽车贸易', '张总', '028-55667788', '成都市高新区天府大道', '丰田,本田')`)

      db.run(`INSERT OR IGNORE INTO warehouses (name, address, manager) VALUES 
        ('北京仓库', '北京市朝阳区物流园A区', '赵经理'),
        ('上海仓库', '上海市闵行区物流中心', '钱经理'),
        ('广州仓库', '广州市白云区仓储基地', '孙经理')`)

      db.run(`INSERT OR IGNORE INTO locations (warehouse_id, code, status) VALUES 
        (1, 'A-001', 'empty'), (1, 'A-002', 'empty'), (1, 'A-003', 'empty'),
        (1, 'B-001', 'empty'), (1, 'B-002', 'empty'), (1, 'B-003', 'empty'),
        (2, 'A-001', 'empty'), (2, 'A-002', 'empty'), (2, 'A-003', 'empty'),
        (3, 'A-001', 'empty'), (3, 'A-002', 'empty'), (3, 'A-003', 'empty')`)

      db.run(`INSERT OR IGNORE INTO cars (vin, license_plate, brand_id, model_id, series_id, year, color, mileage, price) VALUES 
        ('LBV2B210XKM123456', '京A12345', 1, 1, 1, 2020, '白色', 35000, 258000),
        ('LBV3B210XLM234567', '京B23456', 1, 2, 4, 2021, '黑色', 28000, 388000),
        ('WDDWF4EB0LR345678', '沪C34567', 2, 4, 10, 2019, '银色', 42000, 298000),
        ('LFV3A23C0M4567890', '粤D45678', 3, 7, 13, 2022, '蓝色', 15000, 328000),
        ('LSGBL5331KF567890', '川E56789', 4, 10, 16, 2020, '红色', 48000, 128000)`)

      db.run(`INSERT OR IGNORE INTO orders (order_no, type, user_id, customer_id, supplier_id, status, total_amount) VALUES 
        ('PO20260704001', 'purchase', 1, NULL, 1, 'pending', 258000),
        ('PO20260704002', 'purchase', 1, NULL, 2, 'paid', 298000),
        ('SO20260704001', 'sales', 1, 1, NULL, 'transporting', 328000),
        ('SO20260704002', 'sales', 1, 2, NULL, 'delivered', 388000)`)

      db.run(`INSERT OR IGNORE INTO order_items (order_id, car_id, price, quantity) VALUES 
        (1, 1, 258000, 1),
        (2, 3, 298000, 1),
        (3, 4, 328000, 1),
        (4, 2, 388000, 1)`)

      db.run(`INSERT OR IGNORE INTO inventory (car_id, location_id, status, inbound_at) VALUES 
        (1, 1, 'in_stock', '2026-07-01 10:00:00'),
        (2, 2, 'in_stock', '2026-07-02 14:00:00'),
        (5, 3, 'in_stock', '2026-07-03 09:00:00')`)

      db.run(`INSERT OR IGNORE INTO settlements (type, order_id, user_id, amount, status) VALUES 
        ('purchase', 2, 1, 298000, 'paid'),
        ('sales', 4, 1, 388000, 'paid'),
        ('purchase', 1, 1, 258000, 'pending'),
        ('sales', 3, 1, 328000, 'pending')`)

      db.run(`INSERT OR IGNORE INTO invoices (invoice_no, settlement_id, amount, type, status, issued_at) VALUES 
        ('FP20260704001', 1, 298000, 'purchase', 'verified', '2026-07-04 10:00:00'),
        ('FP20260704002', 2, 388000, 'sales', 'verified', '2026-07-04 11:00:00'),
        ('FP20260704003', 3, 258000, 'purchase', 'pending', NULL)`)

      db.run(`INSERT OR IGNORE INTO commissions (order_id, user_id, sales_amount, rate, amount, status) VALUES 
        (3, 1, 328000, 3.00, 9840, 'calculated'),
        (4, 1, 388000, 3.00, 11640, 'paid')`)

      db.run(`INSERT OR IGNORE INTO leads (source, phone, name, car_info, status) VALUES 
        ('抖音', '13700137001', '王五', '宝马3系 2020款', 'new'),
        ('快手', '13600136002', '赵六', '奔驰C级 2019款', 'contacted'),
        ('小红书', '13500135003', '孙七', '奥迪A4 2022款', 'qualified')`)
    })

    db.run('SELECT 1', [], (err) => {
      if (err) {
        reject(err)
      } else {
        console.log('Database initialization completed')
        resolve()
      }
    })
  })
}
