import { forwardRef, useContext, useImperativeHandle, useState } from 'react';

import { Box, Button, FormControlLabel, Menu, Radio, RadioGroup } from '@mui/material';

import { STUDENT_STATUS } from '_constants/variables';
import { ERRORS } from '_constants/messages';

import { updateRole } from '_api/roles.api';

import { isSuccess } from '_func/';
import { alert } from '_func/alert';

import { ConfigRoleContext } from '_modules/students/pages/ListStudentsPage';

import './index.scss';

export const MMenuStatus = forwardRef(({ id, department_id, class_id }, ref) => {
	//#region Data
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const [value, setValue] = useState(null);

	const { getData } = useContext(ConfigRoleContext);
	//#endregion

	//#region Event
	const turnOnMenu = (event, statusId) => {
		setValue(statusId);
		setAnchorEl(event.currentTarget);
	};

	const turnOffMenu = () => setAnchorEl(null);

	const onStatusChange = (event) => setValue(event.target.value);

	const onClick = async () => {
		const body = {
			department_id,
			class_id,
			status_id: Number(value),
		};

		const res = await updateRole(id, body);

		if (isSuccess(res)) {
			getData();

			turnOffMenu();

			alert.success({ text: 'Cập nhật tình trạng thành công.' });
		} else {
			alert.fail({ text: res?.message || ERRORS.FAIL });
		}
	};
	//#endregion

	useImperativeHandle(ref, () => ({
		onMenu: (event, statusId) => turnOnMenu(event, statusId),
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
			<RadioGroup value={value} onChange={onStatusChange}>
				{STUDENT_STATUS.map((status) => (
					<FormControlLabel
						key={status.id}
						value={status.id}
						control={<Radio />}
						label={status.name}
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
