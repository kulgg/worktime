import { getClockFromMilliseconds } from "./timespan";

export function copyWorkTimeToClipboard(ms: number) {
	const clockString = getClockFromMilliseconds(ms);
	const hourMinutes = clockString.slice(0, clockString.length - 3);
	navigator.clipboard.writeText(hourMinutes.replace(/^0{1}/, ""));
}
