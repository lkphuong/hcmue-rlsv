/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';

import { shallowEqual, useSelector } from 'react-redux';

import { Box, Paper, Typography } from '@mui/material';

import { getClassSheets } from '_api/sheets.api';

import { isSuccess, isEmpty } from '_func/';

import { Filter, ListStudents } from '_modules/class/components';

const ClassPage = () => {
	//#region Data
	const { class_id } = useSelector((state) => state.auth.profile, shallowEqual);
	const { semesters, academic_years } = useSelector((state) => state.options, shallowEqual);

	const [data, setData] = useState([]);

	const [body, setBody] = useState({
		semester_id: semesters[0].id,
		academic_id: academic_years[0].id,
	});

	//#endregion

	//#region Event
	const getData = useCallback(async () => {
		if (!class_id) return;
		try {
			const _input = body?.input;

			const res = await getClassSheets(
				class_id,
				_input === '' ? { ...body, input: null } : body
			);

			if (isSuccess(res)) setData(res.data);
			else if (isEmpty(res)) setData([]);
		} catch (error) {
			throw error;
		}
	}, [body, class_id]);
	//#endregion

	useEffect(() => {
		getData();
	}, [getData]);

	//#region Render
	return (
		<Box>
			<Box mb={1.5}>
				<Paper className='paper-wrapper'>
					<Typography fontSize={20} p={1.5}>
						Danh sách điểm rèn luyện của lớp
					</Typography>
				</Paper>
			</Box>

			<Filter
				filter={body}
				onChangeFilter={setBody}
				semesters={semesters}
				academic_years={academic_years}
			/>

			<ListStudents data={data} />
		</Box>
	);
	//#endregion
};

export default ClassPage;
