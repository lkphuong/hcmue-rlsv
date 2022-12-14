export function isSuccess(response) {
	return response?.status?.toString()[0] === '2';
}

// *Accept value 0
export function isFalsy(value) {
	return value === undefined || value === null || isNaN(value);
}

export function isEmpty(response) {
	return response?.status?.toString() === '404' && response?.errorCode?.toString() === '4008';
}

export const getCurrentState = (state) => {
	try {
		return JSON.parse(JSON.stringify(state));
	} catch (error) {
		return null;
	}
};

export function isEmptyObject(obj) {
	return obj && !Object.keys(obj).length && Object.getPrototypeOf(obj) === Object.prototype;
}

export const updateObjInArr = (obj, arr) => {
	if (!arr.length) {
		const newArr = [obj];
		return newArr;
	}
	const index = arr.findIndex((e) => e.item_id.toString() === obj.item_id.toString());

	const newArr = [...arr];
	if (index < 0) {
		newArr.push(obj);
		return newArr;
	} else {
		newArr[index] = { ...newArr[index], ...obj };
		return newArr;
	}
};

export const updateHeaderIdInArr = (header_id, item_id, arr) => {
	const newArr = [...arr];

	for (let i of newArr) {
		if (i.item_id === item_id) {
			i.header_id = header_id;
			break;
		}
	}

	return newArr;
};

//Func convert số thường --> số La mã
export const intToRoman = (num) => {
	const roman = {
		M: 1000,
		CM: 900,
		D: 500,
		CD: 400,
		C: 100,
		XC: 90,
		L: 50,
		XL: 40,
		X: 10,
		IX: 9,
		V: 5,
		IV: 4,
		I: 1,
	};
	let str = '';

	for (let i of Object.keys(roman)) {
		const q = Math.floor(num / roman[i]);
		num -= q * roman[i];
		str += i.repeat(q);
	}

	return str;
};

//Phân trang cho array object, chunk: limit
// Trả về object {data,pages}
export const splitIntoChunk = (arr = [], chunk = 10) => {
	const newArr = [...arr];

	const data = {};
	const pages = Math.ceil(arr.length / chunk);

	let index = 1;
	while (newArr.length > 0) {
		let tempArray;
		tempArray = newArr.splice(0, chunk);
		data[index] = tempArray;
		index += 1;
	}

	return { data, pages };
};
