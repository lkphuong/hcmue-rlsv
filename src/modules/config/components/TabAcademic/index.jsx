import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Box, Stack, Typography } from '@mui/material';

import { getAcademicYears } from '_api/options.api';

import { isSuccess, isEmpty } from '_func/';

import { actions } from '_slices/options.slice';

import { AddSection } from './AddSection';
import { MTable } from './MTable';

export const TabAcademic = () => {
	//#region Data
	const academic_years = useSelector((state) => state.options.academic_years, shallowEqual);

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	const updateData = async () => {
		const res = await getAcademicYears();

		if (isSuccess(res)) dispatch(actions.setAcademicYears(res.data));
		else if (isEmpty(res)) dispatch(actions.setAcademicYears([]));
	};
	//#endregion

	//#region Render
	return (
		<Box>
			<Stack
				direction='row'
				spacing={2}
				justifyContent='space-between'
				alignItems='center'
				mb={2}
			>
				<Typography fontSize='1.5rem' fontWeight={600}>
					Danh sách năm học
				</Typography>
				<AddSection refetch={updateData} />
			</Stack>

			<MTable data={academic_years} refetch={updateData} />
		</Box>
	);
	//#endregion
};
