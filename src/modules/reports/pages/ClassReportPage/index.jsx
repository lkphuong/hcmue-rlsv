import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { shallowEqual, useSelector } from 'react-redux';

import { Box, Paper, Typography } from '@mui/material';

import { MClassTable } from '_modules/reports/components';

import { isSuccess, isEmpty, formatTimeSemester } from '_func/';

import { getClassReports } from '_api/reports.api';

const ClassReportPage = () => {
	//#region Data
	const { semester, academic, department } = useSelector(
		(state) => state.currentInfo,
		shallowEqual
	);

	const { department_id } = useParams();

	const [data, setData] = useState([]);

	const filter = useMemo(
		() => ({
			department_id: Number(department_id),
			academic_id: Number(academic?.id) ?? null,
			semester_id: Number(semester?.id) ?? null,
		}),
		[department_id, academic, semester]
	);
	//#endregion

	//#region Event
	const getData = async () => {
		if (!filter.academic_id || !filter?.semester_id) return;

		const res = await getClassReports(filter);

		if (isSuccess(res)) setData(res.data);
		else if (isEmpty(res)) setData([]);
	};
	//#endregion

	useEffect(() => {
		getData();
	}, [filter]);

	//#region Render
	return (
		<Box>
			<Typography textAlign='center' fontWeight={700} fontSize={25} lineHeight='30px'>
				{`${semester?.name} (${formatTimeSemester(semester?.start)}-${formatTimeSemester(
					semester?.end
				)}) - Năm học ${academic?.name}`}
			</Typography>

			<Box my={1.5}>
				<Paper className='paper-wrapper'>
					<Typography fontSize={20} p={1.5} fontWeight={600}>
						{`Danh sách thống kê phiếu chấm điểm rèn luyện của khoa  ${department?.name}`}
					</Typography>
				</Paper>
			</Box>

			<MClassTable data={data} />
		</Box>
	);
	//#endregion
};

export default ClassReportPage;
