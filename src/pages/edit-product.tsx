import { useNavigate, useParams } from "react-router-dom"
import { GalleryAdd } from "iconsax-react"
import { useFormik } from "formik"
import React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useFileHandler } from "@/hooks"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { GetCategoriesQuery } from "@/queries/shared"
import { GetProductQuery, UpdateProductMutation } from "@/queries/product"
import { SingleProductProps } from "@/types"

const initialValues = {
	productImage: null,
	product_name: "",
	product_category: "",
	quantity: 0,
	unit_price: 0,
	discount: "",
	length: 0,
	height: 0,
	width: 0,
	description: "",
	in_stock: "NO",
}

const EditProduct = () => {
	const queryClient = useQueryClient()
	const [previewUrl, setPreviewUrl] = React.useState("")
	const navigate = useNavigate()
	const { id } = useParams()

	const { data: product } = useQuery({
		queryFn: () => GetProductQuery(String(id)),
		queryKey: ["get-product", id],
		enabled: !!id,
	})

	const { data } = useQuery({
		queryKey: ["get-categories", 1],
		queryFn: () =>
			GetCategoriesQuery({
				page: 1,
				limit: 30,
			}),
	})

	const { isPending, mutate } = useMutation({
        mutationFn: (values: typeof initialValues) =>
            UpdateProductMutation({
                id: String(id),
                data: {
					...values,
                    product_name: values.product_name,
                    category: values.product_category,
                    product_quantity: values.quantity,
                    unit_price: values.unit_price,
                    is_discounted: values.discount,
                    length: values.length,
                    height: values.height,
                    width: values.width,
                    description: values.description,
                    in_stock: values.in_stock,
                    product_image: values.productImage
                }
            }),
        mutationKey: ["update-product"],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-product", id] })
            navigate(-1) 
        },
    })



	const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
		initialValues,
		onSubmit: (values) => {
			mutate(values)
		},
		enableReinitialize: true,
	})

	React.useEffect(() => {
		if (product?.data) {
			const productData: SingleProductProps = product.data
			setFieldValue("product_name", productData.product.product_name)
			setFieldValue("product_category", productData.product.category._id)
			setFieldValue("quantity", productData.product.product_quantity)
			setFieldValue("unit_price", productData.product.unit_price)
			setFieldValue("discount", productData.product.is_discounted || "")
			setFieldValue("length", productData.product.height || 0)
			setFieldValue("height", productData.product.height || 0)
			setFieldValue("width", productData.product.width || 0)
			setFieldValue("description", productData.product.description)
			setFieldValue("in_stock", productData.product.in_stock ? "YES" : "NO")
			if (productData.product.images[0]) {
				setPreviewUrl(productData.product.images[0])
			}
		}
	}, [product, setFieldValue])

	const { handleClick, handleFileChange, inputRef } = useFileHandler((files) => {
		if (files.length === 0) return
		const file = files[0]
		const reader = new FileReader()
		reader.onload = (e) => {
			if (e.target?.result) {
				setPreviewUrl(e.target.result as string)
				setFieldValue("productImage", file)
			}
		}
		reader.readAsDataURL(file)
	})

	const removeFile = () => {
		setPreviewUrl("")
		setFieldValue("productImage", null)
	}

	return (
		<div>
			<div className="flex w-full items-center gap-[180px] pb-[27px] pt-[12px]">
				<div className="flex items-center gap-6">
					<Button onClick={() => navigate(-1)} variant="outline">
						Back
					</Button>
				</div>
				<p className="text-[32px] font-medium">Edit Product</p>
			</div>
			<form
				onSubmit={handleSubmit}
				className="my-5 flex w-full flex-col gap-14 rounded-2xl bg-[#f5f5f5] py-16">
				<div className="mx-auto flex w-full max-w-[620px] flex-col gap-9">
					<Input
						label="Product Name"
						type="text"
						name="product_name"
						value={values.product_name}
						onChange={handleChange}
						placeholder="Enter name"
					/>
					<div className="grid w-full grid-cols-2 gap-11">
						<div className="flex w-full flex-col gap-4">
							<label
								htmlFor="description"
								className="text-sm font-medium leading-none text-[#5d5c5c] peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Product Category
							</label>
							
							<Select
								name="product_category"
								onValueChange={handleChange}>
								<SelectTrigger className="flex w-full rounded border-0 bg-neutral-50 px-4 py-[22px] text-base font-normal capitalize outline-none ring-1 ring-[#E5E5E5] focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:font-normal data-[placeholder]:text-neutral-600">
									<SelectValue placeholder={product?.data?.product?.category?.name} />
								</SelectTrigger>

								<SelectContent>
									{data?.data.data.map((category) => (
										<SelectItem key={category._id} value={category._id} className="capitalize">
											{category.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<Input
							label="Quantity"
							type="number"
							name="quantity"
							value={values.quantity}
							onChange={handleChange}
							placeholder="Enter quantity"
						/>
					</div>
					<div className="grid w-full grid-cols-2 gap-11">
						<Input
							label="Unit Price"
							type="number"
							name="unit_price"
							value={values.unit_price}
							onChange={handleChange}
							placeholder="Enter price"
						/>
						<Input
							label="Discount (optional)"
							type="text"
							name="discount"
							value={values.discount}
							onChange={handleChange}
							placeholder="0%"
						/>
					</div>
					<div className="flex w-full flex-col gap-4">
						<label
							htmlFor="description"
							className="text-md font-medium leading-none text-[#5d5c5c] peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
							Dimensions
						</label>
						<div className="grid w-full grid-cols-3 gap-[50px]">
							<div className="flex w-full flex-col gap-4">
								<Input
									label="Length [m]"
									type="number"
									name="length"
									className="w-full rounded-sm bg-white text-center"
									placeholder="0"
									value={values.length}
									onChange={handleChange}
								/>
							</div>
							<div className="flex w-full flex-col gap-4">
								<Input
									label="Height [m]"
									type="number"
									name="height"
									className="w-full rounded-sm bg-white text-center"
									placeholder="0"
									value={values.height}
									onChange={handleChange}
								/>
							</div>
							<div className="flex w-full flex-col gap-4">
								<Input
									label="Width [m]"
									type="number"
									name="width"
									className="w-full rounded-sm bg-white text-center"
									placeholder="0"
									value={values.width}
									onChange={handleChange}
								/>
							</div>
						</div>
					</div>
					{previewUrl ? (
						<div className="relative grid h-[300px] w-full place-items-center overflow-hidden rounded-3xl bg-white">
							<button onClick={removeFile} className="absolute right-4 top-4"></button>
							<img src={previewUrl} alt={`preview-image`} className="size-full rounded-3xl object-cover" />
						</div>
					) : (
						<label
							onClick={handleClick}
							htmlFor="productImage"
							className="grid h-[200px] w-full cursor-pointer place-items-center rounded-3xl bg-white">
							<input
								ref={inputRef}
								type="file"
								name="productImage"
								onChange={handleFileChange}
								className="sr-only hidden"
								multiple={false}
								accept="image/*"
							/>
							<div className="flex flex-col items-center gap-1 py-[34px]">
								<div className="grid size-[50px] place-items-center rounded-lg border">
									<GalleryAdd className="size-[30px]" />
								</div>
								<p className="text-sm">Upload product image</p>
								<p className="text-xs">Image should be less than 2MB</p>
							</div>
						</label>
					)}
					<div className="flex w-full flex-col gap-4">
						<label
							htmlFor="description"
							className="text-sm font-medium leading-none text-[#5d5c5c] peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
							Description
						</label>
						<Textarea
							name="description"
							onChange={handleChange}
							value={values.description}
							className="h-[250px] w-full resize-none rounded-md bg-white px-3 py-2 text-sm"
							placeholder="Describe your product"
						/>
					</div>
					<div className="flex w-full items-center justify-between">
						<label htmlFor="" className="font-medium leading-none text-[#5d5c5c]">
							Mark product in stock
						</label>
						<Switch
							checked={values.in_stock === "YES"}
							onCheckedChange={(checked) => setFieldValue("in_stock", checked ? "YES" : "NO")}
						/>
					</div>
					<Button className="text-md h-[55px] rounded-md" type="submit" disabled={isPending}>
						{isPending ? "Updating..." : "Update Product"}
					</Button>
				</div>
			</form>
		</div>
	)
}

export default EditProduct
