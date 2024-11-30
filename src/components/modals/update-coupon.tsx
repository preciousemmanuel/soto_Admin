import { UpdateCouponMutation } from "@/queries/coupon"
import { updateCouponSchema } from "@/schema"
import type { CouponProps, UpdateCouponPayload } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useFormik } from "formik"
import * as React from "react"
import { Spinner } from "../shared"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

type Props = {
	coupon: CouponProps
}

export const UpdateCouponModal = ({ coupon }: Props) => {
	const [open, setOpen] = React.useState(false)
	const queryClient = useQueryClient()

	const { isPending, mutate } = useMutation({
		mutationFn: (value: UpdateCouponPayload) =>
			UpdateCouponMutation({
				payload: {
					...value,
					usage_limit: Number(value.usage_limit),
					amount: Number(value.amount),
				},
				id: coupon.id,
			}),
		mutationKey: ["update-coupon"],
		onSuccess: () => {
			queryClient.invalidateQueries()
			setOpen(false)
		},
		onError: (error) => {
			console.error(error)
		},
	})

	// console.log("coupon", coupon.activation_date)

	const { handleSubmit, errors, handleChange } = useFormik({
		initialValues: {
			amount: String(coupon.amount) || "",
			usage_limit: String(coupon.usage_limit) || "",
			active_status: coupon.active_status ? "YES" : "NO",
		},
		validationSchema: updateCouponSchema,
		enableReinitialize: true,
		onSubmit: (values) =>
			mutate({
				...values,
				usage_limit: Number(values.usage_limit),
				amount: Number(values.amount),
			}),
	})

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				type="button"
				className="flex w-full rounded-md px-4 py-2 text-xs text-primary transition-all hover:bg-primary hover:text-white">
				Update Coupon
			</DialogTrigger>

			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Update Coupon</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-8">
					<Input
						type="text"
						pattern="[0-9]+"
						name="amount"
						label="Discount amount"
						defaultValue={coupon.amount || ""}
						onChange={handleChange}
						error={errors.amount}
					/>

					<label className="flex w-full flex-col gap-2.5">
						<p className="text-sm font-medium leading-none text-[#5d5c5c] peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
							Is coupon active?
						</p>
						<Select
							name="active_status"
							defaultValue={coupon.active_status ? "YES" : "NO"}
							onValueChange={(value) => handleChange({ target: { name: "active_status", value } })}>
							<SelectTrigger className="flex w-full rounded border-0 bg-neutral-50 px-4 py-[22px] text-base font-normal outline-none ring-1 ring-[#E5E5E5] focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:font-normal data-[placeholder]:text-neutral-500">
								<SelectValue placeholder="Select a value" />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="YES">Yes</SelectItem>
								<SelectItem value="NO">No</SelectItem>
							</SelectContent>
						</Select>

						{errors.active_status && <p className="text-xs text-red-600">{errors.active_status}</p>}
					</label>

					<Input
						type="text"
						pattern="[0-9]+"
						name="usage_limit"
						label="Usage limit"
						defaultValue={coupon.usage_limit || ""}
						onChange={handleChange}
						error={errors.usage_limit}
					/>

					<Button type="submit" disabled={isPending}>
						{isPending ? <Spinner /> : "Update"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}
