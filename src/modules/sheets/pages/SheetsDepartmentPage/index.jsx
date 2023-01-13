import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { Print } from '@mui/icons-material';

import dayjs from 'dayjs';

import { CPagination } from '_controls/';

import { ListSheets, MDepartmentFilter, MSearch } from '_modules/sheets/components';

import { isSuccess, cleanObjValue } from '_func/';

import { getClassesByDepartment } from '_api/classes.api';
import { getAdminClassSheetsByDepartment } from '_api/sheets.api';

const formatDate = (date) => dayjs(date).format('DD/MM/YYYY');

const SheetsDepartmentPage = () => {
	//#region Data
	const { department_id, department_info } = useParams();

	const info = JSON.parse(department_info);

	const [data, setData] = useState();

	const listData = useMemo(() => data?.data || [], [data]);

	const [classes, setClasses] = useState([]);

	const [filter, setFilter] = useState({
		page: 1,
		pages: 0,
		department_id: Number(department_id),
		academic_id: Number(info?.academic?.id),
		semester_id: Number(info?.semester?.id),
		class_id: '',
		status: -1,
		input: '',
	});

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });
	//#endregion

	//#region Event
	const getData = async () => {
		const _filter = cleanObjValue(filter);

		const res = await getAdminClassSheetsByDepartment(_filter);

		if (isSuccess(res)) setData(res.data);
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
				{`Học kỳ ${info?.semester?.name} (${formatDate(
					info?.semester?.start
				)} - ${formatDate(info?.semester?.end)}) - Năm học ${info?.academic?.name}`}
			</Typography>
			<Box mb={1.5}>
				<Paper className='paper-wrapper'>
					<Typography fontSize={20} p={1.5} fontWeight={600}>
						{info?.department?.name}
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

				<Button
					variant='contained'
					startIcon={<Print />}
					sx={{
						backgroundColor: '#3EAE42',
						color: 'white',
						'&:hover': { backgroundColor: '#0CDB13D2' },
					}}
					onClick={() => {}}
				>
					In thống kê
				</Button>
			</Stack>

			<ListSheets data={listData} />

			<CPagination page={paginate.page} pages={paginate.pages} onChange={onPageChange} />
		</Box>
	);
	//#endregion
};

export default SheetsDepartmentPage;
