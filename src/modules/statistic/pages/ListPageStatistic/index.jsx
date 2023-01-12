import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { Box } from '@mui/material';

import { Filter, MClassTable, MTable } from '_modules/statistic/components';

import { isSuccess, isEmpty } from '_func/';

import { getClassesByDepartment } from '_api/classes.api';
import { getRerorts } from '_api/reports.api';

const ListPageStatistic = () => {
	//#region Data
	const departments = useSelector((state) => state.options.departments, shallowEqual);
	const academic_years = useSelector((state) => state.options.academic_years, shallowEqual);
	const { role_id, department_id } = useSelector((state) => state.auth.profile, shallowEqual);

	const [data, setData] = useState([]);

	const [classes, setClasses] = useState([]);

	const [classData, setClassData] = useState(null);

	const [filter, setFilter] = useState({
		academic_id: academic_years[0]?.id,
		semester_id: '',
		department_id: role_id === 2 ? department_id : departments[0]?.id,
		class_id: '',
	});

	const departmentName = useMemo(
		() =>
			departments.find((e) => e.id.toString() === filter.department_id.toString())?.name ||
			'',
		[departments, filter.department_id]
	);
	//#endregion

	//#region Event
	const getData = async () => {
		setClassData(null);

		const res = await getRerorts(filter);

		if (isSuccess(res)) setData(res.data);
		else if (isEmpty(res)) setData([]);
	};

	const viewClass = (id, name) => () => {
		setClassData({ id, name });
	};

	const getClassData = async (department_id) => {
		const res = await getClassesByDepartment(department_id);

		if (isSuccess(res)) setClasses(res.data);
		else if (isEmpty(res)) setClasses([]);
	};

	const onBack = () => setClassData(null);
	//#endregion

	useEffect(() => {
		if (filter.department_id) {
			getClassData(filter.department_id);
		}
	}, [filter.department_id]);

	useEffect(() => {
		getData();
	}, [filter]);

	//#region Render
	return (
		<Box>
			<Filter
				filter={filter}
				onChangeFilter={setFilter}
				departments={departments}
				semesters={[]}
				classes={classes}
				academic_years={academic_years}
				isDepartment={role_id === 2}
			/>

			{!classData ? (
				<MTable data={data} onClick={viewClass} departmentName={departmentName} />
			) : (
				<MClassTable
					classData={classData}
					academic_id={filter?.academic_id}
					semester_id={filter?.semester_id}
					department_id={filter?.department_id}
					onBack={onBack}
				/>
			)}
		</Box>
	);
	//#endregion
};

export default ListPageStatistic;
