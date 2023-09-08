import {Validators} from '@/hooks/useForm';

export interface FormValue {
	value: string;
	validators?: ValidatorFn[] | ValidatorFn<string>[];
}

export type ValueValidatorFn<T> = (value: T) => ValidatorFn;

export type ValidatorFn<T = string | number | boolean> = (val: T) => boolean;

export interface IValidators {
	isRequired: ValidatorFn;
	isMinLength: ValueValidatorFn<number>;
	isMaxLength: ValueValidatorFn<number>;
	isEmail: ValidatorFn<string>;
}

export type FormObject<T extends keyof any> = Record<T, FormValue | string>;

export type Values<T> = Record<keyof T, string>;
export type Errors<T> = Record<keyof T, string | null | undefined | boolean>;
