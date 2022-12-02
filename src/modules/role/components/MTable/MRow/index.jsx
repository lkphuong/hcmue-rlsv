import React, { useRef } from 'react';

import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material';
import { Settings } from '@mui/icons-material';

import { MMenuRole } from '../../MMenuRole';

export const MRow = ({ data }) => {
	//#region Data
	const menuRef = useRef();
	//#endregion

	//#region Event
	const onClick = (event) => menuRef.current.onMenu(event);
	//#endregion

	//#region Render
	return (
		<>
			<TableRow>
				<TableCell align='center'>{data.username}</TableCell>
				<TableCell align='center'>{data.department}</TableCell>
				<TableCell align='center'>{data.class}</TableCell>
				<TableCell align='center'>{data.role.name}</TableCell>
				<TableCell className='sticky sticky-right'>
					<Tooltip title='Phân quyền'>
						<IconButton onClick={onClick}>
							<Settings />
						</IconButton>
					</Tooltip>
				</TableCell>
			</TableRow>

			<MMenuRole id={data.id} role={data.role.id} ref={menuRef} />
		</>
	);
	//#endregion
};
