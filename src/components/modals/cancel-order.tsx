import { CancelOrderMutation } from "@/queries"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import * as React from "react"
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

type Props = {
	id: string
	owner: string
	trigger: React.ReactNode
}

export const CancelOrderModal = ({ id, owner, trigger }: Props) => {
	const [open, setOpen] = React.useState(false)
	const queryClient = useQueryClient()

	const { isPending, mutate } = useMutation({
		mutationFn: () => CancelOrderMutation(id),
		mutationKey: ["cancel-order"],
		onSuccess: () => {
			queryClient.invalidateQueries()
			setOpen(false)
		},
	})

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>

			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Cancel Order</DialogTitle>
				</DialogHeader>

				<div>
					<p className="text-sm leading-relaxed text-[#666666]">
						You are about to cancel order <strong>#{id.substring(0, 6)}</strong> by{" "}
						<strong className="uppercase">{owner}</strong>. Are you really sure about this? This action
						cannot be undone.
					</p>

					<div className="mt-10 flex flex-col gap-3">
						<Button disabled={isPending} onClick={() => mutate()}>
							{isPending ? <Spinner /> : "Yes, Cancel"}
						</Button>
						<DialogClose asChild>
							<Button variant="secondary" className="text-[#666666]">
								Close
							</Button>
						</DialogClose>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
