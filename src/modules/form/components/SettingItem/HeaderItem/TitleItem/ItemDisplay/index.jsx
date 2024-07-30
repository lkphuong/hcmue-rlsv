import { memo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { EditOutlined, RemoveCircleOutline } from '@mui/icons-material';
import { Box, Grid, IconButton, List, ListItem, Typography } from '@mui/material';

import { alert } from '_func/alert';

import { deleteItem } from '_api/form.api';

import { isSuccess } from '_func/';

import { ERRORS } from '_constants/messages';

const ItemDisplay = memo(({ data, refetch, handleEdit, disabled }) => {
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
				<IconButton onClick={handleDeleteItem} disabled={disabled}>
					<RemoveCircleOutline />
				</IconButton>
			</Grid>
			<Grid item xs={true}>
				<Box py={1.5} px={1} mb={1} border='1px solid #d2d2d2' borderRadius={1}>
					<Typography fontStyle='italic' fontWeight={500}>
						{data.content}
					</Typography>

					{data.control === 2 && (
						<List>
							{data?.options?.map((option) => (
								<ListItem key={option.id}>
									<Typography fontWeight={400}>
										&#10070;&nbsp;{option.content}&nbsp;
										<Typography component='span' fontWeight={600}>
											({option.mark} Điểm)
										</Typography>
									</Typography>
								</ListItem>
							))}
						</List>
					)}
				</Box>
			</Grid>

			{data.control !== 2 && (
				<Grid item xs={3} md={2} textAlign='center'>
					{data?.category === 1
						? `Từ ${data?.from_mark} đến ${data?.to_mark}`
						: `${data?.mark}`}
					&nbsp;
					{data?.unit}
				</Grid>
			)}

			<Grid item xs='auto'>
				<IconButton onClick={handleEdit} disabled={disabled}>
					<EditOutlined />
				</IconButton>
			</Grid>
		</Grid>
	);
	//#endregion
});

export default ItemDisplay;
