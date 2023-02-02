import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import { MRow } from './MRow';

export const MHistoryTable = ({ data }) => {
	//#region Data
	//#endregion

	//#region Event
	//#endregion

	//#region Render
	return (
		<TableContainer sx={{ maxHeight: '500px' }}>
			<Table stickyHeader>
				<TableHead>
					<TableRow>
						<TableCell align='center'>Tên lớp</TableCell>
						<TableCell align='center'>Học kỳ</TableCell>
						<TableCell align='center'>Năm học</TableCell>
						<TableCell align='center'>Tình trạng chấm của sinh viên</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data?.length > 0 ? (
						data.map((row, index) => <MRow key={row?.id + index} data={row} />)
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
	//#endregion
};
