import React from 'react';

import { Box, Typography } from '@mui/material';

import { ListSemester } from '_modules/home/components';

const SemestersPage = () => {
	return (
		<Box>
			<Typography
				borderRadius={2}
				p={2}
				fontWeight={500}
				fontSize={18}
				sx={{ backgroundColor: 'rgba(0 0 0 / 5%)' }}
			>
				Danh sách điểm rèn luyện của tôi
			</Typography>

			<Box mt={1}>
				<ListSemester />
			</Box>
		</Box>
	);
};

export default SemestersPage;
