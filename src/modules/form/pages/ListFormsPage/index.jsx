import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ROUTES } from '_constants/routes';

import { Box, Button, Typography } from '@mui/material';

import { CreateModal, Filter, ListForms } from '_modules/form/components';

import { getForms } from '_api/form.api';
import { isSuccess } from '_func/';
import { Link } from 'react-router-dom';

const ListFormsPage = () => {
	//#region Data
	// eslint-disable-next-line no-unused-vars
	const [data, setData] = useState([]);

	const modalRef = useRef();
	//#endregion

	//#region Event
	const getData = useCallback(async () => {
		try {
			const res = await getForms();

			if (isSuccess(res)) setData(res.data);
		} catch (error) {
			throw error;
		}
	}, []);

	const toggleCreateModal = () => {
		modalRef.current.open();
	};
	//#endregion

	useEffect(() => {
		getData();
	}, [getData]);

	//#region Render
	return (
		<Box>
			<Typography
				borderRadius={2}
				p={2}
				fontWeight={500}
				fontSize={18}
				sx={{ backgroundColor: 'rgba(0 0 0 / 5%)' }}
			>
				Lịch sử Phiếu đánh giá kết quả rèn luyện
			</Typography>

			<Box mt={1}>
				<Filter />

				<Box textAlign='right' my={2}>
					<Link to={ROUTES.FORM_CREATE}>
						<Button variant='contained' onClick={toggleCreateModal}>
							Thêm mới
						</Button>
					</Link>
				</Box>

				<ListForms data={[]} />
			</Box>

			<CreateModal ref={modalRef} />
		</Box>
	);
	//#endregion
};

export default ListFormsPage;
