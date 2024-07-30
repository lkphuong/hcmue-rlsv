/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Box, Paper, Typography } from '@mui/material';

import { CPagination } from '_controls/';

import { ListChanges } from '_modules/sheets/components';

import { isSuccess, cleanObjValue, isEmpty } from '_func/';

import { getChangeHistory } from '_api/sheets.api';

import { actions } from '_slices/filter.slice';

const ChangeHistoryPage = () => {
	//#region Data
	const filters = useSelector((state) => state.filter.filters, shallowEqual);

	const { sheet_id } = useParams();

	const [loading, setLoading] = useState(false);

	const [data, setData] = useState();

	const listData = useMemo(() => data?.data || [], [data]);

	const [filter, setFilter] = useState(
		filters
			? { ...filters, sheet_id }
			: {
					page: 1,
					pages: 0,
					status: -1,
					input: '',
					sheet_id,
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

			const res = await getChangeHistory(_filter);

			if (isSuccess(res)) setData(res.data);
			else if (isEmpty(res)) setData({ data: [], page: 1, pages: 0 });
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const onPageChange = (event, newPage) => setFilter((prev) => ({ ...prev, page: newPage }));

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
			<Box mb={1.5}>
				<Paper className='paper-wrapper'>
					<Typography fontSize={20} p={1.5} fontWeight={600}>
						Lịch sử chỉnh sửa điểm
					</Typography>
				</Paper>
			</Box>

			<ListChanges data={listData} loading={loading} saveFilter={saveFilter} />

			<CPagination page={paginate.page} pages={paginate.pages} onChange={onPageChange} />
		</Box>
	);
	//#endregion
};

export default ChangeHistoryPage;
