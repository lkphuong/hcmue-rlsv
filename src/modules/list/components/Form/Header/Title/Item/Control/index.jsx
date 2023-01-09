import { memo, useMemo, useContext, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { DepartmentMarksContext } from '_modules/list/pages/ListDetailPage';

import TypeInput from './TypeInput';
import TypeCheckbox from './TypeCheckbox';
import TypeSelect from './TypeSelect';

const Control = memo(({ data, id, titleId, index, available }) => {
	//#region Data
	const { status, itemsMark } = useContext(DepartmentMarksContext);

	const { resetField } = useFormContext();

	const { from_mark, to_mark, mark, unit, category, options, required } = data;

	const currentMark = useMemo(() => {
		if (!itemsMark?.length)
			return {
				personal_mark_level: 0,
				class_mark_level: 0,
				department_mark_level: 0,
			};

		const foundItem = itemsMark.find((e) => e.item.id?.toString() === id?.toString());

		if (!foundItem)
			return {
				personal_mark_level: 0,
				class_mark_level: 0,
				department_mark_level: 0,
			};

		return {
			personal_mark_level: foundItem.personal_mark_level,
			class_mark_level: foundItem.class_mark_level,
			department_mark_level: foundItem.department_mark_level,
		};
	}, [id, itemsMark]);

	const initialMark = useMemo(() => {
		if (status === 4) {
			return currentMark.personal_mark_level;
		}
		if (status < 4) {
			return currentMark.class_mark_level;
		} else {
			return currentMark.department_mark_level;
		}
	}, [
		currentMark.class_mark_level,
		currentMark.department_mark_level,
		currentMark.personal_mark_level,
		status,
	]);

	const optionId = useMemo(() => {
		return !currentMark?.option_id ? null : Number(currentMark.option_id);
	}, [currentMark?.option_id]);

	useEffect(() => {
		resetField(`title_${titleId}[${index}].department_mark_level`, {
			defaultValue: initialMark,
		});
		resetField(`title_${titleId}[${index}].option_id`, { defaultValue: optionId });
	}, [initialMark, titleId, index, optionId]);

	const renderControl = useMemo(() => {
		return {
			0: (
				<TypeInput
					available={available}
					category={category}
					currentMark={currentMark}
					id={id}
					index={index}
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
					index={index}
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
					index={index}
					initialMark={initialMark}
					item_id={id}
					options={options || []}
					required={required}
					titleId={titleId}
				/>
			),
		};
	}, [data, id, titleId, index, available, currentMark, initialMark]);
	//#endregion

	//#region Event
	//#endregion

	//#region Render
	return <>{renderControl[data.control]}</>;
	//#endregion
});

export default Control;
