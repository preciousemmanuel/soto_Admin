import { Link, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { Lock, Profile } from "iconsax-react"
import { useFormik } from "formik"

import { Button } from "@/components/ui/button"
import { useUserStore } from "@/store/z-store"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/shared"
import { SigninMutation } from "@/queries"
import { signinSchema } from "@/schema"

const initialValues = { email: "", password: "" }

const Signin = () => {
	const { signIn } = useUserStore()
	const navigate = useNavigate()

	const { isPending } = useMutation({
		mutationFn: (payload: typeof initialValues) => SigninMutation(payload),
		mutationKey: ["signin"],
		onSuccess: (data) => {
			console.log(data)
			const { data: user } = data
			signIn(user, "")
			navigate("/dashboard")
		},
		onError: (error) => {
			console.error(error)
		},
	})

	const { handleChange, handleSubmit } = useFormik({
		initialValues,
		validationSchema: signinSchema,
		onSubmit: (values) => {
			console.log(values)
		},
	})

	return (
		<div className="grid h-screen w-screen grid-cols-2 overflow-hidden">
			<div className="h-full w-full bg-white"></div>
			<div className="grid h-full w-full place-items-center bg-[#fffafb] text-black">
				<div className="flex w-[423px] flex-col items-center gap-4">
					<div className="flex flex-col items-center gap-2">
						<p className="text-4xl font-semibold text-primary">Login</p>
						<p>Kindly enter your email address</p>
					</div>
					<form onSubmit={handleSubmit} className="flex w-full flex-col gap-10">
						<Input
							label="Email Address"
							labelClassName="text-sm font-medium"
							leadingIcon={Profile}
							name="email"
							type="email"
							onChange={handleChange}
							wrapperClassName="bg-[#fbf3f1] rounded-3xl h-[60px]"
							className="text-sm text-black placeholder:text-neutral-500"
							autoComplete="off"
						/>
						<div className="flex w-full flex-col gap-2">
							<Input
								label="Password"
								labelClassName="text-sm font-medium"
								leadingIcon={Lock}
								name="password"
								type="password"
								onChange={handleChange}
								wrapperClassName="bg-[#fbf3f1] rounded-3xl h-[60px]"
								className="text-sm text-black placeholder:text-neutral-500"
								autoComplete="off"
							/>
							<Link
								to="/forgot-password"
								className="self-end text-sm font-medium text-primary transition-all hover:underline">
								Forgot Password?
							</Link>
						</div>
						<Button type="submit" className="h-20 rounded-3xl">
							{isPending ? <Spinner /> : "Login"}
						</Button>
					</form>
				</div>
			</div>
		</div>
	)
}

export default Signin
