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

import { Row } from './Row';

export const ListDepartmentsHistory = ({ data, academic, semester, isLoading }) => {
	//#region Data
	//#endregion

	//#region Event
	//#endregion

	//#region Render
	return (
		<TableContainer sx={{ maxHeight: 500 }}>
			<Table stickyHeader>
				<TableHead>
					<TableRow>
						<TableCell align='center'>STT</TableCell>
						<TableCell align='left'>Tên khoa</TableCell>
						<TableCell align='center'>Học kỳ</TableCell>
						<TableCell align='center'>Năm học</TableCell>
						<TableCell align='center'>Tình trạng chấm của khoa</TableCell>
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
						data.map((row, index) => (
							<Row
								key={row?.id}
								data={row}
								index={index + 1}
								academic={academic}
								semester={semester}
							/>
						))
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
