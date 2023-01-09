import { memo } from 'react';

import { array, func, any, string } from 'prop-types';

import { MenuItem, Select } from '@mui/material';

export const CSelect = memo(
	({ id, name, value, onChange, options, error, helperText, ...props }) => {
		return (
			<Select id={id} name={name} value={value} onChange={onChange} fullWidth>
				{options.map((option) => (
					<MenuItem key={option.id} value={option.id}>
						{option.name}
					</MenuItem>
				))}
			</Select>
		);
	}
);

CSelect.propTypes = {
	id: any,
	value: any,
	name: string,
	onChange: func,
	options: array.isRequired,
};

CSelect.defaultProps = {
	options: [],
};
