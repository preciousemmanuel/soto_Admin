import { UpdateProductMutation } from "@/queries"
import { declineProductSchema } from "@/schema"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useFormik } from "formik"
import * as React from "react"
import { useParams } from "react-router-dom"
import { Spinner } from "../shared"
import { Button } from "../ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog"
import { Textarea } from "../ui/textarea"

const initialValues = {
	decline_product_note: "",
}

type Props = {
	isDeclined: boolean
	isVerified: boolean
}

export const DeclineProductModal = ({ isDeclined, isVerified }: Props) => {
	const { id } = useParams()
	const [open, setOpen] = React.useState(false)
	const queryClient = useQueryClient()

	const { isPending, mutate } = useMutation({
		mutationFn: (value: typeof initialValues) =>
			UpdateProductMutation({
				id: String(id),
				data: {
					...value,
					is_verified: "NO",
				},
			}),
		mutationKey: ["update-product"],
		onSuccess: () => {
			queryClient.invalidateQueries()
			setOpen(false)
		},
	})

	const { handleSubmit, errors, values, handleChange } = useFormik({
		initialValues,
		validationSchema: declineProductSchema,
		enableReinitialize: true,
		onSubmit: (values) => {
			mutate(values)
		},
	})

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				type="button"
				disabled={isDeclined || isVerified}
				className="flex rounded-md bg-red-600 px-4 py-2 text-xs text-white transition-all disabled:cursor-not-allowed disabled:opacity-50">
				Decline
			</DialogTrigger>

			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Decline Product</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<div className="flex w-full flex-col gap-2.5">
						<label className="flex flex-col gap-2 pt-4">
							<p className="text-sm font-medium leading-none text-[#5d5c5c] peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Leave a note
							</p>

							<Textarea
								rows={4}
								className="resize-none text-sm"
								name="decline_product_note"
								onChange={handleChange}
								value={values.decline_product_note}
							/>
						</label>

						{errors.decline_product_note && (
							<p className="text-xs text-red-600">{errors.decline_product_note}</p>
						)}
					</div>

					<div className="mt-10 flex flex-col gap-3">
						<Button disabled={isPending} type="submit">
							{isPending ? <Spinner /> : "Decline"}
						</Button>

						<DialogClose asChild>
							<Button variant="secondary" className="text-[#666666]">
								Cancel
							</Button>
						</DialogClose>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
