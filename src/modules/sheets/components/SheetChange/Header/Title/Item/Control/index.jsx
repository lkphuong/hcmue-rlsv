import { memo, useContext, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import TypeInput from './TypeInput';
import TypeCheckbox from './TypeCheckbox';
import TypeSelect from './TypeSelect';

import { NewContext } from '_modules/sheets/pages/ChangeDetailPage';

const Control = memo(({ data, id, titleId }) => {
	//#region Data
	const { itemsMark, status } = useContext(NewContext);

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
		if (status < 4) {
			return currentMark.adviser_mark_level;
		} else {
			return currentMark.department_mark_level;
		}
	}, [currentMark.adviser_mark_level, currentMark.department_mark_level, status]);

	const optionId = useMemo(() => {
		return !currentMark?.option_id ? null : Number(currentMark.option_id);
	}, [currentMark?.option_id]);

	useEffect(() => {
		resetField(`title_${titleId}_${id}.department_mark_level`, {
			defaultValue: initialMark,
		});
		resetField(`title_${titleId}_${id}.option_id`, { defaultValue: optionId });
	}, [initialMark, titleId, optionId]);

	const renderControl = useMemo(() => {
		return {
			0: (
				<TypeInput
					category={category}
					currentMark={currentMark}
					id={id}
					initialMark={initialMark}
					mark={mark}
					max={to_mark}
					min={from_mark}
					titleId={titleId}
					unit={unit}
				/>
			),
			1: (
				<TypeCheckbox
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
					currentMark={currentMark}
					id={id}
					initialMark={initialMark}
					options={options || []}
					required={required}
					titleId={titleId}
				/>
			),
		};
	}, [data, id, titleId, currentMark, initialMark]);
	//#endregion

	//#region Event

	//#endregion

	//#region Render
	return <>{renderControl[data.control]}</>;
	//#endregion
});

export default Control;
