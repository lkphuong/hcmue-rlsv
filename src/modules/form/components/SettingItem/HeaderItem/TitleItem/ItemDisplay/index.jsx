import React, { memo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { EditOutlined, RemoveCircleOutline } from '@mui/icons-material';
import { Box, Grid, IconButton, Stack, Typography } from '@mui/material';

import { alert } from '_func/alert';

import { deleteItem } from '_api/form.api';

import { isSuccess } from '_func/';

import { ERRORS } from '_constants/messages';

const ItemDisplay = memo(({ data, refetch, handleEdit }) => {
	//#region Data
	const form_id = useSelector((state) => state.form.form_id, shallowEqual);
	//#endregion

	//#region Event
	const handleDeleteItem = () => {
		alert.warningDelete({
			onConfirm: async () => {
				const res = await deleteItem(form_id, Number(data.id));

				if (isSuccess(res)) {
					refetch();

					alert.success({ text: 'Xóa chi tiết tiêu chí đánh giá thành công.' });
				} else {
					alert.fail({ text: res?.message || ERRORS.FAIL });
				}
			},
		});
	};
	//#endregion

	//#region Render
	return (
		<Grid container alignItems='center' spacing={1}>
			<Grid item xs='auto'>
				<Stack direction='row' spacing={1}>
					<IconButton onClick={handleDeleteItem}>
						<RemoveCircleOutline />
					</IconButton>
					<IconButton onClick={handleEdit}>
						<EditOutlined />
					</IconButton>
				</Stack>
			</Grid>
			<Grid item xs={true}>
				<Typography>{data.content}</Typography>
			</Grid>
			{data.control !== 2 ? (
				<Grid item xs={3} md={2} textAlign='center'>
					{data?.category === 1
						? `Từ ${data?.from_mark} đến ${data?.to_mark}`
						: `${data?.mark}`}
					&nbsp;
					{data?.unit}
				</Grid>
			) : (
				data?.options?.map((option) => (
					<Grid key={option.id} item xs={12}>
						<Box ml={8}>
							&#187;&nbsp;{option.content} {option.mark} Điểm
						</Box>
					</Grid>
				))
			)}
		</Grid>
	);
	//#endregion
});

export default ItemDisplay;
