import { useEffect, useState } from 'react';

import dayjs from 'dayjs';

import { Alert } from '@mui/material';

import { getCurrentTimeline } from '_api/timeline.api';

import { isSuccess } from '_func/';

export const CTimeline = () => {
	//#region Data
	const [timeline, setTimeline] = useState({ show: false, start: null, end: null });
	//#endregion

	//#region Event
	const getTimeline = async () => {
		const res = await getCurrentTimeline();
		if (isSuccess(res)) setTimeline({ show: true, ...res?.data });
	};
	//#endregion

	useEffect(() => {
		getTimeline();
	}, []);

	//#region Render
	return (
		timeline.show && (
			<Alert
				severity='info'
				// onClose={() => setTimeline((prev) => ({ ...prev, show: false }))}
				sx={{ fontSize: '14px', py: 0, mb: 1 }}
			>
				Thời gian chấm điểm rèn luyện —&nbsp;
				<strong>{`Từ ngày ${dayjs(timeline.start).format('DD/MM/YYYY')} - đến ngày ${dayjs(
					timeline.end
				).format('DD/MM/YYYY')}`}</strong>
			</Alert>
		)
	);
	//#endregion
};
