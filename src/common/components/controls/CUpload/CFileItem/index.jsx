import { Box, CardMedia, IconButton, Link, ListItem, Stack } from '@mui/material';
import { DeleteForever } from '@mui/icons-material';

import pdf from '_assets/images/file-pdf.png';
import blank from '_assets/images/file.png';
import image from '_assets/images/file-image.png';

import './index.scss';

// const FILE_IMAGE = {
// 	image: image,
// 	application: pdf,
// 	other: blank,
// };

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
	other: blank,
};

export const CFileItem = ({ file, onDelete }) => {
	const url = process.env.REACT_APP_API_URL.replace('/api/', '') + file.url;

	return (
		<ListItem
			className='c-file-item'
			sx={{
				p: 1,
				display: 'flex',
				justifyContent: 'space-between',
				backgroundColor: 'rgb(175 205 255 / 20%)',
				borderRadius: '10px',
				marginTop: '8px',
			}}
		>
			<Stack sx={{ height: '40px' }} direction='row' alignItems='center'>
				<CardMedia
					sx={{ width: 'auto', height: '100%' }}
					component='img'
					width='auto'
					height='100%'
					// src={FILE_IMAGE[file.type.split('/')[0]] || FILE_IMAGE['other']}
					src={FILE_IMAGE[file.extension.split('.').at(-1)] || FILE_IMAGE['other']}
				/>
				<Link
					ml={0.8}
					maxWidth={140}
					fontWeight={500}
					textOverflow='ellipsis'
					whiteSpace='nowrap'
					overflow='hidden'
					href={url || URL.createObjectURL(file)}
					target='_blank'
				>
					{/* {file.name} */}
					{file.originalName}
				</Link>
			</Stack>

			<Box>
				<IconButton color='error' onClick={onDelete}>
					<DeleteForever />
				</IconButton>
			</Box>
		</ListItem>
	);
};
