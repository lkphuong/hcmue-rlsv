import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Alert, Box, Paper, Snackbar, Stack, Typography } from '@mui/material';

import fileDownload from 'js-file-download';

import { Filter, MDepartmentTable } from '_modules/reports/components';

import { isSuccess, isEmpty, cleanObjValue } from '_func/';
import { alert } from '_func/alert';

import { adminExportExcel, adminExportWord, getReports } from '_api/reports.api';
import { getAllDepartments, getSemestersByYear } from '_api/options.api';

import { actions } from '_slices/currentInfo.slice';

import { CReportButton } from '_others/';

import { ERRORS, SUCCESS } from '_constants/messages';
import { FILE_NAMES } from '_constants/variables';
import { useQuery } from '@tanstack/react-query';

const DepartmentReportPage = () => {
	//#region Data
	// const printRef = useRef();

	const academic_years = useSelector((state) => state.options.academic_years, shallowEqual);
	const { role_id, department_id } = useSelector((state) => state.auth.profile, shallowEqual);

	const [loading, setLoading] = useState(false);

	const [noti, setNoti] = useState({ show: false, status: 'success', message: '' });

	const [semesters, setSemesters] = useState([]);

	const [data, setData] = useState([]);

	const [filter, setFilter] = useState({
		academic_id: academic_years[0]?.id,
		semester_id: '',
		department_id: role_id === 5 ? department_id : null,
	});

	const { data: departments } = useQuery({
		queryKey: ['departments', filter?.semester_id, filter?.academic_id],
		queryFn: () =>
			getAllDepartments({ semester_id: filter?.semester_id, academic_id: filter?.academic_id }),
		select: (response) => response?.data?.map((e) => ({ ...e, id: Number(e?.id) })),
	});

	const departmentName = useMemo(
		() =>
			departments?.find((e) => e.id.toString() === filter?.department_id?.toString())?.name || '',
		[departments, filter.department_id]
	);

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	const getData = async () => {
		setLoading(true);

		const _filter = cleanObjValue(filter);

		const res = await getReports(_filter);

		if (isSuccess(res)) setData(res.data);
		else if (isEmpty(res)) setData([]);

		setLoading(false);
	};

	const getSemestersData = async () => {
		const res = await getSemestersByYear(filter.academic_id);

		if (isSuccess(res)) setSemesters(res.data);
		else setSemesters([]);
	};

	const handleSetCurrent = (fields) => {
		const info = {
			academic: data?.academic,
			semester: data?.semester,
			department: data?.department,
			...fields,
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
			const res = type === 'word' ? await adminExportWord(body) : await adminExportExcel(body);

			if (isSuccess(res)) {
				setNoti({
					show: true,
					status: 'success',
					message: type === 'word' ? SUCCESS.WORD : SUCCESS.EXCEL,
				});

				fileDownload(res.data, type === 'word' ? FILE_NAMES.ADMIN_WORD : FILE_NAMES.ADMIN_EXCEL);
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
			<Filter
				filter={filter}
				onFilterChange={setFilter}
				departments={departments}
				semesters={semesters}
				academic_years={academic_years}
				isDepartment={role_id === 5}
				loading={loading}
			/>

			<Box my={1.5}>
				<Paper className='paper-wrapper'>
					<Stack p={1.5} direction='row' justifyContent='space-between' alignItems='center'>
						<Typography fontSize={20} fontWeight={600}>
							{`Danh sách thống kê phiếu chấm điểm rèn luyện của ${
								departmentName ? 'khoa ' + departmentName : 'tất cả các khoa'
							}`}
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

			<MDepartmentTable data={data} onSetCurrent={handleSetCurrent} loading={loading} />

			<Snackbar open={noti.show} autoHideDuration={4000} onClose={onNotiClose}>
				<Alert severity={noti.status}>{noti.message}</Alert>
			</Snackbar>

			{/* <MReportPrint
				data={data}
				academic={data?.academic}
				semester={data?.semester}
				ref={printRef}
			/> */}
		</Box>
	);
	//#endregion
};

export default DepartmentReportPage;
