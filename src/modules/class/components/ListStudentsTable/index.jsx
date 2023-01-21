import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';

import Row from './Row';

export const ListStudentsTable = ({ data, saveFilter }) => {
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
						<TableCell align='center'>Họ và tên</TableCell>
						<TableCell align='center'>Mã số sinh viên</TableCell>
						<TableCell align='center'>Điểm SV chấm</TableCell>
						<TableCell align='center'>Điểm lớp chấm</TableCell>
						<TableCell align='center'>Điểm CVHT chấm</TableCell>
						<TableCell align='center'>Điểm khoa chấm</TableCell>
						<TableCell align='center'>Xếp loại</TableCell>
						<TableCell align='center'>Trạng thái</TableCell>
						<TableCell width={50} />
					</TableRow>
				</TableHead>
				<TableBody>
					{data?.length > 0 ? (
						data.map((row, index) => (
							<Row key={row.id} index={index} data={row} saveFilter={saveFilter} />
						))
					) : (
						<TableRow>
							<TableCell colSpan='100%'>
								<Box
									minHeight={300}
									display='flex'
									justifyContent='center'
									alignItems='center'
								>
									Không có dữ liệu hiển thị
								</Box>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
	//#endregion
};
