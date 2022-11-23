/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';

import { shallowEqual, useSelector } from 'react-redux';

import { Box, Typography } from '@mui/material';

import { STUDENTS } from '_modules/class/mocks';

import { getClassSheets } from '_api/sheets.api';

import { isSuccess } from '_func/';

import { Filter, ListSemester } from '_modules/class/components';

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

	//#region Render
	return (
		<Box>
			<Typography
				borderRadius={2}
				p={2}
				fontWeight={500}
				fontSize={18}
				sx={{ backgroundColor: 'rgba(0 0 0 / 5%)' }}
			>
				Danh sách điểm rèn luyện của lớp
			</Typography>

			<Box mt={1}>
				<Filter
					filter={body}
					onChangeFilter={setBody}
					semesters={semesters}
					academic_years={academic_years}
				/>

				<ListSemester data={data} />
			</Box>
		</Box>
	);
	//#endregion
};

export default ClassPage;
