import { StatusProps } from "@/types"

export const statusClass: Record<StatusProps, string> = {
	BOOKED: "text-neutral-600",
	CANCELLED: "text-red-600",
	COMPLETED: "text-green-600",
	CONFIRMED: "text-green-600",
	DELIVERED: "text-green-600",
	FAILED: "text-red-600",
	PENDING: "text-red-600",
	PICKED: "text-green-600",
	PROCESSING: "text-yellow-600",
	REFUND: "text-yellow-600",
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
