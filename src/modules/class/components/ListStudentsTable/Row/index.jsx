import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material';

import { SHEET_STATUS } from '_constants/variables';

import { CEditIcon, CViewIcon } from '_others/';

const Row = memo(({ data, index, saveFilter, isHistory }) => {
	//#region Data
	const navigate = useNavigate();

	const status = useMemo(
		() => SHEET_STATUS.find((e) => e.id.toString() === data?.status?.toString())?.name || null,
		[data?.status]
	);
	//#endregion

	//#region Event
	const onClick = () => {
		saveFilter();
		navigate(`detail/${data?.id}`);
	};
	//#endregion

	//#region Render
	return (
		<TableRow hover>
			<TableCell align='center'>{index + 1}</TableCell>
			<TableCell align='center'>{data.user.fullname}</TableCell>
			<TableCell align='center'>{data.user.std_code}</TableCell>
			<TableCell align='center'>{data.sum_of_personal_marks}</TableCell>
			<TableCell align='center'>{data.sum_of_class_marks}</TableCell>
			<TableCell align='center'>{data.sum_of_adviser_marks}</TableCell>
			<TableCell align='center'>{data.sum_of_department_marks}</TableCell>
			<TableCell align='center'>
				{!data?.level?.name && data?.status === 5 ? 'Không xếp loại' : data?.level?.name}
			</TableCell>
			<TableCell align='center'>{status}</TableCell>
			<TableCell align='center'>
				{isHistory || data?.status === 5 ? (
					<Tooltip title='Xem'>
						<IconButton onClick={onClick}>
							<CViewIcon />
						</IconButton>
					</Tooltip>
				) : (
					<Tooltip title='Chấm điểm'>
						<IconButton onClick={onClick}>
							<CEditIcon />
						</IconButton>
					</Tooltip>
				)}
			</TableCell>
		</TableRow>
	);
	//#endregion
});

Row.displayName = Row;

export default Row;
