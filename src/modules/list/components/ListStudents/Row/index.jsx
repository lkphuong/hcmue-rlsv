import React, { memo, useCallback, useContext, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { Checkbox, IconButton, TableCell, TableRow, Tooltip } from '@mui/material';
import { HistoryEdu } from '@mui/icons-material';

import { STATUS } from '_constants/variables';
import { ROUTES } from '_constants/routes';

import { NameContext } from '_modules/list/pages/StudentListPage';

const Row = memo(({ classId, data, index, isSelected, onSelect, saveFilter }) => {
	//#region Data
	const navigate = useNavigate();

	const { class_name } = useContext(NameContext);

	const status = useMemo(
		() => STATUS.find((e) => e.value.toString() === (data?.status).toString())?.name || null,
		[data?.status]
	);
	//#endregion

	//#region Event
	const onEdit = (e) => {
		e.stopPropagation();

		saveFilter();

		navigate(`${ROUTES.LIST}/${classId}/${data?.id}/${class_name}`);
	};

	const handleSelect = useCallback(
		(e) => {
			e.stopPropagation();

			return onSelect(e, !isSelected);
		},

		[onSelect]
	);
	//#endregion

	//#region Render
	return (
		<TableRow
			hover
			onClick={data?.status === 3 ? handleSelect : undefined}
			selected={isSelected && data?.status === 3}
		>
			<TableCell width={50} align='center'>
				{data?.status === 3 && (
					<Checkbox
						checked={isSelected}
						onChange={handleSelect}
						onClick={(e) => e.preventDefault()}
					/>
				)}
			</TableCell>
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
