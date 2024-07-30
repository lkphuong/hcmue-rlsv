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

export const MTable = ({ data, refetch }) => {
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
						<TableCell align='center'>STT</TableCell>
						<TableCell align='center'>Năm học</TableCell>
						<TableCell align='center' />
					</TableRow>
				</TableHead>

				<TableBody>
					{data?.length > 0 ? (
						data.map((row, index) => (
							<MRow key={row.id} data={row} index={index + 1} refetch={refetch} />
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
