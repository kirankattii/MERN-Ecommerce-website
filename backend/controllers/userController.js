import userModel from "../models/userModel.js"
import validator from "validator"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const createToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "30d",
	})
}

// route for user login
const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body
		const user = await userModel.findOne({ email })
		if (!user) {
			return res.json({ success: false, message: "User does not exist" })
		}

		// comparing password
		const isMatch = await bcrypt.compare(password, user.password)

		if (isMatch) {
			const token = createToken(user._id)
			res.json({ success: true, token })
		} else {
			res.json({ success: false, message: "Incorrect Password" })
		}
	} catch (error) {
		console.log(error)
		res.json({ success: false, message: error.message })
	}
}

// route for user register
const registerUser = async (req, res) => {
	try {
		const { name, email, password } = req.body

		//check the user exists or not
		const exists = await userModel.findOne({ email })
		if (exists) {
			return res.json({ success: false, message: "User Already exists" })
		}

		// validating email format and strong password
		if (!validator.isEmail(email)) {
			return res.json({ success: false, message: "Please Enter Valid Email" })
		}
		if (password.length < 6) {
			return res.json({ success: false, message: "Password not strong" })
		}

		// hashing password
		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(password, salt)

		const newUser = new userModel({ name, email, password: hashedPassword })

		const user = await newUser.save()

		const token = createToken(user._id)

		res.json({ success: true, token })
	} catch (error) {
		console.log(error)
		res.json({ success: false, message: error.message })
	}
}

// route for admin login
const adminLogin = async (req, res) => {
	try {
		const { email, password } = req.body
		if (
			email === process.env.ADMIN_EMAIL &&
			password === process.env.ADMIN_PASSWORD
		) {
			const token = jwt.sign(email + password, process.env.JWT_SECRET)
			res.json({ success: true, token })
		} else {
			res.json({ success: false, message: "Invalid Credentials" })
		}
	} catch (error) { }
}

export { loginUser, registerUser, adminLogin }
