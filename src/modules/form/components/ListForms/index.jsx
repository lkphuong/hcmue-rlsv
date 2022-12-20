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

const ListSemester = ({ data, refetch, saveFilter }) => {
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
							<TableCell align='center'>Niên khóa</TableCell>
							<TableCell align='center'>Ngày tạo</TableCell>
							<TableCell align='center'>Trạng thái phiếu</TableCell>
							<TableCell />
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.length > 0 &&
							data.map((row, index) => (
								<Row
									key={row.id}
									index={index}
									data={row}
									refetch={refetch}
									saveFilter={saveFilter}
								/>
							))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
	//#endregion
};

export default ListSemester;
