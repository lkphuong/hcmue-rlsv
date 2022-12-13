import React, { memo, useEffect, useCallback } from 'react';

import classNames from 'classnames';

import { useState } from 'react';

import { debounce, Pagination, Stack, TextField } from '@mui/material';

import { number, func } from 'prop-types';

import './index.scss';

export const CPagination = memo(({ page, pages, onChange, isLoading, isGoTo }) => {
	//#region Data
	const MIN_VALUE = 1;
	const MAX_VALUE = pages;
	const [currentPage, setCurrentPage] = useState(1);
	//#endregion

	//#region Event
	const debounceChange = useCallback(
		debounce((e, value) => onChange(e, value), 400),
		[]
	);

	const handlePressKey = (e) => {
		if (e.code === 'KeyE' || e.key === '+' || e.key === '.' || e.key === '-' || e.key === ',')
			e.preventDefault();
		e.keyCode === 13 && onChange(e, Number(currentPage));
	};

	const handleChange = (e) => {
		setCurrentPage(e.currentTarget.value);

		if (e.currentTarget.value) debounceChange(e, Number(e.currentTarget.value));
	};
	//#endregion

	useEffect(() => {
		setCurrentPage(page);
	}, [page]);

	//#region Render
	return (
		<Stack
			direction={{ xs: 'column', md: 'row' }}
			alignItems='center'
			justifyContent='center'
			sx={{ mt: 2, mb: 3 }}
		>
			<Pagination
				disabled={isLoading}
				className={classNames('c-pagination')}
				page={page}
				count={pages}
				onChange={onChange}
				color='primary'
				variant='outlined'
				shape='rounded'
			/>

			{isGoTo && (
				<TextField
					autoComplete='off'
					type='number'
					value={currentPage}
					onKeyDown={handlePressKey}
					onChange={handleChange}
					InputProps={{
						inputProps: {
							max: MAX_VALUE,
							min: MIN_VALUE,
						},
					}}
					className='c-pagination-goto'
					sx={{ maxWidth: '100px', borderRadius: '4px' }}
				/>
			)}
		</Stack>
	);
	//#endregion
});

CPagination.displayName = CPagination;

CPagination.propTypes = {
	page: number,
	pages: number,
	onChange: func,
};

CPagination.defaultProps = {
	page: 1,
	pages: 1,
};
