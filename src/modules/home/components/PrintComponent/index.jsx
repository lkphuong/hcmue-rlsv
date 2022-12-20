import { forwardRef, createContext } from 'react';

import {
	Box,
	Container,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';

import Header from './Header';

import './index.scss';

export const StudentMarksContextt = createContext();

export const PrintComponent = forwardRef(({ data }, ref) => {
	//#region Data
	//#endregion

	//#region Event
	//#endregion

	//#region Render
	return (
		<Box ref={ref} className='print-source' px={2} py={4}>
			<Box component='section' className='info'>
				<Typography ml={10}>TRƯỜNG ĐẠI HỌC SƯ PHẠM TP.HỒ CHÍ MINH</Typography>
				<Typography ml={10} mb={2}>
					KHOA:&nbsp;
					<Typography component='span' fontWeight={600}>
						{data?.department?.name}
					</Typography>
				</Typography>

				<Box textAlign='center' mb={2}>
					<Typography variant='h3'>PHIẾU ĐÁNH GIÁ KẾT QUẢ RÈN LUYỆN SINH VIÊN</Typography>
					<Typography component='span'>
						Học kỳ:
						<Typography component='span' fontWeight={600}>
							&nbsp;{data?.semester?.name},&nbsp;
						</Typography>
					</Typography>
					<Typography component='span'>
						Năm học:
						<Typography component='span' fontWeight={600}>
							&nbsp;{data?.academic?.name}&nbsp;
						</Typography>
					</Typography>
				</Box>

				<Box ml={10}>
					<Grid container spacing={1}>
						<Grid item xs={6}>
							<Typography component='span'>
								Họ tên:
								<Typography component='span' fontWeight={600}>
									&nbsp;{data?.user?.fullname}&nbsp;
								</Typography>
							</Typography>
						</Grid>

						<Grid item xs={6}>
							<Typography component='span'>
								MSSV:
								<Typography component='span' fontWeight={600}>
									&nbsp;{data?.user?.std_code}&nbsp;
								</Typography>
							</Typography>
						</Grid>

						<Grid item xs={6}>
							<Typography component='span'>
								Lớp:
								<Typography component='span' fontWeight={600}>
									&nbsp;{data?.class?.name}&nbsp;
								</Typography>
							</Typography>
						</Grid>

						<Grid item xs={6}>
							<Typography component='span'>
								Khóa:
								<Typography component='span' fontWeight={600}>
									&nbsp;{data?.k?.name}&nbsp;
								</Typography>
							</Typography>
						</Grid>
					</Grid>
				</Box>
			</Box>

			<Box component='section' className='form'>
				<Container maxWidth='lg'>
					<TableContainer>
						<Table
							stickyHeader
							sx={{
								'& .MuiTableCell-root': {
									border: '1px solid rgba(224, 224, 224, 1)',
								},
							}}
						>
							<TableHead>
								<TableRow>
									<TableCell align='center' rowSpan={2} width={50}>
										Mục
									</TableCell>
									<TableCell rowSpan={2} width='50%'>
										Nội dung đánh giá
									</TableCell>
									<TableCell align='center' rowSpan={2}>
										Khung điểm
									</TableCell>
									<TableCell
										align='center'
										colSpan={3}
										sx={{ padding: '1px 4px!important' }}
									>
										Điểm đánh giá
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell align='center' sx={{ padding: '1px 4px!important' }}>
										Sinh viên
									</TableCell>
									<TableCell align='center' sx={{ padding: '1px 4px!important' }}>
										Lớp
									</TableCell>
									<TableCell align='center' sx={{ padding: '1px 4px!important' }}>
										Khoa
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{data?.headers?.length > 0 &&
									data.headers.map((e, i) => (
										<Header key={i} data={e} sheetId={data?.id} index={i + 1} />
									))}
							</TableBody>
						</Table>
					</TableContainer>
				</Container>
			</Box>
		</Box>
	);

	//#endregion
});
