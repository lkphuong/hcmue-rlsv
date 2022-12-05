import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { shallowEqual, useSelector } from 'react-redux';

import { Box, Paper, Typography } from '@mui/material';

import { FilterStudent, ListStudents } from '_modules/list/components';

import { getClassSheets } from '_api/sheets.api';

import { isSuccess, isEmpty } from '_func/';

import { CPagination } from '_controls/';

const StudentListPage = () => {
	//#region Data
	const { department_id } = useSelector((state) => state.auth.profile, shallowEqual);
	const { semesters, academic_years } = useSelector((state) => state.options, shallowEqual);

	const { class_id, class_name } = useParams();

	const [data, setData] = useState();

	const dataTable = useMemo(() => data?.data || [], [data]);

	const [filter, setFilter] = useState({
		department_id,
		semester_id: semesters[0]?.id,
		academic_id: academic_years[0].id,
		page: 1,
		pages: 0,
		input: '',
	});

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });

	const [selected, setSelected] = useState([]);

	const [isSelectedAll, setSelectedAll] = useState(false);

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

	//#region Event
	const getData = useCallback(async () => {
		if (!class_id) return;

		const res = await getClassSheets(class_id, filter);

		if (isSuccess(res)) setData(res.data);
		else if (isEmpty(res)) {
			setData({ data: [], page: 1, pages: 0 });
		}
	}, [filter, class_id]);

	const onPageChange = (event, value) => setFilter((prev) => ({ ...prev, page: value }));
	//#endregion

	useEffect(() => {
		getData();
	}, [getData]);

	useEffect(() => {
		setPaginate({
			page: data?.page,
			pages: data?.pages,
		});
	}, [data]);

	return (
		<Box>
			<Box mb={1.5}>
				<Paper className='paper-wrapper'>
					<Typography fontSize={20} p={1.5}>
						Danh sách điểm rèn luyện lớp {class_name}
					</Typography>
				</Paper>
			</Box>

			<FilterStudent
				filter={filter}
				onChangeFilter={setFilter}
				semesters={semesters}
				academic_years={academic_years}
			/>

			<ListStudents
				data={dataTable}
				refetch={getData}
				isSelectedAll={isSelectedAll}
				selected={selected}
				onSelect={handleSelect}
			/>

			<CPagination page={paginate.page} pages={paginate.pages} onChange={onPageChange} />
		</Box>
	);
};

export default StudentListPage;
