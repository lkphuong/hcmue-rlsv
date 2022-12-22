import React, { memo, useState, useEffect, useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import {
	AddCircleOutline,
	EditOutlined,
	ExpandMore,
	RemoveCircleOutline,
} from '@mui/icons-material';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Grid,
	IconButton,
	Typography,
} from '@mui/material';

import { deleteTitle, getTitlesByHeaderId } from '_api/form.api';

import { isSuccess, isEmpty } from '_func/';

import { alert } from '_func/alert';

import { ERRORS } from '_constants/messages';

import TitleModal from './TitleModal';

const HeaderItem = memo(({ data }) => {
	//#region Data
	const form_id = useSelector((state) => state.form.form_id, shallowEqual);
	const status = useSelector((state) => state.form.status, shallowEqual);

	const [titles, setTitles] = useState([]);

	const { id: header_id } = data;

	const createRef = useRef();
	//#endregion

	//#region Event
	const openCreate = () => createRef.current.open();

	const getTitles = async () => {
		if (!header_id) return;

		const res = await getTitlesByHeaderId(header_id);

		if (isSuccess(res)) setTitles(res.data);
		else if (isEmpty(res)) {
			setTitles([]);
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

	const handleEdit = (data) => () => {
		createRef.current.open(data);
	};
	//#endregion

	useEffect(() => {
		getTitles();
	}, [data?.id]);

	//#region Render
	return (
		<Accordion sx={{ mb: 1 }}>
			<AccordionSummary expandIcon={<ExpandMore />}>
				<Typography fontWeight={600} textTransform='uppercase'>
					{data.name}
					<Typography component='span'>&nbsp;(Tối đa {data.max_mark} điểm)</Typography>
				</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<Grid container alignItems='center'>
					{titles.length > 0 &&
						titles.map((title) => (
							<Grid key={title.id} item xs={12} mb={1}>
								<Grid
									container
									alignItems='center'
									justifyContent='center'
									spacing={1}
								>
									<Grid item xs='auto'>
										<IconButton onClick={onDelete(title.id)}>
											<RemoveCircleOutline />
										</IconButton>
									</Grid>
									<Grid item xs>
										<Box
											py={1.5}
											px={1}
											border='1px solid #d2d2d2'
											borderRadius={1}
											fontWeight={600}
										>
											{`${title.name} `}
										</Box>
									</Grid>
									<Grid item xs='auto'>
										<IconButton
											onClick={handleEdit(title)}
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
								<Typography>NHẬP TIÊU CHÍ</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Grid>

				<TitleModal ref={createRef} refetch={getTitles} header_id={header_id} />
			</AccordionDetails>
		</Accordion>
	);

	//#endregion
});

export default HeaderItem;
