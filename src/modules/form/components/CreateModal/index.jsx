import React, { forwardRef, useState, useImperativeHandle } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { Box, Button, Grow, Modal, Paper, Stack, Typography } from '@mui/material';

import { CAutocomplete, CRangePicker } from '_controls/';

const CreateModal = forwardRef(({ props }, ref) => {
	//#region Data
	const { semesters, academic_years } = useSelector((state) => state.options, shallowEqual);

	const [open, setOpen] = useState(false);
	//#endregion

	//#region Event
	const handleOpen = () => setOpen(true);

	const handleClose = () => setOpen(false);
	//#endregion

	useImperativeHandle(
		ref,
		() => ({
			open: () => handleOpen(),
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	//#region Render
	return (
		<Modal open={open} onClose={handleClose}>
			<Grow in={open} timeout={400}>
				<Paper className='center'>
					<Box p={2}>
						<Stack direction='column' px={4}>
							<Typography fontWeight={600} fontSize={18} mb={2.5}>
								Cài đặt thời gian cho phiếu
							</Typography>

							<Box mb={2}>
								<Typography mb={0.8}>Học kỳ - Niên khóa</Typography>
								<Stack direction='row'>
									<Box flex={1} mr={1}>
										<CAutocomplete
											fullWidth
											options={semesters}
											display='name'
											renderOption={(props, option) => (
												<Box {...props} key={option.id} component='li'>
													{option.name}
												</Box>
											)}
										/>
									</Box>
									<Box flex={1}>
										<CAutocomplete
											fullWidth
											options={academic_years}
											display='name'
											renderOption={(props, option) => (
												<Box {...props} key={option.id} component='li'>
													{option.name}
												</Box>
											)}
										/>
									</Box>
								</Stack>
							</Box>

							<Box mb={2}>
								<Typography mb={0.8}>Thời hạn sinh viên chấm</Typography>
								<CRangePicker />
							</Box>

							<Box mb={2}>
								<Typography mb={0.8}>Thời hạn lớp chấm</Typography>
								<Stack direction='row'>
									<Box flex={1} mr={1}>
										<CAutocomplete
											fullWidth
											options={semesters}
											display='name'
											renderOption={(props, option) => (
												<Box {...props} key={option.id} component='li'>
													{option.name}
												</Box>
											)}
										/>
									</Box>
									<Box flex={1}>
										<CAutocomplete
											fullWidth
											options={academic_years}
											display='name'
											renderOption={(props, option) => (
												<Box {...props} key={option.id} component='li'>
													{option.name}
												</Box>
											)}
										/>
									</Box>
								</Stack>
							</Box>

							<Box mb={2}>
								<Typography mb={0.8}>Thời hạn khoa chấm</Typography>
								<Stack direction='row'>
									<Box flex={1} mr={1}>
										<CAutocomplete
											fullWidth
											options={semesters}
											display='name'
											renderOption={(props, option) => (
												<Box {...props} key={option.id} component='li'>
													{option.name}
												</Box>
											)}
										/>
									</Box>
									<Box flex={1}>
										<CAutocomplete
											fullWidth
											options={academic_years}
											display='name'
											renderOption={(props, option) => (
												<Box {...props} key={option.id} component='li'>
													{option.name}
												</Box>
											)}
										/>
									</Box>
								</Stack>
							</Box>

							<Button onClick={() => {}} variant='contained'>
								Tạo phiếu
							</Button>
						</Stack>
					</Box>
				</Paper>
			</Grow>
		</Modal>
	);
	//#endregion
});

export default CreateModal;
