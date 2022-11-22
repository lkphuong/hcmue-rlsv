import React from 'react';

import { Box, Container, Grid, Stack, Typography } from '@mui/material';

import { CAutocomplete } from '_controls/';

import { HOCKY, NIENKHOA } from '_constants/variables';

const Filter = () => {
	return (
		<Container maxWidth='lg'>
			<Box my={1} border='1px solid black'>
				<Grid container>
					<Grid item xs={12} xl={4}>
						<Box p={2}>
							<Stack>
								<Typography>Học kỳ</Typography>
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
								<Typography>Niên khóa</Typography>
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
								<Typography>Trạng thái phiếu</Typography>
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
		</Container>
	);
};

export default Filter;
