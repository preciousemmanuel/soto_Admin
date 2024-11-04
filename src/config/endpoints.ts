export const endpointts = (id?: string) => {
	const auth = {}

	const wallet = {}

	const orders = {}

	const products = {
		get_all: "/products",
		get_by_id: `/products/${id}`,
	}

	const coupons = {}

	const buyers = {}

	const sellers = {}

	const feedback = {}

	return {
		auth,
		wallet,
		orders,
		products,
		coupons,
		buyers,
		sellers,
		feedback,
	}
}
