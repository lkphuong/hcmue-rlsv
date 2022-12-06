import React, { useRef } from 'react';

import { Box, Typography } from '@mui/material';
import { CloudUploadOutlined } from '@mui/icons-material';

export const CUpload = () => {
	//#region Data
	const wrapperRef = useRef();
	//#endregion

	//#region Event
	const onChange = (e) => {
		console.log(e);
	};
	//#endregion

	//#region Render

	return (
		<Box
			margin='auto'
			ref={wrapperRef}
			position='relative'
			width={250}
			height={150}
			border='2px dashed #a1a0a0'
			borderRadius={3}
			display='flex'
			alignItems='center'
			justifyContent='center'
			sx={{ backgroundColor: '#eeeeee', cursor: 'pointer' }}
			component='label'
		>
			<Box textAlign='center' fontWeight={600} p={1.1}>
				<CloudUploadOutlined sx={{ fontSize: '3rem' }} color='primary' />
				<Typography>Kéo & thả file để upload</Typography>
			</Box>
			<input type='file' onChange={onChange} hidden />
		</Box>
		//#endregion
	);
};
