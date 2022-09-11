const getStartOfWeek = (): Date => {
	let d = new Date();
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

export { getStartOfWeek, getStartOfMonth, getStartOfYear };
