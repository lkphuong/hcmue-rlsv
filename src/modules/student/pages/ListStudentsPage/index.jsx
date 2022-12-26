import { useCallback, useEffect, useState } from 'react';

import { Box } from '@mui/material';

import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { getClasses } from '_api/classes.api';

import { isEmpty, isSuccess } from '_func/';

import { Filter } from '_modules/student/components';

import { actions } from '_slices/filter.slice';

const ListStudentsPage = () => {
	//#region Data
	const semesters = useSelector((state) => state.options.semesters, shallowEqual);
	const academic_years = useSelector((state) => state.options.academic_years, shallowEqual);
	const departments = useSelector((state) => state.options.departments, shallowEqual);
	const filters = useSelector((state) => state.filter.filters, shallowEqual);

	const [data, setData] = useState(null);

	const [classes, setClasses] = useState([]);

	const [filter, setFilter] = useState(
		filters || {
			pages: 0,
			page: 1,
			department_id: departments[0].id,
			class_id: '',
			semester_id: semesters[0]?.id,
			academic_id: academic_years[0]?.id,
			status: -1,
		}
	);

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	const getClassesOptions = useCallback(async () => {
		const res = await getClasses(filter.department_id);

		if (isSuccess(res)) setClasses(res.data);
		else if (isEmpty(res)) setClasses([]);
	}, [filter.department_id]);

	const onPageChange = (event, value) => setFilter((prev) => ({ ...prev, page: value }));

	const getData = async () => {
		// const _filter = { ...filter };
		// if (!_filter?.input) {
		// 	delete _filter?.input;
		// }
		// if (!_filter.status) {
		// 	_filter.status = -1;
		// }
		// const res = await getAdminSheets(_filter);
		// if (isSuccess(res)) setData(res.data);
		// else if (isEmpty(res)) setData({ data: [], page: 1, pages: 0 });
	};

	const saveFilter = () => {
		dispatch(actions.setFilter(filter));
	};
	//#endregion

	useEffect(() => {
		if (filter.class_id) getData();
	}, [filter]);

	useEffect(() => {
		setPaginate({ page: data?.page, pages: data?.pages });
	}, [data]);

	//#region Render
	return (
		<Box>
			<Filter
				filter={filter}
				onChangeFilter={setFilter}
				semesters={semesters}
				departments={departments}
				academic_years={academic_years}
				classes={classes}
			/>
		</Box>
	);
	//#endregion
};

export default ListStudentsPage;
