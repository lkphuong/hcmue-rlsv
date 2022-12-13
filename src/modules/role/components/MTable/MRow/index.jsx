import React, { useMemo, useRef } from 'react';

import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material';
import { Settings } from '@mui/icons-material';

import { ROLES } from '_constants/variables';

import { MMenuRole } from '../../MMenuRole';

export const MRow = ({ data }) => {
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
		<>
			<TableRow>
				<TableCell align='left'>{data?.name}</TableCell>
				<TableCell align='center'>{data?.std_code}</TableCell>
				<TableCell align='center'>{data?.department.name}</TableCell>
				<TableCell align='center'>{data?.classes?.name}</TableCell>
				<TableCell align='center'>{role}</TableCell>
				<TableCell className='sticky sticky-right'>
					<Tooltip title='Phân quyền'>
						<IconButton onClick={onClick}>
							<Settings />
						</IconButton>
					</Tooltip>
				</TableCell>
			</TableRow>

			<MMenuRole
				id={data?.user_id}
				department_id={data?.department?.id}
				class_id={data?.classes?.id}
				ref={menuRef}
			/>
		</>
	);
	//#endregion
};
