const getStartOfWeek = (): Date => {
	const d = new Date();
	d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
	d.setHours(0, 0);
	return d;
};

const getStartOfMonth = (): Date => {
	const now = new Date();
	const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
	firstDay.setHours(0, 0);
	return firstDay;
};

const getStartOfYear = (): Date => {
	const now = new Date();
	const firstDay = new Date(now.getFullYear(), 0, 1);
	firstDay.setHours(0, 0);
	return firstDay;
};

const getStartOfDay = (date: Date): Date => {
	const a = new Date(date);
	a.setHours(0, 0, 0, 0);
	return a;
};

const getEndOfDay = (date: Date): Date => {
	const a = new Date(date);
	a.setHours(23, 59, 59, 999);
	return a;
};

const datesAreOnSameDay = (first: Date, second: Date): boolean =>
	first.getFullYear() === second.getFullYear() &&
	first.getMonth() === second.getMonth() &&
	first.getDate() === second.getDate();

export {
	getStartOfWeek,
	getStartOfMonth,
	getStartOfYear,
	getStartOfDay,
	getEndOfDay,
	datesAreOnSameDay,
};
