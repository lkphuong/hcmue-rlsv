import React from 'react';

import { Box, Grid } from '@mui/material';
import Evaluation from './Evaluation';

export const Form = ({ data }) => {
	return (
		<Box>
			<Grid container>
				<Grid item xl={1} textAlign='center'>
					Mục
				</Grid>
				<Grid item xl={7}>
					Nội dung đánh giá
				</Grid>
				<Grid item xl={2} textAlign='center'>
					Khung điểm
				</Grid>
				<Grid item xl={2} textAlign='center'>
					Sinh viên đánh giá
				</Grid>
			</Grid>

			{data?.evaluations?.length > 0 &&
				data.evaluations.map((e, i) => <Evaluation key={i} data={e} />)}
		</Box>
	);
};
