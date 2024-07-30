import { Controller, useForm } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Box, Paper, Typography, Stack, Button } from '@mui/material';

import { CInput } from '_controls/';

import { useResolver } from '_hooks/';

import { initialValuesChangePassword, validationSchemaChangePassword } from '_modules/auth/form';

import { changePassword } from '_api/auth.api';

import { isSuccess } from '_func/';
import { alert } from '_func/alert';

import { ERRORS } from '_constants/messages';

const ChangePasswordPage = () => {
	//#region Data
	const profile = useSelector((state) => state.auth.profile, shallowEqual);

	const navigate = useNavigate();

	const resolver = useResolver(validationSchemaChangePassword);

	const { control, handleSubmit, reset } = useForm({
		defaultValues: initialValuesChangePassword,
		mode: 'all',
		shouldFocusError: true,
		resolver,
	});
	//#endregion

	//#region Event
	const onSubmit = async (values) => {
		const res = await changePassword(values);

		if (isSuccess(res)) {
			reset();

			alert.success({ text: 'Thay đổi mật khẩu thành công' });
		} else alert.fail({ text: res?.message || ERRORS.FAIL });
	};

	const onCancel = () => {
		reset();

		navigate(-1);
	};
	//#endregion

	//#region Render
	return (
		<Box className='center'>
			<Paper className='paper-filter'>
				<Box p={3}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<Stack direction='column' spacing={3}>
							<Stack
								direction={{ xs: 'column', md: 'row' }}
								spacing={2}
								alignItems='center'
							>
								<Typography>Tên đăng nhập:&nbsp;</Typography>
								<Typography fontWeight={600} fontSize={20}>
									{profile?.username}
								</Typography>
							</Stack>
							<Stack
								direction={{ xs: 'column', md: 'row' }}
								spacing={2}
								justifyContent='space-between'
								alignItems='center'
							>
								<Typography>Nhập mật khẩu hiện tại:&nbsp;</Typography>
								<Controller
									control={control}
									name='old_password'
									render={({ field, fieldState: { error } }) => (
										<CInput
											isPassword
											{...field}
											error={!!error}
											helperText={error?.message}
										/>
									)}
								/>
							</Stack>
							<Stack
								direction={{ xs: 'column', md: 'row' }}
								spacing={2}
								justifyContent='space-between'
								alignItems='center'
							>
								<Typography>Nhập mật khẩu mới:&nbsp;</Typography>
								<Controller
									control={control}
									name='new_password'
									render={({ field, fieldState: { error } }) => (
										<CInput
											isPassword
											{...field}
											error={!!error}
											helperText={error?.message}
										/>
									)}
								/>
							</Stack>
							<Stack
								direction={{ xs: 'column', md: 'row' }}
								spacing={2}
								justifyContent='space-between'
								alignItems='center'
							>
								<Typography>Xác nhận mật khẩu mới:&nbsp;</Typography>
								<Controller
									control={control}
									name='confirm_password'
									render={({ field, fieldState: { error } }) => (
										<CInput
											isPassword
											{...field}
											error={!!error}
											helperText={error?.message}
										/>
									)}
								/>
							</Stack>

							<Stack direction='row' mt={2.5} spacing={3} justifyContent='center'>
								<Button variant='contained' type='submit'>
									Xác nhận
								</Button>
								<Button variant='contained' onClick={onCancel}>
									Hủy
								</Button>
							</Stack>
						</Stack>
					</form>
				</Box>
			</Paper>
		</Box>
	);
	//#endregion
};

export default ChangePasswordPage;
