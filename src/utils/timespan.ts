export const getMillisecondsDifference = (
	first: Date,
	second: Date
): number => {
	return first.getTime() - second.getTime();
};

export const getClockFromMilliseconds = (milliseconds: number): string => {
	let seconds = Math.floor((milliseconds / 1000) % 60),
		minutes = Math.floor((milliseconds / (1000 * 60)) % 60),
		hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

	return `${hours.toString().padStart(2, "0")}:${minutes
		.toString()
		.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export function getCurrentDate(): Date {
	const date = new Date();
	date.setSeconds(date.getSeconds() - 1);
	return date;
}
