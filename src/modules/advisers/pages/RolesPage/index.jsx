import { createContext, memo, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { Box, Stack } from '@mui/material';

import { CPagination } from '_controls/';

import { MRoleFilter, MRoleTable, MSearch } from '_modules/advisers/components';

import { getStudentsRole } from '_api/user.api';
import { getSemestersByYear } from '_api/options.api';

import { isSuccess, isEmpty, cleanObjValue } from '_func/';

export const ConfigRoleContext = createContext();

const RolesPage = memo(() => {
	//#region Data
	const departments = useSelector((state) => state.options.departments, shallowEqual);
	const academic_years = useSelector((state) => state.options.academic_years, shallowEqual);
	const { department_id, classes } = useSelector((state) => state.auth.profile, shallowEqual);

	const [data, setData] = useState();

	const [semesters, setSemesters] = useState([]);

	const [filter, setFilter] = useState({
		academic_id: academic_years[0].id,
		semester_id: null,
		department_id,
		class_id: classes[0]?.id || null,
		input: '',
		page: 1,
		pages: 0,
	});

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });

	const dataTable = useMemo(() => data?.data || [], [data]);
	//endregion

	//#region Event
	const getData = async () => {
		if (!filter?.academic_id || !filter?.semester_id) return;

		const _filter = cleanObjValue(filter);

		const res = await getStudentsRole(_filter);

		if (isSuccess(res)) {
			setData(res.data);
		} else if (isEmpty(res)) setData(null);
	};

	const onPageChange = (event, newPage) => setFilter((prev) => ({ ...prev, page: newPage }));

	const getSemesters = async () => {
		const res = await getSemestersByYear(filter.academic_id);

		if (isSuccess(res)) setSemesters(res.data);
		else if (isEmpty(res)) setSemesters([]);
	};
	//#endregion

	//#region Cycle
	useEffect(() => {
		if (filter.academic_id) getSemesters();
	}, [filter.academic_id]);

	useEffect(() => {
		getData();
	}, [filter]);

	useEffect(() => {
		if (semesters?.length)
			setFilter((prev) => ({ ...prev, semester_id: Number(semesters[0]?.id) }));
	}, [semesters]);

	useEffect(() => {
		setPaginate({
			page: data?.page || 1,
			pages: data?.pages || 0,
		});
	}, [data]);
	//#endregion

	//#region Render
	return (
		<Box>
			<ConfigRoleContext.Provider value={{ getData }}>
				<MRoleFilter
					filter={filter}
					onFilterChange={setFilter}
					departments={departments}
					academic_years={academic_years}
					semesters={semesters || []}
					classes={classes}
				/>

				<MSearch onFilterChange={setFilter} />

				<Stack direction='column' justifyContent='space-between'>
					<MRoleTable data={dataTable} onFilterChange={setFilter} />

					<CPagination
						page={paginate.page}
						pages={paginate.pages}
						onChange={onPageChange}
					/>
				</Stack>
			</ConfigRoleContext.Provider>
		</Box>
	);
	//#endregion
});

export default RolesPage;
