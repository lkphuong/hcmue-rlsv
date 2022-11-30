import React, { useState, useEffect, useMemo, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Box, CardContent, Grid, Paper, Step, StepLabel, Stepper, Typography } from '@mui/material';

import { ROUTES } from '_constants/routes';

import { actions } from '_slices/form.slice';

import { usePrompt } from '_hooks/';

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

	const [step, setStep] = useState(_step || 0);

	const navigate = useNavigate();

	const dispatch = useDispatch();

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

	//#endregion

	useEffect(() => {
		dispatch(actions.setStep(step));

		if (step < 0) {
			dispatch(actions.clearForm());
			navigate(ROUTES.FORM);
		} else if (step > 3) {
			dispatch(actions.clearForm());
			navigate(ROUTES.FORM);
		}
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
					<Typography fontSize={20} p={1.5}>
						Quản lý biểu mẫu - Tạo mới biểu mẫu
					</Typography>
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

							{currentStage}
						</CardContent>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
	//#endregion
};

export default FormCreatePage;
