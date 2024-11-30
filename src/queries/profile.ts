import { endpoints } from "@/config"
import { axios } from "@/lib"
import { HttpResponse, type ProfileProps } from "@/types"

const GetProfileQuery = async () => {
	return axios
		.get<HttpResponse<ProfileProps>>(endpoints().profile.get_profile)
		.then((res) => res.data)
}

export { GetProfileQuery }
