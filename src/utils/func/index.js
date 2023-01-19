import { FILE_NAME_REGEX } from '_constants/variables';
import { alert } from './alert';

export function isSuccess(response) {
	return response?.status?.toString()[0] === '2';
}

// *Accept value 0
export function isFalsy(value) {
	return value === undefined || value === null || isNaN(value);
}

export function isEmpty(response) {
	return (
		response?.status?.toString() === '404' &&
		(response?.errorCode?.toString() === '4008' || response?.errorCode?.toString() === '4007')
	);
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

//Format file name
export function formatFileName(fileName) {
	fileName = fileName.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
	fileName = fileName.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
	fileName = fileName.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
	fileName = fileName.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
	fileName = fileName.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
	fileName = fileName.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
	fileName = fileName.replace(/đ/g, 'd');
	fileName = fileName.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
	fileName = fileName.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
	fileName = fileName.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
	fileName = fileName.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
	fileName = fileName.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
	fileName = fileName.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
	fileName = fileName.replace(/Đ/g, 'D');
	// Some system encode vietnamese combining accent as individual utf-8 characters
	// Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
	fileName = fileName.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
	fileName = fileName.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
	// Remove extra spaces
	fileName = fileName.trim();
	// Thay các khoảng trắng thành dấu gạch nối
	fileName = fileName.replace(/ /g, '-');
	return fileName;
}

//Return new Obj (No falsy value)
export const cleanObjValue = (obj) => {
	if (!obj) return {};

	let newObj = { ...obj };

	Object.keys(newObj).forEach((k) => {
		if (newObj[k]?.toString() === 'NaN') delete newObj[k];
		else
			(newObj[k] === null || newObj[k] === undefined || newObj[k] === '') && delete newObj[k];
	});

	return newObj;
};

// 10Mb = 10485760 byte
export const checkValidFile = (file) => {
	const { name, size } = file;

	if (size > 10485760) {
		alert.fail({ text: 'Dung lượng file tối đa là 10Mb.' });

		return false;
	}

	const pureName = name.slice(0, name.lastIndexOf('.'));

	if (!pureName.match(FILE_NAME_REGEX)) {
		alert.fail({ text: 'Tên file chứa ký tự không hợp lệ.' });

		return false;
	}

	return true;
};
