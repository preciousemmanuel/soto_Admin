import { endpoints } from "@/config"
import { axios } from "@/lib"
import type {
	CategoriesProps,
	CitiesProps,
	HttpResponse,
	PaginationProps,
	StatesProps,
} from "@/types"

const GetCategoriesQuery = async (params: PaginationProps) => {
	return axios
		.get<HttpResponse<CategoriesProps>>(endpoints().shared.get_categories, {
			params: {
				...params,
			},
		})
		.then((res) => res.data)
}

const GetStatesQuery = async () => {
	return axios.get<HttpResponse<StatesProps>>(endpoints().shared.get_states).then((res) => res.data)
}

const GetCitiesQuery = async (params: { state_code?: string }) => {
	return axios
		.get<HttpResponse<CitiesProps>>(endpoints().shared.get_cities, {
			params: {
				country_code: "NG",
				...params,
			},
		})
		.then((res) => res.data)
}

export { GetCategoriesQuery, GetCitiesQuery, GetStatesQuery }
