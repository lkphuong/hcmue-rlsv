/* eslint-disable no-unused-vars */
import React, { memo, useCallback, useEffect, useState } from 'react';

import { Box } from '@mui/material';

import { CPagination } from '_controls/';

import { MFilter, MTable } from '_modules/role/components';

const DEPARTMENTS = [
	{ id: 1, name: 'CNTT' },
	{ id: 2, name: 'Toán' },
	{ id: 3, name: 'Văn' },
	{ id: 4, name: 'Sử' },
];

const CLASSES = [
	{ id: 1, name: 'CNTT.A' },
	{ id: 2, name: 'CNTT.B' },
	{ id: 3, name: 'CNTT.C' },
	{ id: 4, name: 'CNTT.D' },
];

const DATA = [
	{
		id: 1,
		username: 'CamGiang',
		department: 'CNTT',
		class: 'CNTT1',
		role: {
			id: 0,
			name: 'Sinh viên',
		},
	},
	{
		id: 2,
		username: 'CamGiang',
		department: 'CNTT',
		class: 'CNTT1',
		role: {
			id: 0,
			name: 'Sinh viên',
		},
	},
	{
		id: 3,
		username: 'PhucDH',
		department: 'CNTT',
		class: 'CNTT1',
		role: {
			id: 3,
			name: 'Admin',
		},
	},
	{
		id: 4,
		username: 'PhuongLK',
		department: 'CNTT',
		class: 'CNTT1',
		role: {
			id: 2,
			name: 'Trưởng khoa',
		},
	},
	{
		id: 5,
		username: 'CamGiang',
		department: 'CNTT',
		class: 'CNTT1',
		role: {
			id: 0,
			name: 'Sinh viên',
		},
	},
	{
		id: 6,
		username: 'CamGiang',
		department: 'CNTT',
		class: 'CNTT1',
		role: {
			id: 0,
			name: 'Sinh viên',
		},
	},
];

const RolePage = memo(() => {
	//#region Data
	const [data, setData] = useState([]);

	const [filter, setFilter] = useState({
		department_id: 1,
		class_id: 1,
		input: '',
		page: 1,
		pages: 1,
	});
	//endregion

	//#region Event
	const getData = useCallback(async () => {
		try {
			// let _filter = { ...filter };
			// if (_filter.input === '') delete _filter.input;
			// const res = await getStatistic(_filter);
			// if (isSuccess(res)) setData(res.data);
			// else if (isEmpty(res)) setData([]);
		} catch (error) {
			throw error;
		}
	}, [filter]);

	const onChangeFilter = (value) => {
		setFilter({ ...value, page: 1, pages: 0 });
	};

	const onPageChange = (event, value) => {
		setFilter((prev) => ({ ...prev, page: value }));
	};

	//#endregion

	useEffect(() => {
		getData();
	}, [getData]);

	//#region Render
	return (
		<Box>
			<MFilter
				filter={filter}
				onChangeFilter={onChangeFilter}
				classes={CLASSES}
				departments={DEPARTMENTS}
			/>

			<MTable data={DATA} />

			<CPagination page={filter.page} pages={filter.pages} onChange={onPageChange} />
		</Box>
	);
	//#endregion
});

export default RolePage;
