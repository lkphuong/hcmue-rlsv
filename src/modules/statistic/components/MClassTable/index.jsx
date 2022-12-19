/* eslint-disable no-unused-vars */
import React, { memo, useState, useEffect, useMemo } from 'react';

import {
	Box,
	Breadcrumbs,
	Link,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';

import { getClassSheets } from '_api/sheets.api';

import { CPagination } from '_controls/';

const MClassTable = memo(({ classData, academic_id, semester_id, department_id, onBack }) => {
	//#region Data
	const [data, setData] = useState();

	const tableData = useMemo(() => data?.data || [], [data]);

	const [filter, setFilter] = useState({
		academic_id,
		semester_id,
		department_id,
		page: 1,
		pages: 0,
	});

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });
	//#endregion

	//#region Event
	const getClassData = async () => {
		const res = await getClassSheets(classData?.id, filter);

		setData(res.data);
	};

	const onPageChange = (event, value) => setFilter((prev) => ({ ...prev, page: value }));
	//#endregion

	useEffect(() => {
		getClassData();
	}, [classData?.id, filter]);

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
					<Box p={1.5}>
						<Typography fontSize={20} fontWeight={600} mb={1}>
							Thống kê điểm rèn luyện của lớp {classData?.name}
						</Typography>

						<Breadcrumbs>
							<Link underline='hover' onClick={onBack} href='#'>
								Danh sách lớp
							</Link>
							<Typography color='text.primary' fontSize='120%' fontWeight={500}>
								{classData?.name}
							</Typography>
						</Breadcrumbs>
					</Box>
				</Paper>
			</Box>

			<TableContainer className='c-table'>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell align='center'>STT</TableCell>
							<TableCell align='left'>Họ và tên</TableCell>
							<TableCell align='center'>Mã số sinh viên</TableCell>
							<TableCell align='center'>Điểm SV chấm</TableCell>
							<TableCell align='center'>Điểm lớp chấm</TableCell>
							<TableCell align='center'>Điểm khoa chấm</TableCell>
							<TableCell align='center'>Xếp loại</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{tableData?.length > 0 &&
							tableData.map((row, index) => (
								<TableRow key={row.id}>
									<TableCell align='center' height={50}>
										{index + 1}
									</TableCell>
									<TableCell align='left'>{row?.user?.fullname}</TableCell>
									<TableCell align='center'>{row?.user?.std_code}</TableCell>
									<TableCell align='center'>
										{row?.sum_of_personal_marks}
									</TableCell>
									<TableCell align='center'>{row?.sum_of_class_marks}</TableCell>
									<TableCell align='center'>
										{row?.sum_of_department_marks}
									</TableCell>
									<TableCell align='center'>
										{row?.level?.name || 'Chưa đánh giá'}
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>

			<CPagination page={paginate.page} pages={paginate.pages} onChange={onPageChange} />
		</Box>
	);
	//#endregion
});

export default MClassTable;
