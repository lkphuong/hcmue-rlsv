import { memo, useContext, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { AdviserMarksContext } from '_modules/advisers/pages/AdviserDetailPage';

import TypeInput from './TypeInput';
import TypeCheckbox from './TypeCheckbox';
import TypeSelect from './TypeSelect';

const Control = memo(({ data, id, titleId, available }) => {
	//#region Data
	const { itemsMark, status } = useContext(AdviserMarksContext);

	const { resetField } = useFormContext();

	const { from_mark, to_mark, mark, unit, category, options, required } = data;

	const currentMark = useMemo(() => {
		if (!itemsMark?.length)
			return {
				personal_mark_level: 0,
				class_mark_level: 0,
				adviser_mark_level: 0,
				department_mark_level: 0,
			};

		const foundItem = itemsMark.find((e) => e.item.id?.toString() === id?.toString());

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
			option_id: foundItem?.options?.id || null,
		};
	}, [id, itemsMark]);

	const initialMark = useMemo(() => {
		if (status < 3) {
			return currentMark.class_mark_level;
		} else {
			return currentMark.adviser_mark_level;
		}
	}, [currentMark.class_mark_level, currentMark.adviser_mark_level, status]);

	const optionId = useMemo(() => {
		return !currentMark?.option_id ? null : Number(currentMark.option_id);
	}, [currentMark?.option_id]);

	useEffect(() => {
		resetField(`title_${titleId}_${id}.adviser_mark_level`, { defaultValue: initialMark });
		resetField(`title_${titleId}_${id}.option_id`, { defaultValue: optionId });
	}, [initialMark, titleId, optionId]);

	const renderControl = useMemo(() => {
		return {
			0: (
				<TypeInput
					available={available}
					category={category}
					currentMark={currentMark}
					id={id}
					initialMark={initialMark}
					mark={mark}
					min={from_mark}
					max={to_mark}
					titleId={titleId}
					unit={unit}
				/>
			),
			1: (
				<TypeCheckbox
					available={available}
					currentMark={currentMark}
					id={id}
					initialMark={initialMark}
					mark={mark}
					titleId={titleId}
					unit={unit}
				/>
			),
			2: (
				<TypeSelect
					available={available}
					currentMark={currentMark}
					initialMark={initialMark}
					id={id}
					options={options || []}
					required={required}
					titleId={titleId}
				/>
			),
		};
	}, [data, id, titleId, available, currentMark, initialMark]);
	//#endregion

	//#region Event

	//#endregion

	//#region Render
	return <>{renderControl[data.control]}</>;
	//#endregion
});

export default Control;
