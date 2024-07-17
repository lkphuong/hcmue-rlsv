import { useRef } from 'react';

import { FilterAlt } from '@mui/icons-material';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import { CTable } from '_others/';

import { MRow } from './MRow';
import { MStatus } from './MStatus';

export const MTable = ({ data, isLoading, onFilterChange }) => {
	//#region Data
	const statusRef = useRef();
	//#endregion

	//#region Event
	const toggle = (event) => statusRef.current.onMenu(event);
	//#endregion

	//#region Render
	return (
		<CTable loading={isLoading}>
			<Table stickyHeader>
				<TableHead>
					<TableRow>
						{/* <TableCell align='center'>STT</TableCell> */}
						<TableCell align='center'>MSSV</TableCell>
						<TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>
							<Button endIcon={<FilterAlt />} onClick={toggle} size='small' sx={{ color: 'white' }}>
								TÌNH TRẠNG HỌC
							</Button>
						</TableCell>
						<TableCell align='left'>Họ và tên</TableCell>
						<TableCell align='center' style={{ whiteSpace: 'nowrap' }}>
							Ngày sinh
						</TableCell>
						<TableCell align='center'>Khóa học</TableCell>
						<TableCell align='center'>Khoa</TableCell>
						<TableCell align='center'>Ngành học</TableCell>
						<TableCell align='center'>Mã lớp</TableCell>
						<TableCell align='center'>Lớp</TableCell>
						<TableCell align='center'>Phân quyền</TableCell>
						<TableCell align='center'>Reset</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data?.length > 0 ? (
						data.map((row, index) => <MRow key={row?.id} index={index} data={row} />)
					) : (
						<TableRow>
							<TableCell colSpan='100%'>
								<Box minHeight={300} display='flex' justifyContent='center' alignItems='center'>
									Không có dữ liệu hiển thị
								</Box>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			<MStatus ref={statusRef} onFilterChange={onFilterChange} />
		</CTable>
	);
	//#endregion
};
