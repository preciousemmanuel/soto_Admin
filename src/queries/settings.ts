import { endpoints } from "@/config"
import { axios } from "@/lib"
import { HttpResponse, type SettingsProps } from "@/types"

const GetSettingsQuery = async () => {
	return axios.get<HttpResponse<SettingsProps>>(endpoints().settings.get_all).then((res) => res.data)
}

type UpdateSettingsPayload = Partial<{
	address: string
	city: string
	state: string
	postal_code: string
	withdrawals_manual: string
	withdrawals_scheduled: string
	withdrawals_frequency: number
	interest_rates_flat: number
	interest_rates_special: number
}>
const UpdateSettingsMutation = async (payload: UpdateSettingsPayload) => {
	return axios
		.put<HttpResponse<SettingsProps>>(endpoints().settings.update, payload)
		.then((res) => res.data)
}

export { GetSettingsQuery, UpdateSettingsMutation }
