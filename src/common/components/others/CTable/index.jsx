import {
	Box,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import { CLoadingSpinner } from '..';
import { CPagination } from '_controls/';

export const CTable = ({
	headers = [
		{
			key: '',
			label: '',
			width: 'auto',
			align: 'center',
			colSpan: 1,
			render: null,
			cellRender: null,
		},
	],
	data = [],
	rowKey = 'id',
	loading = false,
	showIndexCol = true,
	pagination = { page: 1, pages: 0, onPageChange: () => {} },
}) => {
	return (
		<Stack direction='column' justifyContent='space-between'>
			<TableContainer className='c-table'>
				{loading && (
					<Box
						position='absolute'
						zIndex={3}
						height='calc(100% - 51.75px)'
						width='100%'
						bottom={0}
						display='flex'
						alignItems='center'
						justifyContent='center'
						sx={{ backgroundColor: 'rgb(255 255 255 / 40%)' }}
					>
						<CLoadingSpinner />
					</Box>
				)}

				<Table stickyHeader>
					<TableHead>
						<TableRow>
							{showIndexCol && <TableCell align='center'>STT</TableCell>}
							{headers.map((header, index) => (
								<TableCell
									key={header.key + index}
									colSpan={header.colSpan ?? 1}
									align={header.align ?? 'center'}
									width={header.width ?? 'auto'}
									style={{ whiteSpace: 'nowrap' }}
								>
									{header?.render ? header.render() : header.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.length > 0 ? (
							data.map((row, index) => (
								<TableRow key={row[rowKey] + index}>
									{showIndexCol && (
										<TableCell align='center'>{index + 1 + (pagination.page - 1) * 10}</TableCell>
									)}
									{headers.map((column, _index) => (
										<TableCell
											align={column.align ?? 'center'}
											key={column.key + _index}
											style={{ fontSize: '12px' }}
										>
											{column?.cellRender
												? column.cellRender(row?.[column.key], row, index)
												: typeof row?.[column.key] !== 'string' ||
												  typeof row?.[column.key] !== 'number'
												? row?.[column.key]?.toString()
												: row?.[column.key]}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan='100%'>
									<Box minHeight={300} display='flex' justifyContent='center' alignItems='center'>
										Không có dữ liệu hiển thị
									</Box>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<CPagination
				page={pagination.page ?? 1}
				pages={pagination.pages ?? 0}
				onChange={pagination.onPageChange}
				isLoading={loading}
				isGoTo
			/>
		</Stack>
	);
};
