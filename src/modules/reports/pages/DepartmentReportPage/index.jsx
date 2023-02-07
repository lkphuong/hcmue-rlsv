import { useEffect, useMemo, useState, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';

import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { Print } from '@mui/icons-material';

import { Filter, MDepartmentTable, MReportPrint } from '_modules/reports/components';

import { isSuccess, isEmpty, cleanObjValue } from '_func/';

import { getReports } from '_api/reports.api';
import { getSemestersByYear } from '_api/options.api';

import { actions } from '_slices/currentInfo.slice';

const DepartmentReportPage = () => {
	//#region Data
	const printRef = useRef();

	const departments = useSelector((state) => state.options.departments, shallowEqual);
	const academic_years = useSelector((state) => state.options.academic_years, shallowEqual);
	const { role_id, department_id } = useSelector((state) => state.auth.profile, shallowEqual);

	const [semesters, setSemesters] = useState([]);

	const [data, setData] = useState([]);

	const [filter, setFilter] = useState({
		academic_id: academic_years[0]?.id,
		semester_id: '',
		department_id: role_id === 5 ? department_id : null,
	});

	const departmentName = useMemo(
		() =>
			departments.find((e) => e.id.toString() === filter?.department_id?.toString())?.name ||
			'',
		[departments, filter.department_id]
	);

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	const getData = async () => {
		const _filter = cleanObjValue(filter);

		const res = await getReports(_filter);

		if (isSuccess(res)) setData(res.data);
		else if (isEmpty(res)) setData([]);
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

	const handlePrint = useReactToPrint({
		content: () => printRef.current,
	});
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
							{`Danh sách thống kê phiếu chấm điểm rèn luyện của ${
								departmentName ? 'khoa ' + departmentName : 'tất cả các khoa'
							}`}
						</Typography>

						<Button
							disabled={data.length === 0}
							startIcon={<Print />}
							onClick={handlePrint}
						>
							In thống kê
						</Button>
					</Stack>
				</Paper>
			</Box>

			<MDepartmentTable data={data} onSetCurrent={handleSetCurrent} />

			<MReportPrint
				data={data}
				academic={data?.academic}
				semester={data?.semester}
				ref={printRef}
			/>
		</Box>
	);
	//#endregion
};

export default DepartmentReportPage;
