import React, { memo, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material';

import { STATUS } from '_constants/variables';
import { ROUTES } from '_constants/routes';
import { HistoryEdu } from '@mui/icons-material';

const Row = memo(({ classId, data, index }) => {
	//#region Data
	const navigate = useNavigate();

	const status = useMemo(
		() => STATUS.find((e) => e.value.toString() === (data?.status).toString())?.name || null,
		[data?.status]
	);
	//#endregion

	//#region Event
	const onEdit = () => navigate(`${ROUTES.LIST}/${classId}/${data?.id}`);
	//#endregion

	//#region Render
	return (
		<TableRow hover>
			<TableCell align='center'>{index + 1}</TableCell>
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
