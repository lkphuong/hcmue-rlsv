import { useMemo, useRef } from 'react';

import { IconButton, Stack, Tooltip, Typography } from '@mui/material';

import { CSettingIcon } from '_others/';
import { ROLES } from '_constants/variables';

import { MMenuRole } from '../..';

export const MRoleCell = ({ data }) => {
	//#region Data
	const menuRef = useRef();

	const role = useMemo(() => {
		return ROLES.find((e) => e.id === data.role).name || '';
	}, [data.role]);

	//#endregion

	//#region Event
	const onClick = (event) => menuRef.current.onMenu(event, Number(data?.role));
	//#endregion

	//#region Render
	return (
		<Stack direction='row' spacing={1} alignItems='center' justifyContent='end'>
			<Typography whiteSpace='nowrap' fontSize={12}>
				{role}
			</Typography>
			<Tooltip title='Phân quyền'>
				<span>
					<IconButton disabled={!data?.status?.flag} onClick={onClick}>
						<CSettingIcon />
					</IconButton>
				</span>
			</Tooltip>

			<MMenuRole
				id={data?.std_code}
				department_id={Number(data?.department?.id)}
				class_id={Number(data?.classes?.id)}
				ref={menuRef}
			/>
		</Stack>
	);
	//#endregion
};
