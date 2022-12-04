import React, { memo, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Box, Button, Container, Grid } from '@mui/material';

import { getFormById, getHeadersByFormId, publishForm, unpublishForm } from '_api/form.api';

import { isSuccess } from '_func/';

import { ERRORS } from '_constants/messages';

import { actions } from '_slices/form.slice';

import HeaderItem from './HeaderItem';

const SettingItem = memo(({ updateStep }) => {
	//#region Data
	const form_id = useSelector((state) => state.form.form_id, shallowEqual);
	const status = useSelector((state) => state.form.status, shallowEqual);

	const [headers, setHeaders] = useState([]);

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	const getHeaders = async () => {
		if (!form_id) return;

		try {
			const res = await getHeadersByFormId(form_id);

			if (isSuccess(res)) {
				setHeaders(res.data);
			}
		} catch (error) {
			throw error;
		}
	};

	const handleBack = () => updateStep((prev) => prev - 1);

	const handlePublish = () => {
		alert.warning({
			onConfirm: async () => {
				if (status === 0) {
					const res = await publishForm(form_id);

					if (isSuccess(res)) {
						alert.success({ text: 'Phát hành biểu mẫu thành công.' });
					} else {
						alert.fail({ text: res?.message || ERRORS.FAIL });
					}
				} else {
					const res = await unpublishForm(form_id);

					if (isSuccess(res)) {
						alert.success({ text: 'Hủy phát hành biểu mẫu thành công.' });
					} else {
						alert.fail({ text: res?.message || ERRORS.FAIL });
					}
				}
				const _res = await getFormById(form_id);

				if (isSuccess(_res)) {
					const { status } = _res.data;

					dispatch(actions.setStatus(status));
				}
			},
			title: status === 0 ? 'Phát hành' : 'Hủy phát hành',
		});
	};
	//#endregion

	useEffect(() => {
		getHeaders();
	}, [form_id]);

	//#region Render
	return (
		<Box>
			<Container maxWidth='lg'>
				{status === 0 && (
					<Box textAlign='right' py={1.5}>
						<Button variant='contained' className='publish' onClick={handlePublish}>
							Phát hành
						</Button>
					</Box>
				)}
				{status === 1 && (
					<Box textAlign='right' py={1.5}>
						<Button variant='contained' className='publish' onClick={handlePublish}>
							Hủy phát hành
						</Button>
					</Box>
				)}

				{headers.length > 0 && headers.map((e) => <HeaderItem key={e.id} data={e} />)}
			</Container>

			<Grid container mt={4} spacing={2} alignItems='center' justifyContent='center'>
				<Grid item>
					<Button sx={{ maxWidth: 100 }} variant='contained' onClick={handleBack}>
						Trở lại
					</Button>
				</Grid>
				<Grid item>
					<Button
						sx={{ maxWidth: 140 }}
						variant='contained'
						onClick={() => updateStep((prev) => prev + 1)}
					>
						Lưu biểu mẫu
					</Button>
				</Grid>
			</Grid>
		</Box>
	);
	//#endregion
});

export default SettingItem;
