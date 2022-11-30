import React, { memo } from 'react';

import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';

import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';

import dayjs from 'dayjs';

import { CAutocomplete, CRangePicker } from '_controls/';

import { isSuccess } from '_func/';

import { createForm } from '_api/form.api';

import { useResolver } from '_hooks/';

import { initialValues, validationSchema } from '_modules/form/form';

import { alert } from '_func/alert';

import { actions } from '_slices/form.slice';

import { ERRORS } from '_constants/messages';

const SettingTime = memo(({ updateStep }) => {
	//#region Data
	const { semesters, academic_years } = useSelector((state) => state.options, shallowEqual);

	const dispatch = useDispatch();

	const resolver = useResolver(validationSchema);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: initialValues,
		mode: 'all',
		resolver,
	});
	//#endregion

	//#region Event
	const onSubmit = async (values) => {
		const body = {
			...values,
			student: {
				start: dayjs(values.student.start).format('YYYY-MM-DD'),
				end: dayjs(values.student.end).format('YYYY-MM-DD'),
			},
			classes: {
				start: dayjs(values.classes.start).format('YYYY-MM-DD'),
				end: dayjs(values.classes.end).format('YYYY-MM-DD'),
			},
			department: {
				start: dayjs(values.department.start).format('YYYY-MM-DD'),
				end: dayjs(values.department.end).format('YYYY-MM-DD'),
			},
		};

		const res = await createForm(body);

		if (isSuccess(res)) {
			alert.success({ text: 'Cập nhật thời gian phát hành thành công' });

			const { id } = res.data;

			dispatch(actions.setFormId(Number(id)));
			updateStep(1);
		} else {
			alert.fail({ text: res?.message || ERRORS.FAIL });
		}
	};

	const handleChangeSelect = (CallbackUpdateForm) => (value) => {
		CallbackUpdateForm(value?.id);
	};

	const handleBack = () => updateStep((prev) => prev - 1);
	//#endregion

	//#region Render
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Container maxWidth='md'>
				<Grid container mb={2} spacing={2}>
					<Grid item xs={12} xl={7}>
						<Typography mb={0.8} fontWeight={500}>
							Học kỳ - Niên khóa
						</Typography>
						<Stack direction='row'>
							<Box flex={1} mr={1}>
								<Controller
									control={control}
									name='semester_id'
									render={({
										field: { onChange, onBlur, value, name, ref },
										fieldState: { error },
									}) => (
										<CAutocomplete
											onChange={handleChangeSelect(onChange)}
											onBlur={onBlur}
											value={value}
											name={name}
											inputRef={ref}
											fullWidth
											options={semesters}
											display='name'
											renderOption={(props, option) => (
												<Box {...props} key={option.id} component='li'>
													{option.name}
												</Box>
											)}
											error={!!error}
											helperText={error?.message}
										/>
									)}
								/>
							</Box>
							<Box flex={1}>
								<Controller
									control={control}
									name='academic_id'
									render={({
										field: { onChange, onBlur, value, name, ref },
										fieldState: { error },
									}) => (
										<CAutocomplete
											onChange={handleChangeSelect(onChange)}
											onBlur={onBlur}
											value={value}
											name={name}
											inputRef={ref}
											fullWidth
											options={academic_years}
											display='name'
											renderOption={(props, option) => (
												<Box {...props} key={option.id} component='li'>
													{option.name}
												</Box>
											)}
											error={!!error}
											helperText={error?.message}
										/>
									)}
								/>
							</Box>
						</Stack>
					</Grid>
					<Grid item xs={0} xl={2.5} />
					<Grid item xs={0} xl={2.5} />

					<Grid item xs={12} xl={4}>
						<Typography mb={0.8} fontWeight={500}>
							Thời hạn sinh viên chấm
						</Typography>
						<Controller
							control={control}
							name='student'
							render={({
								field: { onChange, value, name },
								fieldState: { error },
							}) => {
								return (
									<CRangePicker
										onChange={onChange}
										dateRange={value}
										error={!!errors['student.start']}
										helperText={errors['student.start']?.message}
									/>
								);
							}}
						/>
					</Grid>

					<Grid item xs={12} xl={4}>
						<Typography mb={0.8} fontWeight={500}>
							Thời hạn lớp chấm
						</Typography>
						<Controller
							control={control}
							name='classes'
							render={({ field: { onChange, value } }) => (
								<CRangePicker
									onChange={onChange}
									dateRange={value}
									error={!!errors['classes.start']}
									helperText={errors['classes.start']?.message}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={12} xl={4}>
						<Typography mb={0.8} fontWeight={500}>
							Thời hạn khoa chấm
						</Typography>
						<Controller
							control={control}
							name='department'
							render={({ field: { onChange, value } }) => (
								<CRangePicker
									onChange={onChange}
									dateRange={value}
									error={!!errors['department.start']}
									helperText={errors['department.start']?.message}
								/>
							)}
						/>
					</Grid>

					<Grid item xs={12} textAlign='center'>
						<Grid
							container
							mt={4}
							spacing={2}
							alignItems='center'
							justifyContent='center'
						>
							<Grid item>
								<Button
									sx={{ maxWidth: 100 }}
									type='button'
									variant='contained'
									onClick={handleBack}
								>
									Trở lại
								</Button>
							</Grid>
							<Grid item>
								<Button sx={{ maxWidth: 100 }} type='submit' variant='contained'>
									Tiếp tục
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Container>
		</form>
	);
	//#endregion
});

export default SettingTime;
