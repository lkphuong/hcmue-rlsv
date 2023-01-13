import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { FormControlLabel, Menu, Radio, RadioGroup } from '@mui/material';

import { isSuccess } from '_func/';

import { getStatuses } from '_api/statuses.api';

import './index.scss';

export const MStatus = forwardRef(({ onFilterChange }, ref) => {
	//#region Data
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const [value, setValue] = useState('');

	const [statuses, setStatuses] = useState([]);
	//#endregion

	//#region EventPhúc
	const turnOnMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const turnOffMenu = () => setAnchorEl(null);

	const getStatus = async () => {
		const res = await getStatuses();

		if (isSuccess(res)) setStatuses(res.data);
	};

	const onStatusChange = (event) => {
		const { value } = event.target;

		setValue(value);

		onFilterChange((prev) => ({ ...prev, page: 1, status_id: value ? Number(value) : null }));

		turnOffMenu();
	};
	//#endregion

	useEffect(() => {
		getStatus();
	}, []);

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
			keepMounted
		>
			<RadioGroup value={value} onChange={onStatusChange}>
				<FormControlLabel value={''} control={<Radio />} label='Tất cả' />
				{statuses.map((status) => (
					<FormControlLabel
						key={status.id}
						value={status.id}
						control={<Radio />}
						label={status.name}
					/>
				))}
			</RadioGroup>
		</Menu>
	);

	//#endregion
});
