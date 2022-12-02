/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { Box, Paper } from '@mui/material';

import { Filter, MClassTable, MTable } from '_modules/statistic/components';

import { isSuccess, isEmpty } from '_func/';

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
	const semesters = useSelector((state) => state.options.semesters, shallowEqual);
	const academic_years = useSelector((state) => state.options.academic_years, shallowEqual);
	// const classes = useSelector((state) => state.options.classes, shallowEqual);

	const [classData, setClassData] = useState(null);

	const [data, setData] = useState([]);

	const [body, setBody] = useState({
		class_id: 0,
		semester_id: semesters[0]?.id,
		academic_id: academic_years[0]?.id,
	});
	//#endregion

	//#region Event
	const getData = useCallback(async () => {
		setClassData(null);
		try {
			// const res = await getStatistic(body);
			// if (isSuccess(res)) setData(res.data);
			// else if (isEmpty(res)) setData([]);
		} catch (error) {
			throw error;
		}
	}, [body]);

	const viewClass = (classInfo) => () => {
		setClassData(classInfo);
	};
	//#endregion

	useEffect(() => {
		getData();
	}, [getData]);

	//#region Render
	return (
		<Box>
			<Filter
				filter={body}
				onChangeFilter={setBody}
				semesters={semesters}
				// classes={classes}
				classes={CLASSES}
				academic_years={academic_years}
			/>

			{!classData ? (
				<MTable data={DATA} onClick={viewClass} />
			) : (
				<MClassTable
					classData={classData}
					academic_id={body?.academic_id}
					semester_id={body?.semester_id}
				/>
			)}
		</Box>
	);
	//#endregion
};

export default ListPageStatistic;
