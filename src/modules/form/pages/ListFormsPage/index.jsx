import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import { Box, Button, Typography } from '@mui/material';

import { Filter, ListForms } from '_modules/form/components';

import { CPagination } from '_controls/';
import { ROUTES } from '_constants/routes';

const ListFormsPage = () => {
	//#region Data
	const data = [
		{
			id: 1,
			semester: {
				id: 1,
				name: 'II',
			},
			acedemic: {
				id: 1,
				name: '2021-2022',
			},
			created_date: '2022-01-01',
			created_by: 'Admin 1',
			status: 0,
		},
		{
			id: 2,
			semester: {
				id: 1,
				name: 'II',
			},
			acedemic: {
				id: 1,
				name: '2021-2022',
			},
			created_date: '2022-01-01',
			created_by: 'Admin 1',
			status: 0,
		},
		{
			id: 3,
			semester: {
				id: 1,
				name: 'II',
			},
			acedemic: {
				id: 1,
				name: '2021-2022',
			},
			created_date: '2022-01-01',
			created_by: 'Admin 1',
			status: 0,
		},
		{
			id: 4,
			semester: {
				id: 1,
				name: 'I',
			},
			acedemic: {
				id: 1,
				name: '2020-2021',
			},
			created_date: '2020-01-17',
			created_by: 'Admin 1',
			status: 1,
		},
	];

	const [params, setParams] = useState({ page: 1, pages: 10 });
	//#endregion

	//#region Event
	const handleChangePage = (e, v) => setParams({ ...params, page: v });
	//#endregion

	//#region Render
	return (
		<Box>
			<Typography
				borderRadius={2}
				p={2}
				fontWeight={500}
				fontSize={18}
				sx={{ backgroundColor: 'rgba(0 0 0 / 5%)' }}
			>
				Lịch sử Phiếu đánh giá kết quả rèn luyện
			</Typography>

			<Box mt={1}>
				<Filter />

				<Box textAlign='right' my={2}>
					<Link to={ROUTES.FORM_CREATE}>
						<Button variant='contained'>Thêm mới</Button>
					</Link>
				</Box>

				<ListForms data={data} />

				<CPagination page={params.page} pages={params.pages} onChange={handleChangePage} />
			</Box>
		</Box>
	);
	//#endregion
};

export default ListFormsPage;
