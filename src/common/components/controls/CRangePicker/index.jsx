import React, { memo } from 'react';

import { CalendarPicker } from 'mui-calendar-picker';

import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';

import dayjs from 'dayjs';

import { shape, any, func, bool, string } from 'prop-types';

import 'dayjs/locale/vi';

import './index.scss';

export const CRangePicker = memo(({ dateRange, onChange, error, helperText }) => {
	const theme = useTheme();

	return (
		<>
			<CalendarPicker
				setDateRange={onChange}
				theme={theme}
				openBtnText='Chọn thời gian' // optional
				confirmBtnText='Lưu' // optional
				todayBtnText={null}
			/>

			{error && <Typography color='#d32f2f'>{helperText}</Typography>}

			<Stack direction='row' mt={0.5}>
				<Box flex={1}>
					<Typography align='center' fontWeight={500} letterSpacing={1}>
						{dayjs(dateRange.start).format('DD/MM/YYYY')}
					</Typography>
				</Box>

				<Divider orientation='vertical' flexItem />

				<Box flex={1}>
					<Typography align='center' fontWeight={500} letterSpacing={1}>
						{dayjs(dateRange.end).format('DD/MM/YYYY')}
					</Typography>
				</Box>
			</Stack>
		</>
	);
});

CRangePicker.displayName = CRangePicker;

CRangePicker.propTypes = {
	dateRange: shape({
		start: any,
		end: any,
	}).isRequired,
	onChange: func,
	error: bool,
	helperText: string,
};

CRangePicker.defaultProps = {};
