import React from 'react';

import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';

import { CAutocomplete, CInput } from '_controls/';

const HOCKY = [
	{ id: 1, name: 'Học kỳ I' },
	{ id: 2, name: 'Học kỳ II' },
	{ id: 3, name: 'Học kỳ III' },
	{ id: 4, name: 'Học kỳ hè' },
];

const NIENKHOA = [
	{ id: 1, name: '2021-2022' },
	{ id: 2, name: '2022-2023' },
	{ id: 3, name: '2020-2021' },
	{ id: 4, name: '2023-2024' },
];

const Filter = () => {
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
										options={HOCKY}
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
										options={NIENKHOA}
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
					<CInput placeholder='Nhập Tên hoặc MSSV' isSearch />
				</Grid>
				<Grid item>
					<Button variant='contained'>Tìm kiếm</Button>
				</Grid>
			</Grid>
		</>
	);
};

export default Filter;
