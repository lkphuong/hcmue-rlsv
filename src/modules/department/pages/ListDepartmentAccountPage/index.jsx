import { useEffect, useMemo, useRef, useState } from 'react';

import { Box, Button, Stack } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';

import { CPagination } from '_controls/';

import { isSuccess } from '_func/';

import { MFilter, MListDepartmentAccounts, MModal, MSearch } from '_modules/department/components';

import { getDepartmentAccounts } from '_api/other.api';

const ListDepartmentAccountPage = () => {
	//#region Data
	const modalRef = useRef();

	const [filter, setFilter] = useState({
		page: 1,
		pages: 0,
		input: '',
		department_id: 0,
	});

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });

	const [data, setData] = useState();

	const listData = useMemo(() => data?.data || [], [data]);
	//#endregion

	//#region Event
	const getData = async () => {
		//call api
		const res = await getDepartmentAccounts(filter);

		if (isSuccess(res)) {
			setData(res?.data);
		}
	};

	const onPageChange = (event, newPage) => setFilter((prev) => ({ ...prev, page: newPage }));
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
			<MFilter filter={filter} onFilterChange={setFilter} />

			<Stack
				direction={{ xs: 'column', md: 'row' }}
				spacing={1.5}
				justifyContent='space-between'
				alignItems='center'
				mb={2}
			>
				<MSearch onFilterChange={setFilter} placeholder='Tìm kiếm theo tên khoa' />

				<Button
					variant='contained'
					endIcon={<AddCircleOutline />}
					onClick={() => modalRef.current.open()}
				>
					Thêm mới
				</Button>
			</Stack>

			<MListDepartmentAccounts data={listData} refetch={getData} />

			<CPagination page={paginate.page} pages={paginate.pages} onChange={onPageChange} />

			<MModal ref={modalRef} refetch={getData} />
		</Box>
	);
	//#endregion
};

export default ListDepartmentAccountPage;
