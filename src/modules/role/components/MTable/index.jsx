import React from 'react';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { MRow } from './MRow';

export const MTable = ({ data }) => {
	return (
		<TableContainer className='c-table'>
			<Table stickyHeader>
				<TableHead>
					<TableRow>
						<TableCell align='center'>Username</TableCell>
						<TableCell align='center'>Khoa</TableCell>
						<TableCell align='center'>Lớp</TableCell>
						<TableCell align='center'>Phân quyền</TableCell>
						<TableCell width={50} className='sticky sticky-right' />
					</TableRow>
				</TableHead>
				<TableBody>
					{data?.length > 0 &&
						data.map((row, index) => (
							<MRow key={row.id + index} index={index} data={row} />
						))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};
