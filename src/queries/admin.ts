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

type CreateAdminPayload = {
	first_name: string
	last_name: string
	email: string
	phone_number: string
	role: string
	address: string
	city: string
	postal_code: string
	state: string
	country: string
}
const CreateAdminMutation = async (payload: CreateAdminPayload) => {
	return axios
		.post<HttpResponse<AdminProps>>(endpoints().admin.create, payload)
		.then((res) => res.data)
}

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

