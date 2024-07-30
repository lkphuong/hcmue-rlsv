import { WarningAmber } from '@mui/icons-material';
import { Box, Paper, Stack, Typography } from '@mui/material';

import dayjs from 'dayjs';

export const CExpired = ({ roleName, start, end }) => {
	return (
		<Box mb={1.5}>
			<Paper className='paper-wrapper' sx={{ borderColor: '#f9b94a!important' }}>
				<Stack direction='row' alignItems='center' spacing={1} p={1.5}>
					<WarningAmber sx={{ color: '#f9b94a' }} />

					<Typography fontSize={18} fontWeight={500} color='#f9b94a'>
						{`Không đúng hạn ${roleName} chấm điểm (Từ: ${dayjs(start).format(
							'DD/MM/YYYY'
						)} - đến ${dayjs(end).format('DD/MM/YYYY')})`}
					</Typography>
				</Stack>
			</Paper>
		</Box>
	);
};
