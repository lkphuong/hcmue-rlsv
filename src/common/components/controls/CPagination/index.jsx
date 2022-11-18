import React, { memo } from 'react';

import classNames from 'classnames';

import { Pagination } from '@mui/material';

import { number, func } from 'prop-types';

import './index.scss';

export const CPagination = memo(({ page, pages, onChange }) => {
	return (
		<Pagination
			className={classNames('c-pagination')}
			page={page}
			count={pages}
			onChange={onChange}
			color='primary'
			variant='outlined'
		/>
	);
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
