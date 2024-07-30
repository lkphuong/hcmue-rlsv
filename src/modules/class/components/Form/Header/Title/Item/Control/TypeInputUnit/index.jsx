import { Box, TableCell, Typography } from '@mui/material';

import { CAutocomplete } from '_controls/';
import { useMemo } from 'react';

import { Controller, useFormContext } from 'react-hook-form';

const TypeInputUnit = ({ initialMark, currentMark, available, titleId, id, mark, unit }) => {
	//#region Data
	const { control } = useFormContext();

	const options = useMemo(() => {
		return Array(15)
			.fill('')
			.map((e, i) => ({ id: new Date() + i, mark: mark * i }));
	}, [mark]);
	//#endregion

	//#region Event
	const onChangeSelect = (CallbackFunc) => (option) => {
		if (option === null) {
			CallbackFunc(0);
			return;
		}
		CallbackFunc(option?.mark);
	};
	//#endregion

	//#region Render
	return (
		<>
			<TableCell align='center'>
				<Typography component='span' whiteSpace='nowrap' fontWeight={500}>
					&nbsp;&#40;{`${mark} ${unit}`}
					&#41;&nbsp;
				</Typography>
			</TableCell>

			<TableCell align='center' sx={{ '& .MuiTypography-root': { fontSize: '1rem' } }}>
				<Typography>{currentMark.personal_mark_level}</Typography>
			</TableCell>
			<TableCell align='center' sx={{ '& .MuiTypography-root': { fontSize: '1rem' } }}>
				{available ? (
					<Controller
						control={control}
						name={`title_${titleId}_${id}.class_mark_level`}
						defaultValue={initialMark}
						render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
							<CAutocomplete
								sx={{ width: '70%', m: 'auto' }}
								ref={ref}
								disableClearable
								options={options}
								display='mark'
								valueGet='mark'
								value={value}
								onChange={onChangeSelect(onChange)}
								renderOption={(props, option) => (
									<Box component='li' {...props} key={option.id}>
										{option.mark}&nbsp;Điểm
									</Box>
								)}
								error={!!error}
							/>
						)}
					/>
				) : (
					<Typography>{currentMark.class_mark_level}</Typography>
				)}
			</TableCell>
			<TableCell align='center'>
				<Typography>{currentMark.adviser_mark_level}</Typography>
			</TableCell>
			<TableCell align='center' sx={{ '& .MuiTypography-root': { fontSize: '1rem' } }}>
				<Typography>{currentMark.department_mark_level}</Typography>
			</TableCell>
		</>
	);
	//#endregion
};

export default TypeInputUnit;
