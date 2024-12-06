import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, ...props }, ref) => {
		return (
			<textarea
				className={cn(
					"flex w-full rounded border-0 bg-neutral-50 px-4 py-2.5 text-base font-normal outline-none ring-1 ring-[#E5E5E5] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:font-normal placeholder:text-neutral-500 focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
					className
				)}
				ref={ref}
				{...props}
			/>
		)
	}
)
Textarea.displayName = "Textarea"

export { Textarea }
