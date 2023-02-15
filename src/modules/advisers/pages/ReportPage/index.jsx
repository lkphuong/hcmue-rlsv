import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Alert, Box, Paper, Snackbar, Stack, Typography } from '@mui/material';

import fileDownload from 'js-file-download';

import { MClassTable, MReportFilter } from '_modules/advisers/components';

import { classExportExcel, classExportWord, getClassReports } from '_api/reports.api';
import { getSemestersByYear } from '_api/options.api';

import { cleanObjValue, isSuccess, isEmpty } from '_func/index';
import { alert } from '_func/alert';

import { actions } from '_slices/currentInfo.slice';

import { CReportButton } from '_others/';

import { ERRORS, SUCCESS } from '_constants/messages';
import { FILE_NAMES } from '_constants/variables';

const ReportPage = () => {
	//#region Data
	// const printRef = useRef();

	const { department_id, classes } = useSelector((state) => state.auth.profile, shallowEqual);
	const academic_years = useSelector((state) => state.options.academic_years, shallowEqual);

	const [noti, setNoti] = useState({ show: false, status: 'success', message: '' });

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

	const onNotiClose = (event, reason) => {
		if (reason === 'clickaway') return;

		setNoti({ show: false, status: 'success', message: '' });
	};

	const handleExport = (type) => async () => {
		const body = {
			academic_id: filter?.academic_id,
			semester_id: filter?.semester_id,
			department_id: filter?.department_id,
			class_id: filter?.class_id,
		};

		alert.loading();

		try {
			const res =
				type === 'word' ? await classExportWord(body) : await classExportExcel(body);

			if (isSuccess(res)) {
				setNoti({
					show: true,
					status: 'success',
					message: type === 'word' ? SUCCESS.WORD : SUCCESS.EXCEL,
				});

				fileDownload(
					res.data,
					type === 'word' ? FILE_NAMES.CLASS_WORD : FILE_NAMES.CLASS_EXCEL
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

			<Snackbar open={noti.show} autoHideDuration={4000} onClose={onNotiClose}>
				<Alert severity={noti.status}>{noti.message}</Alert>
			</Snackbar>

			{/* <MReportPrint
				ref={printRef}
				data={data}
				classData={classes[0]}
				department={data?.department}
				academic={data?.academic}
				semester={data?.semester}
			/> */}
		</Box>
	);
	//#endregion
};

export default ReportPage;
