import { useCallback, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';

// Custom resolver for validation react-fook-form by Yup
export const useResolver = (validationSchema) =>
	useCallback(
		async (data) => {
			try {
				const values = await validationSchema.validate(data, {
					abortEarly: false,
				});

				return {
					values,
					errors: {},
				};
			} catch (errors) {
				return {
					values: {},
					errors: errors.inner.reduce(
						(allErrors, currentError) => ({
							...allErrors,
							[currentError.path]: {
								type: currentError.type ?? 'validation',
								message: currentError.message,
							},
						}),
						{}
					),
				};
			}
		},
		[validationSchema]
	);

// Check selectable row by status
export const useCheckStatus = () => {};

// Confirm before reload / navigate
export function useConfirmExit(confirmExit, when = true) {
	const { navigator } = useContext(NavigationContext);

	useEffect(() => {
		if (!when) {
			return;
		}

		const push = navigator.push;

		navigator.push = (...args) => {
			const result = confirmExit();

			if (result !== false) {
				push(...args);
			}
		};

		return () => {
			navigator.push = push;
		};
	}, [navigator, confirmExit, when]);
}

export function usePrompt(message, when = true, actionConfirm) {
	const dispatch = useDispatch();

	useEffect(() => {
		if (when) {
			window.onbeforeunload = function (e) {
				return message;
			};
		}

		return () => {
			window.onbeforeunload = null;
		};
	}, [message, when]);

	const confirmExit = useCallback(() => {
		const confirm = window.confirm(message);

		if (confirm) {
			dispatch(actionConfirm);
		}

		return confirm;
	}, [message]);
	useConfirmExit(confirmExit, when);
}
