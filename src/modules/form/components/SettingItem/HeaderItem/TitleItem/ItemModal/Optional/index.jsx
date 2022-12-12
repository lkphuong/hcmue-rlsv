import { createElement, memo, useMemo } from 'react';
import { useWatch } from 'react-hook-form';

import TypeCheckbox from '../TypeCheckbox';
import TypeInput from '../TypeInput';
import TypeSelect from '../TypeSelect';

const typeComponents = [
	{ id: 0, component: TypeInput },
	{ id: 1, component: TypeCheckbox },
	{ id: 2, component: TypeSelect },
];

const Optional = memo(({ control, name }) => {
	//#region Data
	const currentValue = useWatch({ control, name });

	const OptionComponent = useMemo(() => {
		return typeComponents[currentValue].component;
	}, [currentValue]);
	//#endregion

	//#region Event
	//#endregion

	//#region Render
	return createElement(OptionComponent, { control });

	//#endregion
});

export default Optional;
