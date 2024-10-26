import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

export default (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token)
    return res.status(401).json({ error: 'unauthorized' })

  jwt.verify(token, process.env.JWT_SECRET, async (error, user) => {
    if (error) {
      return res.status(403).json({ error: 'Invalid token' })
    }

    req.user = await User.findOne({ where: { user_id: +user.user_id } });

    next()
  })
}