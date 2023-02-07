import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { MRow } from './MRow';

export const StudentsTable = ({ data }) => {
	return (
		<TableContainer>
			<Table sx={{ '& .MuiTableCell-root': { border: '0.5px solid black' } }}>
				<TableHead
					sx={{
						'& .MuiTableCell-root': { fontSize: '16px!important' },
					}}
				>
					<TableRow>
						<TableCell align='center' rowSpan={2}>
							TT
						</TableCell>
						<TableCell align='center' rowSpan={2}>
							MSSV
						</TableCell>
						<TableCell align='center' rowSpan={2}>
							Họ và tên
						</TableCell>
						<TableCell align='center' rowSpan={2}>
							Ngày sinh
						</TableCell>
						<TableCell align='center' rowSpan={2}>
							Lớp
						</TableCell>
						<TableCell align='center' rowSpan={2}>
							Khoa
						</TableCell>
						<TableCell
							align='center'
							colSpan={2}
							sx={{
								textTransform: 'capitalize!important',
								padding: '4px !important',
							}}
						>
							Kết quả đánh giá rèn luyện
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell align='center' sx={{ padding: '4px !important' }}>
							Điểm
						</TableCell>
						<TableCell align='center' sx={{ padding: '4px !important' }}>
							Xếp loại
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody
					sx={{
						'& .MuiTableCell-root': { fontSize: '14px!important' },
					}}
				>
					{data?.length > 0 &&
						data.map((row, index) => (
							<MRow key={row?.id?.toString() + index} data={row} index={index + 1} />
						))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};
