import { Box, Grid, Paper, Stack, Typography } from '@mui/material';

import { CAutocomplete } from '_controls/';

const Filter = ({
	filter,
	onFilterChange,
	departments,
	semesters,
	academic_years,
	isDepartment,
}) => {
	//#region Data
	//#endregion

	//#region Event
	const handleChangeFilter = (key) => (value) =>
		onFilterChange((prev) => ({ ...prev, [key]: parseInt(value?.id) }));
	//#endregion

	//#region Render
	return (
		<Box>
			<Box mb={1.5}>
				<Paper className='paper-filter'>
					<Box p={1.5}>
						<Grid container>
							<Grid item xs={12} md={6} lg={3}>
								<Box p={2}>
									<Stack>
										<Typography fontWeight={500} fontSize={16} pl={1} mb={0.7}>
											Khoa
										</Typography>
										<CAutocomplete
											disabled={isDepartment}
											value={filter.department_id}
											onChange={handleChangeFilter('department_id')}
											options={departments}
											display='name'
											placeholder='Tất cả'
											renderOption={(props, option) => (
												<Box component='li' {...props} key={option.id}>
													{option.name}
												</Box>
											)}
										/>
									</Stack>
								</Box>
							</Grid>
							<Grid item xs={12} md={6} lg={3}>
								<Box p={2}>
									<Stack>
										<Typography fontWeight={500} fontSize={16} pl={1} mb={0.7}>
											Năm học
										</Typography>
										<CAutocomplete
											disableClearable
											value={filter.academic_id}
											onChange={handleChangeFilter('academic_id')}
											options={academic_years}
											display='name'
											renderOption={(props, option) => (
												<Box component='li' {...props} key={option.id}>
													{option.name}
												</Box>
											)}
										/>
									</Stack>
								</Box>
							</Grid>
							<Grid item xs={12} md={6} lg={3}>
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
											display='display'
											renderOption={(props, option) => (
												<Box component='li' {...props} key={option.id}>
													{option.display}
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
