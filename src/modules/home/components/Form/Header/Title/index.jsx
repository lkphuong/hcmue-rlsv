import React, { memo, useCallback, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { TableCell, TableRow, Typography } from '@mui/material';

import { isSuccess } from '_func/';

import { getItemsByTitleId } from '_api/form.api';

import Item from './Item';
import { Controller } from 'react-hook-form';

const Title = memo(({ data, headerId }) => {
	//#region Data
	const [items, setItems] = useState([]);

	const navigate = useNavigate();
	//#endregion

	//#region Event
	const getItems = useCallback(async () => {
		if (!data?.id) return navigate(-1);

		try {
			const res = await getItemsByTitleId(data.id);

			if (isSuccess(res)) setItems(res.data);
		} catch (error) {
			throw error;
		}
	}, [data?.id, navigate]);
	//#endregion

	useEffect(() => {
		getItems();
	}, [getItems]);

	//#region Render
	return (
		<>
			<TableRow>
				<TableCell />
				<TableCell colSpan='100%'>
					<Typography fontWeight={500} fontSize={17}>
						{data?.name}
					</Typography>
				</TableCell>
			</TableRow>

			{items.length > 0 &&
				items.map((e, i) => (
					<React.Fragment key={i}>
						<Controller
							name={`title_${data.id}.${i}.header_id`}
							defaultValue={headerId}
							render={({ field }) => <input type='hidden' {...field} />}
						/>

						<Item key={i} data={e} headerId={headerId} titleId={data.id} index={i} />
					</React.Fragment>
				))}
		</>
	);
	//#endregion
});

Title.displayName = Title;

export default Title;
