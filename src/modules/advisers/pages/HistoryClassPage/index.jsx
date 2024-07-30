import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Box, Paper, Stack, Typography } from '@mui/material';

import { getClassSheets } from '_api/sheets.api';

import { CPagination, CSearch } from '_controls/';

import { cleanObjValue, formatTimeSemester, isEmpty, isSuccess } from '_func/index';

import { ListStudentsTable, MClassFilter } from '_modules/advisers/components';

import { actions } from '_slices/filter.slice';

const HistoryClassPage = () => {
	//#region Data
	const { academic, semester, classData } = useSelector(
		(state) => state.currentInfo,
		shallowEqual
	);
	const { classes } = useSelector((state) => state.auth.profile, shallowEqual);
	const filters = useSelector((state) => state.filter.filters, shallowEqual);

	const { class_id } = useParams();

	const department_id = useMemo(() => {
		let value = 0;
		classes?.forEach((e) => {
			if (e?.id?.toString() === class_id?.toString()) value = Number(e?.department_id);
		});
		return value;
	}, [classes, class_id]);

	const [loading, setLoading] = useState(false);

	const [data, setData] = useState();

	const listData = useMemo(() => data?.data || [], [data]);

	const [filter, setFilter] = useState(
		filters || {
			page: 1,
			pages: 0,
			department_id: Number(department_id),
			academic_id: Number(academic?.id),
			semester_id: Number(semester?.id),
			status: -1,
			input: '',
		}
	);

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	const getData = async () => {
		setLoading(true);

		try {
			const _filter = cleanObjValue(filter);

			const res = await getClassSheets(class_id, _filter);

			if (isSuccess(res)) setData(res.data);
			else if (isEmpty(res)) setData({ data: [], page: 1, pages: 0 });
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const onPageChange = (event, newPage) => setFilter((prev) => ({ ...prev, page: newPage }));

	const handleSelect = () => {};

	const saveFilter = () => dispatch(actions.setFilter(filter));
	//#endregion

	useEffect(() => {
		getData();
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
			<MClassFilter filter={filter} onFilterChange={setFilter} />

			<Typography fontWeight={700} fontSize={25} lineHeight='30px' textAlign='center' mb={4}>
				{`${semester?.name} (${formatTimeSemester(semester?.start)}-${formatTimeSemester(
					semester?.end
				)}) - Năm học ${academic?.name}`}
			</Typography>

			<Box mb={1.5}>
				<Paper className='paper-wrapper'>
					<Typography fontSize={20} p={1.5} fontWeight={600}>
						Lớp {classData?.name} - {classData?.code}
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
				<CSearch
					onFilterChange={setFilter}
					defaultInput={filter?.input}
					placeholder='Nhập MSSV hoặc tên'
				/>
			</Stack>

			<ListStudentsTable
				data={listData}
				refetch={getData}
				isSelectedAll={false}
				selected={[]}
				onSelect={handleSelect}
				loading={loading}
				saveFilter={saveFilter}
			/>

			<CPagination page={paginate.page} pages={paginate.pages} onChange={onPageChange} />
		</Box>
	);
	//#endregion
};

export default HistoryClassPage;
