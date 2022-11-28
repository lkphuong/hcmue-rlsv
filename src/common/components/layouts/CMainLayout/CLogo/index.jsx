import { ButtonBase } from '@mui/material';

import logo from '_assets/images/logo.png';

const CLogo = () => (
	<ButtonBase disableRipple>
		<img src={logo} alt='' style={{ maxHeight: '50px' }} />
	</ButtonBase>
);

export default CLogo;
