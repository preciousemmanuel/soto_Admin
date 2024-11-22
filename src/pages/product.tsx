import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePageTitle } from "@/hooks"
import { useNavigate } from "react-router-dom"

const tabs = ["description", "additional information", "reviews"]

const Product = () => {
	usePageTitle("Product")
	const navigate = useNavigate()
	// const { id } = useParams()

	// const { data: order } = useQuery({
	// 	queryFn: () => GetProductQuery(String(id)),
	// 	queryKey: ["get-product", id],
	// 	enabled: !!id,
	// })

	// React.useEffect(() => {
	// 	console.log(order)
	// }, [order])

	return (
		<section className="flex flex-col gap-10">
			<header className="flex items-center justify-between gap-2">
				<h2 className="text-3xl font-medium">Product Details</h2>

				<div className="flex items-center gap-6">
					<Button variant="outline" className="w-32" onClick={() => navigate(-1)}>
						Back
					</Button>
					{/* <div className="flex items-center gap-3">
						<Button>Add Product</Button>
					</div> */}
				</div>
			</header>

			<div className="flex flex-col gap-16">
				<div className="grid grid-cols-2 gap-16">
					<div className="h-[500px] rounded-md border-[0.3px] border-[#999999]">
						<img src="/images/product-1.png" alt="" />
					</div>

					<div className="flex max-w-prose flex-col gap-4 py-4">
						<div>
							<h3 className="font-body text-4xl font-semibold">Asus Gaming Laptop</h3>
							<p className="text-lg font-semibold text-primary">N18,000</p>
						</div>

						<p className="text-sm leading-relaxed">
							Setting the bar as one of the strongest gaming laptops in its class, the Kilburn is a
							compact, stout-hearted hero with a well-balanced audio which boasts a clear midrange and
							extended highs for a sound.
						</p>

						<div className="flex flex-col gap-2 text-sm text-[#9F9F9F]">
							<p>Sizes: S, M, L</p>
							<p>Colors: S, M, L</p>
							<p>Category: S, M, L</p>
							<p>Tags: S, M, L</p>
							<p>
								Created by: <span className="text-primary">Izu Computers & Accessories</span>
							</p>
						</div>
					</div>
				</div>

				<div>
					<Tabs>
						<TabsList>
							{tabs.map((tab) => (
								<TabsTrigger key={tab} value={tab}>
									{tab}
								</TabsTrigger>
							))}
						</TabsList>

						<TabsContent value="description">
							<p>
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis fugiat eveniet ad
								porro eum neque magnam dolores provident excepturi veniam reiciendis aliquam commodi, itaque
								optio at. Voluptatum illo maxime eos.
							</p>
						</TabsContent>
						{/* {ORDER_TABS.map((tab) => (
						))} */}
					</Tabs>
				</div>
			</div>
		</section>
	)
}

export default Product
