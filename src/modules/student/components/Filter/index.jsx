import React, { useRef, useState } from 'react';

import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material';

import { CAutocomplete, CInput } from '_controls/';

import { STATUS } from '_constants/variables';

export const Filter = ({
	filter,
	onChangeFilter,
	semesters,
	academic_years,
	departments,
	classes,
}) => {
	//#region Data
	const searchRef = useRef();

	const [input, setInput] = useState('');
	//#endregion

	//#region Event
	const handleChangeStringId = (key) => (value) =>
		onChangeFilter((prev) => ({ ...prev, [key]: value?.id }));

	const handleChangeFilter = (key) => (value) =>
		onChangeFilter((prev) => ({ ...prev, [key]: parseInt(value?.id) }));

	const handleChangeInput = (event) => setInput(event.target.value);

	const handleSearch = () => onChangeFilter((prev) => ({ ...prev, input }));

	const onKeyPress = (e) => {
		if (e.key === 'Enter') searchRef.current.click();
	};
	//#endregion

	//#region Render
	return (
		<>
			<Box mb={1.5}>
				<Paper className='paper-filter'>
					<Box p={1.5}>
						<Grid container>
							<Grid item xs={12} md={6} lg={3}>
								<Box p={1}>
									<Stack>
										<Typography fontWeight={500} fontSize={16} pl={1} mb={0.7}>
											Khoa
										</Typography>
										<CAutocomplete
											disableClearable
											value={filter.department_id}
											onChange={handleChangeStringId('department_id')}
											options={departments}
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
								<Box p={1}>
									<Stack>
										<Typography
											fontWeight={500}
											fontSize={16}
											pl={1}
											mb={0.7}
											className='required'
										>
											Lớp
										</Typography>
										<CAutocomplete
											placeholder='Chọn lớp để hiện phiếu'
											disableClearable
											value={filter.class_id}
											onChange={handleChangeStringId('class_id')}
											options={classes}
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
							<Grid item xs={0} lg={6} />
							<Grid item xs={12} md={6} lg={3}>
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
												<Box component='li' {...props} key={option.id}>
													{option.name}
												</Box>
											)}
										/>
									</Stack>
								</Box>
							</Grid>
							<Grid item xs={12} md={6} lg={3}>
								<Box p={1}>
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
			</Box>

			<Grid container mb={1} spacing={1} alignItems='center'>
				<Grid item>
					<CInput
						value={input}
						onChange={handleChangeInput}
						placeholder='Nhập Tên hoặc MSSV'
						isSearch
						onKeyPress={onKeyPress}
					/>
				</Grid>
				<Grid item>
					<Button variant='contained' onClick={handleSearch} ref={searchRef}>
						Tìm kiếm
					</Button>
				</Grid>
			</Grid>
		</>
	);
	//#endregion
};
