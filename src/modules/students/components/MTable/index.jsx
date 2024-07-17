import { useRef } from 'react';

import { FilterAlt } from '@mui/icons-material';
import { Button } from '@mui/material';

import { CTable } from '_others/';

import { MStatus } from './MStatus';
import { MStatusCell } from './MStatusCell';
import { MRoleCell } from './MRoleCell';
import { MResetCell } from './MResetCell';

export const MTable = ({ data, isLoading, onFilterChange, page, pages, onPageChange }) => {
	//#region Data
	const statusRef = useRef();
	//#endregion

	//#region Event
	const toggle = (event) => statusRef.current.onMenu(event);
	//#endregion

	//#region Render
	const headers = [
		{
			key: 'std_code',
			label: 'MSSV',
		},
		{
			key: 'status',
			label: 'TÌNH TRẠNG HỌC',
			width: 175,
			render: () => (
				<Button endIcon={<FilterAlt />} onClick={toggle} size='small' sx={{ color: 'white' }}>
					TÌNH TRẠNG HỌC
				</Button>
			),
			cellRender: (value, record) => <MStatusCell data={record} />,
		},
		{
			key: 'name',
			label: 'Họ và tên',
			align: 'left',
		},
		{
			key: 'birthday',
			label: 'Ngày sinh',
		},
		{
			key: 'k',
			label: 'Khóa học',
			cellRender: (value) => <span>{value?.name}</span>,
		},
		{
			key: 'department',
			label: 'Khoa',
			cellRender: (value) => <span>{value?.name}</span>,
		},
		{
			key: 'major',
			label: 'Ngành học',
			cellRender: (value) => <span>{value?.name}</span>,
		},
		{
			key: 'classes',
			label: 'Mã lớp',
			cellRender: (value) => <span>{value?.code}</span>,
		},
		{
			key: 'classes',
			label: 'Lớp',
			cellRender: (value) => <span>{value?.name}</span>,
		},
		{
			key: 'role',
			label: 'Phân quyền',
			cellRender: (value, record) => <MRoleCell data={record} />,
		},
		{
			key: 'action',
			label: 'Reset',
			cellRender: (value, record) => <MResetCell data={record} />,
		},
	];

	return (
		<>
			<CTable
				loading={isLoading}
				headers={headers}
				data={data}
				showIndexCol={false}
				pagination={{ page, pages, onPageChange }}
			/>

			<MStatus ref={statusRef} onFilterChange={onFilterChange} />
		</>
	);
	//#endregion
};
