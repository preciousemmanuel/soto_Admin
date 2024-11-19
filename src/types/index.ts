export type Maybe<T> = T | null

export type Undefined<T> = T | undefined

export type Exact<T extends { [key: string]: unknown }> = {
	[K in keyof T]: T[K]
}

export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]?: Maybe<T[SubKey]>
}

export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]: Maybe<T[SubKey]>
}

export type ValueOf<T> = T[keyof T]

export type NonEmptyArray<T> = [T, ...T[]]

export type MustInclude<T, U extends T[]> = [T] extends [ValueOf<U>] ? U : never

export interface HttpResponse<T> {
	data: T
	message: string
	status: string
}

export type HttpError = {
	response: {
		data: {
			error: string
			message: string
			status: string
		}
	}
}

export interface PaginationResponse<T> {
	data: T[]
	pagination: {
		pageSize: number
		totalCount: number
		pageCount: number
		currentPage: number
		hasNext: boolean
	}
}

export interface PaginationProps {
	timeLine?: TimelineProps
	limit?: number
	page?: number
}

export type TimelineProps =
	| "YESTERDAY"
	| "TODAY"
	| "THIS_WEEK"
	| "LAST_7_DAYS"
	| "LAST_WEEK"
	| "THIS_MONTH"
	| "LAST_6_MONTHS"
	| "LAST_12_MONTHS"
	| (string & {})

export type StatusProps =
	| "BOOKED"
	| "CANCELLED"
	| "COMPLETED"
	| "CONFIRMED"
	| "DELIVERED"
	| "FAILED"
	| "PENDING"
	| "PICKED"
	| "PROCESSING"
	| "REFUND"
	| "SHIPPED"
	| (string & {})

export type Node = {
	createdAt: Date | string
	deletedBy: Maybe<string>
	deletedAt: Maybe<Date | string>
	id: string
	updateBy: Maybe<string>
	updatedAt: Maybe<Date | string>
}

export type AdminProps = Node & {
	Email: string
	FirstName: string
	LastName: string
	Token: string
}

export type UserProps = Node & {
	email: string
	full_name: string
	profile_image: string
}

export type SellerProps = Node & {
	address: string
	email: string
	full_name: string
	phone_number: string
	profile_image: string
}

export type BuyerProps = Node & {
	address: string
	email: string
	full_name: string
	phone_number: string
	profile_image: string
}

export type ProductProps = Node & {
	__typename?: "Product"
	_id: string
	description: string
	height: number
	images: string[]
	in_stock: boolean
	is_verified: boolean
	is_deleted: boolean
	is_discounted: boolean
	discount_price: number
	total_quantity_sold: number | undefined
	product_id:
		| string
		| {
				total_quantity_sold: number
				images: string[]
		  }
	product_name: string
	product_quantity: number
	unit_price: number
	vendor: {
		Email: string
		_id: string
	}
	weight: number
	width: number
}

export type OrderProps = Node & {
	__typename?: "Order"
	_id: string
	delivery_amount: number
	grand_total: number
	items: ProductProps[]
	order_itinerary: string
	payment_type: "INSTANT"
	shipping_address: string
	status: StatusProps
	total_amount: number
	tracking_id: string
	user: {
		_id: string
		Email: string
		FirstName: string
		LastName: string
		PhoneNumber: string
	}
}

export type TransactionProps = Node & {
	amount: number
	payment_type: "card" | "transfer"
	status: "cancelled" | "pending" | "success"
	tracking_id: string
	type: "credited" | "withdrew"
	user: {
		_id: string
		FirstName: string
		LastName: string
		Role: "buyer" | "seller"
	}
}

export type LatestOrderProps = Node & {
	product_id: string
	product_name: string
	quantity: number
	unit_price: number
	createdAt: Date | string
	status: StatusProps
	total_price: number
	order: string
	images: string[]
}

export type CouponProps = Node & {
	activation_date: Date | string
	amount: number
	applied_to: "USER" | "VENDOR"
	expiry_date: Date | string
	coupon_type: CouponTypeProps
	name: string
	remove_expiry_date: boolean
	remove_usage_limit: boolean
	usage_limit: string
}

export type CouponTypeProps =
	| "PRICE_DISCOUNT"
	| "FIXED_DISCOUNT"
	| "PERCENTAGE_DISCOUNT"
	| "FREE_SHIPPING"
