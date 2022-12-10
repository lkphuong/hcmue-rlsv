import React, { memo, useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { Box, Container } from '@mui/material';

import { getHeadersByFormId } from '_api/form.api';

import { isSuccess } from '_func/';

import HeaderItem from './HeaderItem';

const SettingTitle = memo(() => {
	//#region Data
	const form_id = useSelector((state) => state.form.form_id, shallowEqual);

	const [headers, setHeaders] = useState([]);
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
	//#endregion

	useEffect(() => {
		getHeaders();
	}, [form_id]);

	//#region Render
	return (
		<Box>
			<Container maxWidth='lg'>
				{headers.length > 0 && headers.map((e) => <HeaderItem key={e.id} data={e} />)}
			</Container>
		</Box>
	);
	//#endregion
});

export default SettingTitle;
