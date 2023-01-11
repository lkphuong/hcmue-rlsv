import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { Print } from '@mui/icons-material';

import { CPagination } from '_controls/';

import { ListSheets, MDepartmentFilter, MSearch } from '_modules/department/components';

import { isSuccess } from '_func/';

import { getClassesByDepartment } from '_api/classes.api';

const FAKE_DATA = [
	{
		id: 1,
		name: 'Lê Trương Quỳnh Như',
		std_code: '47.01.902.026',
		student_mark: 50,
		class_mark: 100,
		adviser_mark: 120,
		department_mark: 80,
		level: 'Giỏi',
		status: 'Chưa đánh giá',
	},
	{
		id: 2,
		name: 'Lê Trương Quỳnh Như',
		std_code: '47.01.902.026',
		student_mark: 50,
		class_mark: 100,
		adviser_mark: 120,
		department_mark: 80,
		level: 'Giỏi',
		status: 'Chưa đánh giá',
	},
	{
		id: 3,
		name: 'Lê Trương Quỳnh Như',
		std_code: '47.01.902.026',
		student_mark: 50,
		class_mark: 100,
		adviser_mark: 120,
		department_mark: 80,
		level: 'Giỏi',
		status: 'Chưa đánh giá',
	},
	{
		id: 4,
		name: 'Lê Trương Quỳnh Như',
		std_code: '47.01.902.026',
		student_mark: 50,
		class_mark: 100,
		adviser_mark: 120,
		department_mark: 80,
		level: 'Giỏi',
		status: 'Chưa đánh giá',
	},
	{
		id: 5,
		name: 'Lê Trương Quỳnh Như',
		std_code: '47.01.902.026',
		student_mark: 50,
		class_mark: 100,
		adviser_mark: 120,
		department_mark: 80,
		level: 'Giỏi',
		status: 'Chưa đánh giá',
	},
	{
		id: 6,
		name: 'Lê Trương Quỳnh Như',
		std_code: '47.01.902.026',
		student_mark: 50,
		class_mark: 100,
		adviser_mark: 120,
		department_mark: 80,
		level: 'Giỏi',
		status: 'Chưa đánh giá',
	},
	{
		id: 7,
		name: 'Lê Trương Quỳnh Như',
		std_code: '47.01.902.026',
		student_mark: 50,
		class_mark: 100,
		adviser_mark: 120,
		department_mark: 80,
		level: 'Giỏi',
		status: 'Chưa đánh giá',
	},
	{
		id: 8,
		name: 'Lê Trương Quỳnh Như',
		std_code: '47.01.902.026',
		student_mark: 50,
		class_mark: 100,
		adviser_mark: 120,
		department_mark: 80,
		level: 'Giỏi',
		status: 'Chưa đánh giá',
	},
];

const SheetsDepartmentPage = () => {
	//#region Data
	const { department_id } = useParams();

	const [selected, setSelected] = useState([]);

	const [isSelectedAll, setSelectedAll] = useState(false);

	const [data, setData] = useState();

	const listData = useMemo(() => data?.data || [], [data]);

	const [classes, setClasses] = useState([]);

	const [filter, setFilter] = useState({
		page: 1,
		pages: 0,
		class_id: '',
		status: -1,
		input: '',
	});

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });
	//#endregion

	//#region Event
	const getData = async () => {
		// const res = await getSheet()
		const res = { status: 200, data: {} };

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

	const handleSelect = useCallback(
		(id) => (e, status) => {
			if (id === -1) {
				if (isSelectedAll === false) setSelected([]);
				setSelectedAll(!isSelectedAll);
			} else {
				if (!isSelectedAll) {
					setSelected((prev) => {
						if (e.target.checked !== undefined) {
							if (e.target.checked) {
								return [...prev, id];
							} else {
								return prev.filter((e) => e !== id);
							}
						} else {
							if (status) {
								return [...prev, id];
							} else {
								return prev.filter((e) => e !== id);
							}
						}
					});
				}
			}
		},
		[isSelectedAll]
	);
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
				Học kỳ II ( 06/2021-09/2021) - Năm học 2021-2022
			</Typography>
			<Box mb={1.5}>
				<Paper className='paper-wrapper'>
					<Typography fontSize={20} p={1.5} fontWeight={600}>
						Khoa giáo dục mầm non
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
				<MSearch onFilterChange={setFilter} placeholder='Nhập MSSV hoặc tên' />

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

			<ListSheets
				data={FAKE_DATA}
				refetch={getData}
				isSelectedAll={isSelectedAll}
				selected={selected}
				onSelect={handleSelect}
			/>

			<CPagination page={paginate.page} pages={paginate.pages} onChange={onPageChange} />
		</Box>
	);
	//#endregion
};

export default SheetsDepartmentPage;
