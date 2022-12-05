import React from 'react';

import { Box, Container, Grid, Paper, Stack, Typography } from '@mui/material';

import { CAutocomplete } from '_controls/';

export const FilterClass = ({ filter, onChangeFilter, semesters, academic_years, classes }) => {
	//#region Data
	//#endregion

	//#region Event
	const handleChangeStringId = (key) => (value) =>
		onChangeFilter((prev) => ({ ...prev, [key]: value?.id, page: 1, pages: 0 }));
	//#endregion

	//#region Render
	return (
		<Box mb={1.5}>
			<Container maxWidth='xs'>
				<Paper className='paper-filter'>
					<Box p={1.5}>
						<Grid container>
							<Grid item xs={12}>
								<Box p={2}>
									<Stack>
										<Typography fontWeight={500} fontSize={16} pl={1} mb={0.7}>
											Lớp
										</Typography>
										<CAutocomplete
											value={filter?.class_id || null}
											onChange={handleChangeStringId('class_id')}
											options={classes}
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
			</Container>
		</Box>
	);
	//#endregion
};
