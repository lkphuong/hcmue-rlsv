import React, { memo } from 'react';

import { Box, Button, Stack } from '@mui/material';

import { useFieldArray } from 'react-hook-form';

import OptionItem from './OptionItem';
import { useEffect } from 'react';

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

	useEffect(() => {
		if (!fields.length) {
			append({ content: '', mark: 0 });
		}
	}, [fields]);

	//#region Render
	return (
		<Stack>
			<Box my={2}>
				<Button variant='contained' onClick={addOneMoreOption}>
					Thêm một tùy chọn
				</Button>
			</Box>

			<Box maxHeight={350} overflow='auto'>
				{fields.map((item, index) => (
					<OptionItem
						key={item.id}
						control={control}
						index={index}
						remove={() => remove(index)}
					/>
				))}
			</Box>
		</Stack>
	);
	//#endregion
});

export default TypeSelect;
