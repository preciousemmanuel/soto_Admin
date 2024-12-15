import { UpdatePickupMutation } from "@/queries/purchaser"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useFormik } from "formik"
import * as React from "react"
import { toast } from "sonner"
import { Spinner } from "../shared"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

const statuses = ["PENDING", "CANCELLED", "DELIVERED", "PICKED_UP"]

type Payload = {
	status: string
}

type Props = {
	id: string
}

export const UpdatePurchaserOrderStatusModal = ({ id }: Props) => {
	const queryClient = useQueryClient()
	const [open, setOpen] = React.useState(false)

	const { isPending, mutate } = useMutation({
		mutationFn: (values: Payload) => UpdatePickupMutation(id, values),
		mutationKey: ["update-pickups"],
		onSuccess: (data) => {
			toast.success(data.message)
			queryClient.invalidateQueries()
			setOpen(false)
		},
	})

	const { handleSubmit, errors, handleChange } = useFormik({
		initialValues: {
			status: "",
		},
		// validationSchema: addPurchaserSchema,
		enableReinitialize: true,
		onSubmit: (values) => {
			mutate(values)
		},
	})

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<button
					type="button"
					className="flex w-full rounded-md px-4 py-2 text-xs transition-all hover:bg-primary hover:text-white">
					Update Pickup Status
				</button>
			</DialogTrigger>

			<DialogContent className="max-w-md">
				<DialogHeader className="flex flex-col gap-1">
					<DialogTitle>Update Pickup Status</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="flex flex-col gap-10 pt-6">
					<label className="flex w-full flex-col gap-2.5">
						<p className="text-sm font-medium leading-none text-[#5d5c5c] peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
							Pickup Status
						</p>
						<Select
							name="status"
							onValueChange={(value) => handleChange({ target: { name: "status", value } })}>
							<SelectTrigger className="flex w-full rounded border-0 bg-neutral-50 px-4 py-[22px] text-base font-normal outline-none ring-1 ring-[#E5E5E5] focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:font-normal data-[placeholder]:text-neutral-500">
								<SelectValue placeholder="Select a value" />
							</SelectTrigger>

							<SelectContent>
								{statuses.map((status) => (
									<SelectItem key={status} value={status} className="capitalize">
										{status}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{errors.status && <p className="text-xs text-red-600">{errors.status}</p>}
					</label>

					<Button type="submit" disabled={isPending}>
						{isPending ? <Spinner /> : "Update Status"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}
