import { Box, CardMedia, Grow, IconButton, Link, ListItem, Stack } from '@mui/material';
import { DeleteForever } from '@mui/icons-material';

import pdf from '_assets/images/file-pdf.png';
import blank from '_assets/images/file.png';
import image from '_assets/images/file-image.png';

import './index.scss';

const FILE_IMAGE = {
	image: image,
	application: pdf,
	other: blank,
};

export const CFileItem = ({ file, onDelete }) => {
	return (
		<Grow in={!!file} timeout={400}>
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
						src={FILE_IMAGE[file.type.split('/')[0]] || FILE_IMAGE['other']}
					/>
					<Link
						ml={0.8}
						maxWidth={140}
						fontWeight={500}
						textOverflow='ellipsis'
						whiteSpace='nowrap'
						overflow='hidden'
						href={URL.createObjectURL(file)}
						target='_blank'
					>
						{file.name}
					</Link>
				</Stack>

				<Box>
					<IconButton color='error' onClick={onDelete}>
						<DeleteForever />
					</IconButton>
				</Box>
			</ListItem>
		</Grow>
	);
};
