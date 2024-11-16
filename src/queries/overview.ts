import { endpoints } from "@/config"
import { axios } from "@/lib"
import {
	HttpResponse,
	LatestOrderProps,
	PaginationProps,
	PaginationResponse,
	TimelineProps,
} from "@/types"

interface ExtendedPaginationProps extends PaginationProps {
	timeLine?: TimelineProps
}

type OverviewProps = {
	amount: number
	percentage_change: number
}

const GetOverviewQuery = async (params?: ExtendedPaginationProps) => {
	return axios
		.get<
			HttpResponse<{
				revenue: OverviewProps
				visitors: OverviewProps
				orders: OverviewProps
				conversion: OverviewProps
				advanced_report: {
					day_or_month: Date | string
					amount: number
				}[]
				cart: {
					abandonned_cart: number
					abandonned_revenue: number
					percentage: number
				}
			}>
		>(endpoints().overview.dashboard, {
			params: {
				...params,
				timeLine: params?.timeLine === "ALL" ? "" : params?.timeLine,
			},
		})
		.then((res) => res.data)
}

const GetBestSellerQuery = async (params?: ExtendedPaginationProps) => {
	return axios
		.get<
			HttpResponse<
				PaginationResponse<{
					product_id: string
					product_name: string
					total_quantity: number
					total_price: number
				}>
			>
		>(endpoints().overview.best_seller, {
			params: {
				...params,
				timeLine: params?.timeLine === "ALL" ? "" : params?.timeLine,
			},
		})
		.then((res) => res.data)
}

const GetLatestOrdersQuery = async (params?: ExtendedPaginationProps) => {
	return axios
		.get<HttpResponse<PaginationResponse<LatestOrderProps>>>(endpoints().overview.latest_orders, {
			params: {
				...params,
				timeLine: params?.timeLine === "ALL" ? "" : params?.timeLine,
			},
		})
		.then((res) => res.data)
}

export { GetBestSellerQuery, GetLatestOrdersQuery, GetOverviewQuery }
