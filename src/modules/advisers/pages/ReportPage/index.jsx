import { useEffect, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Box, Paper, Stack, Typography } from '@mui/material';

import { MClassTable, MReportFilter, MReportPrint } from '_modules/advisers/components';

import { adminExportExcel, adminExportWord, getClassReports } from '_api/reports.api';
import { getSemestersByYear } from '_api/options.api';

import { cleanObjValue, isSuccess, isEmpty } from '_func/index';

import { actions } from '_slices/currentInfo.slice';
import { CReportButton } from '_others/';

const ReportPage = () => {
	//#region Data
	const printRef = useRef();

	const { department_id, classes } = useSelector((state) => state.auth.profile, shallowEqual);
	const academic_years = useSelector((state) => state.options.academic_years, shallowEqual);

	const [semesters, setSemesters] = useState([]);

	const [data, setData] = useState([]);

	const [filter, setFilter] = useState({
		academic_id: academic_years[0]?.id || null,
		semester_id: null,
		department_id,
		class_id: Number(classes[0]?.id) || null,
	});

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	const getData = async () => {
		const _filter = cleanObjValue(filter);

		if (!(_filter?.academic_id && _filter?.class_id && _filter?.semester_id)) return;

		const res = await getClassReports(_filter);

		if (isSuccess(res)) setData(res.data);
		else if (isEmpty(res)) setData([]);
	};

	const getSemestersData = async () => {
		const res = await getSemestersByYear(filter?.academic_id);

		if (isSuccess(res)) setSemesters(res.data);
		else setSemesters([]);
	};

	const handleSetCurrent = (classData) => {
		const info = {
			academic: data?.academic,
			semester: data?.semester,
			department: data?.department,
			...classData,
		};

		dispatch(actions.setInfo(info));
	};

	// const handlePrint = useReactToPrint({
	// 	content: () => printRef.current,
	// });

	const handleExport = (type) => async () => {
		const body = {
			academic_id: filter?.academic_id,
			semester_id: filter?.semester_id,
		};

		const res = type === 'word' ? await adminExportWord(body) : await adminExportExcel(body);
	};
	//#endregion

	useEffect(() => {
		getData();
	}, [filter]);

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
				classes={classes}
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

						{/* <Button
							disabled={data.length === 0}
							startIcon={<Print />}
							onClick={handlePrint}
						>
							In thống kê
						</Button> */}
						<Stack direction='row' spacing={1}>
							<CReportButton
								type='word'
								disabled={data.length === 0}
								onClick={handleExport('word')}
							/>
							<CReportButton
								type='excel'
								disabled={data.length === 0}
								onClick={handleExport('excel')}
							/>
						</Stack>
					</Stack>
				</Paper>
			</Box>

			<MClassTable data={data} onSetCurrent={handleSetCurrent} />

			<MReportPrint
				ref={printRef}
				data={data}
				classData={classes[0]}
				department={data?.department}
				academic={data?.academic}
				semester={data?.semester}
			/>
		</Box>
	);
	//#endregion
};

export default ReportPage;
