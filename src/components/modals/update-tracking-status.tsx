import { UpdateTrackingStatusMutation } from "@/queries"
import { GetSettingsQuery } from "@/queries/settings"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useFormik } from "formik"
import * as React from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import * as yup from "yup"
import { Spinner } from "../shared"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

const statusSchema = yup.object({
	step: yup.string().required("Please select a tracking step!"),
})

type Props = {
	level: number
}
export const UpdateTrackingStatusModal = ({ level }: Props) => {
	const { id } = useParams()
	const queryClient = useQueryClient()
	const [open, setOpen] = React.useState(false)

	const { data } = useQuery({
		queryFn: GetSettingsQuery,
		queryKey: ["get-settings"],
	})
	const itinerary = data?.data.order_itinerary

	const { isPending, mutate } = useMutation({
		mutationFn: (values: { step: number }) => UpdateTrackingStatusMutation(String(id), values),
		mutationKey: ["update-tracking-status"],
		onSuccess: (data) => {
			toast.success(data.message)
			queryClient.invalidateQueries()
			setOpen(false)
		},
	})

	const { handleSubmit, errors, handleChange, resetForm } = useFormik({
		initialValues: {
			step: "",
		},
		validationSchema: statusSchema,
		enableReinitialize: true,
		onSubmit: (values) => {
			mutate({
				step: Number(values.step),
			})
		},
	})

	return (
		<Dialog
			open={open}
			onOpenChange={() => {
				resetForm()
				setOpen(!open)
			}}>
			<DialogTrigger asChild>
				<Button
					disabled={level === 4}
					className="mr-auto w-48 bg-neutral-600 text-xs text-white hover:bg-neutral-700 disabled:opacity-10">
					Update tracking status
				</Button>
			</DialogTrigger>

			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Update Tracking Status</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="flex flex-col gap-10 pt-6">
					<label className="flex w-full flex-col gap-2.5">
						<p className="text-sm font-medium leading-none text-[#5d5c5c] peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
							Tracking status
						</p>
						<Select
							name="step"
							onValueChange={(value) => handleChange({ target: { name: "step", value } })}>
							<SelectTrigger className="flex w-full rounded border-0 bg-neutral-50 px-4 py-[22px] text-base font-normal outline-none ring-1 ring-[#E5E5E5] focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:font-normal data-[placeholder]:text-neutral-500">
								<SelectValue placeholder="Select a value" />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value={String(itinerary?.step_1.level)} className="capitalize">
									{itinerary?.step_1.description}
								</SelectItem>
								<SelectItem value={String(itinerary?.step_2.level)} className="capitalize">
									{itinerary?.step_2.description}
								</SelectItem>
								<SelectItem value={String(itinerary?.step_3.level)} className="capitalize">
									{itinerary?.step_3.description}
								</SelectItem>
								<SelectItem value={String(itinerary?.step_4.level)} className="capitalize">
									{itinerary?.step_4.description}
								</SelectItem>
							</SelectContent>
						</Select>

						{errors.step && <p className="text-xs text-red-600">{errors.step}</p>}
					</label>

					<Button type="submit" disabled={isPending}>
						{isPending ? <Spinner /> : "Update Status"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}
