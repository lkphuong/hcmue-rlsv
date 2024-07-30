import { createContextualCan } from '@casl/react';

import { AbilityContext } from '_contexts/ability.context';

export const CPermission = createContextualCan(AbilityContext.Consumer);
