import { TableCell, Typography } from '@mui/material';

const TypeSelect = ({ initialMark, currentMark, options, required, available, titleId, id }) => {
	//#region Data
	//#endregion

	//#region Event
	//#endregion

	//#region Render
	return (
		<>
			<TableCell />
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

export default TypeSelect;
