import { useUserStore } from "@/store/z-store"
import * as React from "react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"

export const LogoutModal = () => {
	const { signOut } = useUserStore()
	const [open, setOpen] = React.useState(false)

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="w-32 bg-red-600 hover:bg-red-600">Logout</Button>
			</DialogTrigger>

			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Log out</DialogTitle>
				</DialogHeader>

				<div>
					<p className="text-sm text-[#666666]">
						Are you really sure about this? This action cannot be undone.
					</p>
					<div className="flex flex-col gap-2 pt-8">
						<Button onClick={() => signOut()} className="bg-red-600 hover:bg-red-600">
							Yes, Logout
						</Button>
						<Button variant="ghost">Cancel</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
