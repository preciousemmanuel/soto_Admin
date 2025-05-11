import { UpdateRoleMutation, type CreateRolePayload } from "@/queries/roles"
import type { RolesProps } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useFormik } from "formik"
import * as React from "react"
import { toast } from "sonner"
import * as yup from "yup"
import { Spinner } from "../shared"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Switch } from "../ui/switch"

type Props = {
	data: RolesProps["data"][number]
}

const createRoleSchema = yup.object({
	name: yup.string().required("Role name is required!"),
})

export const UpdateRoleModal = ({ data }: Props) => {
	const queryClient = useQueryClient()
	const [open, setOpen] = React.useState(false)

	const { isPending, mutate } = useMutation({
		mutationFn: (values: CreateRolePayload) => UpdateRoleMutation(values, data._id),
		mutationKey: ["create-role"],
		onSuccess: (data) => {
			toast.success(data.message)
			queryClient.invalidateQueries()
			setOpen(false)
		},
	})

	const { handleSubmit, errors, handleChange, setFieldValue, values, resetForm } = useFormik({
		initialValues: {
			name: data.name ?? "",
			admin: {
				read: data.admin.read === "YES" ? true : false,
				write: data.admin.write === "YES" ? true : false,
			},
			config: {
				read: data.config.read === "YES" ? true : false,
				write: data.config.write === "YES" ? true : false,
			},
			order: {
				read: data.order.read === "YES" ? true : false,
				write: data.order.write === "YES" ? true : false,
			},
			purchaser: {
				read: data?.purchaser?.read === "YES" ? true : false,
				write: data?.purchaser?.write === "YES" ? true : false,
			},
			buyer: {
				read: data.buyer.read === "YES" ? true : false,
				write: data.buyer.write === "YES" ? true : false,
			},
			seller: {
				read: data?.seller?.read === "YES" ? true : false,
				write: data?.seller?.write === "YES" ? true : false,
			},
			product: {
				read: data?.product?.read === "YES" ? true : false,
				write: data?.product?.write === "YES" ? true : false,
			},
			transaction: {
				read: data.transaction.read === "YES" ? true : false,
				write: data.transaction.write === "YES" ? true : false,
			},
		},
		validationSchema: createRoleSchema,
		enableReinitialize: true,
		onSubmit: (values) => {
			mutate(
				{
					name: values.name,
					admin: {
						read: values.admin.read ? "YES" : "NO",
						write: values.admin.write ? "YES" : "NO",
					},
					config: {
						read: values.config.read ? "YES" : "NO",
						write: values.config.write ? "YES" : "NO",
					},
					order: {
						read: values.order.read ? "YES" : "NO",
						write: values.order.write ? "YES" : "NO",
					},
					buyer: {
						read: values.buyer.read ? "YES" : "NO",
						write: values.buyer.write ? "YES" : "NO",
					},
					purchaser: {
						read: values?.purchaser?.read ? "YES" : "NO",
						write: values?.purchaser?.write ? "YES" : "NO",
					},
					seller: {
						read: values.seller.read ? "YES" : "NO",
						write: values.seller.write ? "YES" : "NO",
					},
					product: {
						read: values.product.read ? "YES" : "NO",
						write: values.product.write ? "YES" : "NO",
					},
					transaction: {
						read: values.transaction.read ? "YES" : "NO",
						write: values.transaction.write ? "YES" : "NO",
					},
				},
				{
					onSuccess: () => {
						resetForm()
					},
				}
			)
		},
	})

	return (
		<Dialog
			open={open}
			onOpenChange={() => {
				resetForm()
				setOpen(!open)
			}}>
			<DialogTrigger asChild>
				<button
					type="button"
					className="flex rounded-md px-4 py-2 text-xs transition-all hover:bg-primary hover:text-white">
					Update Role
				</button>
			</DialogTrigger>

			<DialogContent className="max-h-[90%] overflow-y-auto">
				<DialogHeader className="flex flex-col gap-1">
					<DialogTitle>Create Role</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="flex flex-col gap-10 py-4">
					<Input
						type="text"
						name="name"
						label="Role Name"
						onChange={handleChange}
						error={errors.name}
						defaultValue={data.name || ""}
					/>

					<div className="flex flex-col gap-6 text-sm">
						<div className="grid grid-cols-[1fr_130px_130px] gap-2 text-xs uppercase">
							<p>Permissions</p>
							<p className="place-self-center">Read</p>
							<p className="place-self-center">Write</p>
						</div>

						<div className="grid grid-cols-[1fr_130px_130px] gap-2">
							<p>Admin</p>
							<Switch
								checked={Boolean(values.admin.read)}
								onCheckedChange={(value) => setFieldValue("admin.read", value)}
								className="place-self-center"
							/>
							<Switch
								checked={Boolean(values.admin.write)}
								onCheckedChange={(value) => setFieldValue("admin.write", value)}
								className="place-self-center"
							/>
						</div>

						<div className="grid grid-cols-[1fr_130px_130px] gap-2">
							<p>Config</p>
							<Switch
								checked={Boolean(values.config.read)}
								onCheckedChange={(value) => setFieldValue("config.read", value)}
								className="place-self-center"
							/>
							<Switch
								checked={Boolean(values.config.write)}
								onCheckedChange={(value) => setFieldValue("config.write", value)}
								className="place-self-center"
							/>
						</div>

						<div className="grid grid-cols-[1fr_130px_130px] gap-2">
							<p>Buyer</p>
							<Switch
								checked={Boolean(values.buyer.read)}
								onCheckedChange={(value) => setFieldValue("buyer.read", value)}
								className="place-self-center"
							/>
							<Switch
								checked={Boolean(values.buyer.write)}
								onCheckedChange={(value) => setFieldValue("buyer.write", value)}
								className="place-self-center"
							/>
						</div>

						<div className="grid grid-cols-[1fr_130px_130px] gap-2">
							<p>Seller</p>
							<Switch
								checked={Boolean(values.seller.read)}
								onCheckedChange={(value) => setFieldValue("seller.read", value)}
								className="place-self-center"
							/>
							<Switch
								checked={Boolean(values.seller.write)}
								onCheckedChange={(value) => setFieldValue("seller.write", value)}
								className="place-self-center"
							/>
						</div>

						<div className="grid grid-cols-[1fr_130px_130px] gap-2">
							<p>Product</p>
							<Switch
								checked={Boolean(values.product.read)}
								onCheckedChange={(value) => setFieldValue("product.read", value)}
								className="place-self-center"
							/>
							<Switch
								checked={Boolean(values.product.write)}
								onCheckedChange={(value) => setFieldValue("product.write", value)}
								className="place-self-center"
							/>
						</div>
						<div className="grid grid-cols-[1fr_130px_130px] gap-2">
							<p>Order</p>
							<Switch
								checked={Boolean(values.order.read)}
								onCheckedChange={(value) => setFieldValue("order.read", value)}
								className="place-self-center"
							/>
							<Switch
								checked={Boolean(values.order.write)}
								onCheckedChange={(value) => setFieldValue("order.write", value)}
								className="place-self-center"
							/>
						</div>


						<div className="grid grid-cols-[1fr_130px_130px] gap-2">
							<p>Purchaser</p>
							<Switch
								checked={Boolean(values.purchaser.read)}
								onCheckedChange={(value) => setFieldValue("purchaser.read", value)}
								className="place-self-center"
							/>
							<Switch
								checked={Boolean(values.purchaser.write)}
								onCheckedChange={(value) => setFieldValue("purchaser.write", value)}
								className="place-self-center"
							/>
						</div>

						<div className="grid grid-cols-[1fr_130px_130px] gap-2">
							<p>Transaction</p>
							<Switch
								checked={Boolean(values.transaction.read)}
								onCheckedChange={(value) => setFieldValue("transaction.read", value)}
								className="place-self-center"
							/>
							<Switch
								checked={Boolean(values.transaction.write)}
								onCheckedChange={(value) => setFieldValue("transaction.write", value)}
								className="place-self-center"
							/>
						</div>
					</div>

					<Button type="submit" disabled={isPending} className="col-span-full">
						{isPending ? <Spinner /> : "Create Role"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}
