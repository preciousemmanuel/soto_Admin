import { ApproveProductModal, DeclineProductModal } from "@/components/modals"
import { Spinner } from "@/components/shared"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePageTitle } from "@/hooks"
import { formatCurrency, getInitials } from "@/lib"
import { GetProductQuery, GetSellerQuery } from "@/queries"
import { useQuery } from "@tanstack/react-query"
import { CloseCircle, ShieldTick, Timer } from "iconsax-react"
import { useNavigate, useParams } from "react-router-dom"

const tabs = ["description", "additional information", "reviews"]
const statusClass = {
	true: "text-green-600",
	false: "text-red-600",
}

const Product = () => {
	usePageTitle("Product")
	const navigate = useNavigate()
	const { id } = useParams()

	const { data: product, isPending } = useQuery({
		queryFn: () => GetProductQuery(String(id)),
		queryKey: ["get-product", id],
		enabled: !!id,
	})

	const vendor_id = product?.data.product.vendor
	const { data: vendor } = useQuery({
		queryFn: () => GetSellerQuery(String(vendor_id)),
		queryKey: ["get-sellers", vendor_id],
		enabled: !!vendor_id,
	})

	return (
		<section className="flex flex-col gap-10">
			<header className="flex items-center justify-between gap-2">
				<h2 className="text-3xl font-medium">Product Details</h2>

				<div className="flex items-center gap-6">
					<Button variant="outline" className="w-32" onClick={() => navigate(-1)}>
						Back
					</Button>
				</div>
			</header>

			{isPending ? (
				<div className="flex items-center justify-center">
					<Spinner variant="primary" size="lg" />
				</div>
			) : (
				<div className="flex flex-col gap-16">
					<div className="grid grid-cols-2 gap-16">
						<div className="flex flex-col gap-4">
							<img
								src={product?.data.product.images?.at(0)}
								className="h-[500px] w-full rounded-md border-[0.3px] border-[#999999] object-cover"
								alt={product?.data.product.product_name}
							/>
							<div className="grid w-fit grid-cols-4 gap-4">
								{product?.data.product.images.map((image, index) => (
									<img src={image} key={index} className="size-20 rounded-md object-cover" />
								))}
							</div>
						</div>

						<div className="flex max-w-prose flex-col gap-4 py-4">
							<div>
								<div className="flex items-center justify-between gap-2">
									<h3 className="font-body text-4xl font-semibold capitalize">
										{product?.data.product.product_name}
									</h3>
									{product?.data.product.decline_product_note && !product?.data.product.is_verified ? (
										<div className="flex w-fit items-center gap-1 bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
											<CloseCircle variant="Bold" className="size-4 text-red-600" />
											<p>Declined</p>
										</div>
									) : product?.data.product.is_verified ? (
										<div className="flex w-fit items-center gap-1 bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
											<ShieldTick variant="Bold" className="size-4" />
											<p>Approved</p>
										</div>
									) : (
										<div className="flex w-fit items-center gap-1 bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-600">
											<Timer variant="Bold" className="size-4" />
											<p>Pending</p>
										</div>
									)}
								</div>
								<p className="text-lg font-semibold text-primary">
									{formatCurrency(product?.data.product.unit_price ?? 0)}
								</p>
							</div>

							<p className="text-sm leading-relaxed">{product?.data.product.description}</p>

							<div className="flex flex-col gap-2 text-sm text-[#9F9F9F]">
								<p>Category: {product?.data.product.category.name}</p>
								<p>Total Quantity: {product?.data.product.product_quantity}</p>
								<p>Quantity Sold: {product?.data.product.total_quantity_sold}</p>
								<p>
									In Stock:{" "}
									<span
										className={
											statusClass[product?.data.product.in_stock as unknown as keyof typeof statusClass]
										}>
										{product?.data.product.in_stock ? "YES" : "NO"}
									</span>
								</p>
								<p>
									Is Discontinued:{" "}
									<span
										className={
											statusClass[product?.data.product.is_discounted as unknown as keyof typeof statusClass]
										}>
										{product?.data.product.is_discounted ? "YES" : "NO"}
									</span>
								</p>

								<div className="mt-4 flex flex-col gap-3">
									<p>Created by:</p>
									{vendor?.data.user ? (
										<div className="flex items-center gap-3 text-primary">
											<Avatar className="size-9">
												<AvatarImage
													src={vendor.data.user?.business?.business_logo ?? ""}
													alt=""
													// alt={vendor?.data.user?.business.business_name ?? ""}
													className="shadow-sm"
												/>
												<AvatarFallback>{getInitials(vendor?.data.user.FirstName)}</AvatarFallback>
											</Avatar>

											<div>
												<p className="font-medium capitalize leading-none">
													{vendor?.data.user.business
														? vendor?.data.user.business.business_name
														: `${vendor?.data.user.FirstName} ${vendor?.data.user.LastName}`}
												</p>
												<span className="text-xs text-gray-400">
													{vendor?.data.user.business
														? vendor?.data.user.business.email
														: vendor?.data.user.Email}
												</span>
											</div>
										</div>
									) : null}
								</div>

								<div className="flex items-center gap-3 pt-4">
									<ApproveProductModal
										id={String(id)}
										name={String(product?.data.product.product_name)}
										isVerified={product?.data.product.is_verified ?? false}
									/>

									<DeclineProductModal
										isVerified={product?.data.product.is_verified ?? false}
										isDeclined={Boolean(product?.data.product.decline_product_note)}
									/>
								</div>

								{/* <p>
								Ven: <span className="text-primary">Izu Computers & Accessories</span>
							</p> */}
							</div>
						</div>
					</div>

					<div>
						<Tabs defaultValue="description">
							<TabsList>
								{tabs.map((tab) => (
									<TabsTrigger key={tab} value={tab}>
										{tab} {tab === "reviews" && `[${product?.data.total_reviews}]`}
									</TabsTrigger>
								))}
							</TabsList>

							<TabsContent value="description">
								<p className="leading-relaxed text-[#999999] first-letter:uppercase">
									{product?.data.product.description}
								</p>
							</TabsContent>

							<TabsContent
								value="additional information"
								className="grid grid-cols-2 gap-6 text-sm text-neutral-600">
								<div>
									<p>General Speciation:</p>

									<p className="pt-4">In Stock: {product?.data.product.in_stock ? "YES" : "NO"}</p>
									<p>Is Discontinued: {product?.data.product.is_discounted ? "YES" : "NO"}</p>
									<p>Is Deleted: {product?.data.product.is_deleted ? "YES" : "NO"}</p>
									<p>Is Verified: {product?.data.product.is_verified ? "YES" : "NO"}</p>
								</div>

								<div>
									<p>Display features:</p>

									<p className="pt-4">Height: {product?.data.product.width}</p>
									<p>Height: {product?.data.product.height}</p>
									<p>Width: {product?.data.product.width}</p>
								</div>
							</TabsContent>

							<TabsContent value="reviews">
								<div>
									<h5 className="font-semibold">Customer’s Reviews</h5>
									<p className="text-sm text-neutral-400">Hear what other customers says</p>
								</div>

								<ul className="grid grid-cols-3 gap-6 pt-8">
									{product?.data.reviews.length ? (
										product.data.reviews.map((review) => (
											<li
												key={review._id}
												className="flex flex-col gap-4 rounded-md bg-neutral-100 p-5 text-sm">
												<div className="flex items-center gap-3">
													<Avatar className="size-10 border-4 border-white shadow-sm">
														<AvatarImage src="" alt={review.user?.FirstName ?? "A"} />
														<AvatarFallback className="bg-white">
															{getInitials(review.user?.FirstName ?? "A")}
														</AvatarFallback>
													</Avatar>

													<div>
														<p className="font-medium capitalize leading-none">
															{review.user ? `${review.user?.FirstName} ${review.user?.LastName}` : "Anonymous"}
														</p>
														<span className="text-xs text-gray-400">{review.user?.Email}</span>
													</div>
												</div>

												<p className="text-[#575757]">{review.comment}</p>
											</li>
										))
									) : (
										<li className="text-xs text-neutral-400">Product does have any review(s)</li>
									)}
								</ul>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			)}
		</section>
	)
}

export default Product
