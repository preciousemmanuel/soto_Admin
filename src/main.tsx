import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { QueryClientProvider } from "@tanstack/react-query"
import { createRoot } from "react-dom/client"
import { ThemeProvider } from "next-themes"
import { StrictMode } from "react"

import { Toaster } from "@/components/ui/sonner.tsx"
import { queryClient } from "@/lib"
import App from "./App.tsx"
import "./index.css"

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<App />
				<Toaster />
			</ThemeProvider>
			<ReactQueryDevtools />
		</QueryClientProvider>
	</StrictMode>
)
