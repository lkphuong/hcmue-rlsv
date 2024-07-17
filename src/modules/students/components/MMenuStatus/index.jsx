import { forwardRef, useContext, useImperativeHandle, useState } from 'react';

import { Box, Button, FormControlLabel, Menu, Radio, RadioGroup } from '@mui/material';

import { ERRORS } from '_constants/messages';

import { isSuccess } from '_func/';
import { alert } from '_func/alert';

import { ConfigRoleContext } from '_modules/students/pages/ListStudentsPage';

import { shallowEqual, useSelector } from 'react-redux';
import { updateStatus } from '_api/statuses.api';

import './index.scss';

export const MMenuStatus = forwardRef(({ id }, ref) => {
	//#region Data
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const [value, setValue] = useState(null);

	const { getData } = useContext(ConfigRoleContext);

	const statuses = useSelector((state) => state.options?.statuses, shallowEqual);
	//#endregion

	//#region Event
	const turnOnMenu = (event, statusId) => {
		setValue(statusId);
		setAnchorEl(event.currentTarget);
	};

	const turnOffMenu = () => setAnchorEl(null);

	const onStatusChange = (event) => setValue(event.target.value);

	const onClick = async () => {
		const res = await updateStatus(id, { status: Number(value) });

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
				{statuses.map((status) => (
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
