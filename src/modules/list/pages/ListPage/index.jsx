import { useEffect, useState } from 'react';

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
	const getData = async () => {
		const res = await getDepartmentSheets(department_id, body);

		if (isSuccess(res)) setClasses(res.data);
		else if (isEmpty(res)) setClasses([]);
	};
	//#endregion

	useEffect(() => {
		if (department_id) getData();
	}, [body, department_id]);

	//#region Render
	return (
		<Box>
			<FilterClass filter={body} onFilterChange={setBody} classes={classes} />

			{classes?.length > 0 && <ListClasses data={classes} />}
		</Box>
	);
	//#endregion
};

export default ListPage;
