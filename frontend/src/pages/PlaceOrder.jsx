import React, { useContext, useState } from "react"
import Title from "../components/Title"
import CartTotal from "../components/CartTotal"
import { assets } from "../assets/assets"
import { ShopContext } from "../context/ShopContext"
import { toast } from "react-toastify"
import axios from 'axios'

const PlaceOrder = () => {
	const [method, setMethod] = useState("cod")
	const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext)
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		street: "",
		city: "",
		state: "",
		zipcode: "",
		country: "",
		phone: ""
	})

	const onchangeHandler = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setFormData(data => ({ ...data, [name]: value }))
	}

	const initPay = (order) => {
		const options = {
			key: "rzp_test_pI9R4O84hjlWjl",
			amount: order.amount,
			currency: "INR",
			name: "Shop",
			description: "Test Transaction",
			image: "https://example.com/your_logo",
			order_id: order.id,
			receipt: order.receipt,
			handler: async (response) => {
				try {
					const { data } = await axios.post(`${backendUrl}/api/order/verifyRazorpay`, response, { headers: { token } })
					if (data.success) {
						toast.success(data.message)
						setCartItems([])
						navigate("/orders")
					}
				} catch (error) {
					console.log(error);
					toast.error(error)
				}
			}
		}
		const rzp = new window.Razorpay(options)
		rzp.open()
	}

	const onSubmitHandler = async (e) => {
		e.preventDefault()
		try {
			let orderItems = []
			for (const items in cartItems) {
				for (const item in cartItems[items]) {
					if (cartItems[items][item] > 0) {
						const itemInfo = structuredClone(products.find(product => product._id === items))
						if (itemInfo) {
							itemInfo.size = item
							itemInfo.quantity = cartItems[items][item]
							orderItems.push(itemInfo)
						}
					}
				}
			}
			let orderData = {
				address: formData,
				items: orderItems,
				amount: getCartAmount() + delivery_fee,

			}

			switch (method) {
				// api calls for COD
				case "cod":
					const responce = await axios.post(`${backendUrl}/api/order/place`, orderData, { headers: { token } })
					console.log(responce);

					if (responce.data.success) {
						setCartItems({})
						navigate('/orders')
					} else {
						toast.error(responce.data.message)
					}
					break;

				case "stripe":
					const responceStripe = await axios.post(`${backendUrl}/api/order/stripe`, orderData, { headers: { token } })

					if (responceStripe.data.success) {
						const { session_url } = responceStripe.data
						window.location.replace(session_url)
					} else {
						toast.error(responceStripe.data.message)
					}

					break;

				case "razorpay":
					const responceRazorpay = await axios.post(`${backendUrl}/api/order/razorpay`, orderData, { headers: { token } })

					console.log(responceRazorpay);
					if (responceRazorpay.data.success) {
						initPay(responceRazorpay.data.order)
						console.log(responceRazorpay.data.order);

					}

				default:

					break;
			}

		} catch (error) {
			console.log(error);
			toast.error(error.message)
		}

	}
	return (
		<form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
			{/* ---------left side----------- */}
			<div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
				<div className="text-xl sm:text-2xl my-3">
					<Title
						text1={"DELIVERY"}
						text2={"INFORMATION"}
					/>
				</div>
				<div className="flex gap-3">
					<input
						required
						type="text"
						placeholder="First name"
						onChange={onchangeHandler}
						name="firstName"
						value={formData.firstName}
						className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
					/>
					<input
						required
						type="text"
						onChange={onchangeHandler}
						name="lastName"
						value={formData.lastName}
						placeholder="Last name"
						className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
					/>
				</div>
				<input
					required
					type="email"
					onChange={onchangeHandler}
					name="email"
					value={formData.email}
					placeholder="Email address"
					className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
				/>
				<input
					required
					type="text"
					onChange={onchangeHandler}
					name="street"
					value={formData.street}
					placeholder="Street"
					className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
				/>
				<div className="flex gap-3">
					<input
						required
						type="text"
						onChange={onchangeHandler}
						name="city"
						value={formData.city}
						placeholder="City"
						className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
					/>
					<input
						required
						type="text"
						onChange={onchangeHandler}
						name="state"
						value={formData.state}
						placeholder="State"
						className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
					/>
				</div>
				<div className="flex gap-3">
					<input
						required
						type="number"
						onChange={onchangeHandler}
						name="zipcode"
						value={formData.zipcode}
						placeholder="Zipcode"
						className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
					/>
					<input
						required
						type="text"
						onChange={onchangeHandler}
						name="country"
						value={formData.country}
						placeholder="Country"
						className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
					/>
				</div>
				<input
					required
					type="number"
					onChange={onchangeHandler}
					name="phone"
					value={formData.phone}
					placeholder="Phone"
					className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
				/>
			</div>

			{/* ---------right side----------- */}
			<div className="mt-8">
				<div className="mt-8 min-w-80">
					<CartTotal />
				</div>
				<div className="mt-12">
					<Title
						text1={"PAYMENT"}
						text2={"METHOD"}
					/>
					{/* payment method selection */}
					<div className="flex gap-3 flex-col lg:flex-row">
						<div
							onClick={() => setMethod("stripe")}
							className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
						>
							<p
								className={`min-w-3.5 h-3.5 border rounded-full ${method === "stripe" ? "bg-green-400" : ""
									}`}
							></p>
							<img
								src={assets.stripe_logo}
								alt=""
								className="h-5 mx-4"
							/>
						</div>
						<div
							onClick={() => setMethod("razorpay")}
							className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
						>
							<p
								className={`min-w-3.5 h-3.5 border rounded-full ${method === "razorpay" ? "bg-green-400" : ""
									}`}
							></p>
							<img
								src={assets.razorpay_logo}
								alt=""
								className="h-5 mx-4"
							/>
						</div>
						<div
							onClick={() => setMethod("cod")}
							className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
						>
							<p
								className={`min-w-3.5 h-3.5 border rounded-full ${method === "cod" ? "bg-green-400" : "cod"
									}`}
							></p>
							<p className="text-gray-500 text-sm font-medium mx-4">
								CASH ON DELIVERY
							</p>
						</div>
					</div>
					<div className="w-full text-end mt-8">
						<button
							className="bg-black text-white px-16
						 py-3 text-sm"
							type="submit"
						>
							PLACE ORDER
						</button>
					</div>
				</div>
			</div>
		</form>
	)
}

export default PlaceOrder
