import { Box, TableCell, Typography } from '@mui/material';

import { CAutocomplete } from '_controls/';

import { Controller, useController, useFormContext } from 'react-hook-form';

const TypeSelect = ({ initialMark, currentMark, options, required, available, titleId, index }) => {
	//#region Data

	const { control } = useFormContext();

	const {
		field: { onChange: changeOption },
	} = useController({ control, name: `title_${titleId}.${index}.option_id` });
	//#endregion

	//#region Event

	const onChangeSelect = (CallbackFunc) => (option) => {
		CallbackFunc(option?.mark);
		changeOption(Number(option?.id));
	};
	//#endregion

	//#region Render
	return (
		<>
			<TableCell />
			<TableCell align='center'>
				{available ? (
					<Controller
						control={control}
						name={`title_${titleId}.${index}.personal_mark_level`}
						defaultValue={initialMark}
						render={({ field: { value, onChange, ref } }) => (
							<CAutocomplete
								ref={ref}
								disableClearable={required}
								options={options}
								display='mark'
								valueGet='mark'
								value={value}
								onChange={onChangeSelect(onChange)}
								renderOption={(props, option) => (
									<Box component='li' key={option.id} {...props}>
										{option.content} (<b>{option.mark} Điểm</b>)
									</Box>
								)}
							/>
						)}
					/>
				) : (
					<Typography>{currentMark.personal_mark_level || 0}</Typography>
				)}
			</TableCell>
			<TableCell align='center'>
				<Typography>{currentMark.class_mark_level || 0}</Typography>
			</TableCell>
			<TableCell align='center'>
				<Typography>{currentMark.department_mark_level || 0}</Typography>
			</TableCell>
		</>
	);
	//#endregion
};

export default TypeSelect;
