import React, { memo } from 'react';

import { Box, Button, Stack } from '@mui/material';

import { useFieldArray } from 'react-hook-form';

import OptionItem from './OptionItem';

const TypeSelect = memo(({ control }) => {
	//#region Data
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'options',
	});
	//#endregion

	//#region Event
	const addOneMoreOption = () => append({ content: '', mark: 0 });
	//#endregion

	//#region Render
	return (
		<Stack>
			<Box my={2}>
				<Button variant='contained' onClick={addOneMoreOption}>
					Thêm một tùy chọn
				</Button>
			</Box>

			{fields.map((item, index) => (
				<OptionItem
					key={item.id}
					control={control}
					index={index}
					remove={() => remove(index)}
				/>
			))}
		</Stack>
	);
	//#endregion
});

export default TypeSelect;
