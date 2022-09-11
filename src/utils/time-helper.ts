const getHoursFromMilliseconds = (x: number): number => {
	return x / 1000 / 60 / 60;
};

const getHoursClockFromMilliseconds = (x: number): string => {
	let hoursDecimal = getHoursFromMilliseconds(x);
	hoursDecimal = Math.floor(hoursDecimal) + ((hoursDecimal % 1) / 100) * 60;
	return hoursDecimal.toFixed(2).replace(".", ":");
};

export { getHoursFromMilliseconds, getHoursClockFromMilliseconds };
