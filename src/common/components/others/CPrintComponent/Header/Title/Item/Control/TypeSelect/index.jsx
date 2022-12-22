import { TableCell, Typography } from '@mui/material';

const TypeSelect = ({ currentMark }) => {
	//#region Data
	//#endregion

	//#region Event
	//#endregion

	//#region Render
	return (
		<>
			<TableCell />
			<TableCell align='center'>
				<Typography>{currentMark.personal_mark_level || 0}</Typography>
			</TableCell>
			<TableCell align='center'>
				<Typography>{currentMark.class_mark_level || 0}</Typography>
			</TableCell>
			<TableCell align='center'>
				<Typography>{currentMark.department_mark_level || 0}</Typography>
			</TableCell>
		</>
	);
	//#endregion
};

export default TypeSelect;
