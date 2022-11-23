import React, { useState } from 'react';

import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';

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
			<Container maxWidth='md'>
				<Box my={1} border='1px solid black'>
					<Grid container>
						<Grid item xs={12} xl={6}>
							<Box p={2}>
								<Stack>
									<Typography>Học kỳ</Typography>
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
									<Typography>Niên khóa</Typography>
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
			</Container>

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
