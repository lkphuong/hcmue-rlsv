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

export const ListSemester = ({ data }) => {
	//#region Data

	//#endregion

	//#region Event
	//#endregion

	//#region Render
	return (
		<Box>
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
							<TableCell width={50} />
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.length > 0 ? (
							data.map((row, index) => (
								<Row key={row.id + index} index={index} data={row} />
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
		</Box>
	);
	//#endregion
};
