import { Link } from '@mui/material';

import { Link as RouterLink } from 'react-router-dom';

export const CLink = ({ to, children, ...props }) => {
	return (
		<Link component={RouterLink} {...props} to={to}>
			{children}
		</Link>
	);
};
