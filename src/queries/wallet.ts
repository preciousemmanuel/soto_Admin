import { endpoints } from "@/config"
import { axios } from "@/lib"
import type {
	BuyersProps,
	HttpResponse,
	PaginationProps,
	WalletOverviewProps,
	WithdrawalRequestsProps,
} from "@/types"

const GetWalletOverviewQuery = async (params: PaginationProps & { search?: string }) => {
	return axios
		.get<HttpResponse<WalletOverviewProps>>(endpoints().wallet.get_all, {
			params: {
				...params,
			},
		})
		.then((res) => res.data)
}

const GetWithdrawalRequestsQuery = async (params: PaginationProps & { search?: string }) => {
	return axios
		.get<HttpResponse<WithdrawalRequestsProps>>(endpoints().wallet.get_withdrawal_requests, {
			params: {
				...params,
			},
		})
		.then((res) => res.data)
}

const UpdateWithdrawalRequestMutation = async (
	params: { approve_or_decline: "APPROVED" | "DECLINED" },
	id: string
) => {
	return axios
		.put<HttpResponse<WithdrawalRequestsProps["data"]>>(
			endpoints(id).wallet.approve_decline_withdrawal_request,
			{
				params: {
					...params,
				},
			}
		)
		.then((res) => res.data)
}

const CompleteWithdrawalRequestMutation = async (payload: {
	transfer_code: string
	otp: string
}) => {
	return axios
		.put<HttpResponse<BuyersProps>>(endpoints().wallet.complete_withdrawal_request, payload)
		.then((res) => res.data)
}

export {
	CompleteWithdrawalRequestMutation,
	GetWalletOverviewQuery,
	GetWithdrawalRequestsQuery,
	UpdateWithdrawalRequestMutation,
}
