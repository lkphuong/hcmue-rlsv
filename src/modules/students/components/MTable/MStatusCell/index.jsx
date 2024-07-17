import { useRef, useState } from 'react';

import { Collapse, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import { CUserEditIcon } from '_others/';

import { MMenuStatus } from '../..';

export const MStatusCell = ({ data }) => {
	//#region Data
	const [open, setOpen] = useState(false);

	const statusRef = useRef();
	//#endregion

	//#region Event
	const onClickStatus = (event) => statusRef.current.onMenu(event, Number(data?.status?.id));
	//#endregion

	//#region Render
	return (
		<Stack
			direction='row'
			spacing={1}
			alignItems='center'
			justifyContent='end'
			onMouseEnter={() => setOpen(true)}
			onMouseLeave={() => setOpen(false)}
		>
			<Typography whiteSpace='nowrap' fontSize={12}>
				{data?.status?.name}
			</Typography>
			<Collapse orientation='horizontal' in={open}>
				<Tooltip title='Đổi tình trạng học'>
					<span>
						<IconButton onClick={onClickStatus}>
							<CUserEditIcon />
						</IconButton>
					</span>
				</Tooltip>
			</Collapse>

			<MMenuStatus id={data?.id} ref={statusRef} />
		</Stack>
	);
	//#endregion
};
