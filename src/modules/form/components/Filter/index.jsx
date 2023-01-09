import { shallowEqual, useSelector } from 'react-redux';

import { Box, Grid, Paper, Stack, Typography } from '@mui/material';

import { CAutocomplete } from '_controls/';

import { FORM_STATUS } from '_constants/variables';

const Filter = ({ filter, onChangeFilter }) => {
	//#region Data
	const academic_years = useSelector((state) => state.options.academic_years, shallowEqual);
	const semesters = useSelector((state) => state.options.semesters, shallowEqual);
	//#endregion

	//#region Event

	const handleChangeFilter = (key) => (value) =>
		onChangeFilter((prev) => ({ ...prev, [key]: parseInt(value?.id), page: 1, pages: 0 }));
	//#endregion

	//#region Render
	return (
		<Paper className='paper-filter'>
			<Box p={1.5}>
				<Grid container>
					<Grid item xs={12} xl={4}>
						<Box p={1}>
							<Stack>
								<Typography fontWeight={500} fontSize={16} pl={1} mb={0.7}>
									Năm học
								</Typography>
								<CAutocomplete
									placeholder='Tất cả'
									value={filter?.academic_id}
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
					<Grid item xs={12} xl={4}>
						<Box p={1}>
							<Stack>
								<Typography fontWeight={500} fontSize={16} pl={1} mb={0.7}>
									Học kỳ
								</Typography>
								<CAutocomplete
									placeholder='Tất cả'
									value={filter?.semester_id}
									onChange={handleChangeFilter('semester_id')}
									options={semesters}
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
					<Grid item xs={12} xl={4}>
						<Box p={1}>
							<Stack>
								<Typography fontWeight={500} fontSize={16} pl={1} mb={0.7}>
									Trạng thái biểu mẫu
								</Typography>
								<CAutocomplete
									value={filter.status}
									onChange={handleChangeFilter('status')}
									options={FORM_STATUS}
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
				</Grid>
			</Box>
		</Paper>
	);
	//#endregion
};

export default Filter;
