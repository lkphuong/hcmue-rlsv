import { Box, Paper, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';

import { shallowEqual, useSelector } from 'react-redux';

import { CAutocomplete } from '_controls/';

export const MHistoryFilter = ({ filter, academic_years, semesters, onFilterChange }) => {
	//#region Data
	const departments = useSelector((state) => state.options.departments, shallowEqual);

	//#endregion

	//#region Event
	const handleDepartmentChange = (key) => (value) =>
		onFilterChange((prev) => ({ ...prev, [key]: value?.id, page: 1, pages: 0 }));
	//#endregion

	//#region Render
	return (
		<Box mb={3}>
			<Paper className='paper-filter'>
				<Box p={1.5}>
					<Grid container>
						<Grid xs={12} md={3}>
							<Box p={2}>
								<Stack>
									<Typography fontWeight={500} fontSize={16} pl={1} mb={0.7}>
										Khoa
									</Typography>
									<CAutocomplete
										value={filter.department_id}
										onChange={handleDepartmentChange('department_id')}
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
						<Grid xs={12} md={3}>
							<Box p={2}>
								<Stack>
									<Typography fontWeight={500} fontSize={16} pl={1} mb={0.7}>
										Năm học
									</Typography>
									<CAutocomplete
										disableClearable
										value={filter.academic_id}
										onChange={handleDepartmentChange('academic_id')}
										options={academic_years}
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
						<Grid xs={12} md={3}>
							<Box p={2}>
								<Stack>
									<Typography fontWeight={500} fontSize={16} pl={1} mb={0.7}>
										Học kỳ
									</Typography>
									<CAutocomplete
										disableClearable
										value={filter.semester_id}
										onChange={handleDepartmentChange('semester_id')}
										options={semesters}
										display='display'
										placeholder='Tất cả'
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
	);
	//#endregion
};
