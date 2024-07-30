import { useState } from 'react';

import { IconButton, InputAdornment, TextField } from '@mui/material';

import { Search, Visibility, VisibilityOff } from '@mui/icons-material';

import { string, any, func, bool } from 'prop-types';
import { forwardRef } from 'react';

export const CInput = forwardRef(
	(
		{
			id,
			name,
			value,
			placeholder,
			onChange,
			error,
			helperText,
			isPassword,
			isSearch,
			inputRef,
			onEnter,
			...props
		},
		ref
	) => {
		const [show, setShow] = useState(false);

		const togglePassword = () => setShow(!show);

		const handleFocus = (event) => event.target.select();

		return (
			<TextField
				ref={ref}
				inputRef={inputRef}
				id={id}
				name={name}
				value={value}
				type={isPassword ? (show ? 'text' : 'password') : 'text'}
				placeholder={placeholder}
				onChange={onChange}
				onFocus={handleFocus}
				error={error}
				helperText={helperText}
				onKeyDown={(e) => {
					e.key === 'Enter' && onEnter && onEnter();
				}}
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
