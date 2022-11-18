import React, { memo } from 'react';

import { Autocomplete, TextField } from '@mui/material';

import classNames from 'classnames';

import { string, any, array, func, bool } from 'prop-types';

export const CAutocomplete = memo(
	({
		id,
		name,
		placeholder,
		options,
		value,
		inputValue,
		onChange,
		onInputChange,
		multiple,
		renderOption,
		display,
		// getOptionLabel,
		...props
	}) => {
		const getOptionLabel = (option) => {
			if (typeof option === 'string') return option;

			if (option?.inputValue) return option.inputValue;

			return option?.[display];
		};

		return (
			<Autocomplete
				id={id}
				name={name}
				multiple={multiple}
				className={classNames('c-autocomplete')}
				value={value}
				onChange={onChange}
				inputValue={inputValue}
				onInputChange={onInputChange}
				options={options}
				renderInput={(params) => <TextField placeholder={placeholder} {...params} />}
				renderOption={renderOption}
				getOptionLabel={getOptionLabel}
				{...props}
			/>
		);
	}
);

CAutocomplete.displayName = CAutocomplete;

CAutocomplete.propTypes = {
	id: any,
	name: string,
	placeholder: string,
	value: any,
	options: array.isRequired,
	inputValue: string,
	onChange: func,
	onInputChange: func,
	multiple: bool,
	renderOption: func,
	getOptionLabel: func,
};

CAutocomplete.defaultProps = {
	option: [],
};
