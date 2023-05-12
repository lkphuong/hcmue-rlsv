import { get } from '_axios/request';

import { TIMELINE } from './url';

export const getCurrentTimeline = () => {
	return get(TIMELINE.GET);
};
