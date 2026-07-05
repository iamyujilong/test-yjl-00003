import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../database'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'used-car-saas-dev-secret-key-2026'

router.post('/auth/login', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' })
  }
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user: any) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }
    if (user.status === 'inactive') {
      return res.status(403).json({ error: '账户已被禁用' })
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      if (!result) {
        return res.status(401).json({ error: '用户名或密码错误' })
      }
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      )
      res.json({
        status: 'ok',
        data: {
          id: user.id,
          username: user.username,
          role: user.role,
          email: user.email,
          name: user.name,
          token
        }
      })
    })
  })
})

router.get('/auth/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ error: '未授权' })
  }
  jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: 'token 无效或已过期' })
    }
    db.get('SELECT id, username, role, email, name, status FROM users WHERE id = ?', [decoded.id], (err, user: any) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      if (!user) {
        return res.status(404).json({ error: '用户不存在' })
      }
      res.json({ status: 'ok', data: user })
    })
  })
})

router.post('/auth/logout', (req, res) => {
  res.json({ status: 'ok', message: '退出成功' })
})

export default router
