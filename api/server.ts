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
const port = parseInt(process.env.PORT || '3000', 10)

const dataDir = path.join(__dirname, '../data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

let isDatabaseReady = false

app.get('/health', (_req, res) => {
  if (!isDatabaseReady) {
    return res.status(503).json({ 
      status: 'unhealthy', 
      message: 'Database initialization in progress',
      timestamp: new Date().toISOString() 
    })
  }
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/api/open/test', (req, res) => {
  res.json({
    status: 'ok',
    message: '广告平台对接 API 测试成功',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

initDatabase().then(() => {
  isDatabaseReady = true
  console.log('Registering routes...')

  app.use('/api', authRoutes)
  app.use('/api', ordersRoutes)
  app.use('/api', warehouseRoutes)
  app.use('/api', settlementRoutes)
  app.use('/api', masterRoutes)

  app.post('/api/open/lead', (req, res) => {
    const { source, phone, name, car_info, platform, user_id } = req.body
    if (!source || !phone) {
      return res.status(400).json({ error: '缺少必填字段: source, phone' })
    }
    res.json({
      status: 'ok',
      data: {
        id: Date.now(),
        source,
        phone,
        name: name || null,
        car_info: car_info || null,
        platform: platform || null,
        user_id: user_id || null,
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
    const { status } = req.body
    if (!['contacted', 'qualified', 'converted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: '无效的状态值' })
    }
    res.json({
      status: 'ok',
      data: {
        id: req.params.id,
        status
      }
    })
  })

  app.post('/api/open/convert', (req, res) => {
    const { lead_id, platform, conversion_type, value } = req.body
    if (!lead_id) {
      return res.status(400).json({ error: '缺少必填字段: lead_id' })
    }
    res.json({
      status: 'ok',
      data: {
        id: Date.now(),
        lead_id,
        platform: platform || 'unknown',
        conversion_type: conversion_type || 'sale',
        value: value || 0,
        tracked_at: new Date().toISOString()
      }
    })
  })

  app.get('/api/open/convert', (req, res) => {
    const { user_id, platform } = req.query
    res.json({
      status: 'ok',
      data: {
        user_id: user_id || null,
        platform: platform || null,
        conversions: [
          {
            lead_id: '123456',
            conversion_type: 'sale',
            value: 328000,
            tracked_at: '2026-07-04T10:00:00.000Z'
          }
        ]
      }
    })
  })

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
    console.log(`Health check: http://localhost:${port}/health`)
    console.log(`Open API test: http://localhost:${port}/api/open/test`)
  })

}).catch((err) => {
  console.error('Database initialization failed:', err)
  process.exit(1)
})