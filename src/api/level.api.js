import { get } from '_axios/request';

import { LEVELS } from './url';

export const getLevels = () => {
	return get(LEVELS.GET_LEVELS);
};
