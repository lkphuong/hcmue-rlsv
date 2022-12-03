import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Box, Button, Paper, Typography } from '@mui/material';

import { Filter, ListForms } from '_modules/form/components';

import { ROUTES } from '_constants/routes';

import { getForms } from '_api/form.api';

import { isSuccess } from '_func/';

const ListFormsPage = () => {
	//#region Data
	const [data, setData] = useState([]);
	//#endregion

	//#region Event
	const getData = useCallback(async () => {
		try {
			const res = await getForms();

			if (isSuccess(res)) setData(res.data);
		} catch (error) {
			throw error;
		}
	}, []);
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
						Lịch sử biểu mẫu đánh giá kết quả rèn luyện
					</Typography>
				</Paper>
			</Box>

			<Filter />

			<Box textAlign='right' my={2}>
				<Link to={ROUTES.FORM_CREATE}>
					<Button variant='contained'>Thêm mới</Button>
				</Link>
			</Box>

			<ListForms data={data} refetch={getData} />
		</Box>
	);
	//#endregion
};

export default ListFormsPage;
