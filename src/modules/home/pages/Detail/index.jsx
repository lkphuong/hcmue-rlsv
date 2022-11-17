import React, { useCallback, useEffect } from 'react';

import { Box, Typography } from '@mui/material';

import { useParams } from 'react-router-dom';

import { DATA_BY_ID as DATA } from '_modules/home/mocks';

import { Form } from '_modules/home/components';

const SemesterDetail = () => {
	//#region Data
	const { semester_id } = useParams();
	//#endregion

	//#region Event
	const getForm = useCallback(async () => {
		// const res = await getData(semester_id);
		// console.log(res);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [semester_id]);
	//#endregion

	useEffect(() => {
		getForm();
	}, [getForm]);

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
				{`${DATA.semester.name} - Niên khóa ${DATA.academic.name}`}
			</Typography>

			<Box mt={1}>
				<Form data={DATA} />
			</Box>
		</Box>
	);
	//#endregion
};

export default SemesterDetail;
