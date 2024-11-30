import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"

type ConfirmationProps = {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	// triggerClassName?: string
	// triggerText?: string
	title: string
	body: React.ReactNode
}

export const Confirmation = ({ open, setOpen, title }: ConfirmationProps) => {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{/* <DialogTrigger
				type="button"
				className={cn(
					"flex w-full rounded-md px-4 py-2 text-xs text-primary transition-all hover:bg-primary hover:text-white",
					triggerClassName
				)}>
				{triggerText}
			</DialogTrigger> */}

			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>

				<div>
					<p>
						You are about to approve [User_Name]. Are you really sure about this? This action cannot be
						undone.
					</p>
					div
				</div>
			</DialogContent>
		</Dialog>
	)
}
