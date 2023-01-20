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
						<TableCell align='left'>Họ và tên</TableCell>
						<TableCell align='center'>Số điện thoại</TableCell>
						<TableCell align='left'>Email</TableCell>
						<TableCell align='center'>Học vị</TableCell>
						<TableCell align='left'>Khoa</TableCell>
						<TableCell align='center'>Lớp phụ trách</TableCell>
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
		</TableContainer>
	);
};
