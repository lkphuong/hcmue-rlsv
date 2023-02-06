import { useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { Checkbox, IconButton, TableCell, TableRow, Tooltip } from '@mui/material';

import { SHEET_STATUS } from '_constants/variables';

import { CEditIcon, CViewIcon } from '_others/';

export const Row = ({ data, index, isSelected, isRemoved, onSelect, isHistory, isReport }) => {
	//#region Data
	const navigate = useNavigate();

	const status = useMemo(
		() => SHEET_STATUS.find((e) => e.id.toString() === data?.status?.toString())?.name || null,
		[data?.status]
	);
	//#endregion

	//#region Event
	const onClick = () => navigate(`detail/${data.id}`);

	const handleSelect = (e) => {
		e.stopPropagation();

		return onSelect(e, isRemoved ? true : !isSelected);
	};
	//#endregion

	//#region Render
	return (
		<TableRow onClick={handleSelect} selected={isRemoved ? false : isSelected}>
			{!(isHistory || isReport) && (
				<TableCell width={50} align='center'>
					<Checkbox checked={isRemoved ? false : isSelected} onClick={handleSelect} />
				</TableCell>
			)}
			<TableCell align='center'>{index}</TableCell>
			<TableCell align='center'>{data?.user?.fullname}</TableCell>
			<TableCell align='center'>{data?.user?.std_code}</TableCell>
			<TableCell align='center'>{data?.sum_of_personal_marks}</TableCell>
			<TableCell align='center'>{data?.sum_of_class_marks}</TableCell>
			<TableCell align='center'>{data?.sum_of_adviser_marks}</TableCell>
			<TableCell align='center'>{data?.sum_of_department_marks}</TableCell>
			<TableCell align='center'>
				{!data?.level?.name && data?.status === 5 ? 'Không xếp loại' : data?.level?.name}
			</TableCell>
			<TableCell align='center'>{status}</TableCell>
			{!isReport && (
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
			)}
		</TableRow>
	);
	//#endregion
};
