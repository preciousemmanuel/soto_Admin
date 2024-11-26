import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePageTitle } from "@/hooks"
import { useNavigate, useSearchParams } from "react-router-dom"

const tabs = ["pending", "picked", "delivered", "cancelled"] as const
// type Tabs = (typeof tabs)[number]

const Orders = () => {
	usePageTitle("Purchasers")
	const navigate = useNavigate()
	const [searchParams, setSearchParams] = useSearchParams()
	const status = searchParams.get("status")

	// const [activeTab, setActiveTab] = React.useState<Tabs>("pending")

	return (
		<section className="flex flex-col gap-10">
			<header className="flex items-center justify-between gap-2">
				<h2 className="font-body text-3xl font-medium">Purchaser Management</h2>

				<div className="flex items-center gap-3">
					<Button
						variant="outline"
						className="border-primary hover:bg-primary/5"
						onClick={() => navigate(-1)}>
						Back
					</Button>
					<Button>Add Product</Button>
				</div>
			</header>

			<Tabs
				defaultValue={status ?? "pending"}
				value={status ?? "pending"}
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

export default Orders
