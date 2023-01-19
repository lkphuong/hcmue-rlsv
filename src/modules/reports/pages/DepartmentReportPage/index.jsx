import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { Box } from '@mui/material';

import { Filter, MDepartmentTable } from '_modules/reports/components';

import { isSuccess, isEmpty, cleanObjValue } from '_func/';

import { getReports } from '_api/reports.api';
import { getSemestersByYear } from '_api/options.api';

const DepartmentReportPage = () => {
	//#region Data
	const departments = useSelector((state) => state.options.departments, shallowEqual);
	const academic_years = useSelector((state) => state.options.academic_years, shallowEqual);
	const { role_id, department_id } = useSelector((state) => state.auth.profile, shallowEqual);

	const [semesters, setSemesters] = useState([]);

	const [data, setData] = useState([]);

	const [filter, setFilter] = useState({
		academic_id: academic_years[0]?.id,
		semester_id: '',
		department_id: role_id === 5 ? department_id : null,
	});

	const departmentName = useMemo(
		() =>
			departments.find((e) => e.id.toString() === filter?.department_id?.toString())?.name ||
			'',
		[departments, filter.department_id]
	);
	//#endregion

	//#region Event
	const getData = async () => {
		const _filter = cleanObjValue(filter);

		const res = await getReports(_filter);

		if (isSuccess(res)) setData(res.data);
		else if (isEmpty(res)) setData([]);
	};

	const getSemestersData = async () => {
		const res = await getSemestersByYear(filter.academic_id);

		if (isSuccess(res)) setSemesters(res.data);
		else setSemesters([]);
	};
	//#endregion

	useEffect(() => {
		if (filter?.semester_id) getData();
	}, [filter]);

	useEffect(() => {
		if (semesters?.length) {
			setFilter((prev) => ({ ...prev, semester_id: Number(semesters[0]?.id) || null }));
		}
	}, [semesters]);

	useEffect(() => {
		if (filter?.academic_id) getSemestersData();
	}, [filter?.academic_id]);

	//#region Render
	return (
		<Box>
			<Filter
				filter={filter}
				onFilterChange={setFilter}
				departments={departments}
				semesters={semesters}
				academic_years={academic_years}
				isDepartment={role_id === 5}
			/>

			<MDepartmentTable data={data} filter={filter} departmentName={departmentName} />
		</Box>
	);
	//#endregion
};

export default DepartmentReportPage;
