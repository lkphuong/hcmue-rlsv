import { memo, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material';

import { CEditIcon } from '_others/';

import { SHEET_STATUS } from '_constants/variables';

const Row = memo(({ data, index }) => {
	//#region Data
	const navigate = useNavigate();

	const status = useMemo(
		() => SHEET_STATUS.find((e) => e.id.toString() === data?.status?.toString())?.name || null,
		[data?.status]
	);

	const total = useMemo(() => {
		const mark = {
			0: 0,
			5: 0,
			1: data?.sum_of_personal_marks ?? 0,
			2: data?.sum_of_class_marks ?? 0,
			3: data?.sum_of_adviser_marks ?? 0,
			4: data?.sum_of_department_marks ?? 0,
		};
		return mark[data?.status] || 0;
	}, [data]);
	//#endregion

	//#region Event
	const onClick = () => navigate(`/student/detail/${data?.id}`);
	//#endregion

	//#region Render
	return (
		<TableRow hover onClick={onClick} sx={{ cursor: 'pointer' }}>
			<TableCell align='center'>{index}</TableCell>
			<TableCell align='center'>{data.semester.display || data?.semester?.name}</TableCell>
			<TableCell align='center'>{data.academic.name}</TableCell>
			<TableCell align='center'>{total}</TableCell>
			<TableCell align='center'>{data?.level?.name ?? 'Không xếp loại'}</TableCell>
			<TableCell align='center'>{status}</TableCell>
			<TableCell align='center'>
				<Tooltip title='Chấm điểm'>
					<IconButton>
						<CEditIcon />
					</IconButton>
				</Tooltip>
			</TableCell>
		</TableRow>
	);
	//#endregion
});

Row.displayName = Row;

export default Row;
