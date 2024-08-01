import { Box, Grid, Paper, Stack, Typography } from '@mui/material';

import { CAutocomplete } from '_controls/';
import { useQuery } from '@tanstack/react-query';
import { getAllDepartments } from '_api/options.api';

export const MFilter = ({ filter, onFilterChange }) => {
	//#region Data
	const { data: departments } = useQuery({
		queryKey: ['departments', filter?.semester_id, filter?.academic_id],
		queryFn: () =>
			getAllDepartments({ semester_id: filter?.semester_id, academic_id: filter?.academic_id }),
		select: (response) => response?.data?.map((e) => ({ ...e, id: Number(e?.id) })),
	});
	//#endregion

	//#region Event
	const handleChangeFilter = (key) => (value) =>
		onFilterChange((prev) => ({ ...prev, [key]: parseInt(value?.id), page: 1, pages: 0 }));
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
										onChange={handleChangeFilter('department_id')}
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
					</Grid>
				</Box>
			</Paper>
		</Box>
	);
	//#endregion
};
