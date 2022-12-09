import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { Box, Button, Paper, Typography } from '@mui/material';

import { Filter, ListForms } from '_modules/form/components';

import { ROUTES } from '_constants/routes';

import { getForms } from '_api/form.api';

import { isSuccess, isEmpty, isFalsy } from '_func/';

import { CPagination } from '_controls/';

const ListFormsPage = () => {
	//#region Data

	const [data, setData] = useState();

	const dataTable = useMemo(() => data?.data || [], [data]);

	const [filter, setFilter] = useState({
		page: 1,
		pages: 0,
		status: -1,
	});

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });
	//#endregion

	//#region Event
	const getData = async () => {
		const _filter = { ...filter };

		if (!_filter?.academic_id) {
			delete _filter.academic_id;
		}
		if (!_filter?.semester_id) {
			delete _filter.semester_id;
		}

		if (isFalsy(_filter.status)) {
			_filter.status = -1;
		}

		const res = await getForms(_filter);

		if (isSuccess(res)) setData(res.data);
		else if (isEmpty(res)) setData({ data: [], page: 1, pages: 0 });
	};

	const onPageChange = (event, value) => setFilter((prev) => ({ ...prev, page: value }));
	//#endregion

	useEffect(() => {
		getData();
	}, [filter]);

	useEffect(() => {
		setPaginate({
			page: data?.page,
			pages: data?.pages,
		});
	}, [data]);

	//#region Render
	return (
		<Box>
			<Box mb={1.5}>
				<Paper className='paper-wrapper'>
					<Typography fontSize={20} p={1.5}>
						Lịch sử biểu mẫu đánh giá kết quả rèn luyện
					</Typography>
				</Paper>
			</Box>

			<Filter filter={filter} onChangeFilter={setFilter} />

			<Box textAlign='right' my={2}>
				<Link to={ROUTES.FORM_CREATE}>
					<Button variant='contained'>Thêm mới</Button>
				</Link>
			</Box>

			<ListForms data={dataTable} refetch={getData} />

			<CPagination page={paginate.page} pages={paginate.pages} onChange={onPageChange} />
		</Box>
	);
	//#endregion
};

export default ListFormsPage;
