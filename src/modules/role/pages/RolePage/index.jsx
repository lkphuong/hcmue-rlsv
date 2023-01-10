import { createContext, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { Box, Stack } from '@mui/material';

import { CPagination } from '_controls/';

import { MFilter, MTable } from '_modules/role/components';

import { getClassesByDepartment } from '_api/classes.api';
import { getStudentsRole } from '_api/user.api';

import { isSuccess, isEmpty } from '_func/';

export const ConfigRoleContext = createContext();

const RolePage = memo(() => {
	//#region Data
	const departments = useSelector((state) => state.options.departments, shallowEqual);
	const academic_years = useSelector((state) => state.options.academic_years, shallowEqual);
	const [isLoading, setIsLoading] = useState(false);

	const [data, setData] = useState();

	const [classes, setClasses] = useState([]);

	const [filter, setFilter] = useState({
		department_id: null,
		academic_id: academic_years[0].id,
		class_id: null,
		input: '',
		page: 1,
		pages: 0,
	});

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });

	const dataTable = useMemo(() => data?.data || [], [data]);
	//endregion

	//#region Event
	const getData = useCallback(async () => {
		setIsLoading(true);

		try {
			let _filter = { ...filter };

			if (_filter.input === '') delete _filter.input;

			const res = await getStudentsRole(_filter);

			if (isSuccess(res)) {
				setData(res.data);
			} else if (isEmpty(res)) setData(null);
		} catch (error) {
			throw error;
		} finally {
			setIsLoading(false);
		}
	}, [filter]);

	const getClassData = async (department_id) => {
		const res = await getClassesByDepartment(department_id);

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
					departments={departments}
					academic_years={academic_years}
					classes={classes}
				/>

				<Stack direction='column' justifyContent='space-between'>
					<MTable data={dataTable} isLoading={isLoading} />

					<CPagination
						page={paginate.page}
						pages={paginate.pages}
						onChange={onPageChange}
						isLoading={isLoading}
						isGoTo
					/>
				</Stack>
			</ConfigRoleContext.Provider>
		</Box>
	);
	//#endregion
});

export default RolePage;
