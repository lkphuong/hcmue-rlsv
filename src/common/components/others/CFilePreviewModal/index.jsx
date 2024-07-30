import { forwardRef, useState, useImperativeHandle } from 'react';
import { TransitionGroup } from 'react-transition-group';

import {
	Box,
	CardMedia,
	Grow,
	Link,
	List,
	ListItem,
	Modal,
	Paper,
	Stack,
	Typography,
} from '@mui/material';

import pdf from '_assets/images/file-pdf.png';
import blank from '_assets/images/file.png';
import image from '_assets/images/file-image.png';

const FILE_IMAGE = {
	apng: image,
	avif: image,
	gif: image,
	jpg: image,
	jpeg: image,
	jfif: image,
	pjpeg: image,
	pjp: image,
	png: image,
	svg: image,
	webp: image,
	pdf: pdf,
	0: pdf,
	1: image,
	other: blank,
};

export const CFilePreviewModal = forwardRef(({ itemData }, ref) => {
	//#region Data
	const [open, setOpen] = useState(false);

	const type = (file) => {
		if (file?.extension) {
			if (!file?.extension?.split('.')?.at(-1)) return FILE_IMAGE['png'];

			return FILE_IMAGE[file.extension.split('.').at(-1)] || FILE_IMAGE['other'];
		} else {
			return FILE_IMAGE[file?.type] || FILE_IMAGE['other'];
		}
	};

	//#endregion

	//#region Event
	const close = () => setOpen(false);
	//#endregion

	useImperativeHandle(ref, () => ({
		open: () => setOpen(true),
	}));

	//#region Render
	return (
		<Modal open={open} onClose={close}>
			<Grow in={open} timeout={400}>
				<Box className='center' borderRadius={3}>
					<Paper>
						<Box p={4} minWidth={330}>
							{itemData?.files?.length > 0 ? (
								<List sx={{ p: 0 }}>
									<TransitionGroup>
										{itemData?.files.map((file) => (
											<Grow key={file.id}>
												<div>
													<ListItem
														className='c-file-item'
														sx={{
															p: 1,
															display: 'flex',
															justifyContent: 'space-between',
															backgroundColor:
																'rgb(175 205 255 / 20%)',
															borderRadius: '10px',
															marginTop: '8px',
														}}
													>
														<Stack
															sx={{ height: '40px' }}
															direction='row'
															alignItems='center'
														>
															<CardMedia
																sx={{
																	width: 'auto',
																	height: '100%',
																}}
																component='img'
																width='auto'
																height='100%'
																src={type(file)}
															/>
															<Link
																ml={0.8}
																maxWidth={140}
																fontWeight={500}
																textOverflow='ellipsis'
																whiteSpace='nowrap'
																overflow='hidden'
																href={
																	file?.url ||
																	URL.createObjectURL(file)
																}
																target='_blank'
															>
																{file.originalName || file.name}
															</Link>
														</Stack>
													</ListItem>
												</div>
											</Grow>
										))}
									</TransitionGroup>
								</List>
							) : (
								<Typography
									mt={2}
									fontSize={18}
									fontWeight={600}
									textAlign='center'
								>
									Danh sách File trống
								</Typography>
							)}
						</Box>
					</Paper>
				</Box>
			</Grow>
		</Modal>
	);
	//#endregion
});

CFilePreviewModal.displayName = CFilePreviewModal;
