import { TableCell, Typography } from '@mui/material';

const TypeInput = ({
	available,
	category,
	currentMark,
	id,
	initialMark,
	mark,
	max,
	min,
	titleId,
	unit,
}) => {
	//#region Data
	//#endregion

	//#region Event
	//#endregion

	//#region Render
	return (
		<>
			<TableCell align='center'>
				<Typography component='span' whiteSpace='nowrap' fontWeight={500}>
					&nbsp;&#40;{category === 1 ? `Từ ${min} đến ${max} ${unit}` : `${mark} ${unit}`}
					&#41;&nbsp;
				</Typography>
			</TableCell>

			<TableCell align='center' sx={{ '& .MuiTypography-root': { fontSize: '1rem' } }}>
				<Typography>{currentMark.personal_mark_level}</Typography>
			</TableCell>
			<TableCell align='center' sx={{ '& .MuiTypography-root': { fontSize: '1rem' } }}>
				<Typography>{currentMark.class_mark_level}</Typography>
			</TableCell>
			<TableCell align='center' sx={{ '& .MuiTypography-root': { fontSize: '1rem' } }}>
				<Typography>{currentMark.adviser_mark_level}</Typography>
			</TableCell>
			<TableCell align='center'>
				<Typography>{currentMark.department_mark_level}</Typography>
			</TableCell>
		</>
	);
	//#endregion
};

export default TypeInput;
