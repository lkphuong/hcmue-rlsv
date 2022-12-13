import React from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { Box, Button, IconButton, Stack } from '@mui/material';
import { Block } from '@mui/icons-material';

import { CInput } from '_controls/';

import { useResolver } from '_hooks/';

import { createSemester } from '_api/options.api';

import { isSuccess } from '_func/';

import { alert } from '_func/alert';

import { ERRORS } from '_constants/messages';

import { initialValues, validationSchema } from './form';

export const AddSection = ({ refetch }) => {
	//#region Data
	const resolver = useResolver(validationSchema);

	const { control, handleSubmit, reset } = useForm({
		defaultValues: initialValues,
		mode: 'all',
		shouldFocusError: true,
		resolver,
	});

	const inputValue = useWatch({ control, name: 'name' });
	//#endregion

	//#region Event
	const onSubmit = async (values) => {
		alert.loading();

		const res = await createSemester(values);

		if (isSuccess(res)) {
			refetch();

			alert.success({ text: 'Thêm học kỳ thành công.' });

			reset();
		} else {
			alert.fail({ text: res?.message || ERRORS.FAIL });
		}
	};
	//#endregion

	//#region Render
	return (
		<Box my={2}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Stack alignItems='center' direction='row' spacing={1.5}>
					<Controller
						control={control}
						name='name'
						render={({
							field: { onChange, ref, name, value },
							fieldState: { error },
						}) => (
							<CInput
								name={name}
								inputRef={ref}
								value={value}
								onChange={onChange}
								placeholder='Nhập tên học kỳ'
								error={!!error}
								helperText={error?.message}
							/>
						)}
					/>

					<Button type='submit' variant='contained'>
						Thêm
					</Button>

					{inputValue && (
						<IconButton
							color='error'
							type='button'
							onClick={() => reset(initialValues)}
						>
							<Block />
						</IconButton>
					)}
				</Stack>
			</form>
		</Box>
	);
	//#endregion
};
