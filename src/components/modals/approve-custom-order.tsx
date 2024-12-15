import { GetOrderQuery, UpdateCustomOrderMutation } from "@/queries"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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

export const ApproveCustomOrderModal = () => {
	const { id } = useParams()
	const [open, setOpen] = React.useState(false)
	const queryClient = useQueryClient()

	const { data: order } = useQuery({
		queryFn: () => GetOrderQuery(String(id)),
		queryKey: ["get-order", id],
		enabled: !!id,
	})

	const { isPending, mutate } = useMutation({
		mutationFn: () =>
			UpdateCustomOrderMutation({
				id: String(id),
				data: {
					approve_or_decline: "APPROVED",
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

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				disabled={
					order?.data.approval_status === "APPROVED" || order?.data.approval_status === "DECLINED"
				}
				type="button"
				className="flex rounded-md bg-green-600 px-4 py-2 text-xs text-white transition-all disabled:cursor-not-allowed disabled:opacity-50">
				Approve
			</DialogTrigger>

			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Approve Order</DialogTitle>
				</DialogHeader>

				<div>
					<p className="text-sm leading-relaxed text-[#666666]">
						You are about to approve order <strong>#{String(id).substring(0, 6)}</strong> b. Are you
						really sure about this? This action cannot be undone.
					</p>

					<div className="mt-10 flex flex-col gap-3">
						<Button disabled={isPending} onClick={() => mutate()}>
							{isPending ? <Spinner /> : "Approve"}
						</Button>
						<DialogClose asChild>
							<Button variant="secondary" className="text-[#666666]">
								Cancel
							</Button>
						</DialogClose>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
