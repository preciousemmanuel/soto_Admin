import { endpoints } from "@/config"
import { axios } from "@/lib"
import type { HttpResponse, PaginationProps, PickupsProps, PurchasersProps } from "@/types"

const GetPurchasersQuery = async (params: PaginationProps & { search?: string }) => {
	return axios
		.get<HttpResponse<PurchasersProps>>(endpoints().purchasers.get_all, {
			params: {
				...params,
			},
		})
		.then((res) => res.data)
}

type PickupsPayload = PaginationProps & {
	search?: string
	status?: "PENDING" | "CANCELLED" | "PICKED_UP" | "DELIVERED"
	purchaser?: string
}
const GetPickupsQuery = async (params: PickupsPayload) => {
	return axios
		.get<HttpResponse<PickupsProps>>(endpoints().purchasers.get_pickups, {
			params: {
				...params,
			},
		})
		.then((res) => res.data)
}

const GetPurchaserQuery = async (id: string) => {
	return axios
		.get<HttpResponse<PurchasersProps["data"][number]>>(endpoints(id).purchasers.get_one)
		.then((res) => res.data)
}

export { GetPickupsQuery, GetPurchaserQuery, GetPurchasersQuery }
