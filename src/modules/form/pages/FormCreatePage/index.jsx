import React, { useState, useEffect, useMemo, lazy } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import {
	Avatar,
	Box,
	Button,
	ButtonBase,
	CardContent,
	Container,
	Grid,
	Paper,
	Stack,
	Step,
	StepLabel,
	Stepper,
	Tooltip,
	Typography,
	useTheme,
} from '@mui/material';
import {
	ArrowBack,
	ArrowForward,
	CheckCircleOutline,
	UnpublishedOutlined,
} from '@mui/icons-material';

import { ROUTES } from '_constants/routes';

import { actions } from '_slices/form.slice';

import { usePrompt } from '_hooks/';

import { getFormById, publishForm, unpublishForm } from '_api/form.api';

import { alert } from '_func/alert';
import { isSuccess } from '_func/';

import { ERRORS } from '_constants/messages';

const SettingTime = lazy(() => import('_modules/form/components/SettingTime'));
const SettingHeader = lazy(() => import('_modules/form/components/SettingHeader'));
const SettingTitle = lazy(() => import('_modules/form/components/SettingTitle'));
const SettingItem = lazy(() => import('_modules/form/components/SettingItem'));

const STEPS = [
	'Cài đặt thời gian phát hành',
	'Cài đặt danh mục',
	'Cài đặt tiêu chí',
	'Cài đặt chi tiết tiêu chí',
];

const FormCreatePage = () => {
	//#region Data
	const _step = useSelector((state) => state.form.step, shallowEqual);
	const status = useSelector((state) => state.form.status, shallowEqual);
	const form_id = useSelector((state) => state.form.form_id, shallowEqual);

	const [step, setStep] = useState(_step || 0);

	const navigate = useNavigate();

	const dispatch = useDispatch();

	const theme = useTheme();

	const currentStage = useMemo(() => {
		switch (step) {
			case 0:
				return <SettingTime updateStep={setStep} />;
			case 1:
				return <SettingHeader updateStep={setStep} />;
			case 2:
				return <SettingTitle updateStep={setStep} />;
			case 3:
				return <SettingItem updateStep={setStep} />;
			default:
				break;
		}
	}, [step]);
	//#endregion

	//#region Event
	const onBack = () =>
		setStep((prev) => {
			if (prev - 1 < 0) {
				navigate(ROUTES.FORM);
				return prev;
			}

			return prev - 1;
		});

	const onForward = () =>
		setStep((prev) => {
			if (prev + 1 > 3) {
				navigate(ROUTES.FORM);
				return prev;
			}

			return prev + 1;
		});

	const handlePublish = () => {
		alert.warning({
			onConfirm: async () => {
				const res = await publishForm(form_id);

				if (isSuccess(res)) {
					alert.success({ text: 'Phát hành biểu mẫu thành công.' });

					const _res = await getFormById(form_id);

					if (isSuccess(_res)) {
						const { status } = _res.data;

						dispatch(actions.setStatus(status));
					}
				} else {
					alert.fail({ text: res?.message || ERRORS.FAIL });
				}
			},
			title: 'Phát hành',
		});
	};

	const handleUnpublish = () => {
		alert.warning({
			onConfirm: async () => {
				const res = await unpublishForm(form_id);

				if (isSuccess(res)) {
					alert.success({ text: 'Hủy phát hành biểu mẫu thành công.' });

					const _res = await getFormById(form_id);

					if (isSuccess(_res)) {
						const { status } = _res.data;

						dispatch(actions.setStatus(status));
					}
				} else {
					alert.fail({ text: res?.message || ERRORS.FAIL });
				}
			},
			title: 'Hủy phát hành',
		});
	};
	//#endregion

	useEffect(() => {
		dispatch(actions.setStep(step));
	}, [step]);

	usePrompt(
		'Các thao tác đang điều chỉnh có thể mất khi bạn chuyển trang.',
		true,
		actions.clearForm()
	);

	//#region Render
	return (
		<Box>
			<Box mb={1.5}>
				<Paper className='paper-wrapper'>
					<Box display='flex' alignItems='center' justifyContent='space-between'>
						<Typography fontSize={20} p={1.5} flex={1}>
							Quản lý biểu mẫu - Tạo mới biểu mẫu
						</Typography>
						<Link to={ROUTES.FORM}>
							<Tooltip title='Trở về danh sách biểu mẫu'>
								<ButtonBase sx={{ paddingX: 1.5 }}>
									<Avatar
										variant='rounded'
										sx={{
											...theme.typography.commonAvatar,
											...theme.typography.mediumAvatar,
											transition: 'all .2s ease-in-out',
											background: theme.palette.secondary.light,
											color: theme.palette.secondary.dark,
											'&:hover': {
												background: theme.palette.secondary.dark,
												color: theme.palette.secondary.light,
											},
										}}
									>
										<ArrowBack />
									</Avatar>
								</ButtonBase>
							</Tooltip>
						</Link>
					</Box>
				</Paper>
			</Box>

			<Grid container>
				<Grid item xs={12}>
					<Paper className='paper-wrapper'>
						<CardContent sx={{ backgroundColor: 'rgb(247 246 255)' }}>
							<Stepper activeStep={step} alternativeLabel>
								{STEPS.map((label) => (
									<Step key={label}>
										<StepLabel>{label}</StepLabel>
									</Step>
								))}
							</Stepper>

							<Typography fontWeight={600} fontSize={20} align='center' mt={3} mb={5}>
								PHIẾU ĐÁNH GIÁ KẾT QUẢ RÈN LUYỆN SINH VIÊN
							</Typography>

							{step !== 0 && (
								<Container maxWidth='lg'>
									{status === 0 && (
										<Box py={1.5}>
											<Button
												variant='contained'
												endIcon={<CheckCircleOutline />}
												onClick={handlePublish}
											>
												Phát hành
											</Button>
										</Box>
									)}
									{status === 1 && (
										<Box py={1.5}>
											<Button
												variant='contained'
												endIcon={<UnpublishedOutlined />}
												onClick={handleUnpublish}
											>
												Hủy phát hành
											</Button>
										</Box>
									)}
								</Container>
							)}

							{currentStage}

							<Stack direction='row' spacing={1.5} justifyContent='center' mt={2}>
								<ButtonBase onClick={onBack}>
									<Avatar
										variant='rounded'
										sx={{
											...theme.typography.commonAvatar,
											...theme.typography.mediumAvatar,
											transition: 'all .2s ease-in-out',
											background: theme.palette.secondary.light,
											color: theme.palette.secondary.dark,
											'&:hover': {
												background: theme.palette.secondary.dark,
												color: theme.palette.secondary.light,
											},
										}}
									>
										<ArrowBack />
									</Avatar>
								</ButtonBase>

								<ButtonBase onClick={onForward} disabled={!form_id}>
									<Avatar
										variant='rounded'
										sx={{
											...theme.typography.commonAvatar,
											...theme.typography.mediumAvatar,
											transition: 'all .2s ease-in-out',
											background: theme.palette.secondary.light,
											color: theme.palette.secondary.dark,
											'&:hover': {
												background: theme.palette.secondary.dark,
												color: theme.palette.secondary.light,
											},
										}}
									>
										<ArrowForward />
									</Avatar>
								</ButtonBase>
							</Stack>
						</CardContent>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
	//#endregion
};

export default FormCreatePage;
