import { TableCell, TableRow } from '@mui/material';

export const MRow = ({ data, index }) => {
	//#region Data
	//#endregion

	//#region Event
	//#endregion

	//#region Render
	return (
		<TableRow>
			<TableCell align='center'>{index + 1}</TableCell>
			<TableCell align='left'>{data?.fullname}</TableCell>
			<TableCell align='center'>{data?.phone_number}</TableCell>
			<TableCell align='left'>{data?.email}</TableCell>
			<TableCell align='center'>{data?.degree}</TableCell>
			<TableCell align='left'>{data?.department}</TableCell>
			<TableCell align='center'>{data?.class}</TableCell>
		</TableRow>
	);
	//#endregion
};
