/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';

import { shallowEqual, useSelector } from 'react-redux';

import { Box } from '@mui/material';

import { Filter, ListClasses } from '_modules/list/components';

import { isSuccess } from '_func/';

import { getDepartmentSheets } from '_api/sheets.api';

const ListPage = () => {
	//#region Data
	const semesters = useSelector((state) => state.options.semesters, shallowEqual);
	const academic_years = useSelector((state) => state.options.academic_years, shallowEqual);

	const [classes, setClasses] = useState([]);

	const [body, setBody] = useState({
		semester_id: semesters[0]?.id,
		academic_id: academic_years[0]?.id,
	});

	const { department_id } = useSelector((state) => state.auth.profile, shallowEqual);
	//#endregion

	//#region Event
	const getData = useCallback(async () => {
		if (!department_id) return;
		try {
			const res = await getDepartmentSheets(department_id, body);

			if (isSuccess(res)) setClasses(res.data);
		} catch (error) {
			throw error;
		}
	}, [body, department_id, semesters, academic_years]);
	//#endregion

	useEffect(() => {
		getData();
	}, [getData]);

	//#region Render
	return (
		<Box>
			<Box mt={1}>
				<Filter
					filter={body}
					onChangeFilter={setBody}
					semesters={semesters}
					academic_years={academic_years}
				/>

				<ListClasses data={classes} />
			</Box>
		</Box>
	);
	//#endregion
};

export default ListPage;
