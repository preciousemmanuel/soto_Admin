import { Message2, Notification } from "iconsax-react"
import { Link } from "react-router-dom"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useUserStore } from "@/store/z-store"
import { getInitials } from "@/lib"

const Withdrawal = () => {
	const { user } = useUserStore()

	return (
		<div>
			<div className="flex w-full items-center justify-between pb-[27px] pt-[72px]">
				<p className="text-[32px] font-medium">Wallet</p>
				<div className="flex items-center gap-6">
					<Link to="/dashboard/wallet/withdrawal">
						<Button className="w-[144px]">Withdraw Funds</Button>
					</Link>
					<button className="relative grid size-10 place-items-center">
						<Message2 />
					</button>
					<button className="relative grid size-10 place-items-center">
						<Notification />
					</button>
					<Avatar className="size-[30px]">
						<AvatarImage src={user?.profile_image} alt={user?.full_name} />
						<AvatarFallback>{getInitials(String(user?.full_name) || "SO")}</AvatarFallback>
					</Avatar>
				</div>
			</div>
			<div className="my-5 flex w-full flex-col gap-14"></div>
		</div>
	)
}

export default Withdrawal
