import React from 'react';

import { Controller, useForm } from 'react-hook-form';

import { useDispatch } from 'react-redux';

import { Box, Button, Container, Paper, Stack } from '@mui/material';

import { useResolver } from '_hooks/';

import { initialValues, validationSchema } from '_modules/auth/form';

import { CInput } from '_controls/';

import logo from '_assets/images/logo.png';

import { alert } from '_func/alert';

import { isSuccess } from '_func/';

import { login } from '_api/auth.api';

import { actions } from '_slices/auth.slice';

import { getProfile } from '_axios/';

import './index.scss';

export const LoginPage = () => {
	//#region Data
	const resolver = useResolver(validationSchema);

	const dispatch = useDispatch();

	const { control, handleSubmit } = useForm({
		defaultValues: initialValues,
		mode: 'all',
		resolver,
	});
	//#endregion

	//#region Event
	const onSubmit = async (values) => {
		alert.loading();

		const res = await login(values);

		if (isSuccess(res)) {
			const { access_token, refresh_token } = res.data;

			localStorage.setItem('access_token', access_token);
			localStorage.setItem('refresh_token', refresh_token);

			dispatch(actions.setToken({ access_token, refresh_token }));

			await getProfile(access_token);

			alert.success({ title: 'Đăng nhập thành công!' });
		} else {
			alert.fail({ text: res?.message || 'Đăng nhập không thành công!' });
		}
	};
	//#endregion

	//#region Render
	return (
		<Box className='login-background'>
			<Box
				position='absolute'
				top='50%'
				left='50%'
				sx={{ transform: 'translate(-50% , -50%)' }}
			>
				<Container maxWidth='xl'>
					<Paper className='paper-form'>
						<Stack direction='column'>
							<Box align='center'>
								<img src={logo} alt='' />
							</Box>
							<form onSubmit={handleSubmit(onSubmit)}>
								<Stack direction='column'>
									<Box my={1}>
										<Controller
											control={control}
											name='username'
											render={({
												field: { onChange, onBlur, value, name, ref },
												fieldState: { error },
											}) => (
												<CInput
													fullWidth
													placeholder='Nhập mssv...'
													onChange={onChange}
													onBlur={onBlur}
													value={value}
													name={name}
													inputRef={ref}
													error={!!error}
													helperText={error?.message}
												/>
											)}
										/>
									</Box>
									<Box my={1}>
										<Controller
											control={control}
											name='password'
											render={({
												field: { onChange, onBlur, value, name, ref },
												fieldState: { error },
											}) => (
												<CInput
													fullWidth
													isPassword
													placeholder='Nhập mật khẩu...'
													onChange={onChange}
													onBlur={onBlur}
													value={value}
													name={name}
													inputRef={ref}
													error={!!error}
													helperText={error?.message}
												/>
											)}
										/>
									</Box>
									<Button
										variant='contained'
										type='submit'
										sx={{ m: 'auto', maxWidth: '150px', my: 2, fontSize: 16 }}
									>
										Đăng nhập
									</Button>
								</Stack>
							</form>
						</Stack>
					</Paper>
				</Container>
			</Box>
		</Box>
	);
	//#endregion
};
