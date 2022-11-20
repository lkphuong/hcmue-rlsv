import React, { useCallback, useEffect, useState } from 'react';

import { shallowEqual, useSelector } from 'react-redux';

import { Box, Typography } from '@mui/material';

import { ListSemester } from '_modules/home/components';

import { CPagination } from '_controls/';

import { getStudentSheets } from '_api/sheets.api';

import { isSuccess } from '_func/';

const SemestersPage = () => {
	//#region Data
	const [data, setData] = useState([]);

	const { user_id } = useSelector((state) => state.auth.profile, shallowEqual);

	const [paginate, setPaginate] = useState({ page: 1, pages: 1 });
	//#endregion

	//#region Event
	const getList = useCallback(async (id) => {
		try {
			const res = await getStudentSheets(id);

			if (isSuccess(res)) {
				setData(res?.data);

				if (res.data.length > 0) {
					setPaginate({ page: 1, pages: Math.ceil(res.data.length / 10) });
				}
			}
		} catch (error) {
			console.log(error);
		}
	}, []);

	const handleChangePage = (e, v) => setPaginate({ ...paginate, page: v });
	//#endregion

	useEffect(() => {
		if (user_id) getList('5c35bbec260f27312f28b906');
	}, [getList, user_id]);

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

			<Box mt={1}>
				<ListSemester data={data} />

				<CPagination
					page={paginate.page}
					pages={paginate.pages}
					onChange={handleChangePage}
				/>
			</Box>
		</Box>
	);
	//#endregion
};

export default SemestersPage;
