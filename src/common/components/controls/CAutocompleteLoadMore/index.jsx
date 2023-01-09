import { forwardRef, useEffect, useMemo, useState } from 'react';

import { Autocomplete, CircularProgress, TextField } from '@mui/material';

import classNames from 'classnames';

import { string, any, func, bool, arrayOf, object } from 'prop-types';

export const CAutocompleteLoadMore = forwardRef(
	(
		{
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
			error,
			helperText,
			hasNextPage,
			fetchData,
			loading,
			...props
		},
		ref
	) => {
		//#region Data
		const [inputValue, setInputValue] = useState('');

		const [listboxNode, setListboxNode] = useState(null);

		const [pos, setPos] = useState(0);

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

		const handleScroll = (event) => {
			const { currentTarget } = event;

			setListboxNode(currentTarget);
			if (
				currentTarget.scrollTop + currentTarget.clientHeight ===
					currentTarget.scrollHeight &&
				hasNextPage
			) {
				fetchData();
				setPos(currentTarget.scrollHeight);
			}
		};
		//#endregion

		//#region Other
		const getOptionLabel = (option) => {
			if (typeof option === 'string') return option;

			if (option?.inputValue) return option.inputValue;

			if (typeof option?.[display] === 'number') return option?.[display].toString();

			return option?.[display];
		};
		//#endregion

		useEffect(() => {
			if (listboxNode && pos) {
				listboxNode.scrollTop = pos - 100;
			}
		}, [options, pos]);

		return (
			<Autocomplete
				id={id}
				multiple={multiple}
				className={classNames('c-autocomplete')}
				value={currentValue}
				onChange={onValueChange}
				inputValue={inputValue}
				onInputChange={handleInputChange}
				options={options}
				renderInput={(params) => (
					<TextField
						{...params}
						name={name}
						placeholder={placeholder}
						error={error}
						helperText={helperText}
						inputRef={ref}
						InputProps={{
							...params.InputProps,
							endAdornment: (
								<>
									{loading ? (
										<CircularProgress color='inherit' size={20} />
									) : null}
									{params.InputProps.endAdornment}
								</>
							),
						}}
					/>
				)}
				renderOption={renderOption}
				getOptionLabel={getOptionLabel}
				filterOptions={(x) => x}
				ListboxProps={{ sx: { maxHeight: '260px' }, onScroll: handleScroll }}
				{...props}
			/>
		);
	}
);

CAutocompleteLoadMore.displayName = CAutocompleteLoadMore;

CAutocompleteLoadMore.propTypes = {
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
	error: bool,
	helperText: string,
};

CAutocompleteLoadMore.defaultProps = {
	onInputChange: (v) => v,
	options: [],
	valueGet: 'id',
};
