import React, { memo } from 'react';

import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { CalendarMonth } from '@mui/icons-material';

import { func, array } from 'prop-types';

import './index.scss';

export const CRangePicker = memo(({ values, onChange }) => {
	return (
		<DateRangePicker
			className='c-rangepicker'
			locale='vi-VI'
			onChange={onChange}
			value={values}
			calendarIcon={<CalendarMonth />}
			dayPlaceholder='DD'
			monthPlaceholder='MM'
			yearPlaceholder='YYYY'
		/>
	);
});

CRangePicker.displayName = CRangePicker;

CRangePicker.propTypes = {
	values: array,
	onChange: func,
};

CRangePicker.defaultProps = {};
