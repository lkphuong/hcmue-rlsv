import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material';

import { SHEET_STATUS } from '_constants/variables';

import { CEditIcon, CViewIcon } from '_others/';

export const Row = ({ data, index, isHistory }) => {
	//#region Data
	const navigate = useNavigate();

	const onClick = () => navigate(`detail/${data.id}`);

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
			<TableCell align='center'>
				{data?.sum_of_personal_marks === null ? 'Chưa chấm' : data.sum_of_personal_marks}
			</TableCell>
			<TableCell align='center'>
				{data?.sum_of_class_marks === null ? 'Chưa chấm' : data.sum_of_class_marks}
			</TableCell>
			<TableCell align='center'>
				{data?.sum_of_adviser_marks === null ? 'Chưa chấm' : data.sum_of_adviser_marks}
			</TableCell>
			<TableCell align='center'>
				{data?.sum_of_department_marks === null
					? 'Chưa chấm'
					: data.sum_of_department_marks}
			</TableCell>
			<TableCell align='center'>{data?.level?.name ?? 'Không xếp loại'}</TableCell>
			<TableCell align='center'>{status}</TableCell>
			<TableCell align='center'>
				{isHistory || data?.status === 5 ? (
					<Tooltip title='Xem'>
						<IconButton onClick={onClick}>
							<CViewIcon />
						</IconButton>
					</Tooltip>
				) : (
					<Tooltip title='Điều chỉnh'>
						<IconButton onClick={onClick}>
							<CEditIcon />
						</IconButton>
					</Tooltip>
				)}
			</TableCell>
		</TableRow>
	);
	//#endregion
};
