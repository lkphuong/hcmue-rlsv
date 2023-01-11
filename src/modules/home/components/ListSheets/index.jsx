import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import Row from './Row';

export const ListSheets = ({ data }) => {
	//#region Data

	//#endregion

	//#region Event
	//#endregion

	//#region Render
	return (
		<TableContainer className='c-table'>
			<Table stickyHeader>
				<TableHead>
					<TableRow>
						<TableCell align='center'>STT</TableCell>
						<TableCell align='center'>Học kỳ</TableCell>
						<TableCell align='center'>Năm học</TableCell>
						<TableCell align='center'>Tổng điểm</TableCell>
						<TableCell align='center'>Xếp loại</TableCell>
						<TableCell align='center'>Trạng thái</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data?.length > 0 &&
						data.map((row, index) => (
							<Row key={row.id + index} index={index + 1} data={row} />
						))}
				</TableBody>
			</Table>
		</TableContainer>
	);
	//#endregion
};
