import React, { memo, useState } from 'react';

import { DateRangePicker } from 'materialui-daterange-picker';

import dayjs from 'dayjs';

import { TextField } from '@mui/material';

import './index.scss';

export const CRangePicker = memo(() => {
	const [open, setOpen] = useState(false);
	const [dateRange, setDateRange] = useState({});

	const toggle = () => setOpen(!open);

	return (
		<>
			<TextField
				sx={{ mr: 1 }}
				onClick={toggle}
				value={dayjs(dateRange?.startDate).format('DD/MM/YYYY')}
			/>
			<TextField onClick={toggle} value={dayjs(dateRange?.endDate).format('DD/MM/YYYY')} />
			<DateRangePicker
				toggle={toggle}
				open={open}
				onChange={(range) => setDateRange(range)}
				wrapperClassName='c-rangepicker'
			/>
		</>
	);
});

CRangePicker.displayName = CRangePicker;

CRangePicker.propTypes = {};

CRangePicker.defaultProps = {};
