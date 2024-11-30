import { useMutation } from "@tanstack/react-query"
import { useFormik } from "formik"
import { Lock, Profile } from "iconsax-react"
import { Link, useNavigate } from "react-router-dom"

import loginIllustration from "@/assets/images/login-illustration.png"
import { Spinner } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SigninMutation } from "@/queries"
import { signinSchema } from "@/schema"
import { useUserStore } from "@/store/z-store"

const initialValues = { email: "", password: "" }

const Signin = () => {
	const { signIn } = useUserStore()
	const navigate = useNavigate()

	const login = useMutation({
		mutationFn: (payload: typeof initialValues) => SigninMutation(payload),
		mutationKey: ["signin"],

		onSuccess: (data) => {
			const { data: user } = data
			signIn(user, user.Token)
			navigate("/dashboard")
		},
		onError: (error) => {
			console.error(error)
		},
	})

	const { handleChange, handleSubmit, errors, setErrors } = useFormik({
		initialValues,
		validationSchema: signinSchema,
		onSubmit: (values) =>
			login.mutate(values, {
				onError: (error) => {
					setErrors({
						// @ts-expect-error nil
						email: error?.response?.data?.message,
						// @ts-expect-error nil
						password: error?.response?.data?.message,
					})
				},
			}),
	})
	return (
		<div className="grid h-screen w-screen grid-cols-2 overflow-hidden">
			<div className="grid h-full w-full place-items-center bg-white">
				<img src={loginIllustration} alt="" className="w-[550px]" />
			</div>

			<div className="grid h-full w-full place-items-center bg-[#fffafb] text-black">
				<div className="flex w-[423px] flex-col items-center gap-4">
					<div className="flex flex-col items-center gap-2">
						<p className="text-4xl font-semibold text-primary">Login</p>
						<p>Kindly enter your email address</p>
					</div>

					<form onSubmit={handleSubmit} className="mt-6 flex w-full flex-col gap-6">
						<Input
							label="Email Address"
							leadingIcon={Profile}
							name="email"
							type="email"
							onChange={handleChange}
							error={errors.email}
							className="rounded-full bg-[#fbf3f1] py-3 text-black placeholder:text-neutral-500"
							autoComplete="off"
							autoCorrect="off"
						/>

						<div className="flex w-full flex-col gap-2">
							<Input
								label="Password"
								leadingIcon={Lock}
								name="password"
								type="password"
								onChange={handleChange}
								error={errors.password}
								className="rounded-full bg-[#fbf3f1] py-3 text-black placeholder:text-neutral-500"
								autoComplete="off"
							/>

							<Link
								to="/forgot-password"
								className="self-end text-xs font-medium text-primary transition-all hover:underline">
								Forgot Password?
							</Link>
						</div>

						<Button disabled={login.isPending} type="submit" className="h-12 rounded-3xl">
							{login.isPending ? <Spinner /> : "Login"}
						</Button>
					</form>
				</div>
			</div>
		</div>
	)
}

export default Signin
