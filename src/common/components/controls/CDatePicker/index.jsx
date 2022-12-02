import React, { memo } from 'react';

import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import { any, string, func, bool } from 'prop-types';

export const CDatePicker = memo(
	({ name, value, onChange, placeholder, error, helperText, inputRef, onBlur, ...props }) => {
		return (
			<DatePicker
				className='c-datepicker'
				value={value}
				onChange={onChange}
				inputFormat='DD/MM/YYYY'
				inputRef={inputRef}
				{...props}
				renderInput={(params) => (
					<TextField
						{...params}
						name={name}
						placeholder={placeholder}
						onBlur={onBlur}
						error={error}
						helperText={helperText}
					/>
				)}
			/>
		);
	}
);

CDatePicker.propTypes = {
	name: string,
	value: any,
	placeholder: string,
	onChange: func,
	error: bool,
	helperText: string,
};
