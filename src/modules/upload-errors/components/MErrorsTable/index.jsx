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

export const MErrorsTable = ({ isLoading, data }) => {
	return (
		<TableContainer className='c-table'>
			<Table stickyHeader>
				<TableHead>
					<TableRow>
						<TableCell>Tên Sinh Viên</TableCell>
						<TableCell>Thời điểm xảy ra lỗi</TableCell>
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
						data.map((row, index) => <MRow key={row?.id} data={row} />)
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
