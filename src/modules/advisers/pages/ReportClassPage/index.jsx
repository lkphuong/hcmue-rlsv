import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { shallowEqual, useSelector } from 'react-redux';

import { Box, Paper, Stack, Typography } from '@mui/material';

import { CPagination, CSearch } from '_controls/';

import { ListStudentsTable, MClassFilter, MClassPrint } from '_modules/advisers/components';

import { getClassSheets } from '_api/sheets.api';

import { cleanObjValue, formatTimeSemester, isEmpty, isSuccess } from '_func/index';

const ReportClassPage = () => {
	//#region Data
	const printRef = useRef();

	const { academic, semester, classData } = useSelector(
		(state) => state.currentInfo,
		shallowEqual
	);
	const { classes } = useSelector((state) => state.auth.profile, shallowEqual);

	const { class_id } = useParams();

	const department_id = useMemo(() => {
		let value = 0;
		classes?.forEach((e) => {
			if (e?.id?.toString() === class_id?.toString()) value = Number(e?.department_id);
		});
		return value;
	}, [classes, class_id]);

	const [loading, setLoading] = useState(false);

	const [selected, setSelected] = useState([]);

	const [isSelectedAll, setSelectedAll] = useState(false);

	const [data, setData] = useState();

	const listData = useMemo(() => data?.data || [], [data]);

	const [filter, setFilter] = useState({
		page: 1,
		pages: 0,
		department_id: department_id,
		academic_id: Number(academic?.id),
		semester_id: Number(semester?.id),
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
				if (isSelectedAll === false) setSelected([]);
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
				}
			}
		},
		[isSelectedAll]
	);

	// const handlePrint = useReactToPrint({
	// 	content: () => printRef.current,
	// });
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
					<Stack
						direction='row'
						p={1.5}
						justifyContent='space-between'
						alignItems='center'
					>
						<Typography fontSize={20} fontWeight={600}>
							Thống kê của lớp {classData?.name} - {classData?.code}
						</Typography>
						{/* <Button
							disabled={listData.length === 0}
							startIcon={<Print />}
							onClick={handlePrint}
						>
							In thống kê
						</Button> */}
					</Stack>
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
				isSelectedAll={isSelectedAll}
				selected={selected}
				onSelect={handleSelect}
				loading={loading}
			/>

			<CPagination page={paginate.page} pages={paginate.pages} onChange={onPageChange} />

			<MClassPrint
				ref={printRef}
				academic={academic}
				semester={semester}
				department_id={department_id}
				class_id={class_id}
			/>
		</Box>
	);
	//#endregion
};

export default ReportClassPage;
