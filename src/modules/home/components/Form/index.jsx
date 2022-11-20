import React from 'react';

import { Box, Grid } from '@mui/material';

import Evaluation from './Evaluation';

import './index.scss';

//#region FAKE DATA
const EVALUATIONS = [
	{
		id: 1,
		content: 'Đánh giá về ý thức tham gia học tập',
		to_mark: 20,
		children: true,
	},
	{
		id: 2,
		content: 'Đánh giá về ý thức chấp hành nội quy, quy chế, quy định trong trường',
		to_mark: 25,
		children: true,
	},
	{
		id: 3,
		content:
			'Đánh giá về ý thức tham gia các hoạt động chính trị, xã hội, văn hóa, văn nghệ, thể thao, phòng chống tội phạm và các tệ nạn xã hội',
		children: true,
	},
	{
		id: 4,
		content: 'Đánh giá về ý thức công dân trong quan hệ cộng đồng',
		to_mark: 25,
		children: true,
	},
	{
		id: 5,
		content:
			'Đánh giá về ý thức và kết quả tham gia công tác phụ trách lớp, các đoàn thể, tổ chức trong trường; đạt thành tích xuất sắc trong học tập, rèn luyện',
		to_mark: 10,
		children: true,
	},
];
//#endregion

export const Form = ({ data }) => {
	return (
		<Box>
			<Grid container borderRadius={1} overflow='hidden'>
				<Grid
					item
					xl={1}
					textAlign='center'
					sx={{ backgroundColor: '#28AEF7', fontWeight: 600, py: 1.3 }}
				>
					Mục
				</Grid>
				<Grid item xl={7} sx={{ backgroundColor: '#28AEF7', fontWeight: 600, py: 1.3 }}>
					Nội dung đánh giá
				</Grid>
				<Grid
					item
					xl={2}
					textAlign='center'
					sx={{ backgroundColor: '#28AEF7', fontWeight: 600, py: 1.3 }}
				>
					Khung điểm
				</Grid>
				<Grid
					item
					xl={2}
					textAlign='center'
					sx={{ backgroundColor: '#28AEF7', fontWeight: 600, py: 1.3 }}
				>
					Sinh viên đánh giá
				</Grid>
			</Grid>

			<Grid container mt={1.5} alignItems='center' className='grid-fake-table'>
				{EVALUATIONS.length > 0 &&
					EVALUATIONS.map((e, i) => <Evaluation key={i} data={e} index={i + 1} />)}
			</Grid>
		</Box>
	);
};
