import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { Row } from './Row';

export const ListSheets = ({ data }) => {
	//#region Data
	//#endregion

	//#region Event
	//#endregion

	//#region Render
	return (
		<TableContainer sx={{ maxHeight: 500 }}>
			<Table stickyHeader>
				<TableHead>
					<TableRow>
						<TableCell align='center'>STT</TableCell>
						<TableCell align='left'>Họ và tên</TableCell>
						<TableCell align='center'>MSSV</TableCell>
						<TableCell align='center'>Điểm SV chấm</TableCell>
						<TableCell align='center'>Điểm lớp chấm</TableCell>
						<TableCell align='center'>Điểm CVHT chấm</TableCell>
						<TableCell align='center'>Điểm khoa chấm</TableCell>
						<TableCell align='center'>Xếp loại</TableCell>
						<TableCell align='center'>Trạng thái</TableCell>
						<TableCell />
					</TableRow>
				</TableHead>
				<TableBody>
					{data?.length > 0 &&
						data.map((row, index) => (
							<Row key={row?.id} data={row} index={index + 1} />
						))}
				</TableBody>
			</Table>
		</TableContainer>
	);
	//#endregion
};
