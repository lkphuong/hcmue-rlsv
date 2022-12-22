import React, { useEffect, useRef } from 'react';
import { TransitionGroup } from 'react-transition-group';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Box, Grow, List, Typography } from '@mui/material';
import { CloudUploadOutlined } from '@mui/icons-material';

import { CFileItem } from './CFileItem';

import { uploadFile } from '_api/files.api';

import { isSuccess } from '_func/';
import { alert } from '_func/alert';

import './index.scss';
import { ERRORS } from '_constants/messages';

const MAX_FILES = 5;

const MAX_FILE_SIZE = 10485760;

export const CUpload = ({ name, itemData }) => {
	//#region Data
	const inputRef = useRef(null);

	const wrapperRef = useRef();

	const { control } = useFormContext();

	const { fields, append, remove, replace } = useFieldArray({ control, name });
	//#endregion

	//#region Event
	const checkFile = async (file) => {
		if (file) {
			if (file.size > MAX_FILE_SIZE) {
				alert.fail({ text: 'Dung lượng file tối đa 10Mb.' });
				return;
			} else if (file.type === 'application/pdf' || file.type.split('/')[0] === 'image') {
				inputRef.current.value = null;

				const res = await uploadFile(file);

				if (isSuccess(res)) {
					const { data } = res;

					const file = {
						file_id: Number(data.id),
						extension: data.extension,
						originalName: data.originalName,
						url: data.url,
					};

					append(file);
				} else {
					alert.fail({ text: res?.message || ERRORS.FAIL });
				}
			} else {
				alert.fail({ text: 'Định dạng file không hợp lệ (.pdf, hoặc image/*).' });
				return;
			}
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

	const onChange = (e) => {
		if (fields.length >= MAX_FILES) {
			alert.fail({ text: `Tối đa ${MAX_FILES} files minh chứng.` });
			return;
		}

		const newFile = e.target.files[0];

		checkFile(newFile);
	};

	const onDrop = (e) => {
		e.stopPropagation();
		e.preventDefault();

		wrapperRef.current.classList.remove('dragover');

		if (fields.length >= MAX_FILES) {
			alert.fail({ text: `Tối đa ${MAX_FILES} files minh chứng.` });
			return;
		}

		const newFile = e?.dataTransfer?.files[0];

		checkFile(newFile);
	};

	const onDelete = (index) => () => remove(index);
	//#endregion

	useEffect(() => {
		if (itemData?.files) {
			replace(itemData.files.map((e) => ({ ...e, file_id: Number(e.id) })));
		}
	}, [itemData]);

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
					<input type='file' ref={inputRef} onChange={onChange} hidden />
				</Box>
				<Box textAlign='center' fontWeight={600} p={1.1}>
					<CloudUploadOutlined sx={{ fontSize: '3rem' }} color='primary' />
					<Typography>Kéo & thả file để upload</Typography>
				</Box>
			</Box>

			{fields.length > 0 && (
				<List sx={{ p: 0 }}>
					<TransitionGroup>
						{fields.map((file, index) => (
							<Grow key={file.id}>
								<div>
									<CFileItem file={file} onDelete={onDelete(index)} />
								</div>
							</Grow>
						))}
					</TransitionGroup>
				</List>
			)}
		</>

		//#endregion
	);
};
