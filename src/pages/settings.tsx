import { Message2, Notification } from "iconsax-react"
import React from "react"

import { Button } from "@/components/ui/button"

const tabs = ["profile", "withdrawal", "feedback"] as const
type Tabs = (typeof tabs)[number]

const Settings = () => {
	const [activeTab, setActiveTab] = React.useState<Tabs>("profile")

	return (
		<div className="w-full">
			<div className="flex w-full items-center justify-between pb-[27px] pt-[72px]">
				<p className="text-[32px] font-medium">Account Settings</p>
				<div className="flex items-center gap-6">
					<button className="relative grid size-10 place-items-center">
						<Message2 />
					</button>
					<button className="relative grid size-10 place-items-center">
						<Notification />
					</button>
					<Button className="w-[134px]">Logout</Button>
				</div>
			</div>
			<div className="my-5 flex w-full flex-col gap-14">
				<div className="flex w-full items-center justify-between">
					<div className="flex w-[792px] items-center gap-[14px] border-b">
						{tabs.map((tab) => (
							<button
								key={tab}
								className={`relative h-[38px] py-4 capitalize transition-all before:absolute before:-bottom-0.5 before:left-0 before:h-0.5 before:bg-primary ${
									tab === activeTab ? "before:w-full" : "before:w-0"
								}`}
								onClick={() => setActiveTab(tab)}>
								<p className="text-[16px] font-medium">{tab}</p>
							</button>
						))}
					</div>
					<Button className="w-[101px]" variant="outline">
						Back
					</Button>
				</div>
			</div>
		</div>
	)
}

export default Settings
