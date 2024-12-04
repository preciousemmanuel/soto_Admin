import { endpoints } from "@/config"
import { axios } from "@/lib"
import {
	CouponProps,
	HttpResponse,
	PaginationProps,
	PaginationResponse,
	type CreateCouponPayload,
	type UpdateCouponPayload,
} from "@/types"

const CreateCouponMutation = async (payload: CreateCouponPayload) => {
	return axios
		.post<HttpResponse<CouponProps>>(endpoints().coupons.create, payload)
		.then((res) => res.data)
}

const GetCouponsQuery = async (params: PaginationProps & {}) => {
	return axios
		.get<HttpResponse<PaginationResponse<CouponProps>>>(endpoints().coupons.get_all, {
			params: {
				...params,
				// timeLine: params?.timeLine === "ALL" ? "" : params?.timeLine,
			},
		})
		.then((res) => res.data.data)
}

const GetCouponQuery = async () => {
	return axios.get<HttpResponse<CouponProps>>(endpoints().coupons.get_one).then((res) => res.data)
}

type CouponPayload = {
	payload: UpdateCouponPayload
	id: string
}
const UpdateCouponMutation = async (payload: CouponPayload) => {
	return axios
		.put<HttpResponse<CouponProps>>(endpoints(payload.id).coupons.update, payload)
		.then((res) => res.data)
}

type Payload = {
	quantity: number
	discount: number
	activation_date: string
	expiry_date: string
	product_category: string
}
const CreateDiscountCouponMutation = async (payload: Payload) => {
	return axios
		.post<HttpResponse<CouponProps>>(endpoints().coupons.create_discount, payload)
		.then((res) => res.data)
}

export {
	CreateCouponMutation,
	CreateDiscountCouponMutation,
	GetCouponQuery,
	GetCouponsQuery,
	UpdateCouponMutation,
}

