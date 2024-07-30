import { useState } from 'react';

import { Box, Paper, Tab, Tabs } from '@mui/material';

import { TabAcademic, TabSemester } from '_modules/config/components';

const TABS = [
	{ id: 1, value: 1, label: 'Học kỳ' },
	{ id: 2, value: 2, label: 'Năm học' },
];

const ConfigPage = () => {
	//#region Data
	const [tabIndex, setTabIndex] = useState(TABS[0].value);
	//#endregion

	//#region Event
	const onTabChange = (event, value) => setTabIndex(value);
	//#endregion

	//#region Render
	return (
		<Box>
			<Paper className='paper-wrapper'>
				<Box p={1.5}>
					<Tabs value={tabIndex} onChange={onTabChange}>
						{TABS.map((tab) => (
							<Tab key={tab.id} value={tab.value} label={tab.label} />
						))}
					</Tabs>
				</Box>
			</Paper>

			<Box mt={1}>
				<Paper className='paper-wrapper'>
					<Box p={1.5}>{tabIndex === 1 ? <TabSemester /> : <TabAcademic />}</Box>
				</Paper>
			</Box>
		</Box>
	);

	//#endregion
};

export default ConfigPage;
