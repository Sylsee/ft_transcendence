import { useCallback, useEffect } from "react";
import {
	EmitGameSocketEvent,
	GameDirection,
	GameSendEvent,
} from "types/game/game";

const TOUCH_START = "touchstart";
const TOUCH_MOVE = "touchmove";
const TOUCH_END = "touchend";

const useTouchControls = (
	countDown: number,
	emitGameSocketEvent: EmitGameSocketEvent
): void => {
	const handleTouch = useCallback(
		(direction: GameDirection): void => {
			if (countDown !== 0) return;
			emitGameSocketEvent(GameSendEvent.MovePaddle, { direction });
		},
		[countDown, emitGameSocketEvent]
	);

	useEffect(() => {
		let initialTouchY: number | null = null;
		let lastDirection: GameDirection = GameDirection.None;

		const handleTouchStart = (event: TouchEvent): void => {
			initialTouchY = event.touches[0].clientY;
		};

		const handleTouchMove = (event: TouchEvent): void => {
			if (initialTouchY === null) return;

			const currentTouchY = event.touches[0].clientY;
			if (currentTouchY < initialTouchY) {
				lastDirection = GameDirection.Up;
			} else if (currentTouchY > initialTouchY) {
				lastDirection = GameDirection.Down;
			}
			handleTouch(lastDirection);
			initialTouchY = currentTouchY;
		};

		const handleTouchEnd = (event: TouchEvent): void => {
			if (lastDirection !== GameDirection.None) {
				handleTouch(GameDirection.None);
			}
			initialTouchY = null;
			lastDirection = GameDirection.None;
		};

		window.addEventListener(TOUCH_START, handleTouchStart);
		window.addEventListener(TOUCH_MOVE, handleTouchMove);
		window.addEventListener(TOUCH_END, handleTouchEnd);

		return () => {
			window.removeEventListener(TOUCH_START, handleTouchStart);
			window.removeEventListener(TOUCH_MOVE, handleTouchMove);
			window.removeEventListener(TOUCH_END, handleTouchEnd);
		};
	}, [countDown, handleTouch]);
};

export default useTouchControls;
