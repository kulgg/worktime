const getHoursFromMilliseconds = (x: number): number => {
	return x / 1000 / 60 / 60;
};

const getHoursClockFromMilliseconds = (x: number): string => {
	return getHoursFromMilliseconds(x).toFixed(2).replace(".", ":");
};

export { getHoursFromMilliseconds, getHoursClockFromMilliseconds };
