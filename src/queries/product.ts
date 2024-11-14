import { HttpResponse, PaginationProps, PaginationResponse, ProductProps } from "@/types"
import { endpoints } from "@/config"
import { axios } from "@/lib"

const GetProductsQuery = async (
	params: PaginationProps & { product_name?: string; select_type?: string; status?: string }
) => {
	return axios
		.get<HttpResponse<PaginationResponse<ProductProps>>>(endpoints().products.get_all, {
			params: {
				...params,
				timeLine: params?.timeLine === "ALL" ? "" : params?.timeLine,
			},
		})
		.then((res) => res.data)
}

const GetProductQuery = async (id: string) => {
	return axios
		.get<HttpResponse<ProductProps>>(endpoints(id).products.get_one)
		.then((res) => res.data)
}

export { GetProductQuery, GetProductsQuery }
