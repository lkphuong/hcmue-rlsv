import React, { useCallback, useEffect, useState } from 'react';

import { Box, Typography } from '@mui/material';

import { useParams } from 'react-router-dom';
import { shallowEqual, useSelector } from 'react-redux';

import { Filter, ListStudents } from '_modules/list/components';

import { getClassSheets } from '_api/sheets.api';

import { isSuccess } from '_func/';

const StudentListPage = () => {
	//#region Data
	const { semesters, academic_years } = useSelector((state) => state.options, shallowEqual);

	const [data, setData] = useState([]);

	const [body, setBody] = useState({
		semester_id: semesters[0]?.id,
		academic_id: academic_years[0].id,
	});

	const { class_id } = useParams();
	//#endregion

	//#region Event
	const getData = useCallback(async () => {
		if (!class_id) return;
		try {
			const res = await getClassSheets(class_id, body);

			if (isSuccess(res)) setData(res.data);
		} catch (error) {
			throw error;
		}
	}, [body, class_id]);
	//#endregion

	useEffect(() => {
		getData();
	}, [getData]);

	return (
		<Box mt={1}>
			<Filter
				filter={body}
				onChangeFilter={setBody}
				semesters={semesters}
				academic_years={academic_years}
			/>

			<Typography
				borderRadius={2}
				p={2}
				mb={1}
				fontWeight={500}
				fontSize={18}
				sx={{ backgroundColor: 'rgba(0 0 0 / 5%)' }}
			>
				Lớp CNTT
			</Typography>

			<ListStudents data={data} />
		</Box>
	);
};

export default StudentListPage;
