import { CouponProps, HttpResponse, PaginationProps, PaginationResponse } from "@/types"
import { endpoints } from "@/config"
import { axios } from "@/lib"

const CreateCouponMutation = async (payload: CouponProps) => {
	return axios
		.post<HttpResponse<CouponProps>>(endpoints().coupons.create, payload)
		.then((res) => res.data)
}

const GetCouponsQuery = async (params: PaginationProps & {}) => {
	return axios
		.get<HttpResponse<PaginationResponse<CouponProps>>>(endpoints().coupons.get_all, {
			params: {
				...params,
				timeLine: params?.timeLine === "ALL" ? "" : params?.timeLine,
			},
		})
		.then((res) => res.data.data)
}

const GetCouponQuery = async () => {
	return axios.get<HttpResponse<CouponProps>>(endpoints().coupons.get_one).then((res) => res.data)
}

export { CreateCouponMutation, GetCouponQuery, GetCouponsQuery }
