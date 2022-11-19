import React from 'react';

import { Box, Button, Grid, Typography } from '@mui/material';
import { Print } from '@mui/icons-material';

import { ConfigPanel } from '_modules/form/components';

const FormCreatePage = () => {
	return (
		<Box>
			<Grid
				borderRadius={2}
				p={2}
				sx={{ backgroundColor: 'rgba(0 0 0 / 5%)' }}
				container
				justifyContent='space-between'
				alignItems='center'
			>
				<Grid item>
					<Typography fontWeight={500} fontSize={18}>
						Lịch sử Phiếu đánh giá kết quả rèn luyện
					</Typography>
				</Grid>
				<Grid item>
					<Button sx={{ padding: 0 }} startIcon={<Print />}>
						In phiếu
					</Button>
				</Grid>
			</Grid>

			<ConfigPanel />
		</Box>
	);
};

export default FormCreatePage;
