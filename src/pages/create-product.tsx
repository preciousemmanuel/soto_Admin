import { useNavigate } from "react-router-dom"
import { GalleryAdd } from "iconsax-react"
import { useFormik } from "formik"
import React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useFileHandler } from "@/hooks"

const initialValues = {
	productImage: null,
}

const CreateProduct = () => {
	const [previewUrl, setPreviewUrl] = React.useState("")
	const navigate = useNavigate()

	const { handleChange, handleSubmit, setFieldValue } = useFormik({
		initialValues,
		onSubmit: (values) => {
			console.log(values)
		},
	})

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
			<div className="flex w-full items-center gap-[180px] pb-[27px] pt-[72px]">
				<div className="flex items-center gap-6">
					<Button onClick={() => navigate(-1)} variant="outline">
						Back
					</Button>
				</div>
				<p className="text-[32px] font-medium">Create Product</p>
			</div>
			<form
				onSubmit={handleSubmit}
				className="my-5 flex w-full flex-col gap-14 rounded-2xl bg-[#f5f5f5] py-16">
				<div className="mx-auto flex w-full max-w-[620px] flex-col gap-9">
					<Input
						label="Product Name"
						type="text"
						name=""
						onChange={handleChange}
						placeholder="Enter name"
					/>
					<div className="grid w-full grid-cols-2 gap-11">
						<div className="flex w-full flex-col gap-4">
							<label
								htmlFor="description"
								className="text-2xl font-medium leading-none text-[#5d5c5c] peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Product Cateory
							</label>
							<select
								name=""
								onChange={handleChange}
								className="h-[70px] w-full rounded-3xl bg-white px-3 py-2 outline-none"></select>
						</div>
						<Input
							label="Quantity"
							type="number"
							name=""
							onChange={handleChange}
							placeholder="Enter quantity"
						/>
					</div>
					<div className="grid w-full grid-cols-2 gap-11">
						<Input
							label="Unit Price"
							type="number"
							name=""
							onChange={handleChange}
							placeholder="Enter price"
						/>
						<Input
							label="Discount (optional)"
							type="text"
							name=""
							onChange={handleChange}
							placeholder="0%"
						/>
					</div>
					<div className="flex w-full flex-col gap-4">
						<label
							htmlFor="description"
							className="text-2xl font-medium leading-none text-[#5d5c5c] peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
							Dimensions
						</label>
						<div className="grid w-full grid-cols-3 gap-[130px]">
							<div className="flex w-full flex-col gap-4">
								<label htmlFor="" className="font-medium leading-none text-[#5d5c5c]">
									Length [m]
								</label>
								<input
									type="number"
									name="length"
									className="h-[50px] w-full rounded-lg bg-white text-center"
									placeholder="0"
								/>
							</div>
							<div className="flex w-full flex-col gap-4">
								<label htmlFor="" className="font-medium leading-none text-[#5d5c5c]">
									Height [m]
								</label>
								<input
									type="number"
									name="height"
									className="h-[50px] w-full rounded-lg bg-white text-center"
									placeholder="0"
								/>
							</div>
							<div className="flex w-full flex-col gap-4">
								<label htmlFor="" className="font-medium leading-none text-[#5d5c5c]">
									Width [m]
								</label>
								<input
									type="number"
									name="width"
									className="h-[50px] w-full rounded-lg bg-white text-center"
									placeholder="0"
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
							className="grid h-[300px] w-full cursor-pointer place-items-center rounded-3xl bg-white">
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
							className="text-2xl font-medium leading-none text-[#5d5c5c] peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
							Description
						</label>
						<textarea
							name="description"
							onChange={handleChange}
							className="h-[115px] w-full resize-none rounded-3xl bg-white px-3 py-2 text-xl outline-none"
							placeholder="Describe your product"></textarea>
					</div>
					<div className="flex w-full items-center justify-between">
						<label htmlFor="" className="font-medium leading-none text-[#5d5c5c]">
							Mark product in stock
						</label>
					</div>
					<Button className="h-[85px] rounded-3xl text-2xl" type="submit">
						Add Product
					</Button>
				</div>
			</form>
		</div>
	)
}

export default CreateProduct
