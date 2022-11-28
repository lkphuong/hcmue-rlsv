import React, { memo, useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { Box, Button, Container, Grid } from '@mui/material';

import { getHeadersByFormId } from '_api/form.api';

import { isSuccess } from '_func/';

import HeaderItem from './HeaderItem';

const SettingTitle = memo(({ updateStep }) => {
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

	const handleBack = () => updateStep((prev) => prev - 1);
	//#endregion

	useEffect(() => {
		getHeaders();
	}, [form_id]);

	//#region Render
	return (
		<Box>
			<Button>Lưu nháp</Button>
			<Button>Phát hành</Button>

			<Container maxWidth='lg'>
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
						// disabled={headers.length < 1}
						sx={{ maxWidth: 100 }}
						variant='contained'
						onClick={() => updateStep((prev) => prev + 1)}
					>
						Tiếp tục
					</Button>
				</Grid>
			</Grid>
		</Box>
	);
	//#endregion
});

export default SettingTitle;
