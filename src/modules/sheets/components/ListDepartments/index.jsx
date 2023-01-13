import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { Row } from './Row';

export const ListDepartments = ({ data, academic, semester }) => {
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
						<TableCell align='center'>Tình trạng chấm của khoa</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data?.length > 0 &&
						data.map((row, index) => (
							<Row
								key={row?.id}
								data={row}
								index={index + 1}
								academic={academic}
								semester={semester}
							/>
						))}
				</TableBody>
			</Table>
		</TableContainer>
	);
	//#endregion
};
