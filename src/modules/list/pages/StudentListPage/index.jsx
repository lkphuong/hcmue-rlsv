import React, { useCallback, useEffect, useState } from 'react';

import { Box, Typography } from '@mui/material';

import { useParams } from 'react-router-dom';

import { STUDENTS, HOCKY, NIENKHOA } from '_modules/class/mocks';

import { Filter, ListStudents } from '_modules/list/components';

import { getClassSheets } from '_api/sheets.api';

import { isSuccess } from '_func/';

const semesterId = HOCKY[0].id;
const academicId = NIENKHOA[0].id;

const StudentListPage = () => {
	//#region Data
	const [data, setData] = useState([]);

	const [body, setBody] = useState({ semester_id: semesterId, academic_id: academicId });

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
			<Filter filter={body} onChangeFilter={setBody} />

			<Typography
				borderRadius={2}
				p={2}
				fontWeight={500}
				fontSize={18}
				sx={{ backgroundColor: 'rgba(0 0 0 / 5%)' }}
			>
				Danh sách điểm rèn luyện của lớp
			</Typography>

			<ListStudents data={STUDENTS} />
		</Box>
	);
};

export default StudentListPage;
