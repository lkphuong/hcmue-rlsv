import React, { memo, useEffect } from 'react';

import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Controller, useForm, FormProvider } from 'react-hook-form';

import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';

import dayjs from 'dayjs';

import { CAutocomplete } from '_controls/';

import { isSuccess } from '_func/';

import { createForm, getFormById, updateForm } from '_api/form.api';

import { useResolver } from '_hooks/';

import { initialValues, validationSchema } from '_modules/form/form';

import { alert } from '_func/alert';

import { actions } from '_slices/form.slice';

import { ERRORS } from '_constants/messages';

import { RangeControl } from './RangeControl';

const SettingTime = memo(() => {
	//#region Data
	const form_id = useSelector((state) => state.form.form_id, shallowEqual);

	const { semesters, academic_years } = useSelector((state) => state.options, shallowEqual);

	const dispatch = useDispatch();

	const resolver = useResolver(validationSchema);

	const { control, handleSubmit, reset, resetField, trigger } = useForm({
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

		const res = form_id ? await updateForm(form_id, body) : await createForm(body);

		if (isSuccess(res)) {
			alert.success({ text: 'Cập nhật thời gian phát hành thành công' });

			const { id } = res.data;

			dispatch(actions.setFormId(Number(id)));
		} else {
			alert.fail({ text: res?.message || ERRORS.FAIL });
		}
	};

	const handleChangeSelect = (CallbackUpdateForm) => (value) => {
		CallbackUpdateForm(value?.id);
	};
	//#endregion

	useEffect(() => {
		const getFormData = async () => {
			if (!form_id) return;

			const res = await getFormById(form_id);

			if (isSuccess(res)) {
				const resetData = {
					...res.data,
					academic_id: Number(res.data.academic.id),
					semester_id: Number(res.data.semester.id),
				};

				const { status } = res.data;

				dispatch(actions.setStatus(status));
				reset(resetData);
			}
		};

		getFormData();
	}, [form_id]);

	//#region Render
	return (
		<FormProvider reset={reset} resetField={resetField} trigger={trigger}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Container maxWidth='lg'>
					<Grid container mb={2} spacing={2}>
						<Grid item xs={12} md={8} lg={6} xl={5}>
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
												disableClearable
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
												disableClearable
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
						<Grid item xs={0} md={2} lg={3} xl={3.5} />
						<Grid item xs={0} md={2} lg={3} xl={3.5} />

						<RangeControl
							control={control}
							label='Thời gian sinh viên chấm'
							name='student'
						/>

						<RangeControl control={control} label='Thời gian lớp chấm' name='classes' />

						<RangeControl
							control={control}
							label='Thời gian khoa chấm'
							name='department'
						/>

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
										sx={{ maxWidth: 200 }}
										type='submit'
										variant='contained'
									>
										Cập nhật thời gian
									</Button>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Container>
			</form>
		</FormProvider>
	);
	//#endregion
});

export default SettingTime;
