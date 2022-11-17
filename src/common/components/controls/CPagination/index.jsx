import React from 'react';

import classNames from 'classnames';

import { Pagination } from '@mui/material';

import { number, func } from 'prop-types';

import './index.scss';

export const CPagination = ({ page, pages, onChange }) => {
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
};

CPagination.propTypes = {
	page: number,
	pages: number,
	onChange: func,
};

CPagination.defaultProps = {
	page: 1,
	pages: 1,
};
