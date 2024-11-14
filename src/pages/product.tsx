import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import React from "react"

import { GetProductQuery } from "@/queries"

const Product = () => {
	const { id } = useParams()

	const { data: order } = useQuery({
		queryFn: () => GetProductQuery(String(id)),
		queryKey: ["get-product", id],
		enabled: !!id,
	})

	React.useEffect(() => {
		console.log(order)
	}, [order])

	return (
		<div>
			<div className="flex w-full items-center justify-between pb-[27px] pt-[72px]">
				<p className="text-[32px] font-medium">Product</p>
				<div className="flex items-center gap-6"></div>
			</div>
			<div className="my-5 flex w-full flex-col gap-14"></div>
		</div>
	)
}

export default Product
