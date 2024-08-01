import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Box, Paper, Stack, Typography } from '@mui/material';

import { CPagination, CSearch } from '_controls/';

import { ListSheets, MDepartmentFilter } from '_modules/department/components';

import { getClassSheets } from '_api/sheets.api';

import { cleanObjValue, formatTimeSemester, isEmpty, isSuccess } from '_func/index';

import { actions } from '_slices/filter.slice';

const SheetsDepartmentPage = () => {
	//#region Data
	const { academic, semester, classData } = useSelector((state) => state.currentInfo, shallowEqual);
	const { fullname: departmentName, department_id } = useSelector(
		(state) => state.auth.profile,
		shallowEqual
	);
	const filters = useSelector((state) => state.filter.filters, shallowEqual);

	const { class_id } = useParams();

	const [loading, setLoading] = useState(false);

	const [selected, setSelected] = useState([]);
	const [except, setExcept] = useState([]);

	const [isSelectedAll, setSelectedAll] = useState(false);

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

	const handleSelect = useCallback(
		(id) => (e, status) => {
			if (id === -1) {
				if (isSelectedAll === false) {
					setSelected([]);
					setExcept([]);
				} else if (except?.length > 0) {
					setExcept([]);
					return;
				}

				setSelectedAll(!isSelectedAll);
			} else {
				if (!isSelectedAll) {
					setSelected((prev) => {
						if (e.target.checked !== undefined) {
							if (e.target.checked) return [...prev, id];
							else return prev.filter((e) => e !== id);
						} else {
							if (status) return [...prev, id];
							else return prev.filter((e) => e !== id);
						}
					});
				} else {
					setExcept((prev) => {
						if (e.target.checked !== undefined) {
							if (e.target.checked) return prev.filter((e) => e !== id);
							else return [...prev, id];
						} else {
							if (status) return prev.filter((e) => e !== id);
							else return [...prev, id];
						}
					});
				}
			}
		},
		[isSelectedAll, except]
	);

	const refetch = async () => {
		setSelected([]);
		setExcept([]);
		setSelectedAll(false);
		await getData();
	};

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
			<MDepartmentFilter filter={filter} onFilterChange={setFilter} />

			<Typography fontWeight={700} fontSize={25} lineHeight='30px' textAlign='center' mb={4}>
				{!!semester &&
					!!academic &&
					`${semester?.name} (${formatTimeSemester(semester?.start)}-${formatTimeSemester(
						semester?.end
					)}) - Năm học ${academic?.name}`}
			</Typography>

			<Box mb={1.5}>
				<Paper className='paper-wrapper'>
					<Typography fontSize={20} p={1.5} fontWeight={600}>
						{departmentName} - Lớp {classData?.name} - {classData?.code}
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

			<ListSheets
				data={listData}
				refetch={refetch}
				isSelectedAll={isSelectedAll}
				selected={selected}
				except={except}
				onSelect={handleSelect}
				loading={loading}
				academic_id={Number(academic?.id)}
				semester_id={Number(semester?.id)}
				department_id={department_id}
				saveFilter={saveFilter}
				class_id={class_id}
			/>

			<CPagination page={paginate.page} pages={paginate.pages} onChange={onPageChange} />
		</Box>
	);
	//#endregion
};

export default SheetsDepartmentPage;
