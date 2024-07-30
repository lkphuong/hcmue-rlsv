import { memo, useEffect, useState } from 'react';

import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Controller, useForm, FormProvider, useWatch } from 'react-hook-form';

import { Box, Button, Container, Grid, Typography } from '@mui/material';

import dayjs from 'dayjs';

import { CAutocomplete, CDatePicker } from '_controls/';

import { createForm, getFormById, updateForm } from '_api/form.api';
import { getSemestersByYear } from '_api/options.api';

import { useResolver } from '_hooks/';

import { initialValues, validationSchema } from '_modules/form/form';

import { alert } from '_func/alert';
import { isSuccess } from '_func/';

import { actions } from '_slices/form.slice';

import { ERRORS } from '_constants/messages';

const SettingTime = memo(() => {
	//#region Data
	const form_id = useSelector((state) => state.form.form_id, shallowEqual);
	const status = useSelector((state) => state.form.status, shallowEqual);
	const academic_years = useSelector((state) => state.options.academic_years, shallowEqual);

	const [semesters, setSemesters] = useState([]);

	const dispatch = useDispatch();

	const resolver = useResolver(validationSchema);

	const { control, handleSubmit, reset, resetField, trigger } = useForm({
		defaultValues: initialValues,
		mode: 'all',
		resolver,
	});

	const academicValue = useWatch({ control, name: 'academic_id' });
	const startValue = useWatch({ control, name: 'start' });
	//#endregion

	//#region Event
	const onSubmit = async (values) => {
		const body = {
			...values,
			start: dayjs(values.start).format('YYYY-MM-DD'),
			end: dayjs(values.end).format('YYYY-MM-DD'),
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

	const handleDateChange = (CallbackFunc, keyName) => (event) => {
		if (keyName === 'start') resetField('end', { defaultValue: null });

		CallbackFunc(event);

		trigger('start');
		trigger('end');
	};

	const getSemesters = async () => {
		const res = await getSemestersByYear(academicValue);

		if (isSuccess(res)) setSemesters(res.data);
		else setSemesters([]);
	};

	const shouldDisableDateStart = (date) => {
		return dayjs(date).isSame(dayjs(), 'date');
	};

	const shouldDisableDate = (date) => {
		return (
			dayjs(date).isSame(dayjs(), 'date') ||
			dayjs(date).isBefore(dayjs(startValue)) ||
			dayjs(date).isSame(dayjs(startValue), 'date')
		);
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

	useEffect(() => {
		if (academicValue) getSemesters();
	}, [academicValue]);

	//#region Render
	return (
		<FormProvider reset={reset} resetField={resetField} trigger={trigger}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Container maxWidth='lg'>
					<Grid container mb={2} spacing={2}>
						<Grid item xs={12} md={6} lg={3}>
							<Typography mb={0.8} fontWeight={500}>
								Năm học
							</Typography>
							<Controller
								control={control}
								name='academic_id'
								render={({
									field: { onChange, onBlur, value, name, ref },
									fieldState: { error },
								}) => (
									<CAutocomplete
										disabled={status === 2 || status === 3}
										disableClearable
										onChange={handleChangeSelect(onChange)}
										onBlur={onBlur}
										value={value}
										name={name}
										ref={ref}
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
						</Grid>
						<Grid item xs={12} md={6} lg={3}>
							<Typography mb={0.8} fontWeight={500}>
								Học kỳ
							</Typography>
							<Controller
								control={control}
								name='semester_id'
								render={({
									field: { onChange, onBlur, value, name, ref },
									fieldState: { error },
								}) => (
									<CAutocomplete
										disabled={status === 2 || status === 3}
										disableClearable
										onChange={handleChangeSelect(onChange)}
										onBlur={onBlur}
										value={value}
										name={name}
										ref={ref}
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
						</Grid>
						<Grid item xs={12} md={6} lg={3}>
							<Typography mb={0.8} fontWeight={500}>
								Thời gian bắt đầu chấm điểm
							</Typography>
							<Controller
								control={control}
								name='start'
								render={({
									field: { onChange, onBlur, name, ref, value },
									fieldState: { error },
								}) => (
									<CDatePicker
										disabled={status === 2 || status === 3}
										disablePast
										fullWidth
										minDate={dayjs()}
										name={name}
										ref={ref}
										value={value}
										onChange={handleDateChange(onChange, 'start')}
										onBlur={onBlur}
										error={!!error}
										helperText={error?.message}
										shouldDisableDate={shouldDisableDateStart}
									/>
								)}
							/>
						</Grid>

						<Grid item xs={12} md={6} lg={3}>
							<Typography mb={0.8} fontWeight={500}>
								Thời gian kết thúc chấm điểm
							</Typography>
							<Controller
								control={control}
								name='end'
								render={({
									field: { onChange, onBlur, name, ref, value },
									fieldState: { error },
								}) => (
									<CDatePicker
										disabled={status === 2 || status === 3}
										disablePast
										fullWidth
										minDate={dayjs()}
										name={name}
										ref={ref}
										value={value}
										onChange={handleDateChange(onChange, 'end')}
										onBlur={onBlur}
										error={!!error}
										helperText={error?.message}
										shouldDisableDate={shouldDisableDate}
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
										disabled={status === 2 || status === 3}
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
