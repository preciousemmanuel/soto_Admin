import { endpoints } from "@/config"
import { axios } from "@/lib"
import { HttpResponse, type ProfileProps } from "@/types"

const GetProfileQuery = async () => {
	return axios
		.get<HttpResponse<ProfileProps>>(endpoints().profile.get_profile)
		.then((res) => res.data)
}

type UpdateProfilePayload = {
	first_name: string
	last_name: string
	phone_number: string
	password: string
}
const UpdateProfileMutation = async (payload: UpdateProfilePayload) => {
	return axios
		.post<HttpResponse<ProfileProps>>(endpoints().profile.update_profile, payload)
		.then((res) => res.data)
}

export { GetProfileQuery, UpdateProfileMutation }
