import jwt from 'jsonwebtoken'


export const authenticate = async (req, res, next) => {
  const token = req.cookies.jwt

  if(!token)
    return res.status(401).json({message: 'Authentication token does not exist'})

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if(!decoded)
      return res.status(401).json({message: 'Invalid authentication token'})
    
    req.user = decoded.id
    next();
    
  } catch (error) {
    return res.status(401).json({message: 'Authentication failed'})
  }
}