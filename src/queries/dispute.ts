import { endpoints } from "@/config"
import { axios } from "@/lib"
import type { DisputeProps, DisputesProps, HttpResponse, PaginationProps } from "@/types"

const GetDisputesQuery = async (params: PaginationProps & { search?: string; status?: string }) => {
	return axios
		.get<HttpResponse<DisputesProps>>(endpoints().dispute.get_all, {
			params,
		})
		.then((res) => res.data)
}

const GetDisputeQuery = async (id: string) => {
	return axios.get<HttpResponse<DisputeProps>>(endpoints(id).dispute.get_one).then((res) => res.data)
}

const UpdateDisputeMutation = async (id: string, values: { status: string }) => {
	return axios
		.put<HttpResponse<DisputeProps>>(endpoints(id).dispute.update_dispute, values)
		.then((res) => res.data)
}

export { GetDisputeQuery, GetDisputesQuery, UpdateDisputeMutation }
