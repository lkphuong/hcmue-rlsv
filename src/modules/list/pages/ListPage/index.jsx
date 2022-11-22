/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';

import { shallowEqual, useSelector } from 'react-redux';

import { Box } from '@mui/material';

import { ListClasses } from '_modules/list/components';

import { isSuccess } from '_func/';

import { getClasses } from '_api/classes.api';

const CLASSES = [
	{ id: 1, name: 'CNTT.A' },
	{ id: 2, name: 'CNTT.B' },
	{ id: 3, name: 'CNTT.C' },
];

const ListPage = () => {
	//#region Data
	const [classes, setClasses] = useState([]);

	const { department_id } = useSelector((state) => state.auth.profile, shallowEqual);
	const academic_years = useSelector((state) => state.options.academic_years, shallowEqual);
	//#endregion

	//#region Event
	const getData = useCallback(async () => {
		if (!department_id) return;
		try {
			const body = {
				department_id,
				academic_year_id: academic_years[0]?.id,
			};

			const res = await getClasses(department_id, body);

			if (isSuccess(res)) setClasses(res.data);
		} catch (error) {
			throw error;
		}
	}, [department_id, academic_years]);
	//#endregion

	useEffect(() => {
		getData();
	}, [getData]);

	//#region Render
	return (
		<Box>
			<Box mt={1}>
				<div>filter</div>

				<ListClasses data={CLASSES} />
			</Box>
		</Box>
	);
	//#endregion
};

export default ListPage;
