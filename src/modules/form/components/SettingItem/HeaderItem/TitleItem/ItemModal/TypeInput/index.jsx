import { memo } from 'react';

import { Grid, Typography } from '@mui/material';
import { Controller, useController } from 'react-hook-form';

import { CInput, CSelect } from '_controls/';

import { CATEGORY } from '_constants/variables';
import Optional from './Optional';

const TypeInput = memo(({ control }) => {
	//#region Data
	const {
		field: { onChange: onChangeFromMark },
	} = useController({ control, name: 'from_mark', rules: { required: true } });

	const {
		field: { onChange: onChangeToMark },
	} = useController({ control, name: 'to_mark', rules: { required: true } });

	const {
		field: { onChange: onChangeMark },
	} = useController({ control, name: 'mark', rules: { required: true } });
	//#endregion

	//#region Event
	const handleChangeCategory = (CallbackFunc) => (event) => {
		CallbackFunc(Number(event.target.value));
		if (event.target.value !== 1) {
			onChangeFromMark(0);
			onChangeToMark(0);
		} else {
			onChangeToMark(1);
			onChangeMark(0);
		}
	};
	//#endregion

	//#region Render

	return (
		<>
			<Grid item xs={12} md={4}>
				<Typography>Loại điểm</Typography>
			</Grid>
			<Grid item xs={12} md={8}>
				<Controller
					control={control}
					name='category'
					render={({ field: { name, onChange, value } }) => (
						<CSelect
							value={value}
							options={CATEGORY}
							onChange={handleChangeCategory(onChange)}
							name={name}
							fullWidth
						/>
					)}
				/>
			</Grid>

			<Optional control={control} name='category' />

			<Grid item xs={12} md={4}>
				<Typography>Đơn vị</Typography>
			</Grid>
			<Grid item xs={12} md={8}>
				<Controller
					control={control}
					name='unit'
					render={({
						field: { name, onBlur, onChange, ref, value },
						fieldState: { error },
					}) => (
						<CInput
							value={value}
							inputRef={ref}
							onChange={onChange}
							onBlur={onBlur}
							name={name}
							fullWidth
							error={!!error}
							helperText={error?.message}
						/>
					)}
				/>
			</Grid>
		</>
	);
	//#endregion
});

export default TypeInput;
