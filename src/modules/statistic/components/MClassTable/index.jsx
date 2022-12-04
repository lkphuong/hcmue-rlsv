/* eslint-disable no-unused-vars */
import React, { memo, useState, useEffect } from 'react';

import {
	Box,
	CardHeader,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';

import { getClassSheets } from '_api/sheets.api';

const FAKE_DATA = [
	{
		id: 1,
		user: { fullname: 'Đặng Hoàng Phúc', std_code: '41.01.104.094' },
		level: { name: 'Khá' },
		sum_of_personal_marks: 70,
		sum_of_class_marks: 65,
		sum_of_department_marks: 80,
	},
	{
		id: 2,
		user: { fullname: 'Đặng Hoàng Phúc', std_code: '41.01.104.094' },
		level: { name: 'Khá' },
		sum_of_personal_marks: 70,
		sum_of_class_marks: 65,
		sum_of_department_marks: 80,
	},
	{
		id: 3,
		user: { fullname: 'Đặng Hoàng Phúc', std_code: '41.01.104.094' },
		level: { name: 'Khá' },
		sum_of_personal_marks: 70,
		sum_of_class_marks: 65,
		sum_of_department_marks: 80,
	},
	{
		id: 4,
		user: { fullname: 'Đặng Hoàng Phúc', std_code: '41.01.104.094' },
		level: { name: 'Khá' },
		sum_of_personal_marks: 70,
		sum_of_class_marks: 65,
		sum_of_department_marks: 80,
	},
];

const MClassTable = memo(({ classData, academic_id, semester_id }) => {
	//#region Data
	const [data, setData] = useState([]);
	//#endregion

	//#region Event
	const getClassData = async () => {
		const res = await getClassSheets(classData?.id, { academic_id, semester_id });

		setData(res.data);
	};
	//#endregion

	useEffect(() => {
		getClassData();
	}, [classData?.id, academic_id, semester_id]);

	//#region Render
	return (
		<Box>
			<CardHeader title={`DANH SÁCH SINH VIÊN LỚP ${classData.name}`} />
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
						{data?.length > 0 &&
							data.map((row, index) => (
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
		</Box>
	);
	//#endregion
});

export default MClassTable;
