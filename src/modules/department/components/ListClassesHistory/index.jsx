import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';

import { Row } from './Row';

export const ListDepartmentsHistory = ({ data, onSetCurrent }) => {
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
						<TableCell align='left'>Tên lớp</TableCell>
						<TableCell align='center'>Tình trạng chấm của lớp</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data?.length > 0 ? (
						data.map((row, index) => (
							<Row
								key={row?.id}
								data={row}
								index={index + 1}
								onSetCurrent={onSetCurrent}
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
