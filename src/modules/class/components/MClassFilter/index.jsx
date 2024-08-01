import { useMemo } from 'react';

import { useLocation } from 'react-router-dom';

import { Box, Grid, Paper, Stack, Typography } from '@mui/material';

import { CAutocomplete } from '_controls/';
import { useQuery } from '@tanstack/react-query';
import { getAllDepartments } from '_api/options.api';

export const MClassFilter = ({ filter, onFilterChange, semesters, academic_years }) => {
	//#region Data
	const { data: departments } = useQuery({
		queryKey: ['departments', filter?.semester_id, filter?.academic_id],
		queryFn: () =>
			getAllDepartments({ semester_id: filter?.semester_id, academic_id: filter?.academic_id }),
		select: (response) => response?.data?.map((e) => ({ ...e, id: Number(e?.id) })),
	});

	const { pathname } = useLocation();

	const isHistory = useMemo(() => pathname.includes('history'), [pathname]);
	//#endregion

	//#region Event
	const handleChangeFilter = (key) => (value) => {
		key === 'academic_id'
			? onFilterChange((prev) => ({
					...prev,
					[key]: parseInt(value?.id),
					page: 1,
					semester_id: null,
			  }))
			: onFilterChange((prev) => ({
					...prev,
					[key]: parseInt(value?.id),
					page: 1,
			  }));
	};
	//#endregion

	//#region Render
	return (
		<Box mb={1.5}>
			<Paper className='paper-filter'>
				<Box p={1.5}>
					<Grid container>
						<Grid item xs={12} lg={3}>
							<Box p={2}>
								<Stack>
									<Typography fontWeight={500} fontSize={16} pl={1} mb={0.7}>
										Khoa
									</Typography>
									<CAutocomplete
										disabled
										value={filter?.department_id}
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
						<Grid item xs={12} lg={3}>
							<Box p={2}>
								<Stack>
									<Typography fontWeight={500} fontSize={16} pl={1} mb={0.7}>
										Năm học
									</Typography>
									<CAutocomplete
										disabled={!isHistory}
										disableClearable
										value={filter?.academic_id}
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
						<Grid item xs={12} lg={3}>
							<Box p={2}>
								<Stack>
									<Typography fontWeight={500} fontSize={16} pl={1} mb={0.7}>
										Học kỳ
									</Typography>
									<CAutocomplete
										disabled={!isHistory}
										disableClearable
										value={filter?.semester_id}
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
