import { endpoints } from "@/config"
import { axios } from "@/lib"
import type { BuyerProps, BuyersProps, HttpResponse, PaginationProps } from "@/types"

const GetBuyersQuery = async (
	params: PaginationProps & { search?: string; end_date?: string; start_date?: string }
) => {
	return axios
		.get<HttpResponse<BuyersProps>>(endpoints().buyers.get_all, {
			params: {
				...params,
			},
		})
		.then((res) => res.data)
}

const GetBuyerQuery = async (id: string) => {
	return axios.get<HttpResponse<BuyerProps>>(endpoints(id).buyers.get_one).then((res) => res.data)
}

export { GetBuyerQuery, GetBuyersQuery }
