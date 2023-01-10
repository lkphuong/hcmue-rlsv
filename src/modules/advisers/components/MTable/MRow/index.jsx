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
			<TableCell align='left'>{data?.name}</TableCell>
			<TableCell align='center'>{data?.std_code}</TableCell>
			<TableCell align='center'>{data?.birthday}</TableCell>
			<TableCell align='center'>{data?.phone}</TableCell>
			<TableCell align='center'>{data?.email}</TableCell>
			<TableCell align='center'>{data?.hocvi}</TableCell>
			<TableCell align='center'>{data?.class}</TableCell>
		</TableRow>
	);
	//#endregion
};
