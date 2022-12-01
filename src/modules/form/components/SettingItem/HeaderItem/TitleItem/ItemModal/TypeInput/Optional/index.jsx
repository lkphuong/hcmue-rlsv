import { createElement, memo, useMemo } from 'react';
import { useWatch } from 'react-hook-form';

import TypeRange from './TypeRange';
import TypeSingle from './TypeSingle';

const typeComponents = [
	{ id: 0, component: TypeSingle },
	{ id: 1, component: TypeRange },
	{ id: 2, component: TypeSingle },
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
	return createElement(OptionComponent, {
		control,
	});

	//#endregion
});

export default Optional;
