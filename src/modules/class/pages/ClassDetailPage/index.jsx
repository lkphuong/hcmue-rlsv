import React, { useCallback, useEffect, useState } from 'react';

import { Box, Typography } from '@mui/material';

import { useParams } from 'react-router-dom';

import { FORM_BY_ID as FORM } from '_modules/home/mocks';

import { Form } from '_modules/home/components';

import { getSheetById } from '_api/sheets.api';

const ClassDetailPage = () => {
	//#region Data
	const { semester_id } = useParams();

	// const [data, setData] = useState(null);
	// //#endregion

	// //#region Event
	// const getForm = useCallback(async () => {
	// 	if (!semester_id) return;
	// 	try {
	// 		const res = await getSheetById(semester_id);
	// 	} catch (error) {
	// 		// console.log(error);
	// 	}
	// }, [semester_id]);
	// //#endregion

	// useEffect(() => {
	// 	getForm();
	// }, [getForm]);

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
				Danh sách điểm rèn luyện của tôi
			</Typography>

			<Typography
				borderRadius={1}
				p={2}
				mt={2}
				fontWeight={500}
				fontSize={16}
				sx={{ backgroundColor: 'rgba(0 0 0 / 15%)' }}
			>
				{`${FORM.semester.name} - Niên khóa ${FORM.academic.name}`}
			</Typography>

			<Box mt={1}>
				<Form formId={'form_id'} />
			</Box>
		</Box>
	);
	//#endregion
};

export default ClassDetailPage;
