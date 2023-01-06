import React from 'react';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { MRow } from './MRow';

export const MTable = ({ data, refetch }) => {
	//#region Data
	//#endregion

	//#region Event
	//#endregion

	//#region Render

	return (
		<TableContainer sx={{ maxHeight: '500px' }}>
			<Table stickyHeader>
				<TableHead>
					<TableRow>
						<TableCell align='center'>STT</TableCell>
						<TableCell align='center'>Học kỳ</TableCell>
						<TableCell align='center'>Thời gian bắt đầu</TableCell>
						<TableCell align='center'>Thời gian kết thúc</TableCell>
						<TableCell align='center'>Năm học</TableCell>
						<TableCell align='center'>Thao tác</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{data?.length > 0 &&
						data.map((row, index) => (
							<MRow key={row.id} data={row} index={index + 1} refetch={refetch} />
						))}
				</TableBody>
			</Table>
		</TableContainer>
	);
	//#endregion
};
