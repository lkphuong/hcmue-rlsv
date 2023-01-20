import { Checkbox, TableCell, Typography } from '@mui/material';

import { Controller, useFormContext } from 'react-hook-form';

const TypeCheckbox = ({ mark, unit, initialMark, currentMark, available, titleId, index }) => {
	//#region Data
	const { control } = useFormContext();
	//#endregion

	//#region Event
	const onChangeCheckbox = (CallbackFunc) => (e) => {
		if (e.target.checked) CallbackFunc(mark);
		else CallbackFunc(0);
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

			<TableCell align='center'>
				<Typography>{currentMark.personal_mark_level} </Typography>
			</TableCell>
			<TableCell align='center'>
				{available ? (
					<Controller
						control={control}
						name={`title_${titleId}[${index}].class_mark_level`}
						defaultValue={initialMark}
						render={({ field: { name, ref, value, onChange } }) => (
							<Checkbox
								name={name}
								ref={ref}
								checked={!!value}
								onChange={onChangeCheckbox(onChange)}
							/>
						)}
					/>
				) : (
					<Typography>{currentMark.class_mark_level} </Typography>
				)}
			</TableCell>
			<TableCell align='center'>
				<Typography>{currentMark.adviser_mark_level}</Typography>
			</TableCell>
			<TableCell align='center'>
				<Typography>{currentMark.department_mark_level}</Typography>
			</TableCell>
		</>
	);
	//#endregion
};

export default TypeCheckbox;
