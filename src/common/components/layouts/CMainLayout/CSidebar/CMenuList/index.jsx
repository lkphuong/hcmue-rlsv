import { Typography } from '@mui/material';

import { shallowEqual, useSelector } from 'react-redux';

import { NAVIGATIONS } from '_constants/navigations';

import { CPermission } from '_controls/CPermission';

import { FUNCTION_KEY } from '_config/permissions';

import CNavCollapse from './CNavCollapse';
import CNavItem from './CNavItem';

const CMenuList = () => {
	const { role_id } = useSelector((state) => state.auth.profile, shallowEqual);

	const navItems = NAVIGATIONS[role_id].map((item, index) => {
		return (
			<CPermission key={index} I={FUNCTION_KEY.READ} a={item.entity}>
				{() => {
					switch (item.type) {
						case 'collapse':
							return <CNavCollapse key={item.id} menu={item} level={0.5} />;
						case 'item':
							return <CNavItem key={item.id} item={item} level={0.5} />;
						default:
							return (
								<Typography key={item.id} variant='h6' color='error' align='center'>
									Menu Items Error
								</Typography>
							);
					}
				}}
			</CPermission>
		);
	});

	return <>{navItems}</>;
};

export default CMenuList;
