import axios from "axios"
import Cookies from "js-cookie"

const createInstance = () => {
	const instance = axios.create()

	instance.interceptors.request.use(
		(config) => {
			const token = Cookies.get("SOTO_ADMIN_TOKEN")
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
