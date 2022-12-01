import React, { forwardRef, memo, useImperativeHandle, useState } from 'react';
import { Controller, useController, useForm } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';

import { Box, Button, Checkbox, Grid, Grow, Modal, Paper, Stack, Typography } from '@mui/material';

import { useResolver } from '_hooks/';

import { initialItem, validationItem } from '_modules/form/form';

import { CInput, CSelect } from '_controls/';

import { CONTROL } from '_constants/variables';

import { createItem } from '_api/form.api';

import { isSuccess } from '_func/';

import { alert } from '_func/alert';

import { ERRORS } from '_constants/messages';

import Optional from './Optional';

const ItemModal = memo(
	forwardRef(({ refetch, title_id }, ref) => {
		//#region Data
		const form_id = useSelector((state) => state.form.form_id, shallowEqual);

		const [open, setOpen] = useState(false);

		const resolver = useResolver(validationItem);

		const {
			control,
			handleSubmit,
			reset,
			formState: { errors },
		} = useForm({
			defaultValues: initialItem,
			mode: 'all',
			resolver,
		});

		console.log(errors);

		const {
			field: { onChange: onChangeOption },
		} = useController({ control, name: 'options', rules: { required: true } });

		const {
			field: { onChange: onChangeFromMark },
		} = useController({ control, name: 'from_mark', rules: { required: true } });

		const {
			field: { onChange: onChangeToMark },
		} = useController({ control, name: 'to_mark', rules: { required: true } });

		const {
			field: { onChange: onChangeCategory },
		} = useController({ control, name: 'category', rules: { required: true } });
		//#endregion

		//#region Event
		const toggleModal = () => setOpen(true);

		const toggleClose = () => {
			reset();
			setOpen(false);
		};

		const onSubmit = async (values) => {
			const body = {
				form_id,
				title_id,
				...values,
			};

			const res = await createItem(body);

			if (isSuccess(res)) {
				alert.success({ text: 'Cập nhật chi tiết tiêu chí đánh giá thành công.' });

				refetch();

				toggleClose();
			} else {
				alert.fail({ text: res?.message || ERRORS.FAIL });
			}
		};

		const changeControl = (CallbackFunc) => (event) => {
			CallbackFunc(Number(event.target.value));
			if (!event.target.value !== 0) {
				onChangeCategory(0);
			}
			if (event.target.value !== 2) {
				onChangeOption([]);
				if (event.target.value === 1) {
					onChangeFromMark(0);
					onChangeToMark(0);
				}
			}
		};
		//#endregion

		useImperativeHandle(
			ref,
			() => ({
				open: () => toggleModal(),
			}),
			[]
		);

		//#region Render
		return (
			<Modal open={open} onClose={toggleClose}>
				<Grow in={open} timeout={400}>
					<Paper className='center' sx={{ borderRadius: 3 }}>
						<Box px={3} py={2} width={375}>
							<form onSubmit={handleSubmit(onSubmit)}>
								<Stack spacing={2}>
									<Grid container spacing={1} alignItems='center'>
										<Grid item xs={12} md={4}>
											<Typography>Control</Typography>
										</Grid>
										<Grid item xs={12} md={8}>
											<Controller
												control={control}
												name='control'
												render={({ field: { name, onChange, value } }) => (
													<CSelect
														value={value}
														options={CONTROL}
														onChange={changeControl(onChange)}
														name={name}
														fullWidth
													/>
												)}
											/>
										</Grid>

										<Grid item xs={12} md={4}>
											<Typography>Tiêu chí</Typography>
										</Grid>
										<Grid item xs={12} md={8}>
											<Controller
												control={control}
												name='content'
												render={({
													field: { name, onBlur, onChange, ref, value },
													fieldState: { error },
												}) => (
													<CInput
														value={value}
														inputRef={ref}
														onChange={onChange}
														onBlur={onBlur}
														name={name}
														fullWidth
														error={!!error}
														helperText={error?.message}
													/>
												)}
											/>
										</Grid>

										<Grid item xs={12} md={4}>
											<Typography>Bắt buộc</Typography>
										</Grid>
										<Grid item xs={12} md={8}>
											<Controller
												control={control}
												name='required'
												render={({ field: { name, onChange, value } }) => (
													<Checkbox
														name={name}
														checked={value}
														onChange={onChange}
													/>
												)}
											/>
										</Grid>

										<Optional control={control} name='control' />
									</Grid>
								</Stack>

								<Box textAlign='center' mt={4}>
									<Button variant='contained' type='submit'>
										Hoàn thành
									</Button>
								</Box>
							</form>
						</Box>
					</Paper>
				</Grow>
			</Modal>
		);
		//#endregion
	})
);

export default ItemModal;
