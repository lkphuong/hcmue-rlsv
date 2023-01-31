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

export const MListDepartmentAccounts = ({ data, refetch }) => {
	//#region Data

	//#endregion

	//#region Event
	//#endregion

	//#region Render
	return (
		<Box>
			<TableContainer className='c-table'>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell align='center'>STT</TableCell>
							<TableCell align='left'>Tên khoa</TableCell>
							<TableCell align='center'>Tên đăng nhập</TableCell>
							<TableCell align='center'>Thao tác</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.length > 0 ? (
							data.map((row, index) => (
								<Row
									key={row?.id + index}
									index={index}
									data={row}
									refetch={refetch}
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
		</Box>
	);
	//#endregion
};
