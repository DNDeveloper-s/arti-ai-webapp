import {ContactFormFieldKey, ContactFormObject} from '@/constants/contactData';
import {useCallback, useMemo, useState} from 'react';
import {Errors, FormObject, FormValue, IValidators, ValidatorFn, ValueValidatorFn} from '@/interfaces/Iform';
import {Values} from '@/interfaces/Iform';
import {emailRegExp} from '@/constants';

function isRequired(val: string | number | boolean) {
	if(typeof val === 'string') return val.trim().length > 0;
	return val !== undefined && val !== null;
}

export const Validators: IValidators = {
	isRequired(val: string | number | boolean): boolean {
		if(typeof val === 'string') return val.trim().length > 0;
		return val !== undefined && val !== null;
	},
	isMinLength(val: number): ValidatorFn {
		return ((value: string) => {
			return value.trim().length >= val;
		}) as ValidatorFn
	},
	isMaxLength(val: number): ValidatorFn {
		return ((value: string) => {
			return value.trim().length <= val;
		}) as ValidatorFn
	},
	isEmail(value: string): boolean {
		return emailRegExp.test(value);
	}
}

export default function useForm<T extends FormObject<keyof T>>(initialState: T) {
	const [formValues, setFormValues] = useState<T>(initialState);

	const values: Values<T> = useMemo(() => {
		const keys = Object.keys(formValues);
		return keys.reduce<Values<T>>((acc, _key)  => {
			const key = _key as keyof T;
			if(!formValues[key]) return acc;
			if(typeof formValues[key] === 'string') acc[key] = formValues[key];
			else acc[key] = (formValues[key] as FormValue).value;
			return acc;
		}, {} as Values<T>);
	}, [formValues]);


	const errors: Errors<T> = useMemo(() => {
		const keys = Object.keys(formValues);

		function validate(formValue: FormValue): boolean {
			if(!formValue.validators) return true;
			let isValid = true;
			for (let i = 0; i < formValue.validators.length; i++) {
				const validator = formValue.validators[i];
				const isCurValueValid = validator(formValue.value);
				if(!isCurValueValid) {
					isValid = false;
					break;
				}
			}
			return isValid;
		}

		return keys.reduce<Errors<T>>((acc, _key)  => {
			const key = _key as keyof T;
			if(!formValues[key]) return acc;
			if(typeof formValues[key] === 'string') acc[key] = undefined;
			else {
				// Check validation here
				const formValue = formValues[key] as FormValue;
				const isValid = validate(formValue);
				if(!isValid) acc[key] = 'This field is required';
				else delete acc[key]
			}
			return acc;
		}, {} as Errors<T>);
	}, [formValues])

	function reset() {
		const keys = Object.keys(initialState);
		const _formValues = keys.reduce<T>((acc, _key)  => {
			const key = _key as keyof T;
			acc[key] = initialState[key]
			return acc;
		}, {} as T);

		setFormValues(_formValues);
	}

	const onChange = (key: keyof T, value: string) => {
		setFormValues(cur => {
			let val: string | FormValue = value;
			const currentKey = cur[key];
			if(typeof currentKey !== 'string') val = {...currentKey, value};
			return ({...cur, [key]: val})
		});
	}

	return {values, onChange, errors, reset}
}
