import { createMongoAbility } from '@casl/ability';

function subjectName(item) {
	if (!item || typeof item === 'string') {
		return item;
	}

	return item.__type;
}

const ability = createMongoAbility([], { subjectName });

export default ability;
