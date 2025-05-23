import { endpoints } from "@/config"
import { axios } from "@/lib"
import { HttpResponse, OrderProps, PaginationProps, PaginationResponse, ShipmentProps } from "@/types"

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

const GetShipmentQuery = async (params: PaginationProps) => {
	return axios
		.get<HttpResponse<PaginationResponse<ShipmentProps>>>(endpoints().orders.fetch_shipment, {
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
	return axios.put<HttpResponse<string>>(endpoints(id).orders.cancel).then((res) => res.data)
}

type Payload = {
	id: string
	data: {
		approve_or_decline: "APPROVED" | "DECLINED"
		decline_note?: string
	}
}
const UpdateCustomOrderMutation = async (payload: Payload) => {
	return axios
		.put<HttpResponse<string>>(endpoints(payload.id).orders.update_custom_order, payload.data)
		.then((res) => res.data)
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

const UpdateTrackingStatusMutation = async (id: string, payload: { step: number }) => {
	return axios
		.put<HttpResponse<string>>(endpoints(id).orders.update_tracking_status, payload)
		.then((res) => res.data)
}

export {
	CancelOrderMutation,
	CreateShipmentMutation,
	GetOrderQuery,
	GetOrdersQuery,
	GetShipmentQuery,
	TrackShipmentMutation,
	UpdateCustomOrderMutation,
	UpdateTrackingStatusMutation,
}
