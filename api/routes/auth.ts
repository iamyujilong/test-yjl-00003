import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../database'

const router = express.Router()

router.post('/auth/login', (req, res) => {
  const { username, password } = req.body
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user: any) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      if (!result) {
        return res.status(401).json({ error: '用户名或密码错误' })
      }
      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, 'secret-key', { expiresIn: '1h' })
      res.json({
        status: 'ok',
        data: {
          id: user.id,
          username: user.username,
          role: user.role,
          email: user.email,
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
  jwt.verify(token, 'secret-key', (err, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: 'token 无效' })
    }
    db.get('SELECT id, username, role, email FROM users WHERE id = ?', [decoded.id], (err, user: any) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json({ status: 'ok', data: user })
    })
  })
})

router.post('/auth/logout', (req, res) => {
  res.json({ status: 'ok', message: '退出成功' })
})

export default router
