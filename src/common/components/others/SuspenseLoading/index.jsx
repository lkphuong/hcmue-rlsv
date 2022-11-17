import React from 'react';

import { Backdrop, CircularProgress } from '@mui/material';

export const SuspenseLoading = () => {
	return (
		<Backdrop sx={{ color: '#83EE79', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
			<CircularProgress color='inherit' />
		</Backdrop>
	);
};
