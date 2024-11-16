import { HttpResponse, OrderProps, PaginationProps, PaginationResponse } from "@/types"
import { endpoints } from "@/config"
import { axios } from "@/lib"

const GetOrdersQuery = async (params: PaginationProps & { status?: string }) => {
	return axios
		.get<HttpResponse<PaginationResponse<OrderProps>>>(endpoints().orders.get_all, {
			params: {
				...params,
				timeLine: params?.timeLine === "ALL" ? "" : params?.timeLine,
			},
		})
		.then((res) => res.data)
}

const GetOrderQuery = async (id: string) => {
	return axios.get<HttpResponse<OrderProps>>(endpoints(id).orders.get_one).then((res) => res.data)
}

const CancelOrderMutation = async (id: string) => {
	return axios.delete<HttpResponse<string>>(endpoints(id).orders.cancel).then((res) => res.data)
}

const CreateShipmentMutation = async (id: string) => {
	return axios
		.delete<HttpResponse<string>>(endpoints(id).orders.create_shipment)
		.then((res) => res.data)
}

const TrackShipmentMutation = async (id: string) => {
	return axios
		.delete<HttpResponse<string>>(endpoints(id).orders.track_shipment)
		.then((res) => res.data)
}

export {
	CancelOrderMutation,
	CreateShipmentMutation,
	GetOrderQuery,
	GetOrdersQuery,
	TrackShipmentMutation,
}
