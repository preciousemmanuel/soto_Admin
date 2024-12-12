import { endpoints } from "@/config"
import { axios } from "@/lib"
import type { HttpResponse, NotificationsProps, PaginationProps, PurchasersProps } from "@/types"

const GetNotificationsQuery = async (
	params: PaginationProps & { search?: string; type?: string }
) => {
	return axios
		.get<HttpResponse<NotificationsProps>>(endpoints().notification.get_all, {
			params: {
				...params,
			},
		})
		.then((res) => res.data)
}

const UpdateNotificationMutation = async (id: string) => {
	return axios
		.put<HttpResponse<PurchasersProps["data"][number]>>(endpoints(id).notification.mark_as_read)
		.then((res) => res.data)
}

export { GetNotificationsQuery, UpdateNotificationMutation }
