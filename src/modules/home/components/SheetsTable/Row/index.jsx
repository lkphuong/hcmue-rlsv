import { memo, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material';

import { CEditIcon } from '_others/';

import { SHEET_STATUS } from '_constants/variables';
import { shallowEqual, useSelector } from 'react-redux';

const Row = memo(({ data, index, saveFilter }) => {
	//#region Data
	const { username } = useSelector((state) => state.auth.profile, shallowEqual);

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
		<TableRow>
			<TableCell align='center'>{index + 1}</TableCell>
			<TableCell align='left'>{data.user.fullname}</TableCell>
			<TableCell align='center'>{data.user.std_code}</TableCell>
			<TableCell align='center'>{data.sum_of_personal_marks}</TableCell>
			<TableCell align='center'>{data.sum_of_class_marks}</TableCell>
			<TableCell align='center'>{data.sum_of_adviser_marks}</TableCell>
			<TableCell align='center'>{data.sum_of_department_marks}</TableCell>
			<TableCell align='center'>
				{!data?.level?.name && data?.status === 5 ? 'Không xếp loại' : data?.level?.name}
			</TableCell>
			<TableCell align='center'>{status}</TableCell>
			<TableCell align='center' height={53}>
				{username === data?.user?.std_code && (
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
