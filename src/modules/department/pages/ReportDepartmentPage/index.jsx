import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Alert, Box, Paper, Snackbar, Stack, Typography } from '@mui/material';

import fileDownload from 'js-file-download';

import { MReportDepartmentFilter, MReportDepartmentTable } from '_modules/department/components';

import { isSuccess, isEmpty, cleanObjValue } from '_func/';
import { alert } from '_func/alert';

import { departmentExportExcel, departmentExportWord, getClassReports } from '_api/reports.api';
import { getSemestersByYear } from '_api/options.api';

import { actions } from '_slices/currentInfo.slice';

import { CReportButton } from '_others/';

import { ERRORS, SUCCESS } from '_constants/messages';
import { FILE_NAMES } from '_constants/variables';

const ReportDepartmentPage = () => {
	//#region Data
	// const printRef = useRef();

	const { departments, academic_years } = useSelector((state) => state.options, shallowEqual);
	const { department_id, fullname } = useSelector((state) => state.auth.profile, shallowEqual);

	const [noti, setNoti] = useState({ show: false, status: 'success', message: '' });

	const [semesters, setSemesters] = useState([]);

	const [data, setData] = useState([]);

	const [filter, setFilter] = useState({
		academic_id: academic_years[0]?.id,
		semester_id: '',
		department_id: Number(department_id),
	});

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	const getData = async () => {
		const _filter = cleanObjValue(filter);

		const res = await getClassReports(_filter);

		if (isSuccess(res)) setData(res.data);
		else if (isEmpty(res)) setData([]);
	};

	const getSemestersData = async () => {
		const res = await getSemestersByYear(filter.academic_id);

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

	const onNotiClose = (event, reason) => {
		if (reason === 'clickaway') return;

		setNoti({ show: false, status: 'success', message: '' });
	};

	const handleExport = (type) => async () => {
		const body = {
			academic_id: filter?.academic_id,
			semester_id: filter?.semester_id,
		};

		alert.loading();

		try {
			const res =
				type === 'word'
					? await departmentExportWord(body)
					: await departmentExportExcel(body);

			if (isSuccess(res)) {
				setNoti({
					show: true,
					status: 'success',
					message: type === 'word' ? SUCCESS.WORD : SUCCESS.EXCEL,
				});

				fileDownload(
					res.data,
					type === 'word' ? FILE_NAMES.DEPARTMENT_WORD : FILE_NAMES.DEPARTMENT_EXCEL
				);
			} else
				setNoti({
					show: true,
					status: 'error',
					message: type === 'word' ? ERRORS.WORD : ERRORS.EXCEL,
				});
		} catch (error) {
			throw error;
		} finally {
			alert.close();
		}
	};
	//#endregion

	useEffect(() => {
		if (filter?.semester_id) getData();
	}, [filter]);

	useEffect(() => {
		if (semesters?.length) {
			setFilter((prev) => ({ ...prev, semester_id: Number(semesters[0]?.id) || null }));
		}
	}, [semesters]);

	useEffect(() => {
		if (filter?.academic_id) getSemestersData();
	}, [filter?.academic_id]);

	//#region Render
	return (
		<Box>
			<MReportDepartmentFilter
				filter={filter}
				onFilterChange={setFilter}
				departments={departments}
				semesters={semesters}
				academic_years={academic_years}
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
							{`Danh sách thống kê phiếu chấm điểm rèn luyện của ${fullname}`}
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

			<MReportDepartmentTable data={data} onSetCurrent={handleSetCurrent} />

			<Snackbar open={noti.show} autoHideDuration={4000} onClose={onNotiClose}>
				<Alert severity={noti.status}>{noti.message}</Alert>
			</Snackbar>

			{/* <MReportPrint
				data={data}
				academic={data?.academic}
				semester={data?.semester}
				departmentName={fullname}
				ref={printRef}
			/> */}
		</Box>
	);
	//#endregion
};

export default ReportDepartmentPage;
