import { MutationCache, QueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

const cacheTime = 1000 * 60 * 30 // 1 minute

const mutationCache = new MutationCache({
	onError: (error) => {
		if (error instanceof AxiosError) {
			toast.error(error.response?.data.message || "Something went wrong")
			return
		}

		toast.error(error.message)
	},
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onSuccess: (data: any) => {
		toast.success(data.message)
	},
})

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: cacheTime,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			gcTime: cacheTime, // 30 mins in js
		},
	},
	mutationCache: mutationCache,
})
