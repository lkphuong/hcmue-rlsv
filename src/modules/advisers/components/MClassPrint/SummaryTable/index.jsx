import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';

import { MRow } from './MRow';

export const SummaryTable = ({ data }) => {
	return (
		<>
			<Typography ml={3} my={2.5}>
				Tổng số sinh viên: {data?.sum_of_std_in_classes} SV
			</Typography>

			<Box display='flex' justifyContent='center'>
				<TableContainer sx={{ maxWidth: '80%' }}>
					<Table sx={{ '& .MuiTableCell-root': { border: '0.5px solid black' } }}>
						<TableHead
							sx={{
								'& .MuiTableCell-root': { fontSize: '16px!important' },
							}}
						>
							<TableRow>
								<TableCell align='left'>Xếp loại</TableCell>
								<TableCell align='center'>Số lượng</TableCell>
								<TableCell align='center'>Tỷ lệ</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data?.sum_of_levels?.length > 0 &&
								data?.sum_of_levels?.map((row, index) => (
									<MRow
										key={index}
										data={row}
										total={data?.sum_of_std_in_classes}
									/>
								))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</>
	);
};
