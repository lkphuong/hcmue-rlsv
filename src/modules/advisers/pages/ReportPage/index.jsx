import { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { Print } from '@mui/icons-material';

import { MClassTable, MReportFilter } from '_modules/advisers/components';

import { isSuccess, isEmpty } from '_func/';

import { getClassReports } from '_api/reports.api';
import { getSemestersByYear } from '_api/options.api';

const ReportPage = () => {
	//#region Data
	const { department_id, class_ids } = useSelector((state) => state.auth.profile, shallowEqual);
	const academic_years = useSelector((state) => state.options.academic_years, shallowEqual);

	const [semesters, setSemesters] = useState([]);

	const [data, setData] = useState([]);

	const [filter, setFilter] = useState({
		academic_id: academic_years[0]?.id || null,
		semester_id: null,
		department_id,
		class_id: class_ids[0] || null,
	});
	//#endregion

	//#region Event
	const getData = async () => {
		const res = await getClassReports(filter);

		if (isSuccess(res)) setData(res.data);
		else if (isEmpty(res)) setData([]);
	};

	const getSemestersData = async () => {
		const res = await getSemestersByYear(filter?.academic_id);

		if (isSuccess(res)) setSemesters(res.data);
		else setSemesters([]);
	};
	//#endregion

	useEffect(() => {
		getData();
	}, [department_id]);

	useEffect(() => {
		getSemestersData();
	}, [filter?.academic_id]);

	useEffect(() => {
		setFilter((prev) => ({ ...prev, page: 1, semester_id: Number(semesters[0]?.id) }));
	}, [semesters]);

	//#region Render
	return (
		<Box>
			<MReportFilter
				filter={filter}
				classes={class_ids}
				semesters={semesters}
				academic_years={academic_years}
				onFilterChange={setFilter}
			/>

			<Box my={1.5}>
				<Paper className='paper-wrapper'>
					<Stack
						p={1.5}
						direction='row'
						justifyContent='space-between'
						alignItems='center'
					>
						<Typography fontSize={20} fontWeight={600}>
							Thống kê phiếu chấm điểm rèn luyện
						</Typography>

						<Button startIcon={<Print />}>In thống kê</Button>
					</Stack>
				</Paper>
			</Box>

			<MClassTable data={data} />
		</Box>
	);
	//#endregion
};

export default ReportPage;
