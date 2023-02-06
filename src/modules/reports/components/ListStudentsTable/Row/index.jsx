import { memo, useMemo } from 'react';

import { TableCell, TableRow } from '@mui/material';

import { SHEET_STATUS } from '_constants/variables';

const Row = memo(({ data, index }) => {
	//#region Data
	const status = useMemo(
		() => SHEET_STATUS.find((e) => e.id.toString() === data?.status?.toString())?.name || null,
		[data?.status]
	);
	//#endregion

	//#region Event
	//#endregion

	//#region Render
	return (
		<TableRow>
			<TableCell align='center'>{index}</TableCell>
			<TableCell align='left'>{data?.user?.fullname}</TableCell>
			<TableCell align='center'>{data?.user?.std_code}</TableCell>
			<TableCell align='center'>{data?.sum_of_personal_marks}</TableCell>
			<TableCell align='center'>{data?.sum_of_class_marks}</TableCell>
			<TableCell align='center'>{data?.sum_of_adviser_marks}</TableCell>
			<TableCell align='center'>{data?.sum_of_department_marks}</TableCell>
			<TableCell align='center'>
				{!data?.level?.name && data?.status === 5 ? 'Không xếp loại' : data?.level?.name}
			</TableCell>
			<TableCell align='center'>{status}</TableCell>
		</TableRow>
	);
	//#endregion
});

Row.displayName = Row;

export default Row;
