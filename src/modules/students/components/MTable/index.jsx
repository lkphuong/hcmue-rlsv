import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';

import { CLoadingSpinner } from '_others/';

import { MRow } from './MRow';

export const MTable = ({ data, isLoading }) => {
	return (
		<TableContainer className='c-table'>
			<Table stickyHeader>
				<TableHead>
					<TableRow>
						<TableCell align='center'>STT</TableCell>
						<TableCell align='center'>MSSV</TableCell>
						<TableCell align='center'>Tình trạng học</TableCell>
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
