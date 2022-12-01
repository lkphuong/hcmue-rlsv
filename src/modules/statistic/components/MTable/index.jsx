import React from 'react';

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

import MRow from './MRow';
import MFooter from './MFooter';

const MTable = ({ data, onClick }) => {
	//#region Data

	//#endregion

	//#region Event

	//#endregion

	//#region Render
	return (
		<Box>
			<CardHeader title='DANH SÁCH THỐNG KÊ PHIẾU CHẤM ĐIỂM RÈN LUYỆN CỦA KHOA' />
			<TableContainer className='c-table'>
				<Table stickyHeader className='statistic-table'>
					<TableHead>
						<TableRow>
							<TableCell rowSpan={2} align='center'>
								STT
							</TableCell>
							<TableCell rowSpan={2} align='center'>
								Lớp
							</TableCell>
							<TableCell rowSpan={2} align='center' className='border-right'>
								Sĩ số
							</TableCell>
							<TableCell colSpan={7} align='center' className='border-left'>
								Xếp loại
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align='center' width={100} className='border-left'>
								Xuất sắc
							</TableCell>
							<TableCell align='center' width={100} className='border-left'>
								Tốt
							</TableCell>
							<TableCell align='center' width={100} className='border-left'>
								Khá
							</TableCell>
							<TableCell align='center' width={100} className='border-left'>
								Trung bình
							</TableCell>
							<TableCell align='center' width={100} className='border-left'>
								Yếu
							</TableCell>
							<TableCell align='center' width={100} className='border-left'>
								Kém
							</TableCell>
							<TableCell align='center' width={100} className='border-left'>
								Không xếp loại
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.length > 0 &&
							data.map((row, index) => (
								<MRow
									key={row.id}
									index={index}
									data={row}
									previewClass={onClick}
								/>
							))}
					</TableBody>

					<MFooter data={data} />
				</Table>
			</TableContainer>
		</Box>
	);
	//#endregion
};

export default MTable;
