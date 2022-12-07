import React from 'react';

import { Box, Grid, Paper, Stack, Typography } from '@mui/material';

import { CAutocomplete } from '_controls/';

import { STATUS } from '_constants/variables';

const Filter = ({ filter, onChangeFilter, semesters, academic_years }) => {
	//#region Data
	//#endregion

	//#region Event

	const handleChangeFilter = (key) => (value) =>
		onChangeFilter((prev) => ({ ...prev, [key]: parseInt(value?.id) }));
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
						<Box p={1}>
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
					<Grid item xs={12} xl={4}>
						<Box p={1}>
							<Stack>
								<Typography fontWeight={500} fontSize={16} pl={1} mb={0.7}>
									Trạng thái phiếu
								</Typography>
								<CAutocomplete
									value={filter.status}
									onChange={handleChangeFilter('status')}
									options={STATUS}
									display='name'
									placeholder='Tất cả'
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
	//#endregion
};

export default Filter;
