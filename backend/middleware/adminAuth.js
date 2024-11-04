import jwt from "jsonwebtoken"
const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers
    if (!token) { return res.json({ success: false, message: "Please Login First" }) }
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
    if (tokenDecode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) { return res.json({ success: false, message: "Please Login First" }) }
    next()
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })

  }
}

export default adminAuth