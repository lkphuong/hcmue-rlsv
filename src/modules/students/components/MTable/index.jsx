import { useRef } from 'react';

import { FilterAlt } from '@mui/icons-material';
import {
	Box,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';

import { CLoadingSpinner } from '_others/';

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
		<TableContainer className='c-table'>
			<Table stickyHeader>
				<TableHead>
					<TableRow>
						<TableCell align='center'>STT</TableCell>
						<TableCell align='center'>MSSV</TableCell>
						<TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>
							<Button
								sx={{ color: 'rgba(34, 51, 84, 0.7)' }}
								endIcon={<FilterAlt />}
								onClick={toggle}
								size='small'
							>
								TÌNH TRẠNG HỌC
							</Button>
						</TableCell>
						<TableCell align='left'>Họ và tên</TableCell>
						<TableCell align='center'>Ngày sinh</TableCell>
						<TableCell align='center'>Khóa học</TableCell>
						<TableCell align='center'>Khoa</TableCell>
						<TableCell align='center'>Ngành học</TableCell>
						<TableCell align='center'>Mã lớp</TableCell>
						<TableCell align='center'>Lớp</TableCell>
						<TableCell align='center'>Phân quyền</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{isLoading ? (
						<TableRow>
							<TableCell colSpan='100%' height={500}>
								<Box display='flex' alignItems='center' justifyContent='center'>
									<CLoadingSpinner />
								</Box>
							</TableCell>
						</TableRow>
					) : data?.length > 0 ? (
						data.map((row, index) => <MRow key={row?.id} index={index} data={row} />)
					) : (
						<TableRow>
							<TableCell colSpan='100%'>
								<Box
									minHeight={300}
									display='flex'
									justifyContent='center'
									alignItems='center'
								>
									Không có dữ liệu hiển thị
								</Box>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			<MStatus ref={statusRef} onFilterChange={onFilterChange} />
		</TableContainer>
	);
	//#endregion
};
