import React from 'react';

import { Box, Grid, Paper, Stack, Typography } from '@mui/material';

import { CAutocomplete } from '_controls/';

import { HOCKY, NIENKHOA } from '_constants/variables';

const Filter = () => {
	return (
		<Paper className='paper-filter'>
			<Box p={1.5}>
				<Grid container>
					<Grid item xs={12} xl={4}>
						<Box p={2}>
							<Stack>
								<Typography fontWeight={500} fontSize={16} pl={1} mb={0.7}>
									Học kỳ
								</Typography>
								<CAutocomplete
									options={HOCKY}
									display='name'
									renderOption={(props, option) => (
										<Box component='li' key={option.id} {...props}>
											{option.name}
										</Box>
									)}
								/>
							</Stack>
						</Box>
					</Grid>
					<Grid item xs={12} xl={4}>
						<Box p={2}>
							<Stack>
								<Typography fontWeight={500} fontSize={16} pl={1} mb={0.7}>
									Niên khóa
								</Typography>
								<CAutocomplete
									options={NIENKHOA}
									display='name'
									renderOption={(props, option) => (
										<Box component='li' key={option.id} {...props}>
											{option.name}
										</Box>
									)}
								/>
							</Stack>
						</Box>
					</Grid>
					<Grid item xs={12} xl={4}>
						<Box p={2}>
							<Stack>
								<Typography fontWeight={500} fontSize={16} pl={1} mb={0.7}>
									Trạng thái phiếu
								</Typography>
								<CAutocomplete
									options={NIENKHOA}
									display='name'
									renderOption={(props, option) => (
										<Box component='li' key={option.id} {...props}>
											{option.name}
										</Box>
									)}
								/>
							</Stack>
						</Box>
					</Grid>
				</Grid>
			</Box>
		</Paper>
	);
};

export default Filter;
