import { forwardRef, useEffect, useState } from 'react';

import { Box, Stack, Typography } from '@mui/material';

import { getWholeClass } from '_api/sheets.api';

import { SummaryTable } from './SummaryTable';
import { StudentsTable } from './StudentsTable';

import { isSuccess } from '_func/';
import { getClassReports } from '_api/reports.api';

export const MClassPrint = forwardRef(({ academic, semester, class_id, department_id }, ref) => {
	//#region Data
	const [data, setData] = useState([]);

	const [reportData, setReportData] = useState();
	//#endregion

	//#region Event
	const getData = async () => {
		const body = {
			semester_id: Number(semester?.id),
			academic_id: Number(academic?.id),
			department_id: Number(department_id),
			class_id: Number(class_id),
			status: -1,
		};

		const res = await getWholeClass(body);

		const resReport = await getClassReports(body);

		if (isSuccess(res)) setData(res.data);
		if (isSuccess(resReport)) setReportData(resReport.data);
	};
	//#endregion

	useEffect(() => {
		getData();
	}, [academic, semester, department_id]);

	//#region Render
	return (
		<Box ref={ref} className='print-source' px={4} py={2}>
			<Stack
				direction='row'
				justifyContent='space-between'
				mb={6}
				sx={{
					'& .MuiTypography-root': {
						fontWeight: 700,
						fontSize: '14px',
						textAlign: 'center',
					},
				}}
			>
				<Stack direction='column'>
					<Typography>
						BỘ GIÁO DỤC VÀ ĐÀO TẠO <br />
						TRƯỜNG ĐẠI HỌC SƯ PHẠM
						<br /> THÀNH PHỐ HỒ CHÍ MINH
					</Typography>
				</Stack>
				<Stack direction='column'>
					<Typography>
						CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM <br />
						Độc lập - Tự do - Hạnh phúc
					</Typography>
				</Stack>
			</Stack>
			<Typography textAlign='center' fontWeight={700} fontSize='24px!important' mb={2}>
				BẢNG ĐÁNH GIÁ KẾT QUẢ RÈN LUYỆN SINH VIÊN
			</Typography>

			<Stack direction='row' justifyContent='center' alignItems='center' mb={5}>
				<Stack
					direction='row'
					justifyContent='space-between'
					sx={{ '& .MuiTypography-root': { fontWeight: 700, fontSize: '17px' } }}
				>
					<Typography mr={3}>{semester?.name}</Typography>
					<Typography>Năm học: {academic?.name}</Typography>
				</Stack>
			</Stack>

			<StudentsTable data={data} />

			<SummaryTable data={reportData} />
		</Box>
	);

	//#endregion
});
