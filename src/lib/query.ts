import { QueryClient } from "@tanstack/react-query"

const cacheTime = 1000 * 60 * 30 // 1 minute

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: cacheTime,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			gcTime: cacheTime, // 30 mins in js
		},
	},
})
