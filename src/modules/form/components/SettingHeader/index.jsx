import React, { memo, useEffect, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Box, Button, Container, Grid, IconButton, Typography } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

import {
	deleteHeader,
	getFormById,
	getHeadersByFormId,
	publishForm,
	unpublishForm,
} from '_api/form.api';

import { isSuccess, isEmpty } from '_func/';
import { alert } from '_func/alert';

import { ERRORS } from '_constants/messages';

import { actions } from '_slices/form.slice';

import { CreateModal } from '..';

const SettingHeader = memo(() => {
	//#region Data
	const createRef = useRef();

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
			} else if (isEmpty(res)) {
				setHeaders([]);
			}
		} catch (error) {
			throw error;
		}
	};

	const openCreate = () => createRef.current.open();

	const onDelete = (header_id) => () => {
		alert.warningDelete({
			onConfirm: async () => {
				const res = await deleteHeader(form_id, Number(header_id));

				if (isSuccess(res)) {
					getHeaders();

					alert.success({ text: 'Xóa danh mục thành công.' });
				} else {
					alert.fail({ text: res?.message || ERRORS.FAIL });
				}
			},
		});
	};

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

				<Grid container alignItems='center'>
					{headers.length > 0 &&
						headers.map((header) => (
							<Grid key={header.id} item xs={12} mb={1}>
								<Grid
									container
									alignItems='center'
									justifyContent='center'
									spacing={1}
								>
									<Grid item xs='auto'>
										<IconButton onClick={onDelete(header.id)}>
											<RemoveCircleOutline />
										</IconButton>
									</Grid>
									<Grid item xs textTransform='uppercase'>
										<Box
											py={1.5}
											px={1}
											border='1px solid black'
											fontWeight={600}
										>
											{`${header.name} `}
											<Typography component='span'>
												(Tối đa {header.max_mark} điểm)
											</Typography>
										</Box>
									</Grid>
								</Grid>
							</Grid>
						))}

					<Grid item xs={12} mb={1}>
						<Grid container alignItems='center' justifyContent='center' spacing={1}>
							<Grid item xs='auto'>
								<IconButton onClick={openCreate}>
									<AddCircleOutline />
								</IconButton>
							</Grid>
							<Grid item xs>
								<Typography>NHẬP ĐỀ MỤC</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Container>

			<CreateModal ref={createRef} refetch={getHeaders} />
		</Box>
	);
	//#endregion
});

export default SettingHeader;
