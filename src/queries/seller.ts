import { endpoints } from "@/config"
import { axios } from "@/lib"
import { HttpResponse, PaginationProps, type SellerProps, type SellersProps } from "@/types"

const GetSellersQuery = async (
	params: PaginationProps & { search?: string; end_date?: string; start_date?: string }
) => {
	return axios
		.get<HttpResponse<SellersProps>>(endpoints().sellers.get_all, {
			params: {
				...params,
			},
		})
		.then((res) => res.data)
}

const GetSellerQuery = async (id: string) => {
	return axios.get<HttpResponse<SellerProps>>(endpoints(id).sellers.get_one).then((res) => res.data)
}

export { GetSellerQuery, GetSellersQuery }
