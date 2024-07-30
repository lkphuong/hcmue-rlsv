import { Link } from '@mui/material';

import { Link as RouterLink } from 'react-router-dom';

export const CLink = ({ to, color, classes, variant, underline, sx, children, ...props }) => {
	return (
		<Link
			component={RouterLink}
			to={to}
			color={color}
			classes={classes}
			variant={variant}
			underline={underline}
			sx={sx}
			{...props}
		>
			{children}
		</Link>
	);
};
