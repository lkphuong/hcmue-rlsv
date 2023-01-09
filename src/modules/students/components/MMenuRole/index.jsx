import { forwardRef, useContext, useImperativeHandle, useState } from 'react';

import { Box, Button, FormControlLabel, Menu, Radio, RadioGroup } from '@mui/material';

import { ROLES } from '_constants/variables';
import { ERRORS } from '_constants/messages';

import { updateRole } from '_api/roles.api';

import { isSuccess } from '_func/';
import { alert } from '_func/alert';

import { ConfigRoleContext } from '_modules/students/pages/ListStudentsPage';

import './index.scss';

export const MMenuRole = forwardRef(({ id, role, department_id, class_id }, ref) => {
	//#region Data
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const [value, setValue] = useState(null);

	const { getData } = useContext(ConfigRoleContext);
	//#endregion

	//#region Event
	const turnOnMenu = (event, roleId) => {
		setValue(roleId);
		setAnchorEl(event.currentTarget);
	};

	const turnOffMenu = () => setAnchorEl(null);

	const onChangeRole = (event) => setValue(event.target.value);

	const onClick = async () => {
		const body = {
			department_id,
			class_id,
			role_id: Number(value),
		};

		const res = await updateRole(id, body);

		if (isSuccess(res)) {
			getData();

			turnOffMenu();

			alert.success({ text: 'Cập nhật quyền thành công.' });
		} else {
			alert.fail({ text: res?.message || ERRORS.FAIL });
		}
	};
	//#endregion

	useImperativeHandle(ref, () => ({
		onMenu: (event, roleId) => turnOnMenu(event, roleId),
	}));

	//#region Render
	return (
		<Menu
			anchorEl={anchorEl}
			open={open}
			onClose={turnOffMenu}
			className='role-menu'
			anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
		>
			<RadioGroup value={value} onChange={onChangeRole}>
				{ROLES.map((role) => (
					<FormControlLabel
						key={role.id}
						value={role.id}
						control={<Radio />}
						label={role.name}
					/>
				))}
			</RadioGroup>

			<Box textAlign='center' onClick={onClick}>
				<Button variant='contained'>Lưu</Button>
			</Box>
		</Menu>
	);

	//#endregion
});
