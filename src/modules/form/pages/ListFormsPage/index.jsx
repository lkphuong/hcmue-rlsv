import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Box, Button, Typography } from '@mui/material';

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
			<Typography
				borderRadius={2}
				p={2}
				fontWeight={500}
				fontSize={18}
				sx={{ backgroundColor: 'rgba(0 0 0 / 5%)' }}
			>
				Lịch sử Phiếu đánh giá kết quả rèn luyện
			</Typography>

			<Box mt={1}>
				<Filter />

				<Box textAlign='right' my={2}>
					<Link to={ROUTES.FORM_CREATE}>
						<Button variant='contained'>Thêm mới</Button>
					</Link>
				</Box>

				<ListForms data={data} refetch={getData} />
			</Box>
		</Box>
	);
	//#endregion
};

export default ListFormsPage;
