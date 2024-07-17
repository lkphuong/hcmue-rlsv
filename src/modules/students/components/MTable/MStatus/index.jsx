import { forwardRef, useImperativeHandle, useState } from 'react';

import { FormControlLabel, Menu, Radio, RadioGroup } from '@mui/material';

import { shallowEqual, useSelector } from 'react-redux';

import './index.scss';

export const MStatus = forwardRef(({ onFilterChange }, ref) => {
	//#region Data
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const [value, setValue] = useState('');

	const statuses = useSelector((state) => state.options?.statuses, shallowEqual);
	//#endregion

	//#region EventPhúc
	const turnOnMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const turnOffMenu = () => setAnchorEl(null);

	const onStatusChange = (event) => {
		const { value } = event.target;

		setValue(value);

		onFilterChange((prev) => ({ ...prev, page: 1, status_id: value ? Number(value) : null }));

		turnOffMenu();
	};
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
