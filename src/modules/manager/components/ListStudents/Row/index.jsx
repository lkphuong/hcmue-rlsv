import React, { memo, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material';
import { HistoryEdu } from '@mui/icons-material';

import { STATUS } from '_constants/variables';
import { ROUTES } from '_constants/routes';

const Row = memo(({ page, data, index, saveFilter }) => {
	//#region Data
	const navigate = useNavigate();

	const status = useMemo(
		() => STATUS.find((e) => e.value.toString() === (data?.status).toString())?.name || null,
		[data?.status]
	);
	//#endregion

	//#region Event
	const onEdit = () => {
		saveFilter();
		navigate(`${ROUTES.ADMIN_SHEET}/${data?.id}`);
	};
	//#endregion

	//#region Render
	return (
		<TableRow hover>
			<TableCell align='center'>{(page - 1) * 10 + (index + 1)}</TableCell>
			<TableCell align='center'>{data.user.fullname}</TableCell>
			<TableCell align='center'>{data.user.std_code}</TableCell>
			<TableCell align='center'>{data.sum_of_personal_marks}</TableCell>
			<TableCell align='center'>{data.sum_of_class_marks}</TableCell>
			<TableCell align='center'>{data.sum_of_department_marks}</TableCell>
			<TableCell align='center'>{data?.level?.name}</TableCell>
			<TableCell align='center'>{status}</TableCell>
			<TableCell>
				<Tooltip title='Chấm điểm'>
					<IconButton onClick={onEdit}>
						<HistoryEdu />
					</IconButton>
				</Tooltip>
			</TableCell>
		</TableRow>
	);
	//#endregion
});

Row.displayName = Row;

export default Row;
