import React from 'react';

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

const ListSemester = ({ data }) => {
	//#region Data

	//#endregion

	//#region Event
	//#endregion

	//#region Render
	return (
		<Box>
			<TableContainer
				sx={{
					maxHeight: 600,
					boxShadow: '0 1px 5px 0px rgb(0 0 0 / 20%)',
					borderRadius: '10px',
				}}
			>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell align='center'>STT</TableCell>
							<TableCell align='center'>Học kỳ</TableCell>
							<TableCell align='center'>Niên khóa</TableCell>
							<TableCell align='center'>Tổng điểm</TableCell>
							<TableCell align='center'>Xếp loại</TableCell>
							<TableCell align='center'>Trạng thái</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.length > 0 &&
							data.map((row, index) => (
								<Row key={row.id + index} index={index} data={row} />
							))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
	//#endregion
};

export default ListSemester;
