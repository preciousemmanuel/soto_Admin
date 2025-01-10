import { useMutation } from "@tanstack/react-query"
import { useFormik } from "formik"
import { Lock } from "iconsax-react"
import React from "react"
import { useNavigate } from "react-router-dom"

import { OtpInput, Spinner } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ForgotPasswordMutation, ResetPasswordMutation, VerifyOtpMutation } from "@/queries"

type ComponentProps = {
	handleBack: () => void
	handleNext: () => void
}

function EmailScreen({ handleBack, handleNext }: ComponentProps) {
	const { isPending } = useMutation({
		mutationFn: (email: string) => ForgotPasswordMutation(email),
		mutationKey: ["forgot-password"],
		onSuccess: (data) => {
			console.log(data)
		},
		onError: (error) => {
			console.error(error)
		},
	})

	const { handleChange, handleSubmit } = useFormik({
		initialValues: { email: "" },
		onSubmit: (values) => {
			console.log(values)
			handleNext()
		},
	})

	return (
		<div className="flex w-[473px] flex-col gap-12">
			<div className="flex w-full items-center justify-end">
				<Button className="bg-[#fbded3] hover:bg-[#fbded3]/80" variant="outline" onClick={handleBack}>
					Back
				</Button>
			</div>
			<div className="flex w-[423px] flex-col items-center gap-4">
				<div className="flex flex-col items-center gap-2">
					<p className="text-4xl font-semibold text-primary">Forgot Password</p>
					<p>Kindly enter your registered email address or phone number to reset your password</p>
				</div>
				<form onSubmit={handleSubmit} className="flex w-full flex-col gap-10">
					<Input
						label="Email Address"
						labelClassName="text-sm font-medium"
						name="email"
						type="email"
						onChange={handleChange}
						className="text-sm text-black placeholder:text-neutral-500"
					/>
					<Button type="submit" className="h-20 rounded-3xl">
						{isPending ? <Spinner /> : "Continue"}
					</Button>
				</form>
			</div>
		</div>
	)
}

function OtpScreen({ handleBack, handleNext }: ComponentProps) {
	const { isPending } = useMutation({
		mutationFn: (payload: { email: string; otp: string }) => VerifyOtpMutation(payload),
		mutationKey: ["forgot-password"],
		onSuccess: (data) => {
			console.log(data)
		},
		onError: (error) => {
			console.error(error)
		},
	})

	const { handleSubmit, setFieldValue, values } = useFormik({
		initialValues: { email: "", otp: "" },
		onSubmit: () => {
			handleNext()
		},
	})

	return (
		<div className="flex w-[473px] flex-col gap-12">
			<div className="flex w-full items-center justify-end">
				<Button className="bg-[#fbded3] hover:bg-[#fbded3]/80" variant="outline" onClick={handleBack}>
					Back
				</Button>
			</div>
			<div className="flex w-[423px] flex-col items-center gap-4">
				<div className="flex flex-col items-center gap-2">
					<p className="text-4xl font-semibold text-primary">Forgot Password</p>
					<p>Kindly enter the OTp sent to your email address</p>
				</div>
				<form onSubmit={handleSubmit} className="flex w-full flex-col gap-10">
					<OtpInput length={4} onChange={(value) => setFieldValue("otp", value)} value={values.otp} />
					<Button type="submit" className="h-20 rounded-3xl">
						{isPending ? <Spinner /> : "Continue"}
					</Button>
				</form>
			</div>
		</div>
	)
}

function NewPasswordScreen({ handleBack, handleNext }: ComponentProps) {
	const { isPending } = useMutation({
		mutationFn: (payload: { new_password: string; confirm_password: string }) =>
			ResetPasswordMutation(payload),
		mutationKey: ["forgot-password"],
		onSuccess: (data) => {
			console.log(data)
		},
		onError: (error) => {
			console.error(error)
		},
	})
	const { handleChange, handleSubmit } = useFormik({
		initialValues: { new_password: "", confirm_password: "" },
		onSubmit: (values) => {
			console.log(values)
			handleNext()
		},
	})

	return (
		<div className="flex w-[473px] flex-col gap-12">
			<div className="flex w-full items-center justify-end">
				<Button className="bg-[#fbded3] hover:bg-[#fbded3]/80" variant="outline" onClick={handleBack}>
					Back
				</Button>
			</div>
			<div className="flex w-[423px] flex-col items-center gap-4">
				<div className="flex flex-col items-center gap-2">
					<p className="text-4xl font-semibold text-primary">Reset Password</p>
					<p>Kindly enter your new password to proceed</p>
				</div>
				<form onSubmit={handleSubmit} className="flex w-full flex-col gap-10">
					<Input
						label="New Password"
						labelClassName="text-sm font-medium"
						leadingIcon={Lock}
						name="password"
						type="password"
						onChange={handleChange}
						className="text-sm text-black placeholder:text-neutral-500"
					/>
					<Input
						label="Confirm Password"
						labelClassName="text-sm font-medium"
						leadingIcon={Lock}
						name="password"
						type="password"
						onChange={handleChange}
						className="text-sm text-black placeholder:text-neutral-500"
					/>
					<Button type="submit" className="h-20 rounded-3xl">
						{isPending ? <Spinner /> : "Continue"}
					</Button>
				</form>
			</div>
		</div>
	)
}

const screens = [
	{ label: "email", component: EmailScreen, image: "" },
	{ label: "otp", component: OtpScreen, image: "" },
	{ label: "password", component: NewPasswordScreen, image: "" },
]

const ForgotPassword = () => {
	const [current, setCurrent] = React.useState(0)
	const navigate = useNavigate()

	const handleNext = () => {
		if (current < screens.length - 1) {
			setCurrent(current + 1)
		} else {
			navigate("/signin")
		}
	}

	const handlePrev = () => {
		if (current > 0) {
			setCurrent(current - 1)
		} else {
			navigate(-1)
		}
	}

	const { component: ActiveComponent, image, label } = screens[current]

	return (
		<div className="grid h-screen w-screen grid-cols-2 overflow-hidden">
			<div className="flex h-full w-full flex-col items-center justify-center gap-[51px] bg-white">
				<div className="flex items-center gap-3">
					{screens.map((_, index) => (
						<div
							key={index}
							className={`h-1 w-8 rounded ${index === current ? "bg-primary" : "bg-[#FFDDD6]"}`}></div>
					))}
				</div>
				<div className="aspect-square size-[406px]">
					<img src={image} alt={label} className="size-full" />
				</div>
			</div>
			<div className="grid h-full w-full place-items-center overflow-hidden bg-[#fffafb] text-black">
				<ActiveComponent handleBack={handlePrev} handleNext={handleNext} />
			</div>
		</div>
	)
}

export default ForgotPassword
