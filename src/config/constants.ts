export const PAGE_LIMIT = 15
export const ORDER_TABS = [
	"pending",
	"confirmed",
	"processing",
	"picked",
	"shipped",
	"delivered",
	"cancelled",
] as const
export type OrderTabs = (typeof ORDER_TABS)[number]
