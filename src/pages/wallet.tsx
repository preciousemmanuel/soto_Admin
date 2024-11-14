import { ArrowRight, Message2, Notification } from "iconsax-react"
import { Link } from "react-router-dom"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTable, WalletCard } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { useUserStore } from "@/store/z-store"
import { transactionColumm } from "@/config"
import { getInitials } from "@/lib"

const Wallet = () => {
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
			<div className="my-5 flex w-full flex-col gap-14">
				<div className="grid w-full grid-cols-4 gap-5">
					<WalletCard label="transaction amount" color="red" />
					<WalletCard label="total income" color="green" />
					<WalletCard label="total withdraw" color="yellow" />
					<WalletCard label="remittance balance" color="red" />
				</div>
				<div className="flex w-full flex-col gap-10">
					<div className="flex w-full items-center justify-between">
						<div className="flex flex-col gap-4">
							<p className="text-[28px] font-medium">Transactions</p>
							<p className="text-sm text-neutral-400">Recent Transactions</p>
						</div>
						<div className="flex items-center gap-7">
							<Button className="border-primary" variant="outline">
								Export
							</Button>
							<Button variant="ghost">
								See More <ArrowRight />
							</Button>
						</div>
					</div>
					<DataTable columns={transactionColumm} data={[]} />
				</div>
			</div>
		</div>
	)
}

export default Wallet
