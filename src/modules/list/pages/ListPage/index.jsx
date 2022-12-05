/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';

import { shallowEqual, useSelector } from 'react-redux';

import { Box } from '@mui/material';

import { FilterClass, ListClasses } from '_modules/list/components';

import { isSuccess, isEmpty } from '_func/';

import { getDepartmentSheets } from '_api/sheets.api';

const ListPage = () => {
	//#region Data
	const { department_id } = useSelector((state) => state.auth.profile, shallowEqual);

	const [classes, setClasses] = useState([]);

	const [body, setBody] = useState(null);
	//#endregion

	//#region Event
	const getData = useCallback(async () => {
		if (!department_id) return;

		const res = await getDepartmentSheets(department_id, body);

		if (isSuccess(res)) setClasses(res.data);
		else if (isEmpty(res)) setClasses([]);
	}, [body, department_id]);
	//#endregion

	useEffect(() => {
		getData();
	}, [getData]);

	//#region Render
	return (
		<Box>
			<FilterClass filter={body} onChangeFilter={setBody} classes={classes} />

			{classes?.length > 0 && <ListClasses data={classes} />}
		</Box>
	);
	//#endregion
};

export default ListPage;
