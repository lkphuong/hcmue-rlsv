import React, { useCallback, useState } from 'react';

import { Box, debounce, Grid, Paper, Stack, Typography } from '@mui/material';

import { CAutocomplete, CInput } from '_controls/';

export const MFilter = ({ filter, onChangeFilter, classes, departments, academic_years }) => {
	//#region Data
	const [inputValue, setInputValue] = useState(filter?.input);
	//#endregion

	//#region Event
	const handleChangeStringId = (key) => (value) =>
		onChangeFilter((prev) => {
			if (key === 'class_id') {
				setInputValue('');
				return { ...prev, [key]: value?.id, page: 1, pages: 0, input: '' };
			}
			return { ...prev, [key]: value?.id, page: 1, pages: 0 };
		});

	const handleChangeFilter = (key) => (value) =>
		onChangeFilter((prev) => ({ ...prev, [key]: parseInt(value?.id), page: 1, pages: 0 }));

	const debounceSearch = useCallback(
		debounce((input) => onChangeFilter((prev) => ({ ...prev, input, page: 1, pages: 0 })), 400),
		[]
	);

	const onChangeInput = (event) => {
		setInputValue(event.target.value);
		debounceSearch(event.target.value);
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
										value={filter.department_id}
										onChange={handleChangeStringId('department_id')}
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
										Niên khóa
									</Typography>
									<CAutocomplete
										disableClearable
										value={filter.academic_id}
										onChange={handleChangeFilter('academic_id')}
										options={academic_years}
										display='name'
										placeholder='ALL'
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
										placeholder='Tất cả'
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
						<Grid item xs={12} md={6} lg={3}>
							<Box p={2}>
								<Stack>
									<Typography fontWeight={500} fontSize={16} pl={1} mb={0.7}>
										Tìm kiếm
									</Typography>
									<CInput
										isSearch
										value={inputValue}
										onChange={onChangeInput}
										placeholder='Tìm kiếm tên hoặc mã'
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
