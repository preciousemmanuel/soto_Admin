import { endpoints } from "@/config"
import { axios } from "@/lib"
import { HttpResponse, PaginationProps, type SellerProps, type SellersProps } from "@/types"

const GetSellersQuery = async (
	params: PaginationProps & {
		search?: string
		end_date?: string
		start_date?: string
		seller_status?: string
	}
) => {
	return axios
		.get<HttpResponse<SellersProps>>(endpoints().sellers.get_all, {
			params: {
				...params,
			},
		})
		.then((res) => res.data)
}

const GetSellerQuery = async (id: string, params?: PaginationProps) => {
	return axios
		.get<HttpResponse<SellerProps>>(endpoints(id).sellers.get_one, {
			params: {
				...params,
			},
		})
		.then((res) => res.data)
}

type UpdateSellerPayload = {
	id: string
	data: {
		is_verified?: "YES" | "NO"
		is_blocked?: "YES" | "NO"
	}
}
const UpdateSellerMutation = async (payload: UpdateSellerPayload) => {
	return axios
		.put<HttpResponse<SellerProps>>(endpoints(payload.id).sellers.update, payload.data)
		.then((res) => res.data)
}

export { GetSellerQuery, GetSellersQuery, UpdateSellerMutation }
