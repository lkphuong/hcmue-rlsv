import React, { memo, useMemo, useState } from 'react';

import { Autocomplete, TextField } from '@mui/material';

import classNames from 'classnames';

import { string, any, func, bool, arrayOf, object } from 'prop-types';

export const CAutocomplete = memo(
	({
		id,
		name,
		placeholder,
		options,
		value,
		onChange,
		onInputChange,
		multiple,
		renderOption,
		display,
		valueGet,
		// getOptionLabel,
		...props
	}) => {
		//#region Data
		const [inputValue, setInputValue] = useState('');

		const currentValue = useMemo(() => {
			if (multiple) {
				if (!options || !value) return null;
			} else if (!options || !value?.toString()) return null;

			if (multiple)
				return (
					value?.map((id) =>
						options.find((option) => option?.id?.toString() === id?.toString())
					) ?? null
				);

			return (
				options.find((option) =>
					value[valueGet]
						? option[valueGet]?.toString() === value[valueGet]?.toString()
						: option[valueGet]?.toString() === value?.toString()
				) ?? null
			);
		}, [multiple, options, value, valueGet]);
		//#endregion

		//#region Event
		const handleInputChange = (e, v) => setInputValue(onInputChange(v));

		const onValueChange = (event, value) => {
			if (multiple) {
				onChange(value.map(({ inputValue, ..._value }) => _value));
			} else {
				if (value && value.inputValue) return onChange({ [display]: value[display] });
				else if (typeof value === 'object') return onChange(value);

				return onChange(value);
			}
		};
		//#endregion

		//#region Other
		const getOptionLabel = (option) => {
			if (typeof option === 'string') return option;

			if (option?.inputValue) return option.inputValue;

			return option?.[display];
		};
		//#endregion

		return (
			<Autocomplete
				id={id}
				name={name}
				multiple={multiple}
				className={classNames('c-autocomplete')}
				value={currentValue}
				onChange={onValueChange}
				inputValue={inputValue}
				onInputChange={handleInputChange}
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
	display: string.isRequired,
	options: arrayOf(object).isRequired,
	onChange: func,
	onInputChange: func,
	multiple: bool,
	renderOption: func,
	valueGet: string,
};

CAutocomplete.defaultProps = {
	onInputChange: (v) => v,
	options: [],
	valueGet: 'id',
};
