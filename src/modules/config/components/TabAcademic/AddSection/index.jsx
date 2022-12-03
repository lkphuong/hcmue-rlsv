import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Box, Button, IconButton, Stack } from '@mui/material';
import { Block } from '@mui/icons-material';

import dayjs from 'dayjs';

import { CDatePicker } from '_controls/';

import { useResolver } from '_hooks/';

import { createAcademicYear } from '_api/options.api';

import { isSuccess } from '_func/';

import { alert } from '_func/alert';

import { ERRORS } from '_constants/messages';

import { initialValues, validationSchema } from './form';

export const AddSection = ({ refetch }) => {
	//#region Data
	const resolver = useResolver(validationSchema);

	const {
		control,
		handleSubmit,
		reset,
		formState: { submitCount },
	} = useForm({
		defaultValues: initialValues,
		mode: 'all',
		shouldFocusError: true,
		resolver,
	});

	//#endregion

	//#region Event
	const onSubmit = async (values) => {
		alert.loading();

		const from = dayjs(values.from).get('year');
		const to = dayjs(values.to).get('year');

		const res = await createAcademicYear({ from, to });
		if (isSuccess(res)) {
			refetch();
			alert.success({ text: 'Thêm niên khóa thành công.' });
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
					<Stack direction='row' maxWidth={250}>
						<Box mr={0.5}>
							<Controller
								control={control}
								name='from'
								render={({
									field: { onChange, ref, name, value },
									fieldState: { error },
								}) => (
									<CDatePicker
										views={['year']}
										inputFormat={'YYYY'}
										openTo='year'
										name={name}
										inputRef={ref}
										value={value}
										onChange={onChange}
										error={!!error}
										helperText={error?.message}
									/>
								)}
							/>
						</Box>

						<Box>
							<Controller
								control={control}
								name='to'
								render={({
									field: { onChange, ref, name, value },
									fieldState: { error },
								}) => (
									<CDatePicker
										views={['year']}
										inputFormat={'YYYY'}
										openTo='year'
										name={name}
										inputRef={ref}
										value={value}
										onChange={onChange}
										error={!!error}
										helperText={error?.message}
									/>
								)}
							/>
						</Box>
					</Stack>

					<Button type='submit' variant='contained'>
						Thêm
					</Button>

					{submitCount !== 0 && (
						<IconButton color='error' type='button' onClick={reset}>
							<Block />
						</IconButton>
					)}
				</Stack>
			</form>
		</Box>
	);
	//#endregion
};
