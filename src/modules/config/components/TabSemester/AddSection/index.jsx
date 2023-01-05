import { Controller, useForm } from 'react-hook-form';

import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	Container,
	Stack,
	Typography,
	Unstable_Grid2 as Grid,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

import { CAutocomplete, CDatePicker } from '_controls/';

import { useResolver } from '_hooks/';

import { createSemester } from '_api/options.api';

import { isSuccess } from '_func/';
import { alert } from '_func/alert';

import { ERRORS } from '_constants/messages';

import { initialValues, validationSchema } from './form';

const SEMESTERS_OPTIONS = [
	{ id: 'Học kỳ I', name: 'Học kỳ I' },
	{ id: 'Học kỳ II', name: 'Học kỳ II' },
];

export const AddSection = ({ refetch }) => {
	//#region Data
	const resolver = useResolver(validationSchema);

	const { control, handleSubmit, reset } = useForm({
		defaultValues: initialValues,
		mode: 'all',
		shouldFocusError: true,
		resolver,
	});
	//#endregion

	//#region Event
	const onSubmit = async (values) => {
		alert.loading();

		const res = await createSemester(values);

		if (isSuccess(res)) {
			refetch();

			alert.success({ text: 'Thêm học kỳ thành công.' });

			reset();
		} else {
			alert.fail({ text: res?.message || ERRORS.FAIL });
		}
	};
	//#endregion

	//#region Render
	return (
		<Box mb={2}>
			<Accordion>
				<AccordionSummary
					expandIcon={<ExpandMore />}
					sx={{ '& .MuiAccordionSummary-content.Mui-expanded': { marginBottom: '5px' } }}
				>
					<Typography fontWeight={600} fontSize={20}>
						Cài đặt học kỳ
					</Typography>
				</AccordionSummary>
				<AccordionDetails sx={{ p: 3, pt: 2 }}>
					<Container maxWidth='lg'>
						<form onSubmit={handleSubmit(onSubmit)}>
							<Grid container spacing={2}>
								<Grid xs={12} md={6} xl={3}>
									<Stack direction='column' spacing={1}>
										<Typography fontSize={18} lineHeight='21px'>
											Học kỳ
										</Typography>
										<Controller
											control={control}
											name='name'
											render={({ field: { value, onChange, name, ref } }) => (
												<CAutocomplete
													display='name'
													disableClearable
													name={name}
													re={ref}
													onChange={onChange}
													value={value}
													options={SEMESTERS_OPTIONS}
													renderOption={(props, option) => (
														<Box {...props} key={option.id}>
															{option.name}
														</Box>
													)}
												/>
											)}
										/>
									</Stack>
								</Grid>
								<Grid xs={12} md={6} xl={3}>
									<Stack direction='column' spacing={1}>
										<Typography fontSize={18} lineHeight='21px'>
											Năm học
										</Typography>
										<Controller
											control={control}
											name='academic_id'
											render={({ field: { value, onChange, name, ref } }) => (
												<CAutocomplete
													display='name'
													name={name}
													re={ref}
													onChange={onChange}
													value={value}
													renderOption={(props, option) => (
														<Box {...props} key={option.id}>
															{option.name}
														</Box>
													)}
												/>
											)}
										/>
									</Stack>
								</Grid>
								<Grid xs={12} md={6} xl={3}>
									<Stack direction='column' spacing={1}>
										<Typography fontSize={18} lineHeight='21px'>
											Thời gian bắt đầu
										</Typography>
										<Controller
											control={control}
											name='start'
											render={({
												field: { value, onChange, name, ref },
												fieldState: { error },
											}) => (
												<CDatePicker
													ref={ref}
													name={name}
													views={['year', 'month']}
													openTo='month'
													inputFormat='MM/YYYY'
													value={value}
													onChange={onChange}
													error={!!error}
													helperText={error?.message}
												/>
											)}
										/>
									</Stack>
								</Grid>
								<Grid xs={12} md={6} xl={3}>
									<Stack direction='column' spacing={1}>
										<Typography fontSize={18} lineHeight='21px'>
											Thời gian kết thúc
										</Typography>
										<Controller
											control={control}
											name='end'
											render={({
												field: { value, onChange, name, ref },
												fieldState: { error },
											}) => (
												<CDatePicker
													ref={ref}
													name={name}
													views={['year', 'month']}
													openTo='month'
													inputFormat='MM/YYYY'
													value={value}
													onChange={onChange}
													error={!!error}
													helperText={error?.message}
												/>
											)}
										/>
									</Stack>
								</Grid>

								<Grid xs={12}>
									<Stack direction='row' spacing={1.5} justifyContent='center'>
										<Button type='button' variant='contained'>
											Mặc định
										</Button>
										<Button type='submit' variant='contained'>
											Thêm mới
										</Button>
									</Stack>
								</Grid>
							</Grid>
						</form>
					</Container>
				</AccordionDetails>
			</Accordion>
		</Box>
	);
	//#endregion
};
