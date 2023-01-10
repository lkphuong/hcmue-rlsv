import { Box, Paper, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';

import { SHEET_STATUS } from '_constants/variables';

import { CAutocomplete } from '_controls/';

export const MDepartmentFilter = ({ filter, onFilterChange, classes }) => {
	//#region Data
	//#endregion

	//#region Event
	const onSelectChange = (key) => (value) =>
		onFilterChange((prev) => ({ ...prev, [key]: value?.id, page: 1, pages: 0 }));
	//#endregion

	//#region Render
	return (
		<Box mb={3}>
			<Paper className='paper-filter'>
				<Box p={1.5}>
					<Grid container spacing={1}>
						<Grid xs={12} md={3}>
							<Stack>
								<Typography fontWeight={500} fontSize={16} pl={1} mb={0.7}>
									Lớp
								</Typography>
								<CAutocomplete
									value={filter.class_id}
									onChange={onSelectChange('class_id')}
									options={classes}
									display='code'
									placeholder='Tất cả'
									renderOption={(props, option) => (
										<Box component='li' {...props} key={option.id}>
											{option.code}
										</Box>
									)}
								/>
							</Stack>
						</Grid>
						<Grid xs={12} md={3}>
							<Stack>
								<Typography fontWeight={500} fontSize={16} pl={1} mb={0.7}>
									Trạng thái phiếu
								</Typography>
								<CAutocomplete
									value={filter.status}
									onChange={onSelectChange('status')}
									options={SHEET_STATUS}
									display='name'
									placeholder='Tất cả'
									renderOption={(props, option) => (
										<Box component='li' {...props} key={option.id}>
											{option.name}
										</Box>
									)}
								/>
							</Stack>
						</Grid>
					</Grid>
				</Box>
			</Paper>
		</Box>
	);
	//#endregion
};
