export function isSuccess(response) {
	return response?.status?.toString()[0] === '2';
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
		newArr[index] = obj;
		return newArr;
	}
};
