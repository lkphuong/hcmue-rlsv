import { AbilityBuilder } from '@casl/ability';

import ability from '_config/casl_ability';
import { ENTITY_KEY, FUNCTION_KEY } from '_config/permissions';

export const updateAbility = (roleId) => {
	const { can, rules } = new AbilityBuilder();

	const perUpdate = {};

	const entityKeys = Object.keys(ENTITY_KEY);

	entityKeys.forEach((key) => (perUpdate[key] = []));

	entityKeys.forEach((key) => {
		if (ENTITY_KEY[key].roles.includes(roleId)) {
			perUpdate[key].push(FUNCTION_KEY.READ);
		}
	});

	entityKeys.forEach((key) => {
		can(perUpdate[key], key);
	});

	ability.update(rules);
};
