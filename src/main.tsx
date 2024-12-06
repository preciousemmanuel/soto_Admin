import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ThemeProvider } from "next-themes"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Toaster } from "sonner"
import "../node_modules/sonner/dist/styles.css"

import { queryClient } from "@/lib"
import App from "./App.tsx"
import "./index.css"

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<App />
				<Toaster
					richColors
					position="top-right"
					closeButton
					toastOptions={{
						className: "p-4 font-body",
						classNames: {
							description: "opacity-70",
						},
					}}
				/>
			</ThemeProvider>
			<ReactQueryDevtools />
		</QueryClientProvider>
	</StrictMode>
)
