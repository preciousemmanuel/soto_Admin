import { endpoints } from "@/config"
import { axios } from "@/lib"
import type {
	AdminProps,
	HttpResponse,
	PaginationProps,
	PickupsProps,
	PurchasersProps,
} from "@/types"

const GetPurchasersQuery = async (params: PaginationProps & { search?: string }) => {
	return axios
		.get<HttpResponse<PurchasersProps>>(endpoints().purchasers.get_all, {
			params: {
				...params,
			},
		})
		.then((res) => res.data)
}

type PickupsPayload = PaginationProps & {
	search?: string
	status?: "PENDING" | "CANCELLED" | "PICKED_UP" | "DELIVERED"
	purchaser?: string
}
const GetPickupsQuery = async (params: PickupsPayload) => {
	return axios
		.get<HttpResponse<PickupsProps>>(endpoints().purchasers.get_pickups, {
			params: {
				...params,
			},
		})
		.then((res) => res.data)
}

const GetPurchaserQuery = async (id: string) => {
	return axios
		.get<HttpResponse<PurchasersProps["data"][number]>>(endpoints(id).purchasers.get_one)
		.then((res) => res.data)
}

export type CreatePurchaserPayload = {
	first_name: string
	last_name: string
	email: string
	phone_number: string
	address: string
	city: string
	state: string
	country: string
	id_type: string
	id_number: string
	password: string
	passport: string | undefined
}
const CreatePurchaserMutation = async (payload: CreatePurchaserPayload) => {
	return axios
		.post<HttpResponse<AdminProps>>(endpoints().purchasers.create, payload, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		})
		.then((res) => res.data)
}

const UpdatePurchaserMutation = async (id: string, payload: Partial<CreatePurchaserPayload>) => {
	return axios
		.put<HttpResponse<AdminProps>>(endpoints(id).purchasers.update_purchaser, payload, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		})
		.then((res) => res.data)
}

const UpdatePickupMutation = async (id: string, payload: { status: string }) => {
	return axios
		.put<HttpResponse<AdminProps>>(endpoints(id).purchasers.update_pickup, payload)
		.then((res) => res.data)
}

const RemovePurchaser = async (id: string) => {
	return axios
		.put<HttpResponse<AdminProps>>(endpoints(id).purchasers.remove_purchaser)
		.then((res) => res.data)
}

export {
	CreatePurchaserMutation,
	GetPickupsQuery,
	GetPurchaserQuery,
	GetPurchasersQuery,
	RemovePurchaser,
	UpdatePickupMutation,
	UpdatePurchaserMutation,
}

