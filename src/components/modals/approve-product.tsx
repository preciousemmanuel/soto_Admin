import { UpdateProductMutation } from "@/queries"
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
	name: string
	isVerified: boolean
}

export const ApproveProductModal = ({ id, name, isVerified }: Props) => {
	const [open, setOpen] = React.useState(false)
	const queryClient = useQueryClient()

	const { isPending, mutate } = useMutation({
		mutationFn: () =>
			UpdateProductMutation({
				id,
				data: {
					is_verified: "YES",
				},
			}),
		mutationKey: ["update-product"],
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
				disabled={isVerified}
				type="button"
				className="flex rounded-md bg-green-600 px-4 py-2 text-xs text-white transition-all disabled:cursor-not-allowed disabled:opacity-50">
				Approve
			</DialogTrigger>

			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Approve Product</DialogTitle>
				</DialogHeader>

				<div>
					<p className="text-sm leading-relaxed text-[#666666]">
						You are about to approve <strong className="uppercase">{name}</strong>. Are you really sure
						about this? Please check the product details before approving. This action cannot be undone.
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
