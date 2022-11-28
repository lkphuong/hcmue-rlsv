import React, { memo } from 'react';

import { CalendarPicker } from 'mui-calendar-picker';

import { Box, Divider, Stack, Typography } from '@mui/material';

import dayjs from 'dayjs';

import { shape, any, func, bool, string } from 'prop-types';

import calendarTheme from '_theme/calendar';

import 'dayjs/locale/vi';

import './index.scss';

export const CRangePicker = memo(({ dateRange, onChange, error, helperText }) => {
	return (
		<>
			<CalendarPicker
				setDateRange={onChange}
				theme={calendarTheme}
				openBtnText='Chọn thời gian' // optional
				confirmBtnText='Lưu' // optional
				todayBtnText={null}
			/>

			{error && (
				<Typography my={1} color='#d32f2f'>
					{helperText}
				</Typography>
			)}

			{dayjs(dateRange.start).isValid() && dayjs(dateRange.end).isValid() && (
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
			)}
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
