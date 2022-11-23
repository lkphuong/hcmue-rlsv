/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';

import { shallowEqual, useSelector } from 'react-redux';

import { Box } from '@mui/material';

import { ListClasses } from '_modules/list/components';

import { isSuccess } from '_func/';

import { getDepartmentSheets } from '_api/sheets.api';

const ListPage = () => {
	//#region Data
	const [classes, setClasses] = useState([]);

	const { department_id } = useSelector((state) => state.auth.profile, shallowEqual);
	const semesters = useSelector((state) => state.options.semesters, shallowEqual);
	const academic_years = useSelector((state) => state.options.academic_years, shallowEqual);
	//#endregion

	//#region Event
	const getData = useCallback(async () => {
		if (!department_id) return;
		try {
			const body = {
				semester_id: semesters[0]?.id,
				academic_id: academic_years[0]?.id,
			};

			const res = await getDepartmentSheets(department_id, body);

			if (isSuccess(res)) setClasses(res.data);
		} catch (error) {
			throw error;
		}
	}, [department_id, semesters, academic_years]);
	//#endregion

	useEffect(() => {
		getData();
	}, [getData]);

	//#region Render
	return (
		<Box>
			<Box mt={1}>
				<div>filter</div>

				<ListClasses data={classes} />
			</Box>
		</Box>
	);
	//#endregion
};

export default ListPage;
