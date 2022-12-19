import React from 'react';

import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';

import Row from './Row';

export const ListStudents = ({ data, page }) => {
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
							<TableCell align='center'>Họ và tên</TableCell>
							<TableCell align='center'>Mã số sinh viên</TableCell>
							<TableCell align='center'>Điểm SV chấm</TableCell>
							<TableCell align='center'>Điểm lớp chấm</TableCell>
							<TableCell align='center'>Điểm khoa chấm</TableCell>
							<TableCell align='center'>Xếp loại</TableCell>
							<TableCell align='center'>Trạng thái</TableCell>
							<TableCell width={50} />
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.length > 0 ? (
							data.map((row, index) => (
								<Row key={row.id} index={index} data={row} page={page} />
							))
						) : (
							<TableRow>
								<TableCell colSpan='100%' align='center' sx={{ py: 15 }}>
									<Typography fontSize={20}>Không có dữ liệu hiển thị</Typography>
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
