import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

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

export const ListSheets = ({ data, loading, saveFilter }) => {
	//#region Data
	const { pathname } = useLocation();

	const isHistory = useMemo(() => pathname.includes('history'), [pathname]);
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
						<TableCell align='left'>Họ và tên</TableCell>
						<TableCell align='center'>MSSV</TableCell>
						<TableCell align='center'>Điểm SV chấm</TableCell>
						<TableCell align='center'>Điểm lớp chấm</TableCell>
						<TableCell align='center'>Điểm CVHT chấm</TableCell>
						<TableCell align='center'>Điểm khoa chấm</TableCell>
						<TableCell align='center'>Xếp loại</TableCell>
						<TableCell align='center'>Trạng thái</TableCell>
						<TableCell />
					</TableRow>
				</TableHead>
				<TableBody>
					{loading ? (
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
								isHistory={isHistory}
								saveFilter={saveFilter}
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
