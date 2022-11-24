import React, { forwardRef, useState, useImperativeHandle } from 'react';

import { shallowEqual, useSelector } from 'react-redux';

import { Controller, useForm } from 'react-hook-form';

import { Box, Button, Grow, Modal, Paper, Stack, Typography } from '@mui/material';

import { CAutocomplete, CRangePicker } from '_controls/';

import { useResolver } from '_hooks/';

import { initialValues, validationSchema } from '_modules/form/form';

const CreateModal = forwardRef(({ props }, ref) => {
	//#region Data
	const { semesters, academic_years } = useSelector((state) => state.options, shallowEqual);

	const resolver = useResolver(validationSchema);

	const [open, setOpen] = useState(false);

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: initialValues,
		mode: 'all',
		resolver,
	});
	//#endregion

	//#region Event
	const handleOpen = () => setOpen(true);

	const handleClose = () => {
		reset();
		setOpen(false);
	};

	const onSubmit = (values) => {
		console.log(values);
	};

	const handleChangeSelect = (CallbackUpdateForm) => (value) => {
		CallbackUpdateForm(value?.id);
	};
	//#endregion

	useImperativeHandle(
		ref,
		() => ({
			open: () => handleOpen(),
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	//#region Render
	return (
		<Modal open={open} onClose={handleClose}>
			<Grow in={open} timeout={400}>
				<Paper className='center' sx={{ borderRadius: 3 }}>
					<Box p={4} minWidth={330}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<Stack direction='column'>
								<Typography align='center' fontWeight={600} fontSize={18} mb={2.5}>
									Cài đặt thời gian cho phiếu
								</Typography>

								<Box mb={2}>
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
															<Box
																{...props}
																key={option.id}
																component='li'
															>
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
															<Box
																{...props}
																key={option.id}
																component='li'
															>
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
								</Box>

								<Box mb={2}>
									<Typography mb={0.8} fontWeight={500}>
										Thời hạn sinh viên chấm
									</Typography>
									<Controller
										control={control}
										name='student'
										render={({
											field: { onChange, value },
											fieldState: { error },
										}) => (
											<CRangePicker
												onChange={onChange}
												dateRange={value}
												error={!!errors['student.start']}
												helperText={errors['student.start']?.message}
											/>
										)}
									/>
								</Box>

								<Box mb={2}>
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
								</Box>

								<Box mb={2}>
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
								</Box>

								<Button
									sx={{ maxWidth: 100, margin: 'auto' }}
									type='submit'
									variant='contained'
								>
									Tạo phiếu
								</Button>
							</Stack>
						</form>
					</Box>
				</Paper>
			</Grow>
		</Modal>
	);
	//#endregion
});

export default CreateModal;
