import { Spinner } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { capitalize } from "@/lib"
import { CreateCouponMutation } from "@/queries/coupon"
import { createCouponSchema } from "@/schema"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { useFormik } from "formik"
import { Money, PercentageSquare, Tag, TruckFast } from "iconsax-react"
import { useNavigate } from "react-router-dom"
import { boolean } from "yup"

const coupon_types = [
	{
		id: 1,
		value: "FIXED_DISCOUNT",
		icon: <Money />,
	},
	{
		id: 2,
		value: "PERCENTAGE_DISCOUNT",
		icon: <PercentageSquare />,
	},
	{
		id: 3,
		value: "FREE_SHIPPING",
		icon: <TruckFast />,
	},
	{
		id: 4,
		value: "PRICE_DISCOUNT",
		icon: <Tag />,
	},
]

const initialValues = {
	name: "",
	coupon_type: "",
	amount: "",
	applied_to: "",
	activation_date: "",
	expiry_date: "",
	usage_limit: "",
	remove_expiry_date: boolean,
	remove_usage_limit: boolean,
}

type FormValue = typeof initialValues

const CreateCoupon = () => {
	const queryClient = useQueryClient()
	const navigate = useNavigate()

	const { isPending, mutate } = useMutation({
		mutationFn: (value: FormValue) =>
			CreateCouponMutation({
				...value,
				usage_limit: Number(value.usage_limit),
				amount: Number(value.amount),
				remove_expiry_date:
					Array.isArray(value.remove_expiry_date) && value.remove_expiry_date?.at(0) === "on"
						? "YES"
						: "NO",
				remove_usage_limit:
					Array.isArray(value.remove_usage_limit) && value.remove_usage_limit.at(0) === "on"
						? "YES"
						: "NO",
				activation_date: format(new Date(value.activation_date), "MM/dd/yyyy"),
				expiry_date: format(new Date(value.expiry_date), "MM/dd/yyyy"),
			}),
		mutationKey: ["create-coupon"],
		onSuccess: () => {
			queryClient.invalidateQueries()
			navigate("/dashboard/coupon-and-promo")
		},
		onError: (error) => {
			console.error(error)
		},
	})

	const { handleSubmit, errors, handleChange, values } = useFormik({
		initialValues,
		validationSchema: createCouponSchema,
		onSubmit: (values) => {
			mutate(values)
		},
	})

	return (
		<section className="flex flex-col gap-10">
			<header className="flex items-center justify-between gap-2">
				<h2 className="font-body text-3xl font-medium">Create Coupon & Promotion</h2>

				<div className="flex items-center gap-3">
					<Button variant="outline" onClick={() => navigate(-1)}>
						Back
					</Button>
					<Button className="w-32" type="submit" form="create-coupon">
						{isPending ? <Spinner /> : "Save"}
					</Button>
				</div>
			</header>

			<form
				onSubmit={handleSubmit}
				id="create-coupon"
				className="rounded-xl border-0.5 border-[#f8f3f3] bg-white p-6 shadow-card shadow-primary/[8%]">
				<div className="space-y-8 border-b border-b-[#E6E9F4] py-10">
					<div>
						<h3 className="font-body font-medium text-[#303030]">Coupon Information</h3>
						<p className="text-sm text-[#939393]">Code will be used by users in checkout</p>
					</div>

					<div className="grid grid-cols-2 gap-6">
						<Input
							type="text"
							name="name"
							label="Coupon Name"
							error={errors.name}
							onChange={handleChange}
						/>

						<label className="flex w-full flex-col gap-2.5">
							<p className="text-sm font-medium leading-none text-[#5d5c5c] peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Applies to
							</p>
							<Select
								name="applied_to"
								onValueChange={(value) => handleChange({ target: { name: "applied_to", value } })}>
								<SelectTrigger className="flex w-full rounded border-0 bg-neutral-50 px-4 py-[22px] text-base font-normal outline-none ring-1 ring-[#E5E5E5] focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:font-normal data-[placeholder]:text-neutral-500">
									<SelectValue placeholder="Select a value" />
								</SelectTrigger>

								<SelectContent>
									<SelectItem value="USER">User</SelectItem>
									<SelectItem value="VENDOR">Vendor</SelectItem>
								</SelectContent>
							</Select>

							{errors.applied_to && <p className="text-xs text-red-600">{errors.applied_to}</p>}
						</label>
					</div>
				</div>

				<div className="space-y-8 py-10">
					<div>
						<h3 className="font-body font-medium text-[#303030]">Coupon Type</h3>
						<p className="text-sm text-[#939393]">Type of coupon you want to create</p>
					</div>

					<div className="flex flex-col gap-2">
						<div className="grid grid-cols-4 gap-6">
							{coupon_types.map((type) => (
								<label className="group flex cursor-pointer items-center justify-center rounded border border-[#D7DBEC] p-6 text-sm transition-all has-[:checked]:border-2 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
									<input
										type="radio"
										name="coupon_type"
										value={type.value}
										onChange={handleChange}
										className="fixed opacity-0"
									/>

									<div className="flex flex-col gap-3">
										<span className="self-center text-[#939393] group-has-[:checked]:text-primary">
											{type.icon}
										</span>
										<p className="font-normal capitalize text-[#939393] group-has-[:checked]:font-medium group-has-[:checked]:text-primary">
											{capitalize(type.value.replace("_", " "))}
										</p>
									</div>
								</label>
							))}
						</div>

						{errors.coupon_type && <p className="text-sm text-red-600">{errors.coupon_type}</p>}
					</div>

					<div className="grid grid-cols-2 gap-6">
						<Input
							type="text"
							pattern="[0-9]+"
							name="amount"
							label="Discount amount"
							onChange={handleChange}
							error={errors.amount}
						/>
						<Input
							type="date"
							name="activation_date"
							label="Activation Date"
							onChange={handleChange}
							error={errors.activation_date}
						/>
					</div>

					<div className="grid grid-cols-2 gap-6">
						<div className="flex flex-col gap-2">
							<Input
								type="date"
								name="expiry_date"
								label="Expiry Date"
								onChange={handleChange}
								error={errors.expiry_date}
								// @ts-expect-error nil
								disabled={values.remove_expiry_date?.[0] === "on"}
							/>

							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									name="remove_expiry_date"
									onChange={handleChange}
									className="size-5 rounded-md border-[1.5px] border-[#D3D6DC]"
								/>

								<span className="text-sm text-[#939393]">Don't set duration</span>
							</label>
						</div>

						<div className="flex flex-col gap-2">
							<Input
								type="text"
								pattern="[0-9]+"
								name="usage_limit"
								label="Usage Limit"
								onChange={handleChange}
								error={errors.usage_limit}
								// @ts-expect-error nil
								disabled={values.remove_usage_limit?.[0] === "on"}
							/>
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									name="remove_usage_limit"
									onChange={handleChange}
									className="size-5 rounded-md border-[1.5px] border-[#D3D6DC]"
								/>

								<span className="text-sm text-[#939393]">Don't limit amount of uses</span>
							</label>
						</div>
					</div>
				</div>
			</form>
		</section>
	)
}

export default CreateCoupon
