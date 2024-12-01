import { endpoints } from "@/config"
import { axios } from "@/lib"
import {
	HttpResponse,
	PaginationProps,
	PaginationResponse,
	ProductProps,
	type SingleProductProps,
} from "@/types"

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
		.get<HttpResponse<SingleProductProps>>(endpoints(id).products.get_one)
		.then((res) => res.data)
}

type Payload = {
	id: string
	data: {
		is_verified: "YES" | "NO"
	}
}
const UpdateProductMutation = async ({ id, data }: Payload) => {
	return axios
		.put<HttpResponse<SingleProductProps>>(endpoints(id).products.update, data, {
			headers: { "Content-Type": "multipart/form-data" },
		})
		.then((res) => res.data)
}

export { GetProductQuery, GetProductsQuery, UpdateProductMutation }
