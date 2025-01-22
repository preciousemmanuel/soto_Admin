import { CreateCategoryMutation, type CreateCategoryPayload } from "@/queries"
import { addProductCategorySchema } from "@/schema"
import { useMutation } from "@tanstack/react-query"
import { useFormik } from "formik"
import * as React from "react"
import { Spinner } from "../shared"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"

const initialValues = {
	name: "",
	image: undefined,
}

export const AddProductCategory = () => {
	const [open, setOpen] = React.useState(false)

	const { isPending, mutate } = useMutation({
		mutationFn: (values: CreateCategoryPayload) => CreateCategoryMutation(values),
		mutationKey: ["add-purchaser"],
		onSuccess: () => {
			// queryClient.invalidateQueries()
			setOpen(false)
			// URL.revokeObjectURL(values?.passport as string)
		},
	})

	const { handleSubmit, errors, handleChange, setFieldValue, resetForm } = useFormik({
		initialValues,
		validationSchema: addProductCategorySchema,
		enableReinitialize: true,
		onSubmit: (values) => mutate(values),
	})

	return (
		<Dialog
			open={open}
			onOpenChange={() => {
				resetForm()
				setOpen(!open)
			}}>
			<DialogTrigger asChild>
				<Button>Add product category</Button>
			</DialogTrigger>

			<DialogContent className="max-w-md">
				<DialogHeader className="flex flex-col gap-1">
					<DialogTitle>Add new product category</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="flex flex-col gap-8 py-4">
					<Input
						type="text"
						name="name"
						label="Category Name"
						onChange={handleChange}
						error={errors.name}
					/>

					<Input
						type="file"
						name="image"
						label="Category Image"
						onChange={(e) => setFieldValue("image", e.target.files?.[0])}
						error={errors.image}
						accept="image/jpeg, image/jpg, image/png"
					/>

					<Button disabled={isPending}>{isPending ? <Spinner /> : "Add Category"}</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}
