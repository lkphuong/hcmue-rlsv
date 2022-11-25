import React, { memo, useMemo, useContext } from 'react';

import { Grid, Typography } from '@mui/material';

import { StudentMarksContext } from '../../..';

import Control from './Control';

const Item = memo(({ data }) => {
	//#region Data
	const { itemsMark } = useContext(StudentMarksContext);

	const currentMark = useMemo(() => {
		if (!itemsMark?.length)
			return {
				personal_mark_level: 0,
				class_mark_level: 0,
				department_mark_level: 0,
			};

		const foundItem = itemsMark.find((e) => e.item.id?.toString() === data.id?.toString());

		if (!foundItem)
			return {
				personal_mark_level: 0,
				class_mark_level: 0,
				department_mark_level: 0,
			};

		return {
			personal_mark_level: foundItem.personal_mark_level,
			class_mark_level: foundItem.class_mark_level,
			department_mark_level: foundItem.department_mark_level,
		};
	}, [data?.id, itemsMark]);

	const initialMark = useMemo(() => {
		return currentMark.personal_mark_level;
	}, [currentMark.personal_mark_level]);
	//#endregion

	//#region Event

	//#endregion

	//#region Render
	return (
		<>
			<Grid item xs={6.4}>
				<Typography>- {data.content}</Typography>
			</Grid>

			<Grid item xs={2} textAlign='center'>
				{!data.category ? (
					<Typography component='span' whiteSpace='nowrap' fontWeight={500}>
						&nbsp;&#40;{`${data.from_mark}${data?.unit ? ` ${data.unit}` : ''}`}
						&#41;&nbsp;
					</Typography>
				) : (
					<Typography component='span' whiteSpace='nowrap' fontWeight={500}>
						&nbsp;&#40;
						{`Từ ${data.from_mark} đến ${data.to_mark} ${data.unit ? data.unit : ''}`}
						&#41;&nbsp;
					</Typography>
				)}
			</Grid>

			<Control
				id={data.id}
				min={data.from_mark}
				max={data.to_mark}
				control={data.control}
				initialMark={initialMark}
				currentMark={currentMark}
			/>
		</>
	);
	//#endregion
});

Item.displayName = Item;

export default Item;
