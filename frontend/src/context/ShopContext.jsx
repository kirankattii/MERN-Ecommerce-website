import { Children, createContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import axios from 'axios'

export const ShopContext = createContext()

const shopContextProvider = (props) => {
	const currency = "$"
	const delivary_fee = 10
	const backendUrl = import.meta.env.VITE_BACKEND_URL
	const [search, setSearch] = useState("")
	const [showSearch, setShowSearch] = useState(false)
	const [cartItems, setCartItems] = useState({})
	const [products, setProducts] = useState([])
	const [token, setToken] = useState("")
	const navigate = useNavigate()

	const addToCart = async (itemId, size) => {
		if (!size) {
			toast.error("Select product size")
			return
		}
		let cartData = structuredClone(cartItems)
		if (cartData[itemId]) {
			if (cartData[itemId][size]) {
				cartData[itemId][size] += 1
			} else {
				cartData[itemId][size] = 1
			}
		} else {
			cartData[itemId] = {}
			cartData[itemId][size] = 1
		}

		setCartItems(cartData)
		if (token) {
			try {
				await axios.post(`${backendUrl}/api/cart/add`, { itemId, size }, {
					headers: {
						token
					}
				})
			} catch (error) {
				console.log(error);
				toast.error(error.message)
			}
		}
	}

	const getCartCount = () => {
		let totalCount = 0
		for (const items in cartItems) {
			for (const item in cartItems[items]) {
				try {
					if (cartItems[items][item] > 0) {
						totalCount += cartItems[items][item]
					}
				} catch (error) { }
			}
		}
		return totalCount
	}

	const updateQuantity = async (itemId, size, quantity) => {
		let cartData = structuredClone(cartItems)
		cartData[itemId][size] = quantity
		setCartItems(cartData)
		if (token) {
			try {
				await axios.post(`${backendUrl}/api/cart/update`, { itemId, size, quantity }, {
					headers: {
						token
					}
				})
			} catch (error) {
				console.log(error);
				toast.error(error.message)

			}
		}
	}

	const getCartAmount = () => {
		let totalAmount = 0
		for (const items in cartItems) {
			let itemInfo = products.find((product) => product._id === items)
			for (const item in cartItems[items]) {
				try {
					if (cartItems[items][item] > 0) {
						totalAmount += itemInfo.price * cartItems[items][item]
					}
				} catch (error) { }
			}
		}
		return totalAmount
	}
	const delivery_fee = 10

	const getProductsData = async () => {
		try {
			const responce = await axios.get(`${backendUrl}/api/product/list`)
			if (responce.data.success) {
				setProducts(responce.data.products)
			} else {
				toast.error(responce.data.message)
			}
		} catch (error) {
			console.log(error);
			toast.error(error.message)
		}
	}

	const getUserCart = async (token) => {
		try {
			const responce = await axios.post(`${backendUrl}/api/cart/get`, {}, {
				headers: {
					token
				}
			})
			console.log("cart responce", responce);

			if (responce.data.success) {
				setCartItems(responce.data.cartData)
			}
		} catch (error) {
			console.log(error);
			toast.error(error.message)
		}
	}

	console.log(cartItems);

	useEffect(() => {
		getProductsData()

	}, [])

	useEffect(() => {
		if (!token && localStorage.getItem("token")) {
			setToken(localStorage.getItem("token"))
			getUserCart(localStorage.getItem("token"))
		}
	}, [token])
	const value = {
		products,
		currency,
		delivary_fee,
		search,
		setSearch,
		showSearch,
		setShowSearch,
		cartItems,
		setCartItems,
		addToCart,
		getCartCount,
		updateQuantity,
		getCartAmount,
		delivery_fee,
		navigate,
		backendUrl,
		token, setToken
	}
	return (
		<ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
	)
}

export default shopContextProvider
