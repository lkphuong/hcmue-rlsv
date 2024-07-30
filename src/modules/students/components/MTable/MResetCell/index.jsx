import { IconButton, Tooltip } from '@mui/material';

import { restorePassword } from '_api/auth.api';
import { ERRORS } from '_constants/messages';
import { isSuccess } from '_func/index';
import { CResetIcon } from '_others/';

export const MResetCell = ({ data }) => {
	//#region Event
	const onReset = () =>
		alert.question({
			onConfirm: async () => {
				alert.loading();

				const res = await restorePassword(data?.id, { type: 1 });

				if (isSuccess(res)) alert.success({ text: 'Reset mật khẩu cho sinh viên thành công.' });
				else alert.fail({ text: res?.message || ERRORS.FAIL });
			},
			title: 'Reset mật khẩu',
			text: 'Bạn có chắc muốn đặt lại mật khẩu mặc định cho tài khoản này không?',
		});
	//#endregion

	//#region Render
	return (
		<Tooltip title='Reset mật khẩu'>
			<IconButton onClick={onReset}>
				<CResetIcon />
			</IconButton>
		</Tooltip>
	);
	//#endregion
};
