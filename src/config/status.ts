import { StatusProps } from "@/types"

export const statusClass: Record<StatusProps, string> = {
	BOOKED: "text-blue-600",
	CANCELLED: "text-red-600",
	COMPLETED: "text-green-600",
	CONFIRMED: "text-green-600",
	DELIVERED: "text-green-600",
	FAILED: "text-rose-600",
	PENDING: "text-yellow-600",
	PICKED: "text-green-600",
	PROCESSING: "text-yellow-600",
	REFUND: "text-orange-600",
	SHIPPED: "text-neutral-600",
}

export const status = ["BOOKED", "PENDING", "CANCELLED", "DELIVERED", "PROCESSING", "FAILED"]

export const productStatus = {
	ACTIVE: "active products",
	SOLD: "sold products",
	PROMO: "promotion",
	OUT_OF_STOCK: "out of stock",
	RETURNED: "returned products",
}

export const transactionStatusClass = {
	SUCCESSFUL: "text-green-600",
	PENDING: "text-yellow-600",
	FAILED: "text-red-600",
}

export const pickupsStatusClass = {
	PENDING: "text-yellow-600",
	DELIVERED: "text-green-600",
	CANCELLED: "text-red-600",
	PICKED_UP: "text-purple-600",
}
