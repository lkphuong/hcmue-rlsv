import { Controller, useForm } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';

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
import { ExpandMore, RestartAlt } from '@mui/icons-material';

import { CAutocomplete, CDatePicker } from '_controls/';

import { useResolver } from '_hooks/';

import { createSemester } from '_api/options.api';

import { isSuccess } from '_func/';
import { alert } from '_func/alert';

import { ERRORS } from '_constants/messages';

import { initialValues, validationSchema } from './form';
import dayjs from 'dayjs';

const SEMESTERS_OPTIONS = [
	{ id: 'Học kỳ I', name: 'Học kỳ I' },
	{ id: 'Học kỳ II', name: 'Học kỳ II' },
];

export const AddSection = ({ refetch }) => {
	//#region Data
	const academic_years = useSelector((state) => state.options.academic_years, shallowEqual);

	const resolver = useResolver(validationSchema);

	const { control, handleSubmit, reset, trigger } = useForm({
		defaultValues: { ...initialValues, academic_id: academic_years[0]?.id || '' },
		mode: 'all',
		shouldFocusError: true,
		resolver,
	});
	////#endregion
	//#region Event
	const onReset = () => reset({ ...initialValues, academic_id: academic_years[0]?.id || '' });

	const onSubmit = async (values) => {
		alert.loading();

		const _values = { ...values };
		_values.start = dayjs(_values.start).format('YYYY-MM-DD');
		_values.end = dayjs(_values.end).format('YYYY-MM-DD');

		const res = await createSemester(_values);

		if (isSuccess(res)) {
			refetch();

			alert.success({ text: 'Thêm học kỳ thành công.' });

			onReset();
		} else {
			alert.fail({ text: res?.message || ERRORS.FAIL });
		}
	};

	const onSelectChange = (CallbackFunc) => (option) => CallbackFunc(option?.id);

	const onTimeChange = (CallbackFunc) => (value) => {
		CallbackFunc(value);
		trigger('start');
		trigger('end');
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
													ref={ref}
													onChange={onSelectChange(onChange)}
													value={value}
													options={SEMESTERS_OPTIONS}
													renderOption={(props, option) => (
														<Box
															component='li'
															{...props}
															key={option.id}
														>
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
													disableClearable
													display='name'
													name={name}
													ref={ref}
													onChange={onSelectChange(onChange)}
													value={value}
													options={academic_years}
													renderOption={(props, option) => (
														<Box
															component='li'
															{...props}
															key={option.id}
														>
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
													onChange={onTimeChange(onChange)}
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
													onChange={onTimeChange(onChange)}
													error={!!error}
													helperText={error?.message}
												/>
											)}
										/>
									</Stack>
								</Grid>

								<Grid xs={12}>
									<Stack direction='row' spacing={1.5} justifyContent='center'>
										<Button
											type='button'
											variant='contained'
											endIcon={<RestartAlt />}
											onClick={onReset}
										>
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
