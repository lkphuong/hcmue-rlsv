import React, { forwardRef, useState, useImperativeHandle } from 'react';

import { Controller, useForm } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';

import { Box, Button, Grow, Modal, Paper, Stack, Typography } from '@mui/material';

import { useResolver } from '_hooks/';

import { initialHeader, validationHeader } from '_modules/form/form';

import { CInput } from '_controls/';

import { createHeader, updateHeader } from '_api/form.api';

import { isSuccess } from '_func/';

import { alert } from '_func/alert';

import { ERRORS } from '_constants/messages';

const CreateModal = forwardRef(({ refetch }, ref) => {
	//#region Data
	const [open, setOpen] = useState(false);
	const [headerId, setHeaderId] = useState(null);

	const form_id = useSelector((state) => state.form.form_id, shallowEqual);

	const resolver = useResolver(validationHeader);

	const { control, handleSubmit, reset } = useForm({
		defaultValues: initialHeader,
		mode: 'all',
		resolver,
	});
	//#endregion

	//#region Event
	const handleOpen = () => setOpen(true);

	const handleClose = () => {
		reset(initialHeader);
		setHeaderId(null);
		setOpen(false);
	};

	const onSubmit = async (values) => {
		const res = headerId
			? await updateHeader(headerId, { form_id, ...values })
			: await createHeader({ form_id, ...values });

		if (isSuccess(res)) {
			refetch();

			alert.success({ text: 'Cập nhật danh mục thành công.' });

			handleClose();
		} else {
			alert.fail({ text: res?.message || ERRORS.FAIL });
		}
	};
	//#endregion

	useImperativeHandle(ref, () => ({
		open: (editData) => {
			if (editData) {
				const { id } = editData;

				setHeaderId(id);

				reset(editData);
			}

			handleOpen();
		},
	}));

	//#region Render
	return (
		<Modal open={open} onClose={handleClose}>
			<Grow in={open} timeout={400}>
				<Paper className='center' sx={{ borderRadius: 3 }}>
					<Box p={4} minWidth={330}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<Stack>
								<Stack
									direction='row'
									alignItems='center'
									justifyContent='space-between'
									mb={2}
								>
									<Typography mr={1.5}>Danh mục</Typography>
									<Controller
										control={control}
										name='name'
										render={({
											field: { name, onBlur, onChange, ref, value },
											fieldState: { error },
										}) => (
											<CInput
												name={name}
												inputRef={ref}
												onBlur={onBlur}
												onChange={onChange}
												value={value}
												error={!!error}
												helperText={error?.message}
											/>
										)}
									/>
								</Stack>
								<Stack
									direction='row'
									alignItems='center'
									justifyContent='space-between'
									mb={2}
								>
									<Typography mr={1.5}>Điểm tối đa</Typography>
									<Controller
										control={control}
										name='max_mark'
										render={({
											field: { name, onBlur, onChange, ref, value },
											fieldState: { error },
										}) => (
											<CInput
												type='number'
												name={name}
												inputRef={ref}
												onBlur={onBlur}
												onChange={onChange}
												value={value}
												error={!!error}
												helperText={error?.message}
											/>
										)}
									/>
								</Stack>

								<Button
									sx={{ maxWidth: 150, margin: 'auto' }}
									type='submit'
									variant='contained'
								>
									Lưu danh mục
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
