import { ButtonBase } from '@mui/material';

import logo from '_assets/images/logo.jpg';

const CLogo = () => (
	<ButtonBase disableRipple>
		<img src={logo} alt='' style={{ maxHeight: '60px' }} />
	</ButtonBase>
);

export default CLogo;
