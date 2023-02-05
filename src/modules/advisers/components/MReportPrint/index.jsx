import { forwardRef } from 'react';

import { Box, Grid, Stack, Typography } from '@mui/material';

import { MClassTable } from './MClassTable';

export const MReportPrint = forwardRef(
	({ data, department, academic, semester, classData }, ref) => {
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
						<Typography textAlign='left!important'>
							KHOA: {department?.name}
							<br />
							LỚP: {classData?.name}
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
					BIÊN BẢN HỌP LỚP {classData?.name}
					<br />
					Về việc đánh giá kết quả rèn luyện sinh viên
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
						+ Cố vấn học tập:&nbsp;
					</Typography>
					<Box width='100%' borderBottom='1px dotted'></Box>
				</Stack>
				<Stack direction='row' alignItems='baseline'>
					<Typography fontWeight={500} fontSize={20} whiteSpace='nowrap'>
						+ Lớp trưởng:&nbsp;
					</Typography>
					<Box width='100%' borderBottom='1px dotted'></Box>
				</Stack>
				<Stack direction='row' alignItems='baseline'>
					<Typography fontWeight={500} fontSize={20} whiteSpace='nowrap'>
						+ Bí thư chi đoàn:&nbsp;
					</Typography>
					<Box width='100%' borderBottom='1px dotted'></Box>
				</Stack>
				<Stack direction='row' alignItems='baseline'>
					<Typography fontWeight={500} fontSize={20} whiteSpace='nowrap'>
						+ Chi hội trưởng chi hội:&nbsp;
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
						+ Thành viên (sĩ số sinh viên đầu học kỳ của lớp):&nbsp;
					</Typography>
					<Box width='100%' borderBottom='1px dotted'></Box>
				</Stack>
				<Stack direction='row'>
					<Typography fontWeight={500} fontSize={20} whiteSpace='nowrap'>
						Trong đó:&nbsp;
					</Typography>
					<Box>
						<Typography fontWeight={500} fontSize={20} whiteSpace='nowrap'>
							Có mặt:....................SV
						</Typography>
						<Typography fontWeight={500} fontSize={20}>
							Vắng mặt:....................SV (trong đó: tạm nghỉ học, vắng có lý do,
							không lý do)
						</Typography>
					</Box>
				</Stack>
				<Typography fontWeight={500} fontSize={20} whiteSpace='nowrap'>
					+ SV tạm nghỉ học:...................SV + SV vắng có lý do:..................SV{' '}
					<br />+ SV vắng không lý do:.........................SV
				</Typography>
				<Typography fontWeight={700} fontSize={20}>
					4. Nội dung:&nbsp;
					<Typography component='span'>
						(Ghi diễn tiến cuộc họp; các ý kiến góp ý)
					</Typography>
				</Typography>
				<Box width='100%' minHeight={18} mb={1} borderBottom='1px dotted'></Box>
				<Typography fontStyle='italic' mb={2.5}>
					Kết quả biểu quyế có: ........../........... sinh viên dự họp, đạt tỷ lệ:
					.........% đồng ý thông qua kết quả đánh giá kết quả rèn luyện sinh viên của lớp
					và được phân loại như sau:
				</Typography>

				<MClassTable data={data} />

				<Typography fontWeight={700} fontSize={20} mb={3} mt={2}>
					5. Kết quả đánh giá rèn luyện sinh viên toàn lớp:&nbsp;
					<Typography component='span'>(Bảng kết quả kèm theo - Mẫu 1a).</Typography>
				</Typography>
				<Typography fontWeight={700} fontSize={20}>
					6. Đề xuất, kiến nghị:
				</Typography>
				<Box width='100%' minHeight={18} mb={1} borderBottom='1px dotted'></Box>

				<Typography mb={2.5}>
					Cuộc họp kết thúc vào lúc.........giờ.........phút..........cùng ngày./.
				</Typography>

				<Grid container spacing={2} mb={7}>
					<Grid item xs={7} textAlign='left'>
						<Typography fontSize={20} fontWeight={700}>
							LỚP TRƯỞNG
						</Typography>
						<Typography fontSize={20} fontWeight={700}>
							BÍ THƯ:
						</Typography>
						<Typography fontSize={20} fontWeight={700}>
							CHI HỘI TRƯỞNG:
						</Typography>
					</Grid>
					<Grid item xs={5} textAlign='left'>
						<Typography fontSize={20} fontWeight={700} mb={3.5}>
							CỐ VẤN HỌC TẬP
						</Typography>
						<Typography fontSize={20} fontWeight={700}>
							THƯ KÝ
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
	}
);
