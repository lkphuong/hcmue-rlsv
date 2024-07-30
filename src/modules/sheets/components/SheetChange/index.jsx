import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import Header from './Header';

import './index.scss';

export const SheetChange = ({ data }) => {
	//#region Data
	//#endregion

	//#region Event
	//#endregion

	//#region Render
	return (
		<form>
			<TableContainer>
				<Table
					stickyHeader
					sx={{
						'& .MuiTableCell-root': { border: '1px solid rgba(224, 224, 224, 1)' },
					}}
				>
					<TableHead>
						<TableRow>
							<TableCell
								align='center'
								rowSpan={2}
								width={60}
								sx={{ minWidth: '60px' }}
							>
								Mục
							</TableCell>
							<TableCell rowSpan={2} sx={{ minWidth: '650px' }}>
								Nội dung đánh giá
							</TableCell>
							<TableCell
								align='center'
								rowSpan={2}
								width={140}
								sx={{ minWidth: '140px' }}
							>
								Khung điểm
							</TableCell>
							<TableCell align='center' colSpan={4} sx={{ minWidth: '390px' }}>
								Điểm đánh giá
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align='center' width={85}>
								Sinh viên
							</TableCell>
							<TableCell align='center' width={85}>
								Lớp
							</TableCell>
							<TableCell align='center' width={85}>
								CVHT
							</TableCell>
							<TableCell align='center' width={85}>
								Khoa
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.headers?.length > 0 &&
							data.headers.map((e, i) => <Header key={i} data={e} index={i + 1} />)}
					</TableBody>
				</Table>
			</TableContainer>
		</form>
	);
	//#endregion
};
