import { memo, useMemo, useContext } from 'react';

import { MarkContext } from '_others/';

import TypeInput from './TypeInput';
import TypeCheckbox from './TypeCheckbox';
import TypeSelect from './TypeSelect';

const Control = memo(({ data, id }) => {
	//#region Data
	const { marks } = useContext(MarkContext);

	const { from_mark, to_mark, mark, unit, category } = data;

	const currentMark = useMemo(() => {
		if (!marks?.length)
			return {
				personal_mark_level: 0,
				class_mark_level: 0,
				adviser_mark_level: 0,
				department_mark_level: 0,
			};

		const foundItem = marks.find((e) => e.item.id?.toString() === id?.toString());

		if (!foundItem)
			return {
				personal_mark_level: 0,
				class_mark_level: 0,
				adviser_mark_level: 0,
				department_mark_level: 0,
			};

		return {
			personal_mark_level: foundItem.personal_mark_level,
			class_mark_level: foundItem.class_mark_level,
			adviser_mark_level: foundItem.adviser_mark_level,
			department_mark_level: foundItem.department_mark_level,
		};
	}, [id, marks]);

	const renderControl = useMemo(() => {
		return {
			0: (
				<TypeInput
					category={category}
					currentMark={currentMark}
					mark={mark}
					min={from_mark}
					max={to_mark}
					unit={unit}
				/>
			),
			1: <TypeCheckbox currentMark={currentMark} mark={mark} unit={unit} />,
			2: <TypeSelect currentMark={currentMark} />,
		};
	}, [data, currentMark]);

	//#endregion

	//#region Event

	//#endregion

	//#region Render
	return <>{renderControl[data.control]}</>;

	//#endregion
});

export default Control;
