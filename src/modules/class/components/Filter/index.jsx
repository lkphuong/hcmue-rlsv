import React, { useState } from 'react';

import { Box, Button, Container, Grid, Paper, Stack, Typography } from '@mui/material';

import { CAutocomplete, CInput } from '_controls/';

const Filter = ({ filter, onChangeFilter, semesters, academic_years }) => {
	//#region Data
	const [input, setInput] = useState('');
	//#endregion

	//#region Event
	const handleChangeFilter = (key) => (value) =>
		onChangeFilter((prev) => ({ ...prev, [key]: parseInt(value?.id) }));

	const handleChangeInput = (event) => setInput(event.target.value);

	const handleSearch = () => onChangeFilter((prev) => ({ ...prev, input }));
	//#endregion

	//#region Render
	return (
		<>
			<Box mb={1.5}>
				<Container maxWidth='md'>
					<Paper className='paper-filter'>
						<Box p={1.5}>
							<Grid container>
								<Grid item xs={12} xl={6}>
									<Box p={2}>
										<Stack>
											<Typography
												fontWeight={500}
												fontSize={16}
												pl={1}
												mb={0.7}
											>
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
								<Grid item xs={12} xl={6}>
									<Box p={2}>
										<Stack>
											<Typography
												fontWeight={500}
												fontSize={16}
												pl={1}
												mb={0.7}
											>
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
				</Container>
			</Box>

			<Grid container mb={1} spacing={1} alignItems='center'>
				<Grid item>
					<CInput
						value={input}
						onChange={handleChangeInput}
						placeholder='Nhập Tên hoặc MSSV'
						isSearch
					/>
				</Grid>
				<Grid item>
					<Button variant='contained' onClick={handleSearch}>
						Tìm kiếm
					</Button>
				</Grid>
			</Grid>
		</>
	);
	//#endregion
};

export default Filter;
