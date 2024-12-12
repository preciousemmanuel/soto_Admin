import { CreateDiscountCouponMutation } from "@/queries/coupon"
import { GetCategoriesQuery } from "@/queries/shared"
import { createDiscountCouponSchema } from "@/schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { useFormik } from "formik"
import * as React from "react"
import { Spinner } from "../shared"
import { Button } from "../ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

const initialValues = {
	quantity: "",
	discount: "",
	product_category: "",
	activation_date: "",
	expiry_date: "",
}

type FormValue = typeof initialValues

export const QuantityDiscountModal = () => {
	const [open, setOpen] = React.useState(false)
	const queryClient = useQueryClient()

	const { data } = useQuery({
		queryKey: ["get-categories", 1],
		queryFn: () =>
			GetCategoriesQuery({
				page: 1,
				limit: 30,
			}),
	})

	const { isPending, mutate } = useMutation({
		mutationFn: (value: FormValue) =>
			CreateDiscountCouponMutation({
				...value,
				quantity: Number(value.quantity),
				discount: Number(value.discount),
				activation_date: format(new Date(value.activation_date), "MM/dd/yyyy"),
				expiry_date: format(new Date(value.expiry_date), "MM/dd/yyyy"),
			}),

		mutationKey: ["create-discount-coupon"],
		onSuccess: () => {
			queryClient.invalidateQueries()
			setOpen(false)
		},
	})

	const { handleSubmit, errors, handleChange } = useFormik({
		initialValues,
		validationSchema: createDiscountCouponSchema,
		enableReinitialize: true,
		onSubmit: (values) => {
			mutate(values)
		},
	})

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="border-primary hover:bg-primary/5">
					Add Quantity Discount
				</Button>
			</DialogTrigger>

			<DialogContent className="max-w-md">
				<DialogHeader className="flex flex-col gap-1">
					<DialogTitle>Quantity Discount</DialogTitle>
					<DialogDescription>Every order quantity from 1000 and above </DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="flex flex-col gap-6">
					<Input
						type="text"
						pattern="[0-9]*"
						name="quantity"
						label="Quantity"
						onChange={handleChange}
						error={errors.quantity}
					/>

					<Input
						type="text"
						pattern="[0-9]*"
						name="discount"
						label="Discount (%)"
						onChange={handleChange}
						error={errors.discount}
					/>

					<label className="flex w-full flex-col gap-2.5">
						<p className="text-sm font-medium leading-none text-[#5d5c5c] peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
							Product Category
						</p>
						<Select
							name="product_category"
							onValueChange={(value) => handleChange({ target: { name: "product_category", value } })}>
							<SelectTrigger className="flex w-full rounded border-0 bg-neutral-50 px-4 py-[22px] text-base font-normal capitalize outline-none ring-1 ring-[#E5E5E5] focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:font-normal data-[placeholder]:text-neutral-500">
								<SelectValue placeholder="Select a value" />
							</SelectTrigger>

							<SelectContent>
								{data?.data.data.map((category) => (
									<SelectItem key={category._id} value={category._id} className="capitalize">
										{category.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{errors.product_category && <p className="text-xs text-red-600">{errors.product_category}</p>}
					</label>

					<Input
						type="date"
						name="activation_date"
						label="Activation Date"
						onChange={handleChange}
						error={errors.activation_date}
					/>

					<Input
						type="date"
						name="expiry_date"
						label="Expiry Date"
						onChange={handleChange}
						error={errors.expiry_date}
					/>

					<Button type="submit" disabled={isPending}>
						{isPending ? <Spinner /> : "Apply Discount"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}
