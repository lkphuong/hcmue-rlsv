import { Box, Stack, Typography } from '@mui/material';

import avatarPlaceholder from '_assets/images/avatar-placeholder.png';
import logo from '_assets/images/new-logo.png';

export const CStudentCard = ({ profile }) => {
	return (
		<Box
			height={380}
			width='100%'
			mb={2}
			textAlign='center'
			borderRadius={1}
			overflow='hidden'
			border='2px solid #124874'
			sx={{ borderBottomWidth: 20 }}
		>
			<Stack p={1} direction='row' alignItems='center' bgcolor='#124874' height={70} gap={1}>
				<img
					src={logo}
					alt='logo'
					style={{
						width: 'auto',
						height: '36px',
						objectFit: 'cover',
					}}
				/>
				<Box
					flex={1}
					textAlign='justify'
					sx={{ textJustify: 'inter-word', textAlignLast: 'center' }}
				>
					<Typography
						textOverflow='ellipsis'
						overflow='hidden'
						fontWeight={500}
						whiteSpace='nowrap'
						fontSize={12}
						color='white'
						textTransform='uppercase'
					>
						bộ giáo dục và đào tạo
					</Typography>
					<Typography
						textOverflow='ellipsis'
						overflow='hidden'
						fontWeight={500}
						whiteSpace='nowrap'
						fontSize={12}
						color='white'
						textTransform='uppercase'
					>
						trường đại học sư phạm
					</Typography>
					<Typography
						textOverflow='ellipsis'
						overflow='hidden'
						fontWeight={500}
						whiteSpace='nowrap'
						fontSize={12}
						color='white'
						textTransform='uppercase'
					>
						thành phố hồ chí minh
					</Typography>
				</Box>
			</Stack>
			<Typography
				component='h3'
				textTransform='uppercase'
				color='#CF373D'
				fontWeight={700}
				fontSize={24}
				lineHeight={1.8}
			>
				thẻ sinh viên
			</Typography>
			<Box position='relative' sx={{ aspectRatio: '3/4' }} maxHeight={130} margin='auto'>
				<img
					src={
						profile?.avatar
							? profile.avatar
									.replace('file/d/', 'uc?export=view&id=')
									.replace('/view?usp=drivesdk', '')
							: ''
					}
					onError={({ currentTarget }) => {
						currentTarget.onerror = null; // Prevent looping
						currentTarget.src = avatarPlaceholder;
					}}
					alt='avatar'
					style={{
						position: 'absolute',
						inset: 0,
						height: '100%',
						width: '100%',
						objectFit: 'cover',
					}}
				/>
			</Box>
			<Typography
				color='#124874'
				textTransform='uppercase'
				fontWeight={600}
				fontSize={16}
				lineHeight={1.3}
				whiteSpace='pre-wrap'
				my={1.5}
				px={1}
				maxWidth={300}
			>
				{profile?.fullname}
			</Typography>
			<Typography color='#124874' fontWeight={500} fontSize={14} mb={1.5}>
				{profile?.major}
			</Typography>
			<Typography color='#124874' fontWeight={500} fontSize={14} mb={1.5}>
				{profile?.classes[0]?.code}
			</Typography>
		</Box>
	);
};
