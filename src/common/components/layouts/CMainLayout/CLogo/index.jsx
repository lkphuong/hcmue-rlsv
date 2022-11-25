import { ButtonBase } from '@mui/material';

import logo from '_assets/images/logo.png';

const CLogo = () => (
	<ButtonBase disableRipple>
		<img src={logo} alt='' />
	</ButtonBase>
);

export default CLogo;
