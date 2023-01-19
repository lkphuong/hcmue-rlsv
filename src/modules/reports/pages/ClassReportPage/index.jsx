import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Box, Paper, Typography } from '@mui/material';

import { MClassTable } from '_modules/reports/components';

import { isSuccess, isEmpty } from '_func/';

import { getClassReports } from '_api/reports.api';

const ClassReportPage = () => {
	//#region Data
	const { department_id, info } = useParams();

	const [data, setData] = useState([]);
	//#endregion

	//#region Event
	const getData = async () => {
		const _ = JSON.parse(info);
		const filter = { ..._, department_id: parseInt(department_id) };

		const res = await getClassReports(filter);

		if (isSuccess(res)) setData(res.data);
		else if (isEmpty(res)) setData([]);
	};
	//#endregion

	useEffect(() => {
		getData();
	}, [department_id, info]);

	//#region Render
	return (
		<Box>
			<Typography textAlign='center' fontWeight={700} fontSize={25} lineHeight='30px'>
				Học kỳ II ( 06/2021-09/2021) - Năm học 2021-2022
			</Typography>

			<Box my={1.5}>
				<Paper className='paper-wrapper'>
					<Typography fontSize={20} p={1.5} fontWeight={600}>
						{`Danh sách thống kê phiếu chấm điểm rèn luyện của khoa: ${'Giáo dục mầm non'}`}
					</Typography>
				</Paper>
			</Box>

			<MClassTable data={data} />
		</Box>
	);
	//#endregion
};

export default ClassReportPage;
