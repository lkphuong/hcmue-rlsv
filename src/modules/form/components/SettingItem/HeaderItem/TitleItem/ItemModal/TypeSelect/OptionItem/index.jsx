import React, { memo } from 'react';
import { Controller } from 'react-hook-form';

import { Box, Button, Grid, Stack, Tooltip, Typography } from '@mui/material';

import { CInput } from '_controls/';

const OptionItem = memo(({ control, index, remove }) => {
	return (
		<Box p={1.5} border='1px solid #c5c5c5'>
			<Stack>
				<Grid container spacing={1} alignItems='center'>
					<Grid item xs={3}>
						<Typography>Chi tiết tiêu chí</Typography>
					</Grid>
					<Grid item xs={9}>
						<Controller
							control={control}
							name={`options[${index}].content`}
							render={({
								field: { name, onBlur, onChange, ref, value },
								fieldState: { error },
							}) => (
								<CInput
									fullWidth
									name={name}
									inputRef={ref}
									value={value}
									onBlur={onBlur}
									onChange={onChange}
									error={!!error}
									helperText={error?.message}
								/>
							)}
						/>
					</Grid>

					<Grid item xs={3}>
						<Typography>Điểm</Typography>
					</Grid>
					<Grid item xs={9}>
						<Controller
							control={control}
							name={`options[${index}].mark`}
							render={({
								field: { name, onBlur, onChange, ref, value },
								fieldState: { error },
							}) => (
								<CInput
									fullWidth
									inputProps={{ min: -100, max: 100, maxLength: 3 }}
									name={name}
									inputRef={ref}
									value={value}
									onBlur={onBlur}
									onChange={onChange}
									error={!!error}
									helperText={error?.message}
								/>
							)}
						/>
					</Grid>
				</Grid>
			</Stack>

			<Box mt={1} textAlign='right'>
				<Tooltip title={index === 0 ? 'Phải có ít nhất 1 tùy chọn' : ''}>
					<span>
						<Button
							variant='contained'
							color='error'
							onClick={remove}
							disabled={index === 0}
						>
							Xóa tùy chọn
						</Button>
					</span>
				</Tooltip>
			</Box>
		</Box>
	);
});

export default OptionItem;
