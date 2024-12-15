import { endpoints } from "@/config"
import { axios } from "@/lib"
import type { HttpResponse, PaginationProps, RolesProps } from "@/types"

const GetRolesQuery = async (params: PaginationProps) => {
	return axios
		.get<HttpResponse<RolesProps>>(endpoints().roles.get_all, {
			params: {
				...params,
			},
		})
		.then((res) => res.data)
}

export type CreateRolePayload = {
	name: string
	admin: {
		read: string
		write: string
	}
	config: {
		read: string
		write: string
	}
	order: {
		read: string
		write: string
	}
	buyer: {
		read: string
		write: string
	}
	seller: {
		read: string
		write: string
	}
	product: {
		read: string
		write: string
	}
	transaction: {
		read: string
		write: string
	}
}
const CreateRoleMutation = async (data: CreateRolePayload) => {
	return axios.post<HttpResponse<RolesProps>>(endpoints().roles.create, data).then((res) => res.data)
}

const UpdateRoleMutation = async (data: CreateRolePayload, id: string) => {
	return axios
		.put<HttpResponse<RolesProps>>(endpoints(id).roles.update, data)
		.then((res) => res.data)
}

export { CreateRoleMutation, GetRolesQuery, UpdateRoleMutation }
