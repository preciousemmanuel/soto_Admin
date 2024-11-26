import { LogoutModal } from "@/components/modals/logout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Message2, Notification } from "iconsax-react"
import { useSearchParams } from "react-router-dom"

const tabs = ["profile", "withdrawal", "feedback"] as const
type Tabs = (typeof tabs)[number]

const Settings = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const status = searchParams.get("status")

	return (
		<section className="flex flex-col gap-10">
			<header className="flex items-center justify-between gap-2">
				<h2 className="font-body text-3xl font-medium">Account Settings</h2>

				<div className="flex items-center gap-3">
					<button className="relative grid size-10 place-items-center">
						<Message2 />
					</button>
					<button className="relative grid size-10 place-items-center">
						<Notification />
					</button>
					<Button variant="outline" className="w-32 border-primary hover:bg-primary/5">
						Add Admin
					</Button>

					<LogoutModal />
				</div>
			</header>

			<Tabs
				defaultValue={status ?? tabs[0]}
				value={status ?? tabs[0]}
				onValueChange={(value) => {
					searchParams.set("status", value)
					setSearchParams(searchParams)
				}}>
				<TabsList>
					{tabs.map((tab) => (
						<TabsTrigger key={tab} value={tab}>
							{tab}
						</TabsTrigger>
					))}
				</TabsList>

				{tabs.map((tab) => (
					<TabsContent key={tab} value={tab}>
						<p>
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore ad error velit temporibus
							a. Harum quod ea natus sit ipsam.
						</p>
					</TabsContent>
				))}
			</Tabs>
		</section>
	)
}

export default Settings
