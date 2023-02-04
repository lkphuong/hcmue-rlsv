import { forwardRef } from 'react';

import { Box, Grid, Stack, Typography } from '@mui/material';

import { MDepartmentTable } from './MDepartmentTable';

export const MReportPrint = forwardRef(({ data, academic, semester }, ref) => {
	//#region Data
	//#endregion

	//#region Event
	//#endregion

	//#region Render
	return (
		<Box ref={ref} className='print-source' px={4} py={2}>
			<Stack
				direction='row'
				justifyContent='space-between'
				mb={6}
				sx={{
					'& .MuiTypography-root': {
						fontWeight: 700,
						fontSize: '14px',
						textAlign: 'center',
					},
				}}
			>
				<Stack direction='column'>
					<Typography>
						BỘ GIÁO DỤC VÀ ĐÀO TẠO <br />
						TRƯỜNG ĐẠI HỌC SƯ PHẠM
						<br /> THÀNH PHỐ HỒ CHÍ MINH
					</Typography>
				</Stack>
				<Stack direction='column'>
					<Typography>
						CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM <br />
						Độc lập - Tự do - Hạnh phúc
					</Typography>
				</Stack>
			</Stack>
			<Typography textAlign='center' fontWeight={700} fontSize='24px!important' mb={2}>
				BIÊN BẢN HỌP HỘI ĐỒNG <br />
				ĐÁNH GIÁ KẾT QUẢ RÈN LUYỆN SINH VIÊN CẤP TRƯỜNG
			</Typography>

			<Stack direction='row' justifyContent='center' alignItems='center' mb={5}>
				<Stack
					direction='row'
					justifyContent='space-between'
					sx={{ '& .MuiTypography-root': { fontWeight: 700, fontSize: '17px' } }}
				>
					<Typography mr={3}>{semester?.name}</Typography>
					<Typography>Năm học: {academic?.name}</Typography>
				</Stack>
			</Stack>

			<Typography fontWeight={700} fontSize={20}>
				1. Thời gian:&nbsp;
				<Typography component='span'>
					Vào lúc..................giờ........phút,
					ngày...........tháng...........năm........................
				</Typography>
			</Typography>

			<Stack direction='row' alignItems='baseline'>
				<Typography fontWeight={700} fontSize={20} whiteSpace='nowrap'>
					2. Địa điểm:&nbsp;
				</Typography>
				<Box width='100%' borderBottom='1px dotted'></Box>
			</Stack>

			<Typography fontWeight={700} fontSize={20} whiteSpace='nowrap'>
				3. Thành phần tham dự:&nbsp;
			</Typography>
			<Stack direction='row' alignItems='baseline'>
				<Typography fontWeight={500} fontSize={20} whiteSpace='nowrap'>
					+ Chủ tịch Hội đồng:&nbsp;
				</Typography>
				<Box width='100%' borderBottom='1px dotted'></Box>
			</Stack>
			<Stack direction='row' alignItems='baseline'>
				<Typography fontWeight={500} fontSize={20} whiteSpace='nowrap'>
					+ Phó Chủ tịch Hội đồng:&nbsp;
				</Typography>
				<Box width='100%' borderBottom='1px dotted'></Box>
			</Stack>
			<Stack direction='row' alignItems='baseline'>
				<Typography fontWeight={500} fontSize={20} whiteSpace='nowrap'>
					+ Thư ký:&nbsp;
				</Typography>
				<Box width='100%' borderBottom='1px dotted'></Box>
			</Stack>
			<Stack direction='row' alignItems='baseline'>
				<Typography fontWeight={500} fontSize={20} whiteSpace='nowrap'>
					+ Thành viên:&nbsp;
				</Typography>
				<Box width='100%' borderBottom='1px dotted'></Box>
			</Stack>

			<Typography fontWeight={700} fontSize={20}>
				4. Nội dung:&nbsp;
				<Typography component='span'>
					(Ghi diễn tiến cuộc họp; biểu quyết kết quả đánh giá rèn luyện sinh
					viên:..........Đồng ý; tỷ lệ...........; ...........Không đồng ý; tỷ
					lệ:..........)
				</Typography>
			</Typography>
			<Box width='100%' minHeight={18} borderBottom='1px dotted'></Box>
			<Box width='100%' minHeight={18} mb={1} borderBottom='1px dotted'></Box>

			<Typography fontWeight={700} fontSize={20} whiteSpace='nowrap'>
				5. Kết luận của Chủ tịch Hội đồng Trường:&nbsp;
			</Typography>
			<Typography mb={2}>
				Hội đồng nhất trí thông qua kết quả đánh giá rèn luyện sinh viên&nbsp;
				<b>{semester?.name}</b>, <b>năm học: {academic?.name}</b> như sau:
			</Typography>

			<MDepartmentTable data={data} />

			<Typography fontWeight={700} fontSize={20} mb={3} mt={2}>
				6. Kết quả đánh giá rèn luyện sinh viên toàn Trường:&nbsp;
				<Typography component='span'>(Bảng kết quả kèm theo - Mẫu 3a).</Typography>
			</Typography>

			<Typography mb={2.5}>
				Cuộc họp kết thúc vào lúc.........giờ.........phút..........cùng ngày./.
			</Typography>

			<Grid container spacing={2} mb={7}>
				<Grid item xs={6} textAlign='center'>
					<Typography fontSize={20} fontWeight={700}>
						THƯ KÝ
					</Typography>
				</Grid>
				<Grid item xs={6} textAlign='center'>
					<Typography fontSize={20} fontWeight={700}>
						CHỦ TỊCH HĐ
					</Typography>
				</Grid>
			</Grid>

			<Box sx={{ '& .MuiTypography-root': { fontSize: '14px!important' } }}>
				<Typography fontWeight={600}>Nơi nhận:</Typography>
				<Typography>- HĐ ĐGRL Trường (Phòng CTCT-HSSV);</Typography>
				<Typography>- Lưu: VP Khoa.</Typography>
			</Box>
		</Box>
	);

	//#endregion
});
