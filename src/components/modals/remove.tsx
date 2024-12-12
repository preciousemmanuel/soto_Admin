import { UpdateSellerMutation } from "@/queries"
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
	isBlocked: boolean
	trigger?: React.ReactNode
}

export const RemoveUserModal = ({ id, name, isBlocked, trigger }: Props) => {
	const [open, setOpen] = React.useState(false)
	const queryClient = useQueryClient()

	const { isPending, mutate } = useMutation({
		mutationFn: () =>
			UpdateSellerMutation({
				id,
				data: {
					is_blocked: isBlocked ? "NO" : "YES",
				},
			}),
		mutationKey: ["update-seller"],
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["get-sellers"],
			})
			setOpen(false)
		},
		onError: (error) => {
			console.error(error)
		},
	})

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{trigger ? (
					trigger
				) : (
					<button
						type="button"
						className="flex w-full rounded-md px-4 py-2 text-xs text-red-600 transition-all hover:bg-red-600 hover:text-white">
						{isBlocked ? "Unblock User" : "Block User"}
					</button>
				)}
			</DialogTrigger>

			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>{isBlocked ? "Unblock" : "Block"} User</DialogTitle>
				</DialogHeader>

				<div>
					<p className="text-sm leading-relaxed text-[#666666]">
						You are about to {isBlocked ? "unblock" : "block"}{" "}
						<strong className="capitalize">{name}</strong>. Are you really sure about this?
					</p>

					<div className="mt-10 flex flex-col gap-3">
						<Button disabled={isPending} onClick={() => mutate()}>
							{isPending ? <Spinner /> : isBlocked ? "Unblock" : "Block"}{" "}
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
