import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

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

import { validationSchemaForgotPassword } from '_modules/auth/form';

import { CInput } from '_controls/';

import logo from '_assets/images/new-logo.png';

import { alert } from '_func/alert';
import { isSuccess } from '_func/';

import { forgotPassword } from '_api/auth.api';

import './index.scss';

const ROLES = [
	{ id: 1, value: 1, label: 'Sinh viên/Cán bộ lớp' },
	{ id: 2, value: 2, label: 'Cố vấn học tập' },
	{ id: 3, value: 3, label: 'Quản lý cấp Khoa' },
	{ id: 4, value: 4, label: 'Quản lý cấp Trường' },
];

const ForgotPasswordPage = () => {
	//#region Data
	const { type } = useParams();

	const [isDone, setIsDone] = useState(false);

	const resolver = useResolver(validationSchemaForgotPassword);

	const { control, handleSubmit } = useForm({
		defaultValues: { type: Number(type), email: '' },
		mode: 'all',
		resolver,
	});

	const navigate = useNavigate();
	//#endregion

	//#region Event
	const onSubmit = async (values) => {
		alert.loading();

		const res = await forgotPassword(values);

		if (isSuccess(res)) {
			setIsDone(true);

			alert.success({
				title: 'Yêu cầu nhận mật khẩu của bạn đã được gửi tới Email! Vui lòng kiểm trả Email để hoàn tất xác nhận lấy lại mật khẩu.',
			});
		} else {
			alert.fail({ text: res?.message || 'Gửi yêu cầu lấy lại mật khẩu không thành công!' });
		}
	};

	const onTypeChange = (CallbackFunc) => (event, newValue) => CallbackFunc(Number(newValue));
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
									<Typography
										fontSize={18}
										fontWeight={600}
										textAlign='center'
										textTransform='uppercase'
										my={1.5}
									>
										Quên mật khẩu
									</Typography>

									{isDone ? (
										<Box textAlign='center'>
											<Typography mb={2}>
												Mật khẩu của bạn đã được gửi tới Email sinh viên!
												Vui lòng kiểm tra Email để nhận mật khẩu mới!
											</Typography>

											<Button onClick={() => navigate('/login')}>
												Trỏ về trang chủ
											</Button>
										</Box>
									) : (
										<>
											<Box my={1}>
												<Controller
													control={control}
													name='type'
													render={({
														field: { name, ref, value, onChange },
													}) => (
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
																			checked={
																				value === e.value
																			}
																		/>
																	}
																/>
															))}
														</RadioGroup>
													)}
												/>
											</Box>
											<Box my={1}>
												<Typography mb={1}>Nhập email</Typography>
												<Controller
													control={control}
													name='email'
													render={({
														field: {
															onChange,
															onBlur,
															value,
															name,
															ref,
														},
														fieldState: { error },
													}) => (
														<CInput
															fullWidth
															placeholder='Nhập email tại đây'
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
												sx={{
													m: 'auto',
													maxWidth: '200px',
													my: 2,
													fontSize: 14,
													whiteSpace: 'nowrap',
												}}
											>
												Lấy lại mật khẩu
											</Button>
										</>
									)}
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

export default ForgotPasswordPage;
