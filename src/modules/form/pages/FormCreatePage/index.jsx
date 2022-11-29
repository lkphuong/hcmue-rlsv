import React, { useState, useEffect, useMemo, lazy } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, CardContent, Grid, Paper, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { ROUTES } from '_constants/routes';

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
	const [isEdit, setIsEdit] = useState();

	const [step, setStep] = useState(3);

	const { form_id } = useParams();

	const navigate = useNavigate();

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
		if (form_id) setIsEdit(true);
	}, [form_id]);

	useEffect(() => {
		if (step < 0) {
			navigate(ROUTES.FORM);
		} else if (step > 3) {
			navigate(ROUTES.FORM);
		}
	}, [step]);

	//#region Render
	return (
		<Box>
			<Box mb={1.5}>
				<Paper className='paper-wrapper'>
					<Typography fontSize={20} p={1.5}>
						Quản lý biểu mẫu - {isEdit ? 'Chỉnh sửa phiếu' : 'Tạo mới phiếu'}
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
