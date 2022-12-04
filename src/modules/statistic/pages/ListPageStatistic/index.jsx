/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { Box } from '@mui/material';

import { Filter, MClassTable, MTable } from '_modules/statistic/components';

import { isSuccess, isEmpty } from '_func/';

import { getClasses } from '_api/classes.api';
import { getRerorts } from '_api/reports.api';

const CLASSES = [
	{ id: 1, name: 'CNTT.A' },
	{ id: 2, name: 'CNTT.B' },
	{ id: 3, name: 'CNTT.C' },
	{ id: 4, name: 'CNTT.D' },
];

const DATA = [
	{
		id: 1,
		class: {
			id: 1,
			name: 'CNTT 1',
		},
		count: 80,
		perfect: 5,
		well: 30,
		good: 35,
		medium: 5,
		low: 5,
		bad: 0,
		underated: 2,
	},
	{
		id: 2,
		class: {
			id: 2,
			name: 'CNTT 2',
		},
		count: 80,
		perfect: 5,
		well: 30,
		good: 35,
		medium: 5,
		low: 5,
		bad: 0,
		underated: 2,
	},
	{
		id: 3,
		class: {
			id: 3,
			name: 'CNTT 3',
		},
		count: 80,
		perfect: 5,
		well: 30,
		good: 35,
		medium: 5,
		low: 5,
		bad: 0,
		underated: 2,
	},
	{
		id: 4,
		class: {
			id: 4,
			name: 'CNTT 4',
		},
		count: 80,
		perfect: 5,
		well: 30,
		good: 35,
		medium: 5,
		low: 5,
		bad: 0,
		underated: 2,
	},
	{
		id: 5,
		class: {
			id: 5,
			name: 'CNTT 5',
		},
		count: 80,
		perfect: 5,
		well: 30,
		good: 35,
		medium: 5,
		low: 5,
		bad: 0,
		underated: 2,
	},
];

const ListPageStatistic = () => {
	//#region Data
	const departments = useSelector((state) => state.options.departments, shallowEqual);
	const semesters = useSelector((state) => state.options.semesters, shallowEqual);
	const academic_years = useSelector((state) => state.options.academic_years, shallowEqual);

	const [data, setData] = useState([]);

	const [classes, setClasses] = useState([]);

	const [classData, setClassData] = useState(null);

	const [filter, setFilter] = useState({
		academic_id: academic_years[0]?.id,
		semester_id: semesters[0]?.id,
		department_id: departments[0]?.id,
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
	const getData = useCallback(async () => {
		setClassData(null);

		const res = await getRerorts(filter);

		if (isSuccess(res)) setData(res.data);
		else if (isEmpty(res)) setData([]);
	}, [filter]);

	const viewClass = (classInfo) => () => {
		setClassData(classInfo);
	};

	const getClassData = async (department_id, academic_year_id) => {
		const res = await getClasses({ department_id, academic_year_id });

		if (isSuccess(res)) setClasses(res.data);
		else if (isEmpty(res)) setClasses([]);
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

	//#region Render
	return (
		<Box>
			<Filter
				filter={filter}
				onChangeFilter={setFilter}
				departments={departments}
				semesters={semesters}
				classes={classes}
				academic_years={academic_years}
			/>

			{!classData ? (
				<MTable data={data} onClick={viewClass} departmentName={departmentName} />
			) : (
				<MClassTable
					classData={classData}
					academic_id={filter?.academic_id}
					semester_id={filter?.semester_id}
					onBack={() => setClassData(null)}
				/>
			)}
		</Box>
	);
	//#endregion
};

export default ListPageStatistic;
