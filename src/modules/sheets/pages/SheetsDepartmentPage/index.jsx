import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { shallowEqual, useSelector } from 'react-redux';

import { Box, Paper, Stack, Typography } from '@mui/material';

import { CPagination } from '_controls/';

import { ListSheets, MDepartmentFilter, MSearch } from '_modules/sheets/components';

import { isSuccess, cleanObjValue, isEmpty, formatTimeSemester } from '_func/';

import { getClassesByDepartment } from '_api/classes.api';
import { getAdminClassSheetsByDepartment } from '_api/sheets.api';

const SheetsDepartmentPage = () => {
	//#region Data
	const { academic, semester, department } = useSelector(
		(state) => state.currentInfo,
		shallowEqual
	);

	const { department_id } = useParams();

	const [loading, setLoading] = useState(false);

	const [data, setData] = useState();

	const listData = useMemo(() => data?.data || [], [data]);

	const [classes, setClasses] = useState([]);

	const [filter, setFilter] = useState({
		page: 1,
		pages: 0,
		department_id: Number(department_id),
		academic_id: Number(academic?.id),
		semester_id: Number(semester?.id),
		class_id: '',
		status: -1,
		input: '',
	});

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });
	//#endregion

	//#region Event
	const getData = async () => {
		setLoading(true);

		try {
			const _filter = cleanObjValue(filter);

			const res = await getAdminClassSheetsByDepartment(_filter);

			if (isSuccess(res)) setData(res.data);
			else if (isEmpty(res)) setData({ data: [], page: 1, pages: 0 });
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const getClassesData = async () => {
		const res = await getClassesByDepartment(department_id);

		if (isSuccess(res)) {
			setClasses(res.data);
			setFilter((prev) => ({ ...prev, class_id: Number(res.data[0]?.id) }));
		}
	};

	const onPageChange = (event, newPage) => setFilter((prev) => ({ ...prev, page: newPage }));
	//#endregion

	useEffect(() => {
		if (department_id) getClassesData();
	}, [department_id]);

	useEffect(() => {
		if (filter?.class_id) getData();
	}, [filter]);

	useEffect(() => {
		setPaginate({
			page: data?.page || 1,
			pages: data?.pages || 0,
		});
	}, [data]);

	//#region Render
	return (
		<Box>
			<MDepartmentFilter filter={filter} onFilterChange={setFilter} classes={classes} />

			<Typography fontWeight={700} fontSize={25} lineHeight='30px' textAlign='center' mb={4}>
				{`${semester?.name} (${formatTimeSemester(semester?.start)} - ${formatTimeSemester(
					semester?.end
				)}) - Năm học ${academic?.name}`}
			</Typography>
			<Box mb={1.5}>
				<Paper className='paper-wrapper'>
					<Typography fontSize={20} p={1.5} fontWeight={600}>
						{department?.name}
					</Typography>
				</Paper>
			</Box>

			<Stack
				direction={{ xs: 'column', md: 'row' }}
				spacing={1.5}
				justifyContent='space-between'
				alignItems='center'
				mb={2}
			>
				<MSearch onFilterChange={setFilter} />
			</Stack>

			<ListSheets data={listData} loading={loading} />

			<CPagination page={paginate.page} pages={paginate.pages} onChange={onPageChange} />
		</Box>
	);
	//#endregion
};

export default SheetsDepartmentPage;
