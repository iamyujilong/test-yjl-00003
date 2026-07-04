import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { initDatabase } from './database'
import authRoutes from './routes/auth'
import ordersRoutes from './routes/orders'
import warehouseRoutes from './routes/warehouse'
import settlementRoutes from './routes/settlement'
import masterRoutes from './routes/master'

const app = express()
const port = 3000

const dataDir = path.join(__dirname, '../data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

initDatabase().then(() => {
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use('/api', authRoutes)
  app.use('/api', ordersRoutes)
  app.use('/api', warehouseRoutes)
  app.use('/api', settlementRoutes)
  app.use('/api', masterRoutes)

  app.get('/api/open/test', (req, res) => {
    res.json({ status: 'ok', message: '广告平台对接 API 测试成功' })
  })

  app.post('/api/open/lead', (req, res) => {
    const { source, phone, name, car_info } = req.body
    if (!source || !phone) {
      return res.status(400).json({ error: '缺少必填字段' })
    }
    res.json({
      status: 'ok',
      data: {
        id: Date.now(),
        source,
        phone,
        name,
        car_info,
        status: 'new',
        created_at: new Date().toISOString()
      }
    })
  })

  app.get('/api/open/lead/:id', (req, res) => {
    res.json({
      status: 'ok',
      data: {
        id: req.params.id,
        source: '抖音',
        phone: '13700137001',
        name: '王五',
        car_info: '宝马3系 2020款',
        status: 'new',
        created_at: new Date().toISOString()
      }
    })
  })

  app.put('/api/open/lead/:id/status', (req, res) => {
    res.json({
      status: 'ok',
      data: {
        id: req.params.id,
        status: req.body.status || 'contacted'
      }
    })
  })

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
  })
}).catch((err) => {
  console.error('Database initialization failed:', err)
  process.exit(1)
})
