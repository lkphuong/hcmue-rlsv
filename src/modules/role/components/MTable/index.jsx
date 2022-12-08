import React from 'react';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { MRow } from './MRow';

export const MTable = ({ data }) => {
	return (
		<TableContainer className='c-table'>
			<Table stickyHeader>
				<TableHead>
					<TableRow>
						<TableCell align='left'>Họ và tên</TableCell>
						<TableCell align='center'>Username</TableCell>
						<TableCell align='center'>Khoa</TableCell>
						<TableCell align='center'>Lớp</TableCell>
						<TableCell align='center'>Phân quyền</TableCell>
						<TableCell width={50} className='sticky sticky-right' />
					</TableRow>
				</TableHead>
				<TableBody>
					{data?.length > 0 ? (
						data.map((row, index) => (
							<MRow key={row?.user_id} index={index} data={row} />
						))
					) : (
						<TableRow>
							<TableCell height={300} colSpan='100%' align='center'>
								Không có dữ liệu hiển thị
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
};
