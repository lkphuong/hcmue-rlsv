import React, { createContext, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { Box } from '@mui/material';

import { CPagination } from '_controls/';

import { MFilter, MTable } from '_modules/role/components';

import { getStudentsRole } from '_api/roles.api';
import { getClasses } from '_api/classes.api';

import { isSuccess, isEmpty } from '_func/';

const DEPARTMENTS = [
	{ id: 1, name: 'CNTT' },
	{ id: 2, name: 'Toán' },
	{ id: 3, name: 'Văn' },
	{ id: 4, name: 'Sử' },
];

export const ConfigRoleContext = createContext();

const RolePage = memo(() => {
	//#region Data
	const [data, setData] = useState();

	const [classes, setClasses] = useState([]);

	const departments = useSelector((state) => state.options.departments, shallowEqual);
	const academic_years = useSelector((state) => state.options.academic_years, shallowEqual);

	const [filter, setFilter] = useState({
		department: '5c35a6785081842fda2067b5',
		academic_id: academic_years[0].id,
		classes: '5c662569957ddb191891289a',
		input: '',
		page: 1,
		pages: 0,
	});

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });

	const dataTable = useMemo(() => data?.data || [], [data]);
	//endregion

	//#region Event
	const getData = useCallback(async () => {
		try {
			let _filter = { ...filter };

			if (_filter.input === '') delete _filter.input;

			const res = await getStudentsRole(_filter);

			if (isSuccess(res)) {
				setData(res.data);
			} else if (isEmpty(res)) setData(null);
		} catch (error) {
			throw error;
		}
	}, [filter]);

	const getClassData = async (department_id, academic_year_id) => {
		const res = await getClasses({ department_id, academic_year_id });

		if (isSuccess(res)) setClasses(res.data);
		else if (isEmpty(res)) setClasses([]);
	};

	const onPageChange = (event, value) => {
		setFilter((prev) => ({ ...prev, page: value }));
	};

	//#endregion

	useEffect(() => {
		if (filter.department_id && filter.academic_id) {
			getClassData(filter.department_id, filter.academic_id);
		}
	}, [filter.department_id, filter.academic_id]);

	useEffect(() => {
		getData();
	}, [getData]);

	useEffect(() => {
		setPaginate({
			page: data?.page || 1,
			pages: data?.pages || 0,
		});
	}, [data]);

	//#region Render
	return (
		<Box>
			<ConfigRoleContext.Provider value={{ getData }}>
				<MFilter
					filter={filter}
					onChangeFilter={setFilter}
					departments={DEPARTMENTS}
					academic_years={academic_years}
					classes={classes}
				/>

				<MTable data={dataTable} />

				<CPagination page={paginate.page} pages={paginate.pages} onChange={onPageChange} />
			</ConfigRoleContext.Provider>
		</Box>
	);
	//#endregion
});

export default RolePage;
