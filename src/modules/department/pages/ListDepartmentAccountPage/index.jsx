import { useEffect, useMemo, useState } from 'react';

import { Box, Button, Stack } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';

import { CPagination } from '_controls/';

import { isSuccess } from '_func/';

import { Filter, ListDepartmentAccounts, Search } from '_modules/department/components';

const FAKE_DATA = [
	{
		id: 1,
		department: { id: 136, name: 'Khoa Công nghệ Thông tin' },
		username: 'Nmb@sps.hcm.edu.vn',
		password: 'Nmb@sps.hcm.edu.vn',
	},
	{
		id: 2,
		department: { id: '137', name: 'Khoa Hóa học' },
		username: 'Nmb@sps.hcm.edu.vn',
		password: 'Nmb@sps.hcm.edu.vn',
	},
	{
		id: 3,
		department: { id: '151', name: 'Khoa Giáo dục Mầm non' },
		username: 'Nmb@sps.hcm.edu.vn',
		password: 'Nmb@sps.hcm.edu.vn',
	},
	{
		id: 4,
		department: { id: 135, name: 'Khoa Vật lý' },
		username: 'Nmb@sps.hcm.edu.vn',
		password: 'Nmb@sps.hcm.edu.vn',
	},
	{
		id: 5,
		department: { id: 135, name: 'Khoa Vật lý' },
		username: 'Nmb@sps.hcm.edu.vn',
		password: 'Nmb@sps.hcm.edu.vn',
	},
	{
		id: 6,
		department: { id: 136, name: 'Khoa Công nghệ Thông tin' },
		username: 'Nmb@sps.hcm.edu.vn',
		password: 'Nmb@sps.hcm.edu.vn',
	},
	{
		id: 7,
		department: { id: 136, name: 'Khoa Công nghệ Thông tin' },
		username: 'Nmb@sps.hcm.edu.vn',
		password: 'Nmb@sps.hcm.edu.vn',
	},
	{
		id: 8,
		department: { id: 135, name: 'Khoa Vật lý' },
		username: 'Nmb@sps.hcm.edu.vn',
		password: 'Nmb@sps.hcm.edu.vn',
	},
	{
		id: 9,
		department: { id: 136, name: 'Khoa Công nghệ Thông tin' },
		username: 'Nmb@sps.hcm.edu.vn',
		password: 'Nmb@sps.hcm.edu.vn',
	},
	{
		id: 10,
		department: { id: 135, name: 'Khoa Vật lý' },
		username: 'Nmb@sps.hcm.edu.vn',
		password: 'Nmb@sps.hcm.edu.vn',
	},
];

const ListDepartmentAccountPage = () => {
	//#region Data
	const [filter, setFilter] = useState({
		page: 1,
		pages: 0,
		input: '',
		department_id: 0,
	});

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });

	const [data, setData] = useState();

	const listData = useMemo(() => data?.data || [], [data]);
	//#endregion

	//#region Event
	const getData = async () => {
		//call api

		const res = { status: 200, data: { data: FAKE_DATA, page: 1, pages: 1 } };

		if (isSuccess(res)) {
			setData(res?.data);
		}
	};

	const onPageChange = (event, newPage) => setFilter((prev) => ({ ...prev, page: newPage }));
	//#endregion

	useEffect(() => {
		getData();
	}, [filter]);

	useEffect(() => {
		setPaginate({
			page: data?.page || 1,
			pages: data?.pages || 0,
		});
	}, [data]);

	//#region Render
	return (
		<Box>
			<Filter />

			<Stack
				direction={{ xs: 'column', md: 'row' }}
				spacing={1.5}
				justifyContent='space-between'
				alignItems='center'
			>
				<Search />

				<Button variant='contained' endIcon={<AddCircleOutline />}>
					Thêm mới
				</Button>
			</Stack>

			<ListDepartmentAccounts data={listData} refetch={getData} />

			<CPagination page={paginate.page} pages={paginate.pages} onChange={onPageChange} />
		</Box>
	);
	//#endregion
};

export default ListDepartmentAccountPage;
