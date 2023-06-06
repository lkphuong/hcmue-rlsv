import { Controller, useForm, useWatch } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
	Box,
	Button,
	Container,
	FormControlLabel,
	Paper,
	Radio,
	RadioGroup,
	Stack,
	Typography,
} from '@mui/material';

import { useResolver } from '_hooks/';

import { initialValues, validationSchema } from '_modules/auth/form';

import { CInput } from '_controls/';

import logo from '_assets/images/new-logo.png';

import { alert } from '_func/alert';
import { isSuccess } from '_func/';

import { login } from '_api/auth.api';

import { actions } from '_slices/auth.slice';

import { getProfile } from '_axios/';

import './index.scss';

const ROLES = [
	{ id: 1, value: 1, label: 'Sinh viên/Cán bộ lớp' },
	{ id: 2, value: 2, label: 'Cố vấn học tập' },
	{ id: 3, value: 3, label: 'Quản lý cấp Khoa' },
	{ id: 4, value: 4, label: 'Quản lý cấp Trường' },
];

export const LoginPage = () => {
	//#region Data
	const resolver = useResolver(validationSchema);

	const dispatch = useDispatch();

	const { control, handleSubmit } = useForm({
		defaultValues: initialValues,
		mode: 'all',
		resolver,
	});

	const type = useWatch({ control, name: 'type' });

	const navigate = useNavigate();
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

	const onTypeChange = (CallbackFunc) => (event, newValue) => {
		CallbackFunc(Number(newValue));
	};
	//#endregion

	//#region Render
	return (
		<Box className='login-background'>
			<Container maxWidth='xl'>
				<Box
					position='absolute'
					top='50%'
					left='50%'
					sx={{ transform: 'translate(-50% , -50%)' }}
					minWidth='60%'
				>
					<Typography
						fontWeight={700}
						textAlign='center'
						color='#CF373D'
						fontSize='1.25rem'
						lineHeight={1.6}
					>
						CHUYÊN TRANG ĐÁNH GIÁ ĐIỂM RÈN LUYỆN SINH VIÊN
					</Typography>
					<Typography
						textAlign='center'
						color='#CF373D'
						fontSize='1.2rem'
						lineHeight={1.6}
						mb={1.4}
					>
						TRƯỜNG ĐẠI HỌC SƯ PHẠM THÀNH PHỐ HỒ CHÍ MINH
					</Typography>

					<Paper className='paper-form' sx={{ maxWidth: '342px', margin: 'auto' }}>
						<Stack direction='column'>
							<Box align='center'>
								<img src={logo} alt='' />
							</Box>
							<form onSubmit={handleSubmit(onSubmit)}>
								<Stack direction='column'>
									<Box my={1}>
										<Controller
											control={control}
											name='type'
											render={({ field: { name, ref, value, onChange } }) => (
												<RadioGroup
													name={name}
													ref={ref}
													value={value}
													onChange={onTypeChange(onChange)}
												>
													{ROLES.map((e) => (
														<FormControlLabel
															key={e.id}
															value={e.value}
															label={e.label}
															control={
																<Radio
																	checked={value === e.value}
																/>
															}
														/>
													))}
												</RadioGroup>
											)}
										/>
									</Box>
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
													placeholder='Nhập tên đăng nhập'
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

									<Box textAlign='right'>
										<Button
											sx={{ fontWeight: 400 }}
											onClick={() => navigate(`/forgot-password/${type}`)}
											type='button'
										>
											Quên mật khẩu?
										</Button>
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
				</Box>
			</Container>
		</Box>
	);
	//#endregion
};
