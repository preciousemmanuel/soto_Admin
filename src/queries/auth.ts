import { endpoints } from "@/config"
import { axios } from "@/lib"
import { HttpResponse, type SiginProps } from "@/types"

const SigninMutation = async (payload: { email: string; password: string }) => {
	return axios
		.post<HttpResponse<SiginProps>>(endpoints().auth.signin, payload)
		.then((res) => res.data)
}

const ForgotPasswordMutation = async (email: string) => {
	return axios
		.post<HttpResponse<string>>(endpoints().auth.forgot_password, { email })
		.then((res) => res.data)
}

const ResetPasswordMutation = async (payload: {
	new_password: string
	confirm_password: string
}) => {
	return axios
		.post<HttpResponse<string>>(endpoints().auth.reset_password, payload)
		.then((res) => res.data)
}

const VerifyOtpMutation = async (payload: { email: string; otp: string }) => {
	return axios
		.post<HttpResponse<string>>(endpoints().auth.verify_otp, payload)
		.then((res) => res.data)
}

export { ForgotPasswordMutation, ResetPasswordMutation, SigninMutation, VerifyOtpMutation }
