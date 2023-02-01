import { useEffect, useMemo, useRef, useState } from 'react';

import { Box, Button } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';

import { CPagination } from '_controls/';

import { isSuccess, cleanObjValue } from '_func/';

import { MFilter, MListDepartmentAccounts, MModal } from '_modules/department/components';

import { getDepartmentAccounts } from '_api/others.api';

const ListDepartmentAccountPage = () => {
	//#region Data
	const modalRef = useRef();

	const [filter, setFilter] = useState({
		page: 1,
		pages: 0,
		department_id: 0,
	});

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });

	const [data, setData] = useState();

	const listData = useMemo(() => data?.data || [], [data]);
	//#endregion

	//#region Event
	const getData = async () => {
		const _filter = cleanObjValue(filter);

		const res = await getDepartmentAccounts(_filter);

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

			<Box textAlign='right' mb={1.5}>
				<Button
					variant='contained'
					endIcon={<AddCircleOutline />}
					onClick={() => modalRef.current.open()}
				>
					Thêm mới
				</Button>
			</Box>

			<MListDepartmentAccounts
				data={listData}
				refetch={getData}
				onAdd={(department_id) => modalRef.current.open(department_id)}
			/>

			<CPagination page={paginate.page} pages={paginate.pages} onChange={onPageChange} />

			<MModal ref={modalRef} refetch={getData} />
		</Box>
	);
	//#endregion
};

export default ListDepartmentAccountPage;
