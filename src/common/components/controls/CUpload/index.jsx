import { useEffect, useMemo, useRef } from 'react';
import { TransitionGroup } from 'react-transition-group';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { Box, Grow, List, Typography } from '@mui/material';
import { CloudUploadOutlined } from '@mui/icons-material';

import { CFileItem } from './CFileItem';

import { uploadFile } from '_api/files.api';

import { isSuccess } from '_func/';
import { alert } from '_func/alert';

import { ERRORS } from '_constants/messages';

import './index.scss';

const MAX_FILES = 5;

const MAX_FILE_SIZE = 10485760;

export const CUpload = ({ name, files }) => {
	//#region Data
	const available = useSelector((state) => state.mark.available, shallowEqual);
	const { role_id } = useSelector((state) => state.auth.profile, shallowEqual);

	const { pathname } = useLocation();

	const isAllowed = useMemo(
		() => (pathname.includes('student') || role_id === 0) && available,
		[pathname]
	);

	const inputRef = useRef(null);

	const wrapperRef = useRef();

	const {
		control,
		trigger,
		formState: { errors },
	} = useFormContext();

	const { fields, append, remove, replace, update } = useFieldArray({
		control,
		name,
	});
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

					if (Object.keys(errors)?.length > 0) {
						trigger();
					}
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
		if (fields.filter((e) => !e?.deleted).length >= MAX_FILES) {
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

		if (fields.filter((e) => !e?.deleted).length >= MAX_FILES) {
			alert.fail({ text: `Tối đa ${MAX_FILES} files minh chứng.` });
			return;
		}

		const newFile = e?.dataTransfer?.files[0];

		checkFile(newFile);
	};

	const onDelete = (index) => () => {
		fields[index]?.exist ? update(index, { ...fields[index], deleted: 1 }) : remove(index);
	};
	//#endregion

	useEffect(() => {
		if (files?.length > 0 && fields.length < 1) {
			replace(files.map((e) => ({ ...e, file_id: Number(e.id) })));
		}
	}, [files]);

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
					sx={{
						inset: 0,
						backgroundColor: 'transparent',
						cursor: isAllowed ? 'pointer' : 'default',
					}}
				>
					{isAllowed && (
						<input
							type='file'
							ref={inputRef}
							onChange={onChange}
							hidden
							accept='image/*,application/pdf'
						/>
					)}
				</Box>
				<Box
					textAlign='center'
					fontWeight={600}
					p={1.1}
					sx={{ opacity: isAllowed ? 1 : 0.2 }}
				>
					<CloudUploadOutlined sx={{ fontSize: '3rem' }} color='primary' />
					<Typography>Kéo & thả file để upload</Typography>
				</Box>
			</Box>

			{fields.length > 0 ? (
				<List sx={{ p: 0 }}>
					<TransitionGroup>
						{fields.map((file, index) => (
							<Grow key={file.id}>
								<div style={{ display: file?.deleted === 1 ? 'none' : 'block' }}>
									<CFileItem
										file={file}
										onDelete={onDelete(index)}
										isAllowed={isAllowed}
									/>
								</div>
							</Grow>
						))}
					</TransitionGroup>
				</List>
			) : (
				<Typography mt={2} fontSize={18} fontWeight={600} textAlign='center'>
					Danh sách File trống
				</Typography>
			)}
		</>

		//#endregion
	);
};
