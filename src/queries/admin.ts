import { endpoints } from "@/config"
import { axios } from "@/lib"
import { AdminProps, HttpResponse, PaginationProps } from "@/types"

const GetAdminsQuery = async (params: PaginationProps & {}) => {
	return axios
		.get<HttpResponse<AdminProps>>(endpoints().admin.get_all, {
			params: {
				...params,
			},
		})
		.then((res) => res.data)
}

const GetAdminQuery = async (id: string) => {
	return axios.get<HttpResponse<AdminProps>>(endpoints(id).admin.get_one).then((res) => res.data)
}

const CreateAdminMutation = async () => {}

const UpdateAdminMutation = async (id: string) => {
	return axios.put<HttpResponse<AdminProps>>(endpoints(id).admin.update).then((res) => res.data)
}

const DeleteAdminMutation = async (id: string) => {
	return axios.delete<HttpResponse<AdminProps>>(endpoints(id).admin.delete).then((res) => res.data)
}

export {
	CreateAdminMutation,
	DeleteAdminMutation,
	GetAdminQuery,
	GetAdminsQuery,
	UpdateAdminMutation,
}
