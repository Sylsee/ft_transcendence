import { useCallback, useEffect } from "react";
import {
	EmitGameSocketEvent,
	GameDirection,
	GameSendEvent,
} from "types/game/game";

const KEY_DOWN = "keydown";
const KEY_UP = "keyup";

const useKeyboardControls = (
	countDown: number,
	emitGameSocketEvent: EmitGameSocketEvent
) => {
	const handlePressKey = useCallback(
		(direction: GameDirection): void => {
			if (countDown !== 0) return;
			emitGameSocketEvent(GameSendEvent.MovePaddle, { direction });
		},
		[countDown, emitGameSocketEvent]
	);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			switch (event.key) {
				case "ArrowUp":
					handlePressKey(GameDirection.Up);
					break;
				case "ArrowDown":
					handlePressKey(GameDirection.Down);
					break;
				default:
					break;
			}
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			switch (event.key) {
				case "ArrowUp":
				case "ArrowDown":
					handlePressKey(GameDirection.None);
					break;
				default:
					break;
			}
		};

		document.addEventListener(KEY_DOWN, handleKeyDown);
		document.addEventListener(KEY_UP, handleKeyUp);

		return () => {
			document.removeEventListener(KEY_DOWN, handleKeyDown);
			document.removeEventListener(KEY_UP, handleKeyUp);
		};
	}, [countDown, handlePressKey]);
};

export default useKeyboardControls;
