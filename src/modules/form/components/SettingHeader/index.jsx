import { memo, useEffect, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { Box, Container, Grid, IconButton, Typography } from '@mui/material';
import { AddCircleOutline, EditOutlined, RemoveCircleOutline } from '@mui/icons-material';

import { deleteHeader, getHeadersByFormId } from '_api/form.api';

import { isSuccess, isEmpty } from '_func/';
import { alert } from '_func/alert';

import { ERRORS } from '_constants/messages';

import CreateModal from './CreateModal';

const SettingHeader = memo(() => {
	//#region Data
	const createRef = useRef();

	const form_id = useSelector((state) => state.form.form_id, shallowEqual);
	const status = useSelector((state) => state.form.status, shallowEqual);

	const [headers, setHeaders] = useState([]);
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

	const handleEdit = (data) => () => {
		createRef.current.open(data);
	};
	//#endregion

	useEffect(() => {
		getHeaders();
	}, [form_id]);

	//#region Render
	return (
		<Box>
			<Container maxWidth='lg'>
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
										<IconButton
											onClick={onDelete(header.id)}
											disabled={status === 3 || status === 2}
										>
											<RemoveCircleOutline />
										</IconButton>
									</Grid>
									<Grid item xs textTransform='uppercase'>
										<Box
											py={1.5}
											px={1}
											border='1px solid #d2d2d2'
											fontWeight={600}
											borderRadius={1}
										>
											{`${header.name} `}
											<Typography component='span'>
												(Tối đa {header.max_mark} điểm)
											</Typography>
										</Box>
									</Grid>
									<Grid item xs='auto'>
										<IconButton
											onClick={handleEdit(header)}
											disabled={status === 3 || status === 2}
										>
											<EditOutlined />
										</IconButton>
									</Grid>
								</Grid>
							</Grid>
						))}

					<Grid item xs={12} mb={1}>
						<Grid container alignItems='center' justifyContent='center' spacing={1}>
							<Grid item xs='auto'>
								<IconButton
									onClick={openCreate}
									disabled={status === 3 || status === 2}
								>
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
