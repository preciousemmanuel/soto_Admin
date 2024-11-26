const baseURL = import.meta.env.VITE_API_URL

export const endpoints = (id?: string) => {
	if (!baseURL) {
		throw Error("API URL is not defined")
	}

	const auth = {
		signin: `${baseURL}/admin/login`,
		forgot_password: `${baseURL}/admin/auth/`,
		reset_password: `${baseURL}/admin/auth/`,
		verify_otp: `${baseURL}/admin/auth/`,
	}

	const admin = {
		get_all: `${baseURL}/admin`,
		get_one: `${baseURL}/admin`,
		create: `${baseURL}/admin`,
		delete: `${baseURL}/admin`,
		update: `${baseURL}/admin`,
	}

	const overview = {
		overview: `${baseURL}/admin/overview`,
		best_seller: `${baseURL}/admin/best-seller`,
		latest_orders: `${baseURL}/admin/latest-orders`,
	} as const

	const wallet = {
		get_all: `${baseURL}/admin/transactions/get-wallet-overview`,
		get_withdrawal_requests: `${baseURL}/admin/transactions/get-withdrawal-requests`,
		approve_decline_withdrawal_request: `${baseURL}/admin/transactions/approve-or-decline-withdrawal-request/${id}`,
		complete_withdrawal_request: `${baseURL}/admin/transactions/complete-withdrawal-approval`,
	} as const

	const orders = {
		get_all: `${baseURL}/admin/orders`,
		get_one: `${baseURL}/admin/view-an-order/${id}`,
		cancel: `${baseURL}/admin/cancel-order/${id}`,
		create_shipment: `${baseURL}/admin/create-shipment`,
		track_shipment: `${baseURL}/admin/track-shipment`,
	} as const

	const products = {
		get_all: `${baseURL}/admin/products-mgt`,
		get_one: `${baseURL}/admin/view-a-product/${id}`,
	} as const

	const coupons = {
		get_all: `${baseURL}/admin/get-coupons`,
		get_one: `${baseURL}/admin/`,
		create: `${baseURL}/admin/create-coupon`,
		update: `${baseURL}/admin/update-coupon/${id}`,
	} as const

	const buyers = {
		get_all: `${baseURL}/admin/get-buyers`,
		get_one: `${baseURL}/admin/view-a-buyer/${id}`,
	} as const

	const sellers = {
		get_all: `${baseURL}/admin/get-sellers`,
		get_one: `${baseURL}/admin/view-a-seller/${id}`,
		update: `${baseURL}/admin/update-a-buyer-or-seller/${id}`,
	} as const

	const feedback = {}

	return {
		admin,
		auth,
		buyers,
		coupons,
		feedback,
		orders,
		overview,
		products,
		sellers,
		wallet,
	}
}
