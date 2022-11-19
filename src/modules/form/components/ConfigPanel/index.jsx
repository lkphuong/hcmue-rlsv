import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Box, Grid, Stack, Typography } from '@mui/material';

import { CAutocomplete, CRangePicker } from '_controls/';

import { HOCKY, NIENKHOA } from '_constants/variables';

const ConfigPanel = () => {
	const [values, setValues] = useState({
		startDate: dayjs(),
		endDate: dayjs('2022-12-01'),
	});

	const handleChangeDates = (e, f, v) => {
		console.log(e);
		console.log(f);
		console.log(v);
	};

	return (
		<Box my={2} p={1} border='1px solid black'>
			<Typography fontWeight={600} component='h1' mb={3}>
				Cài đặt thời gian
			</Typography>
			<Grid container spacing={2}>
				<Grid item xs={12} md={6} xl={3}>
					<Stack direction='column'>
						<Typography>Học kỳ - Niên khóa</Typography>
						<Box display='flex'>
							<Stack flex={1} mr={1}>
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
							<Stack flex={1}>
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
					</Stack>
				</Grid>
				<Grid item xs={12} md={6} xl={3}>
					<Stack direction='column'>
						<Typography>Thời hạn sinh viên chấm</Typography>
						<CRangePicker values={values} onChange={handleChangeDates} />
					</Stack>
				</Grid>
				<Grid item xs={12} md={6} xl={3}>
					<Stack direction='column'>
						<Typography>Thời hạn lớp chấm</Typography>
					</Stack>
				</Grid>
				<Grid item xs={12} md={6} xl={3}>
					<Stack direction='column'>
						<Typography>Thời hạn khoa chấm</Typography>
					</Stack>
				</Grid>
			</Grid>
		</Box>
	);
};

export default ConfigPanel;
