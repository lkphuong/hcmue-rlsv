import { TableCell, Typography } from '@mui/material';

const TypeCheckbox = ({ mark, unit, initialMark, currentMark, available, titleId, id }) => {
	//#region Data
	//#endregion

	//#region Event
	//#endregion

	//#region Render
	return (
		<>
			<TableCell align='center'>
				<Typography component='span' whiteSpace='nowrap' fontWeight={500}>
					&nbsp;&#40;{`${mark} ${unit}`}
					&#41;&nbsp;
				</Typography>
			</TableCell>

			<TableCell align='center'>
				<Typography>{currentMark.personal_mark_level} </Typography>
			</TableCell>
			<TableCell align='center'>
				<Typography>{currentMark.class_mark_level}</Typography>
			</TableCell>
			<TableCell align='center'>
				<Typography>{currentMark.adviser_mark_level}</Typography>
			</TableCell>
			<TableCell align='center'>
				<Typography>{currentMark.department_mark_level} </Typography>
			</TableCell>
		</>
	);
	//#endregion
};

export default TypeCheckbox;
