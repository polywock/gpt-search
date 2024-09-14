export function setupBlurDetection(
	blurRef: React.RefObject<boolean>,
	appRef: React.RefObject<HTMLDivElement>,
	onBlur: () => void
): () => void {
	let isClickOutside = false;
	let isEscapePressed = false;

	function handleDocumentClick(event: MouseEvent): void {
		if (blurRef.current) return; // Exit if blur is already true

		if (appRef.current) {
			const rect = appRef.current.getBoundingClientRect();
			const { clientX, clientY } = event;

			// Check if the click is within the bounding box of appRef
			if (
				clientX >= rect.left &&
				clientX <= rect.right &&
				clientY >= rect.top &&
				clientY <= rect.bottom
			) {
				isClickOutside = false;
			} else {
				isClickOutside = true;
				checkConditions();
			}
		}
	}

	function handleKeyPress(event: KeyboardEvent): void {
		if (blurRef.current) return; // Exit if blur is already true

		if (event.key === "Escape") {
			isEscapePressed = true;
			checkConditions();
		} else {
			isEscapePressed = false;
		}
	}

	function checkConditions(): void {
		if (isClickOutside || isEscapePressed) {
			onBlur();
			resetConditions();
		}
	}

	function resetConditions(): void {
		isClickOutside = false;
		isEscapePressed = false;
	}

	// Attach event listeners
	document.addEventListener("click", handleDocumentClick, { capture: true });
	document.addEventListener("keydown", handleKeyPress, { capture: true });

	// Return a function to remove the listeners when necessary
	return function removeListeners(): void {
		document.removeEventListener("click", handleDocumentClick, {
			capture: true,
		});
		document.removeEventListener("keydown", handleKeyPress, {
			capture: true,
		});
	};
}
