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

type OverviewMetricProps = {
	amount: number
	percentage_change: number
}
type OverviewProps = {
	revenue: OverviewMetricProps
	buyers: OverviewMetricProps
	sellers: OverviewMetricProps
	visitors: OverviewMetricProps
	orders: OverviewMetricProps
	conversion: OverviewMetricProps
	advanced_report: Array<{
		day_or_month: string
		amount: number
	}>
	cart: {
		abandonned_cart: number
		abandonned_revenue: number
		percentage: number
	}
}

const GetOverviewQuery = async (params?: ExtendedPaginationProps) => {
	return axios
		.get<HttpResponse<OverviewProps>>(endpoints().overview.overview, {
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
					images: string
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
