import { Box, TableContainer } from '@mui/material';
import { CLoadingSpinner } from '..';

export const CTable = ({ children, loading }) => {
	return (
		<TableContainer className='c-table'>
			{loading && (
				<Box
					position='absolute'
					zIndex={3}
					height='calc(100% - 51.75px)'
					width='100%'
					bottom={0}
					display='flex'
					alignItems='center'
					justifyContent='center'
					sx={{ backgroundColor: 'rgb(255 255 255 / 40%)' }}
				>
					<CLoadingSpinner />
				</Box>
			)}
			{children}
		</TableContainer>
	);
};
