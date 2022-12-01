import React from 'react';

import { Box, Grid, Paper, Stack, Typography } from '@mui/material';

import { CAutocomplete } from '_controls/';

const Filter = ({ filter, onChangeFilter, classes, semesters, academic_years }) => {
	//#region Data
	//#endregion

	//#region Event
	const handleChangeFilter = (key) => (value) =>
		onChangeFilter((prev) => ({ ...prev, [key]: parseInt(value?.id) }));
	//#endregion

	//#region Render
	return (
		<Box>
			<Box mb={1.5}>
				<Paper className='paper-filter'>
					<Box p={1.5}>
						<Grid container>
							<Grid item xs={12} xl={4}>
								<Box p={2}>
									<Stack>
										<Typography fontWeight={500} fontSize={16} pl={1} mb={0.7}>
											Mã lớp
										</Typography>
										<CAutocomplete
											value={filter.class_id}
											onChange={handleChangeFilter('class_id')}
											options={classes}
											display='name'
											placeholder='ALL'
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
											Học kỳ
										</Typography>
										<CAutocomplete
											disableClearable
											value={filter.semester_id}
											onChange={handleChangeFilter('semester_id')}
											options={semesters}
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
											disableClearable
											value={filter.academic_id}
											onChange={handleChangeFilter('academic_id')}
											options={academic_years}
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
			</Box>
		</Box>
	);
	//#endregion
};

export default Filter;
