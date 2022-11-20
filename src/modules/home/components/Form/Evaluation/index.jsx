import React, { memo, useState } from 'react';

import { Box, Collapse, Grid, IconButton, Stack, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import SubEvaluation from './SubEvaluation';

//#region FAKE DATA
const EVALUATIONS = [
	{
		id: 1,
		content: 'a. Tinh thần và thái độ trong học tập',
		children: true,
		evaluation: [
			{
				id: 1,
				content: 'Vào lớp học đúng giờ, tham gia các giờ học đầy đủ',
				children: false,
				category: 0,
				from_mark: 1.5,
				control: 1,
			},
			{
				id: 2,
				content: 'Chuẩn bị bài tốt, ý thức trong giờ học nghiêm túc',
				children: false,
				category: 0,
				from_mark: 1.5,
				control: 1,
			},
		],
	},
	{
		id: 2,
		content: 'b. Tham gia các hoạt động học thuật, hoạt động nghiên cứu khoa học (NCKH)',
		children: true,
		evaluation: [
			{
				id: 1,
				content:
					'Tham gia các hoạt động học thuật: Hội thảo, tọa đàm, lớp hướng dẫn NCKH, hoạt động khảo sát của Trường…',
				children: false,
				category: 0,
				from_mark: 3,
				control: 0,
				unit: 'hoạt động',
			},
			{
				id: 2,
				content:
					'Tham gia hoạt động NCKH: Có bài báo khoa học, tham luận được đăng tải trên các tạp chí, tạp san uy tín được công nhận; thực hiện đề tài NCKH, bài viết, bài tham luận tại các hội thảo khoa học…',
				children: false,
				category: 0,
				from_mark: 5,
				control: 0,
				unit: 'nghiên cứu',
			},
		],
	},
	{
		id: 3,
		content: 'c. Tham gia các kỳ thi, cuộc thi',
		children: true,
		evaluation: [
			{
				id: 1,
				content: 'Tham gia cổ vũ các kỳ thi, cuộc thi học thuật',
				children: false,
				category: 0,
				from_mark: 1,
				control: 0,
				unit: 'hoạt động',
			},
		],
	},
];
//#endregion

const Evaluation = memo(({ data, index }) => {
	//#region Data
	const [open, setOpen] = useState(false);
	//#endregion

	//#region Event
	const toggle = () => setOpen(!open);
	//#endregion

	//#region Render
	return (
		<>
			<Grid item xs={1} textAlign='center'>
				<Box>{index}</Box>
			</Grid>
			<Grid item xs={11}>
				<Stack direction='row' justifyContent='space-between' alignItems='center'>
					<Typography>{`${data.content}${
						data?.to_mark ? ` (Tối đa ${data.to_mark} điểm)` : ''
					}`}</Typography>
					<IconButton onClick={toggle}>
						{open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
					</IconButton>
				</Stack>
			</Grid>

			<Grid item xs={12}>
				<Collapse in={open} timeout='auto'>
					<Grid container alignItems='center'>
						{EVALUATIONS.length > 0 &&
							EVALUATIONS.map((e, i) => <SubEvaluation key={i} data={e} />)}
					</Grid>
				</Collapse>
			</Grid>
		</>
	);
	//#endregion
});

Evaluation.displayName = Evaluation;

export default Evaluation;
