import React, { useContext, useEffect, useState } from "react"
import { ShopContext } from "../context/ShopContext"
import axios from "axios"
import { toast } from "react-toastify"

const Login = () => {
	const [currentState, setCurrentState] = useState("Login")
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const { token, setToken, navigate, backendUrl } = useContext(ShopContext)
	const onSubmithandler = async (e) => {
		e.preventDefault()
		try {
			if (currentState === "Sign Up") {
				const response = await axios.post(`${backendUrl}/api/user/register`, {
					name,
					email,
					password,
				})
				console.log(response.data);

				if (response.data.success) {
					setToken(response.data.token)
					localStorage.setItem("token", response.data.token)
				} else {
					toast.error(response.data.message)
				}
			} else {
				const response = await axios.post(`${backendUrl}/api/user/login`, {
					email,
					password,
				})
				if (response.data.success) {
					setToken(response.data.token)
					localStorage.setItem("token", response.data.token)
				} else {
					toast.error(response.data.message)
				}


			}

		} catch (error) {
			console.log(error);
			toast.error(error.message)

		}
	}

	useEffect(() => {
		if (token) {
			navigate("/")
		}
	}, [token])

	return (
		<form
			onSubmit={onSubmithandler}
			className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
		>
			<div className="inline-flex items-center gap-2 mb-2 mt-10">
				<p className="prata-regular text-3xl">{currentState}</p>
				<hr className="border-none h-[1.5px] w-8 bg-gray-800" />
			</div>
			{currentState === "Login" ? (
				""
			) : (
				<input
					type="text"
					className="w-full p-3 border border-gray-800"
					placeholder="Name"
					required
					onChange={(e) => setName(e.target.value)}
					value={name}
				/>
			)}
			<input
				type="email"
				className="w-full p-3 border border-gray-800"
				placeholder="Email"
				required
				onChange={(e) => setEmail(e.target.value)}
				value={email}
			/>
			<input
				type="password"
				className="w-full p-3 border border-gray-800"
				placeholder="Password"
				required
				onChange={(e) => setPassword(e.target.value)}
				value={password}
			/>
			<div className="flex justify-between w-full text-sm mt-[-8px]">
				<p className="cursor-pointer">Forgot your password?</p>
				{currentState === "Login" ? (
					<p
						className="cursor-pointer"
						onClick={() => setCurrentState("Sign Up")}
					>
						Create account
					</p>
				) : (
					<p
						className="cursor-pointer"
						onClick={() => setCurrentState("Login")}
					>
						Login Here
					</p>
				)}
			</div>
			<button
				className="bg-black text-white font-light px-8 py-2 mt-4"
				type="submit"
			>
				{currentState === "Login" ? "Sign In" : "Sign Up"}
			</button>
		</form>
	)
}

export default Login
