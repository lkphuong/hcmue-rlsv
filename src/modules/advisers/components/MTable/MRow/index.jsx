import { IconButton, TableCell, TableRow, Tooltip, Typography } from '@mui/material';

import { restorePassword } from '_api/auth.api';

import { ERRORS } from '_constants/messages';

import { isSuccess } from '_func/';
import { alert } from '_func/alert';

import { CResetIcon } from '_others/';

export const MRow = ({ data, index }) => {
	//#region Data
	//#endregion

	//#region Event
	const onReset = () =>
		alert.question({
			onConfirm: async () => {
				alert.loading();

				const res = await restorePassword(data?.id, { type: 2 });

				if (isSuccess(res)) alert.success({ text: 'Reset mật khẩu cho CVHT thành công.' });
				else alert.fail({ text: res?.message || ERRORS.FAIL });
			},
			title: 'Reset mật khẩu',
			text: 'Bạn có chắc muốn đặt lại mật khẩu mặc định cho tài khoản này không?',
		});
	//#endregion

	//#region Render
	return (
		<TableRow>
			<TableCell align='center'>{index + 1}</TableCell>
			<TableCell align='left'>{data?.fullname}</TableCell>
			<TableCell align='center'>{data?.phone_number}</TableCell>
			<TableCell align='left'>{data?.email}</TableCell>
			<TableCell align='center'>{data?.code}</TableCell>
			<TableCell align='left'>{data?.department}</TableCell>
			<TableCell align='center'>
				{data?.classes?.length &&
					data.classes.map((e, i) => (
						<Typography key={i} lineHeight={2}>
							{e}
						</Typography>
					))}
			</TableCell>
			<TableCell align='center'>
				<Tooltip title='Reset mật khẩu'>
					<IconButton onClick={onReset}>
						<CResetIcon />
					</IconButton>
				</Tooltip>
			</TableCell>
		</TableRow>
	);
	//#endregion
};
