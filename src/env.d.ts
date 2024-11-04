export const requiredEnvs = ["VITE_API_URL", "VITE_NODE_ENV"] as const

type RequiredEnvs = (typeof requiredEnvs)[number]

interface ImportMetaEnv extends Record<RequiredEnvs, string> {
	readonly VITE_API_URL: string
	readonly VITE_NODE_ENV: "development" | "test" | "production"
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
