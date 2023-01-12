import { useMemo, useRef } from 'react';

import { IconButton, Stack, TableCell, TableRow, Tooltip, Typography } from '@mui/material';

import { ROLES } from '_constants/variables';

import { CSettingIcon } from '_others/';

import { MMenuRole } from '../../MMenuRole';

export const MRow = ({ data, index }) => {
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
				<TableCell align='center'>{index + 1}</TableCell>
				<TableCell align='center'>{data?.std_code}</TableCell>
				<TableCell align='center'>{data?.status?.name}</TableCell>
				<TableCell align='left'>{data?.name}</TableCell>
				<TableCell align='center'>{data?.birthday}</TableCell>
				<TableCell align='center'>{data?.k?.name}</TableCell>
				<TableCell align='center'>{data?.department?.name}</TableCell>
				<TableCell align='center'>{data?.major?.name}</TableCell>
				<TableCell align='center'>{data?.classes?.code}</TableCell>
				<TableCell align='center'>{data?.classes?.name}</TableCell>
				<TableCell align='center'>
					<Stack direction='row' spacing={1} alignItems='center' justifyContent='end'>
						<Typography>{role}</Typography>
						<Tooltip title='Phân quyền'>
							<IconButton onClick={onClick}>
								<CSettingIcon />
							</IconButton>
						</Tooltip>
					</Stack>
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
