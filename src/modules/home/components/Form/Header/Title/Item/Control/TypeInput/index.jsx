import { Controller, useFormContext } from 'react-hook-form';

import { TableCell, Typography } from '@mui/material';

import { CInput } from '_controls/';

const TypeInput = ({
	available,
	category,
	currentMark,
	id,
	initialMark,
	mark,
	max,
	min,
	titleId,
	unit,
}) => {
	//#region Data
	const { control, trigger } = useFormContext();
	//#endregion

	//#region Event
	const handleChange = (CallbackFunc) => (e) => {
		if (e.target.value === '') {
			CallbackFunc('');
			trigger(`title_${titleId}_${id}.personal_mark_level`);
			return;
		}
		CallbackFunc(Number(e.target.value));
		trigger(`title_${titleId}_${id}.personal_mark_level`);
	};
	//#endregion

	//#region Render
	return (
		<>
			<TableCell align='center'>
				<Typography component='span' whiteSpace='nowrap' fontWeight={500}>
					&nbsp;&#40;{category === 1 ? `Từ ${min} đến ${max} ${unit}` : `${mark} ${unit}`}
					&#41;&nbsp;
				</Typography>
			</TableCell>

			<TableCell align='center'>
				{available ? (
					<Controller
						control={control}
						name={`title_${titleId}_${id}.personal_mark_level`}
						defaultValue={initialMark}
						render={({
							field: { name, onChange, ref, value },
							fieldState: { error },
						}) => (
							<CInput
								sx={{ width: '70%' }}
								type='number'
								name={name}
								inputRef={ref}
								value={value}
								onChange={handleChange(onChange)}
								error={!!error}
							/>
						)}
					/>
				) : (
					<Typography>{currentMark.personal_mark_level}</Typography>
				)}
			</TableCell>
			<TableCell align='center' sx={{ '& .MuiTypography-root': { fontSize: '1rem' } }}>
				<Typography>{currentMark.class_mark_level}</Typography>
			</TableCell>
			<TableCell align='center' sx={{ '& .MuiTypography-root': { fontSize: '1rem' } }}>
				<Typography>{currentMark.adviser_mark_level}</Typography>
			</TableCell>
			<TableCell align='center' sx={{ '& .MuiTypography-root': { fontSize: '1rem' } }}>
				<Typography>{currentMark.department_mark_level}</Typography>
			</TableCell>
		</>
	);
	//#endregion
};

export default TypeInput;
