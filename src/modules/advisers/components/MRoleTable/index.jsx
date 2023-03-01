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

export const MRoleTable = ({ data }) => {
	//#region Data
	//#endregion

	//#region Event
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
							Tình trạng học
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
					{data?.length > 0 ? (
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
	//#endregion
};
