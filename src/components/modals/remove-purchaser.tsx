import { RemovePurchaser } from "@/queries/purchaser"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import * as React from "react"
import { useNavigate } from "react-router-dom"
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
	id: string | undefined
	name: string
}

export const RemovePurchaserModal = ({ id, name }: Props) => {
	const navigate = useNavigate()
	const [open, setOpen] = React.useState(false)
	const queryClient = useQueryClient()

	const { isPending, mutate } = useMutation({
		mutationFn: (id: string) => RemovePurchaser(id),
		mutationKey: ["remove-purchaser"],
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["get-purchasers"],
			})
			setOpen(false)
			navigate("/dashboard/purchasers")
		},
		onError: (error) => {
			console.error(error)
		},
	})

	if (!id) return null

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<button
					type="button"
					className="flex w-fit rounded-md px-4 py-3 text-xs text-red-600 transition-all hover:bg-red-600 hover:text-white">
					Remove Purchaser
				</button>
			</DialogTrigger>

			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Remove Purchaser</DialogTitle>
				</DialogHeader>

				<div>
					<p className="text-sm leading-relaxed text-[#666666]">
						You are about to remove <strong className="capitalize">{name}</strong> as a purchaser. Are you
						really sure about this? This action cannot be undone.
					</p>

					<div className="mt-10 flex flex-col gap-3">
						<Button disabled={isPending} onClick={() => mutate(id)}>
							{isPending ? <Spinner /> : "Remove"}
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
