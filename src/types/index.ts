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

// export type SellerProps = Node & {
// 	address: string
// 	email: string
// 	full_name: string
// 	phone_number: string
// 	profile_image: string
// }

export type SellersProps = {
	stats: {
		active_percentage: number
		inactive_percentage: number
		blocked_percentage: number
		others_percentage: number
	}
	revenue_from_sellers_chart: Array<{
		day_or_month: string
		amount: number
	}>
	sellers_data: {
		data: Array<{
			_id: string
			first_name: string
			last_name: string
			email: string
			createdAt: string
			is_active: boolean
			is_verified: boolean
			total_quantity: number
			category?: string
			product?: string
		}>
		pagination: {
			pageSize: number
			totalCount: number
			pageCount: number
			currentPage: number
			hasNext: boolean
		}
	}
}

export type SellerProps = {
	user: {
		ShippingAddress: {
			country: string
		}
		IsBlocked: boolean
		Rank: string
		_id: string
		FirstName: string
		LastName: string
		Email: string
		Password: string
		UserType: string
		SignupChannel: string
		IsVerified: boolean
		IsActive: boolean
		business: {
			_id: string
			business_name: string
			email: string
			phone_number: string
			adress: string
			category: string
			description: string
			business_logo: string
			createdAt: string
			updatedAt: string
			__v: number
			user: string
		}
		createdAt: string
		updatedAt: string
		__v: number
		Token: string
		wallet: string
	}
	total_amount_sold: number
	product_records: PaginationResponse<{
		_id: string
		product_name: string
		createdAt: string
		unit_price: number
		product_quantity: number
		is_verified: boolean
	}>
}

export type BuyersProps = {
	revenue_from_buyers_chart: Array<{
		day_or_month: string
		amount: number
	}>
	data: PaginationResponse<{
		_id: string
		first_name: string
		last_name: string
		email: string
		profile_image: string
		createdAt: string
		rank?: string
		total_spent: number
		last_order_price: number
	}>
}

export type BuyerProps = {
	user: {
		ShippingAddress: {
			full_address: string
			address: string
			city: string
			state: string
			postal_code: string
			country: string
		}
		Rank: string
		_id: string
		FirstName: string
		LastName: string
		Email: string
		Password: string
		PhoneNumber: string
		UserType: string
		SignupChannel: string
		createdAt: string
		updatedAt: string
		__v: number
		Token: string
		IsVerified: boolean
	}
	total_amount_spent: number
	orderRecords: PaginationResponse<{
		_id: string
		tracking_id: string
		createdAt: string
		status: string
		grand_total: number
	}>
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

export type CreateCouponPayload = {
	name: string
	coupon_type: string
	amount: number
	applied_to: string
	activation_date: string
	expiry_date: string
	remove_expiry_date: string
	remove_usage_limit: string
	usage_limit: number
}

export type UpdateCouponPayload = {
	amount: number
	active_status: string
	usage_limit: number
}

export type CouponProps = Node & {
	total_usage: number
	name: string
	audience: string
	code: string
	activation_date: string
	expiry_date: string
	remove_expiry_date: boolean
	amount_type: string
	coupon_type: string
	condition: string
	is_condition: boolean
	usage_limit: number
	remove_usage_limit: boolean
	total_subscribers: number
	active_status: boolean
	amount: number
}

export type CouponTypeProps =
	| "PRICE_DISCOUNT"
	| "FIXED_DISCOUNT"
	| "PERCENTAGE_DISCOUNT"
	| "FREE_SHIPPING"
