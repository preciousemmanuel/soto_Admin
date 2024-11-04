import Cookies from "js-cookie"
import axios from "axios"

const createInstance = () => {
	const instance = axios.create({
		baseURL: import.meta.env.VITE_API_URL,
	})

	instance.interceptors.request.use(
		(config) => {
			const token = Cookies.get("SPACEET_TOKEN")
			if (token) {
				config.headers.Authorization = `Bearer ${token}`
			}
			return config
		},
		(error) => {
			return Promise.reject(error)
		}
	)

	return instance
}

const instance = createInstance()

export { instance as axios }
