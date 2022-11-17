import React, { useState } from 'react';

import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';

import { CPagination } from '_controls/';

import Row from './Row';

const ListSemester = () => {
	//#region Data
	const data = [
		{ id: 123, semester: 'Học kỳ 2', years: '2021-2022', total: 0, rating: 1, status: 1 },
		{ id: 223, semester: 'Học kỳ 2', years: '2021-2022', total: 75, rating: 2, status: 4 },
		{ id: 234, semester: 'Học kỳ 1', years: '2021-2022', total: 100, rating: 6, status: 3 },
		{ id: 6365, semester: 'Học kỳ 1', years: '2021-2022', total: 60, rating: 5, status: 4 },
		{ id: 473, semester: 'Học kỳ 2', years: '2021-2022', total: 47, rating: 2, status: 3 },
		{ id: 1225323, semester: 'Học kỳ 1', years: '2021-2022', total: 84, rating: 3, status: 2 },
		{ id: 2622, semester: 'Học kỳ 2', years: '2021-2022', total: 85, rating: 3, status: 2 },
	];

	const [params, setParams] = useState({ page: 1, pages: 10 });
	//#endregion

	//#region Event
	const handleChangePage = (e, v) => setParams({ ...params, page: v });
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
							data.map((row, index) => <Row key={row.id} index={index} data={row} />)}
					</TableBody>
				</Table>
			</TableContainer>

			<CPagination page={params.page} pages={params.pages} onChange={handleChangePage} />
		</Box>
	);
	//#endregion
};

export default ListSemester;
