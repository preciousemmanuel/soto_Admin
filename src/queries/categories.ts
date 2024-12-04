import { endpoints } from "@/config"
import { axios } from "@/lib"
import type { CategoriesProps, HttpResponse, PaginationProps } from "@/types"

const GetCategoriesQuery = async (params: PaginationProps) => {
	return axios
		.get<HttpResponse<CategoriesProps>>(endpoints().categories.get_all, {
			params: {
				...params,
			},
		})
		.then((res) => res.data)
}

export { GetCategoriesQuery }
