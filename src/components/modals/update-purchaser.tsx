import {
	GetPurchaserQuery,
	UpdatePurchaserMutation,
	type CreatePurchaserPayload,
} from "@/queries/purchaser"
import { idTypes, updatePurchaserSchema } from "@/schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useFormik } from "formik"
import { Trash2Icon } from "lucide-react"
import * as React from "react"
import { useParams } from "react-router-dom"
import { Spinner } from "../shared"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export const UpdatePurchaserModal = () => {
	const [open, setOpen] = React.useState(false)
	const queryClient = useQueryClient()

	const { id } = useParams()

	const { data } = useQuery({
		queryFn: () => GetPurchaserQuery(String(id)),
		queryKey: ["get-purchaser", id],
		select: (data) => data.data,
	})

	const { isPending, mutate } = useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: Partial<CreatePurchaserPayload> }) =>
			UpdatePurchaserMutation(id, payload),
		mutationKey: ["update-purchaser"],
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["get-purchaser", id],
			})
			setOpen(false)
		},
	})

	const { handleSubmit, errors, handleChange, setFieldValue, values } = useFormik({
		enableReinitialize: true,
		initialValues: {
			first_name: data?.FirstName ?? "",
			last_name: data?.LastName ?? "",
			email: data?.Email ?? "",
			phone_number: data?.PhoneNumber ?? "",
			id_type: data?.id_type ?? "",
			id_number: data?.id_number ?? "",
			passport: data?.ProfileImage ?? undefined,
		},
		validationSchema: updatePurchaserSchema,
		onSubmit: (values) => {
			if (typeof values.passport === "string") {
				delete values.passport
			}

			mutate({
				id: String(id),
				payload: {
					...values,
					id_type: values.id_type.replace(" ", "_").toUpperCase(),
				},
			})
		},
	})

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<button
					type="button"
					className="flex w-fit rounded-md px-4 py-2 text-sm text-primary transition-all hover:bg-primary hover:text-white">
					Edit
				</button>
			</DialogTrigger>

			<DialogContent className="max-h-[90%] overflow-y-auto">
				<DialogHeader className="flex flex-col gap-1">
					<DialogTitle>Update Purchaser</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-4 gap-y-8 py-4">
					<Input
						type="text"
						name="first_name"
						label="First Name"
						value={values.first_name}
						onChange={handleChange}
						error={errors.first_name}
					/>
					<Input
						type="text"
						name="last_name"
						label="Last Name"
						value={values.last_name}
						onChange={handleChange}
						error={errors.last_name}
					/>
					<Input
						type="email"
						name="email"
						label="Email"
						value={values.email}
						onChange={handleChange}
						error={errors.email}
					/>
					<Input
						type="text"
						name="phone_number"
						label="Phone number"
						onChange={handleChange}
						value={values.phone_number}
						error={errors.phone_number}
						maxLength={11}
					/>

					<label className="flex w-full flex-col gap-2.5">
						<p className="text-sm font-medium leading-none text-[#5d5c5c] peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
							ID Type
						</p>
						<Select
							name="id_type"
							value={values.id_type}
							onValueChange={(value) => handleChange({ target: { name: "id_type", value } })}>
							<SelectTrigger className="flex w-full rounded border-0 bg-neutral-50 px-4 py-[22px] text-base font-normal outline-none ring-1 ring-[#E5E5E5] focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:font-normal data-[placeholder]:text-neutral-500">
								<SelectValue placeholder="Select a value" />
							</SelectTrigger>

							<SelectContent>
								{idTypes.map((type) => (
									<SelectItem key={type} value={type} className="capitalize">
										{type}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{errors.id_type && <p className="text-xs text-red-600">{errors.id_type}</p>}
					</label>

					<Input
						type="text"
						name="id_number"
						label="ID Number"
						onChange={handleChange}
						value={values.id_number}
						error={errors.id_number}
						placeholder=""
					/>

					<div className="col-span-full flex flex-col gap-4">
						<Input
							type="file"
							name="passport"
							label="Passport"
							// value={values.passport}
							onChange={(e) => setFieldValue("passport", e.target.files?.[0])}
							error={errors.passport}
							accept="image/jpeg, image/jpg, image/png"
						/>
						{/* {errors.passport && <p className="text-xs text-red-600">{errors.passport}</p>} */}

						{values.passport ? (
							<div className="relative">
								<img
									src={
										typeof values.passport === "string"
											? values.passport
											: URL.createObjectURL(values?.passport)
									}
									className="h-80 max-h-full w-full object-contain"
								/>

								{typeof values.passport !== "string" ? (
									<button
										type="button"
										className="absolute right-2 top-2 grid size-6 place-items-center rounded bg-white text-red-600"
										onClick={() => {
											URL.revokeObjectURL(values.passport as string)
											setFieldValue("passport", data?.ProfileImage)
										}}>
										<Trash2Icon className="size-4" />
									</button>
								) : null}
							</div>
						) : null}
					</div>

					<Button type="submit" disabled={isPending} className="col-span-full">
						{isPending ? <Spinner /> : "Update Purchaser"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}
