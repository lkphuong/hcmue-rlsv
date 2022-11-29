import React, { useState, memo } from 'react';

import { IconButton, InputAdornment, TextField } from '@mui/material';

import { Search, Visibility, VisibilityOff } from '@mui/icons-material';

import { string, any, func, bool } from 'prop-types';

export const CInput = memo(
	({
		id,
		name,
		value,
		placeholder,
		onChange,
		error,
		helperText,
		isPassword,
		isSearch,
		...props
	}) => {
		const [show, setShow] = useState(false);

		const togglePassword = () => setShow(!show);

		const handleFocus = (event) => event.target.select();

		return (
			<TextField
				id={id}
				name={name}
				value={value}
				type={isPassword ? (show ? 'text' : 'password') : 'text'}
				placeholder={placeholder}
				onChange={onChange}
				onFocus={handleFocus}
				error={error}
				helperText={helperText}
				InputProps={
					isPassword
						? {
								endAdornment: (
									<InputAdornment position='end'>
										<IconButton onClick={togglePassword}>
											{show ? <Visibility /> : <VisibilityOff />}
										</IconButton>
									</InputAdornment>
								),
						  }
						: isSearch && {
								startAdornment: (
									<InputAdornment position='start'>
										<Search />
									</InputAdornment>
								),
						  }
				}
				{...props}
			/>
		);
	}
);

CInput.displayName = CInput;

CInput.propTypes = {
	id: any,
	name: string,
	value: any,
	placeholder: string,
	onChange: func,
	error: bool,
	helperText: string,
	isPassword: bool,
};
