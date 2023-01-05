import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Box, Typography } from '@mui/material';

import { getSemesters } from '_api/options.api';

import { isSuccess, isEmpty } from '_func/';

import { actions } from '_slices/options.slice';

import { AddSection } from './AddSection';
import { MTable } from './MTable';

export const TabSemester = () => {
	//#region Data
	const semesters = useSelector((state) => state.options.semesters, shallowEqual);

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	const updateData = async () => {
		const res = await getSemesters();

		if (isSuccess(res)) dispatch(actions.setSemesters(res.data));
		else if (isEmpty(res)) dispatch(actions.setSemesters([]));
	};
	//#endregion

	//#region Render
	return (
		<Box>
			<AddSection refetch={updateData} />

			<Typography fontSize='1.5rem' fontWeight={600}>
				Danh sách học kỳ
			</Typography>

			<MTable data={semesters} refetch={updateData} />
		</Box>
	);
	//#endregion
};
