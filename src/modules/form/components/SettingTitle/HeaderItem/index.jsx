import React, { memo, useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';

import { ExpandMore, RemoveCircleOutline } from '@mui/icons-material';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Grid,
	IconButton,
	Typography,
} from '@mui/material';

import { createTitle, deleteTitle, getTitlesByHeaderId } from '_api/form.api';

import { CInput } from '_controls/';

import { isSuccess, isEmpty } from '_func/';

import { useResolver } from '_hooks/';

import { initialTitle, validationTitle } from '_modules/form/form';

import { alert } from '_func/alert';

import { ERRORS } from '_constants/messages';

import CheckButton from './CheckButton';

const HeaderItem = memo(({ data }) => {
	//#region Data
	const form_id = useSelector((state) => state.form.form_id, shallowEqual);

	const [titles, setTitles] = useState([]);

	const { id: header_id } = data;

	const resolver = useResolver(validationTitle);

	const { control, handleSubmit, reset } = useForm({
		mode: 'all',
		defaultValues: initialTitle,
		resolver,
	});
	//#endregion

	//#region Event
	const getTitles = async () => {
		if (!header_id) return;

		const res = await getTitlesByHeaderId(header_id);

		if (isSuccess(res)) setTitles(res.data);
		else if (isEmpty(res)) {
			setTitles([]);
		}
	};

	const onSubmit = async (values) => {
		const body = {
			form_id,
			header_id: Number(header_id),
			...values,
		};

		const res = await createTitle(body);

		if (isSuccess(res)) {
			alert.success({ text: 'Cập nhật tiêu chí đánh giá thành công.' });

			getTitles();

			reset();
		} else {
			alert.fail({ text: res?.message || ERRORS.FAIL });
		}
	};

	const onDelete = (title_id) => () => {
		alert.warningDelete({
			onConfirm: async () => {
				const res = await deleteTitle(form_id, Number(title_id));

				if (isSuccess(res)) {
					getTitles();

					alert.success({ text: 'Xóa tiêu chí thành công.' });
				} else {
					alert.fail({ text: res?.message || ERRORS.FAIL });
				}
			},
		});
	};
	//#endregion

	useEffect(() => {
		getTitles();
	}, [data?.id]);

	//#region Render
	return (
		<Accordion>
			<AccordionSummary expandIcon={<ExpandMore />}>
				<Typography fontWeight={600}>
					{data.name}
					<Typography component='span'>&nbsp;(Tối đa {data.max_mark} điểm)</Typography>
				</Typography>
			</AccordionSummary>
			<AccordionDetails>
				{titles.length > 0 &&
					titles.map((title) => (
						<Grid key={title.id} container alignItems='center' spacing={1}>
							<Grid item xs='auto'>
								<IconButton onClick={onDelete(title.id)}>
									<RemoveCircleOutline />
								</IconButton>
							</Grid>
							<Grid item>
								<Typography>{title.name}</Typography>
							</Grid>
						</Grid>
					))}

				<Grid item xs={12} mb={1}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<Grid container alignItems='center' justifyContent='center' spacing={1}>
							<CheckButton
								control={control}
								name='name'
								onSubmit={handleSubmit(onSubmit)}
							/>

							<Grid item xs>
								<Controller
									control={control}
									name='name'
									render={({
										field: { name, onBlur, onChange, ref, value },
										fieldState: { error },
									}) => (
										<CInput
											fullWidth
											name={name}
											onBlur={onBlur}
											onChange={onChange}
											inputRef={ref}
											value={value}
											placeholder='Nhập tiêu chí đánh giá'
											error={!!error}
											helperText={error?.message}
										/>
									)}
								/>
							</Grid>
						</Grid>
					</form>
				</Grid>
			</AccordionDetails>
		</Accordion>
	);

	//#endregion
});

export default HeaderItem;
