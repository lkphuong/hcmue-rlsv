import React, { forwardRef, useImperativeHandle, useState } from 'react';

import { Box, Button, FormControlLabel, Menu, Radio, RadioGroup } from '@mui/material';

import './index.scss';

export const MMenuRole = forwardRef(({ id, role }, ref) => {
	//#region Data
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const [value, setValue] = useState(role);
	//#endregion

	//#region Event
	const turnOnMenu = (event) => setAnchorEl(event.currentTarget);

	const turnOffMenu = () => setAnchorEl(null);

	const onChangeRole = (event) => setValue(event.target.value);
	//#endregion

	useImperativeHandle(ref, () => ({
		onMenu: (event) => turnOnMenu(event),
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
				<FormControlLabel value={3} control={<Radio />} label='ADMIN' />
				<FormControlLabel value={2} control={<Radio />} label='KHOA' />
				<FormControlLabel value={1} control={<Radio />} label='CÁN BỘ LỚP' />
				<FormControlLabel value={0} control={<Radio />} label='SINH VIÊN' />
			</RadioGroup>

			<Box textAlign='center'>
				<Button variant='contained'>Lưu</Button>
			</Box>
		</Menu>
	);

	//#endregion
});
