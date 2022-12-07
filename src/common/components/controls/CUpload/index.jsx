import React, { useRef, useState } from 'react';

import { Box, CardMedia, IconButton, List, ListItem, Stack, Typography } from '@mui/material';
import { CloudUploadOutlined, DeleteForever } from '@mui/icons-material';

import pdf from '_assets/images/file-pdf.png';
import blank from '_assets/images/file.png';
import image from '_assets/images/file-image.png';

import './index.scss';

const FILE_IMAGE = {
	image: image,
	application: pdf,
	other: blank,
};

export const CUpload = () => {
	//#region Data
	const wrapperRef = useRef();

	const [fileList, setFileList] = useState([]);
	//#endregion

	//#region Event
	const onChange = (e) => {
		const newFile = e.target.files[0];

		if (newFile) {
			setFileList((prev) => [...prev, newFile]);
		}
	};

	const onDragEnter = () => {
		wrapperRef.current.classList.add('dragover');
	};

	const onDragLeave = () => {
		wrapperRef.current.classList.remove('dragover');
	};

	const onDragOver = (e) => {
		e.stopPropagation();
		e.preventDefault();
	};

	const onDrop = (e) => {
		e.stopPropagation();
		e.preventDefault();

		wrapperRef.current.classList.remove('dragover');

		const newFile = e?.dataTransfer?.files[0];

		if (newFile) {
			setFileList((prev) => [...prev, newFile]);
		}
	};

	const onDelete = (index) => () => {
		const newList = fileList.filter((e, i) => i !== index);

		setFileList(newList);
	};
	//#endregion

	//#region Render
	return (
		<>
			<Box
				className='c-upload'
				margin='auto'
				position='relative'
				width='100%'
				minWidth={250}
				height={150}
				borderRadius={3}
				display='flex'
				alignItems='center'
				justifyContent='center'
				component='label'
				sx={{ backgroundColor: '#eeeeee' }}
			>
				<Box
					component='label'
					ref={wrapperRef}
					onDragEnter={onDragEnter}
					onDragLeave={onDragLeave}
					onDragOver={onDragOver}
					onDrop={onDrop}
					className='overlay'
					position='absolute'
					height='100%'
					width='100%'
					borderRadius='inherit'
					border='3px dashed #a1a0a0'
					sx={{ inset: 0, backgroundColor: 'transparent', cursor: 'pointer' }}
				>
					<input type='file' onChange={onChange} hidden />
				</Box>
				<Box textAlign='center' fontWeight={600} p={1.1}>
					<CloudUploadOutlined sx={{ fontSize: '3rem' }} color='primary' />
					<Typography>Kéo & thả file để upload</Typography>
				</Box>
			</Box>

			{fileList.length > 0 && (
				<List>
					{fileList.map((file, index) => (
						<ListItem
							key={index}
							sx={{
								p: 1,
								display: 'flex',
								justifyContent: 'space-between',
								backgroundColor: 'rgb(175 205 255 / 20%)',
								borderRadius: '10px',
								marginBottom: '8px',
							}}
						>
							<Stack sx={{ height: '40px' }} direction='row' alignItems='center'>
								<CardMedia
									sx={{ width: 'auto', height: '100%' }}
									component='img'
									width='auto'
									height='100%'
									src={FILE_IMAGE[file.type.split('/')[0]] || FILE_IMAGE['other']}
								/>
								<Typography
									ml={0.8}
									maxWidth={140}
									fontWeight={500}
									textOverflow='ellipsis'
									whiteSpace='nowrap'
									overflow='hidden'
								>
									{file.name}
								</Typography>
							</Stack>

							<Box>
								<IconButton color='error' onClick={onDelete(index)}>
									<DeleteForever />
								</IconButton>
							</Box>
						</ListItem>
					))}
				</List>
			)}
		</>

		//#endregion
	);
};
