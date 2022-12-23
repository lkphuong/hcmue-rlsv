import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Box, Paper, Typography } from '@mui/material';

import { FilterStudent, ListStudents } from '_modules/list/components';

import { getClassSheets } from '_api/sheets.api';

import { isSuccess, isEmpty } from '_func/';

import { CPagination } from '_controls/';
import { actions } from '_slices/filter.slice';

export const NameContext = createContext();

const StudentListPage = () => {
	//#region Data
	const { department_id } = useSelector((state) => state.auth.profile, shallowEqual);
	const { semesters, academic_years } = useSelector((state) => state.options, shallowEqual);
	const filters = useSelector((state) => state.filter.filters, shallowEqual);

	const { class_id, class_name } = useParams();

	const [data, setData] = useState();

	const dataTable = useMemo(() => data?.data || [], [data]);

	const [filter, setFilter] = useState(
		filters || {
			department_id,
			semester_id: semesters[0]?.id,
			academic_id: academic_years[0].id,
			page: 1,
			pages: 0,
			input: '',
		}
	);

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });

	const [selected, setSelected] = useState([]);

	const [isSelectedAll, setSelectedAll] = useState(false);

	const dispatch = useDispatch();
	//#endregion

	//#region Event
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

	const getData = useCallback(async () => {
		if (!class_id) return;

		const res = await getClassSheets(class_id, filter);

		if (isSuccess(res)) setData(res.data);
		else if (isEmpty(res)) {
			setData({ data: [], page: 1, pages: 0 });
		}
	}, [filter, class_id]);

	const onPageChange = (event, value) => setFilter((prev) => ({ ...prev, page: value }));

	const saveFilter = () => {
		dispatch(actions.setFilter(filter));
	};
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
			<NameContext.Provider value={{ class_name }}>
				<Box mb={1.5}>
					<Paper className='paper-wrapper'>
						<Typography fontSize={20} p={1.5} fontWeight={600}>
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
					saveFilter={saveFilter}
				/>

				<CPagination page={paginate.page} pages={paginate.pages} onChange={onPageChange} />
			</NameContext.Provider>
		</Box>
	);
};

export default StudentListPage;
