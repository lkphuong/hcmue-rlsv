import { useMemo, useRef, useState } from 'react';

import {
	Collapse,
	IconButton,
	Stack,
	TableCell,
	TableRow,
	Tooltip,
	Typography,
} from '@mui/material';

import { ROLES } from '_constants/variables';

import { CResetIcon, CSettingIcon, CUserEditIcon } from '_others/';

import { alert } from '_func/alert';
import { isSuccess } from '_func/';

import { ERRORS } from '_constants/messages';

import { restorePassword } from '_api/auth.api';

import { MMenuRole } from '../../MMenuRole';
import { MMenuStatus } from '../..';

export const MRow = ({ data, index }) => {
	//#region Data
	const menuRef = useRef();
	const statusRef = useRef();

	const role = useMemo(() => {
		return ROLES.find((e) => e.id === data.role).name || '';
	}, [data.role]);

	const [open, setOpen] = useState(false);
	//#endregion

	//#region Event
	const onClick = (event) => menuRef.current.onMenu(event, Number(data?.role));

	const onClickStatus = (event) => statusRef.current.onMenu(event, Number(data?.role));

	const onReset = () =>
		alert.question({
			onConfirm: async () => {
				alert.loading();

				const res = await restorePassword(data?.id, { type: 1 });

				if (isSuccess(res))
					alert.success({ text: 'Reset mật khẩu cho sinh viên thành công.' });
				else alert.fail({ text: res?.message || ERRORS.FAIL });
			},
			title: 'Reset mật khẩu',
			text: 'Bạn có chắc muốn đặt lại mật khẩu mặc định cho tài khoản này không?',
		});
	//#endregion

	//#region Render
	return (
		<>
			<TableRow sx={{ '& .MuiTableCell-root': { fontSize: '12px!important' } }}>
				<TableCell align='center'>{index + 1}</TableCell>
				<TableCell align='center'>{data?.std_code}</TableCell>
				<TableCell align='center' width={175}>
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
									<IconButton
										disabled={!data?.status?.flag}
										onClick={onClickStatus}
									>
										<CUserEditIcon />
									</IconButton>
								</span>
							</Tooltip>
						</Collapse>
					</Stack>
				</TableCell>
				<TableCell align='left'>{data?.name}</TableCell>
				<TableCell align='center'>{data?.birthday}</TableCell>
				<TableCell align='center'>{data?.k?.name}</TableCell>
				<TableCell align='center'>{data?.department?.name}</TableCell>
				<TableCell align='center'>{data?.major?.name}</TableCell>
				<TableCell align='center'>{data?.classes?.code}</TableCell>
				<TableCell align='center'>{data?.classes?.name}</TableCell>
				<TableCell align='center'>
					<Stack direction='row' spacing={1} alignItems='center' justifyContent='end'>
						<Typography whiteSpace='nowrap' fontSize={12}>
							{role}
						</Typography>
						<Tooltip title='Phân quyền'>
							<span>
								<IconButton disabled={!data?.status?.flag} onClick={onClick}>
									<CSettingIcon />
								</IconButton>
							</span>
						</Tooltip>
					</Stack>
				</TableCell>
				<TableCell align='center'>
					<Tooltip title='Reset mật khẩu'>
						<IconButton onClick={onReset}>
							<CResetIcon />
						</IconButton>
					</Tooltip>
				</TableCell>
			</TableRow>

			<MMenuRole
				id={data?.std_code}
				department_id={Number(data?.department?.id)}
				class_id={Number(data?.classes?.id)}
				ref={menuRef}
			/>

			<MMenuStatus
				id={data?.std_code}
				department_id={Number(data?.department?.id)}
				class_id={Number(data?.classes?.id)}
				ref={statusRef}
			/>
		</>
	);
	//#endregion
};
