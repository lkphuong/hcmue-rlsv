import { shallowEqual, useSelector } from 'react-redux';

import { Box, Grid, Paper, Stack, Typography } from '@mui/material';

import { CAutocomplete } from '_controls/';

export const MRoleFilter = ({
	filter,
	onFilterChange,
	classes,
	departments,
	academic_years,
	semesters,
}) => {
	//#region Data
	const { department_id } = useSelector((state) => state.auth.profile, shallowEqual);
	//#endregion

	//#region Event
	const handleChangeFilter = (key) => (value) => {
		key === 'class_id'
			? onFilterChange((prev) => ({
					...prev,
					[key]: parseInt(value?.id),
					department_id: parseInt(value?.department_id),
					page: 1,
					pages: 0,
			  }))
			: onFilterChange((prev) => ({
					...prev,
					[key]: parseInt(value?.id),
					page: 1,
					pages: 0,
			  }));
	};
	//#endregion

	//#region Render
	return (
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
										disabled
										value={department_id}
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
										Lớp
									</Typography>
									<CAutocomplete
										disableClearable
										disabled={classes?.length < 2}
										placeholder='Tất cả'
										value={filter.class_id}
										onChange={handleChangeFilter('class_id')}
										options={classes}
										display='code'
										renderOption={(props, option) => (
											<Box component='li' {...props} key={option.id}>
												{option.code}
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
										Học kỳ
									</Typography>
									<CAutocomplete
										disableClearable
										value={filter.semester_id}
										onChange={handleChangeFilter('semester_id')}
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
