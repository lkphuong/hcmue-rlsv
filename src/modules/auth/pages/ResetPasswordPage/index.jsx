import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';

import { useResolver } from '_hooks/';

import { validationSchemaResetPassword } from '_modules/auth/form';

import { CInput } from '_controls/';

import logo from '_assets/images/logo.png';

import { alert } from '_func/alert';
import { isSuccess } from '_func/';

import { resetPassword } from '_api/auth.api';

import './index.scss';

const ResetPasswordPage = () => {
	//#region Data
	const resolver = useResolver(validationSchemaResetPassword);

	const navigate = useNavigate();

	const [searchParams] = useSearchParams();

	const token = searchParams.get('token');

	const { control, handleSubmit } = useForm({
		defaultValues: { new_password: '', confirm_password: '', token },
		mode: 'all',
		resolver,
	});

	if (!token) navigate('/login');
	//#endregion

	//#region Event
	const onSubmit = async (values) => {
		alert.loading();

		const res = await resetPassword(values);

		if (isSuccess(res)) {
			alert.success({
				title: 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại',
				onOkConfirm: () => {
					navigate('/login');
				},
			});
		} else {
			alert.fail({ text: res?.message || 'Đổi mật khẩu không thành công!' });
		}
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
				>
					<Typography
						fontWeight={700}
						textAlign='center'
						color='#2A61A2'
						fontSize='1.25rem'
						lineHeight={1.6}
					>
						CHUYÊN TRANG ĐÁNH GIÁ ĐIỂM RÈN LUYỆN SINH VIÊN
					</Typography>
					<Typography
						textAlign='center'
						color='#2A61A2'
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
									<Typography
										fontSize={18}
										fontWeight={600}
										textAlign='center'
										textTransform='uppercase'
										my={1.5}
									>
										Đổi mật khẩu
									</Typography>

									<Box my={1}>
										<Typography mb={1}>Nhập mật khẩu mới</Typography>
										<Controller
											control={control}
											name='new_password'
											render={({
												field: { onChange, onBlur, value, name, ref },
												fieldState: { error },
											}) => (
												<CInput
													fullWidth
													isPassword
													placeholder='Nhập mật khẩu mới'
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
										<Typography mb={1}>Xác nhận mật khẩu mới</Typography>
										<Controller
											control={control}
											name='confirm_password'
											render={({
												field: { onChange, onBlur, value, name, ref },
												fieldState: { error },
											}) => (
												<CInput
													fullWidth
													isPassword
													placeholder='Xác nhận mật khẩu mới'
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
										Xác nhận
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
export default ResetPasswordPage;
