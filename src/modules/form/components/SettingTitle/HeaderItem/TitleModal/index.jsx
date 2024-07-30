import { forwardRef, useState, useImperativeHandle } from 'react';

import { Controller, useForm } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';

import { Box, Button, Grow, Modal, Paper, Stack, Typography } from '@mui/material';

import { useResolver } from '_hooks/';

import { initialTitle, validationTitle } from '_modules/form/form';

import { CInput } from '_controls/';

import { createTitle, updateTitle } from '_api/form.api';

import { isSuccess } from '_func/';

import { alert } from '_func/alert';

import { ERRORS } from '_constants/messages';

export const TitleModal = forwardRef(({ refetch, header_id }, ref) => {
	//#region Data
	const [open, setOpen] = useState(false);
	const [titleId, setTitleId] = useState(null);

	const form_id = useSelector((state) => state.form.form_id, shallowEqual);

	const resolver = useResolver(validationTitle);

	const { control, handleSubmit, reset } = useForm({
		defaultValues: initialTitle,
		mode: 'all',
		resolver,
	});
	//#endregion

	//#region Event
	const handleOpen = () => setOpen(true);

	const handleClose = () => {
		reset(initialTitle);
		setTitleId(null);
		setOpen(false);
	};

	const onSubmit = async (values) => {
		const body = {
			form_id,
			header_id: Number(header_id),
			...values,
		};

		const res = titleId ? await updateTitle(titleId, body) : await createTitle(body);

		if (isSuccess(res)) {
			refetch();

			alert.success({ text: 'Cập nhật tiêu chí đánh giá thành công.' });

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

				setTitleId(id);

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
									<Typography mr={1.5}>Tiêu chí</Typography>
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

								<Button
									sx={{ maxWidth: 150, margin: 'auto' }}
									type='submit'
									variant='contained'
								>
									Lưu tiêu chí
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

export default TitleModal;
