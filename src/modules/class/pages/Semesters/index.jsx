import React, { useState } from 'react';

import { Box, Typography } from '@mui/material';

import { Filter, ListSemester } from '_modules/class/components';

import { CPagination } from '_controls/';

const SemestersPage = () => {
	//#region Data
	const data = [
		{
			id: 123,
			fullname: 'Đặng Hoàng Phúc',
			code: '41.01.104.094',
			total: 0,
			rating: 1,
			status: 1,
		},
		{
			id: 223,
			fullname: 'Đặng Hoàng Phúc',
			code: '41.01.104.094',
			total: 75,
			rating: 2,
			status: 4,
		},
		{
			id: 234,
			fullname: 'Đặng Hoàng Phúc',
			code: '41.01.104.094',
			total: 100,
			rating: 6,
			status: 3,
		},
		{
			id: 6365,
			fullname: 'Đặng Hoàng Phúc',
			code: '41.01.104.094',
			total: 60,
			rating: 5,
			status: 4,
		},
		{
			id: 473,
			fullname: 'Đặng Hoàng Phúc',
			code: '41.01.104.094',
			total: 47,
			rating: 2,
			status: 3,
		},
		{
			id: 1225323,
			fullname: 'Đặng Hoàng Phúc',
			code: '41.01.104.094',
			total: 84,
			rating: 3,
			status: 2,
		},
		{
			id: 2622,
			fullname: 'Đặng Hoàng Phúc',
			code: '41.01.104.094',
			total: 85,
			rating: 3,
			status: 2,
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
				Danh sách điểm rèn luyện của lớp
			</Typography>

			<Box mt={1}>
				<Filter />

				<ListSemester data={data} />

				<CPagination page={params.page} pages={params.pages} onChange={handleChangePage} />
			</Box>
		</Box>
	);
	//#endregion
};

export default SemestersPage;
