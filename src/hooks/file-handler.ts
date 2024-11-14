import React from "react"

/**
 * @description Custom hook to handle file input
 * @param onValueChange function to be called when the value changes
 * @returns { handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void, handleClick: () => void, inputRef: React.RefObject<HTMLInputElement> }
 * @example
 * const { handleFileChange, handleClick, inputRef } = useFileHandler((files) => {
 *  console.log(files)
 * })
 */
export const useFileHandler = (onValueChange: (files: File[]) => void) => {
	const inputRef = React.useRef<HTMLInputElement>(null)

	const handleClick = () => {
		if (inputRef.current) {
			inputRef.current.click()
		}
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return
		const files = Array.from(e.target.files)
		onValueChange(files)
	}

	return { handleFileChange, handleClick, inputRef }
}
