import { GetOrderQuery, UpdateCustomOrderMutation } from "@/queries"
import { declineProductSchema } from "@/schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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
	decline_note: "",
}

export const DeclineCustomOrderModal = () => {
	const { id } = useParams()
	const [open, setOpen] = React.useState(false)
	const queryClient = useQueryClient()

	const { data: order } = useQuery({
		queryFn: () => GetOrderQuery(String(id)),
		queryKey: ["get-order", id],
		enabled: !!id,
	})
	const { isPending, mutate } = useMutation({
		mutationFn: (value: typeof initialValues) =>
			UpdateCustomOrderMutation({
				id: String(id),
				data: {
					approve_or_decline: "APPROVED",
					decline_note: value.decline_note,
				},
			}),
		mutationKey: ["update-custom-order"],
		onSuccess: () => {
			queryClient.invalidateQueries()
			setOpen(false)
		},
		onError: (error) => {
			console.error(error)
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
				disabled={
					order?.data.approval_status === "APPROVED" || order?.data.approval_status === "DECLINED"
				}
				type="button"
				className="flex rounded-md bg-red-600 px-4 py-2 text-xs text-white transition-all disabled:cursor-not-allowed disabled:opacity-50">
				Decline
			</DialogTrigger>

			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Decline Order</DialogTitle>
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
								name="decline_note"
								onChange={handleChange}
								value={values.decline_note}
							/>
						</label>

						{errors.decline_note && <p className="text-xs text-red-600">{errors.decline_note}</p>}
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
