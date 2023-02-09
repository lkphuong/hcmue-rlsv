import { Box, TableCell, Typography } from '@mui/material';

import { CAutocomplete } from '_controls/';

import { Controller, useController, useFormContext } from 'react-hook-form';

const TypeSelect = ({ initialMark, currentMark, options, required, available, titleId, id }) => {
	//#region Data
	const { control } = useFormContext();

	const {
		field: { onChange: changeOption },
	} = useController({ control, name: `title_${titleId}_${id}.option_id` });
	//#endregion

	//#region Event
	const onChangeSelect = (CallbackFunc) => (option) => {
		if (option === null) {
			CallbackFunc(0);
			changeOption(null);
			return;
		}
		CallbackFunc(option?.mark);
		changeOption(Number(option?.id));
	};
	//#endregion

	//#region Render
	return (
		<>
			<TableCell />
			<TableCell align='center'>
				<Typography>{currentMark.personal_mark_level}</Typography>
			</TableCell>
			<TableCell align='center'>
				<Typography>{currentMark.class_mark_level}</Typography>
			</TableCell>
			<TableCell align='center'>
				{available ? (
					<Controller
						control={control}
						name={`title_${titleId}_${id}.adviser_mark_level`}
						defaultValue={initialMark}
						render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
							<CAutocomplete
								ref={ref}
								disableClearable={required}
								options={options}
								display='mark'
								valueGet='mark'
								value={value}
								onChange={onChangeSelect(onChange)}
								renderOption={(props, option) => (
									<Box component='li' {...props} key={option.id}>
										{option.content} (<b>{option.mark} Điểm</b>)
									</Box>
								)}
								error={!!error}
							/>
						)}
					/>
				) : (
					<Typography>{currentMark.adviser_mark_level}</Typography>
				)}
			</TableCell>
			<TableCell align='center'>
				<Typography>{currentMark.department_mark_level}</Typography>
			</TableCell>
		</>
	);
	//#endregion
};

export default TypeSelect;
