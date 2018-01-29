/* ================================================================================

	Validator.

================================================================================ */

import * as isString from "lodash.isstring"
import * as isPlainObject from "lodash.isplainobject"
import * as isNumber from "lodash.isnumber"
import * as isBoolean from "lodash.isboolean"
import * as isArray from "lodash.isarray"

export type Purify<T extends string> = { [P in T]: T }[T]

export type Validator<T> = (value: T) => boolean

export type ObjectSchema<T extends object> = {
	[key in Purify<keyof T>]: Validator<T[key]>
}

export function object<T extends object>(
	schema: ObjectSchema<T>
): Validator<T> {
	return function(value: T) {
		if (!isPlainObject(value)) {
			return false
		}
		for (const key in schema) {
			if (!schema[key](value[key])) {
				return false
			}
		}
		return true
	}
}

export function objectMapOf<T>(
	fn: Validator<T>
): Validator<{ [key: string]: T }> {
	return function(value: { [key: string]: T }) {
		if (!isPlainObject(value)) {
			return false
		}
		for (const key in value) {
			if (!fn(value[key])) {
				return false
			}
		}
		return true
	}
}

export function string(): Validator<string> {
	return function(value: string) {
		return isString(value)
	}
}

export function number(): Validator<number> {
	return function(value: number) {
		return isNumber(value)
	}
}

export function gt(n: number): Validator<number> {
	return function(value: number) {
		return isNumber(value) && value > n
	}
}

export function gte(n: number): Validator<number> {
	return function(value: number) {
		return isNumber(value) && value >= n
	}
}

export function lt(n: number): Validator<number> {
	return function(value: number) {
		return isNumber(value) && value < n
	}
}

export function lte(n: number): Validator<number> {
	return function(value: number) {
		return isNumber(value) && value <= n
	}
}

export function optional<T>(fn: Validator<T & {}>): Validator<T | undefined> {
	return function(value: T | undefined) {
		if (value === undefined) {
			return true
		} else {
			return fn(value)
		}
	}
}

export function maxLen(len: number): Validator<Array<any>> {
	return function(value: Array<any>) {
		if (!isArray(value)) {
			return false
		}
		if (value.length > len) {
			return false
		}
		return true
	}
}

export function array<T>(fn: Validator<T>): Validator<Array<T>> {
	return function(value: Array<T>) {
		if (!isArray(value)) {
			return false
		}
		for (const item of value) {
			if (!fn(item)) {
				return false
			}
		}
		return true
	}
}

export function boolean(): Validator<boolean> {
	return function(value: boolean) {
		return isBoolean(value)
	}
}

export function any(): Validator<any> {
	return function(value: any) {
		return true
	}
}

export function equal<T>(option: T): Validator<T> {
	return function(value: T) {
		return value === option
	}
}

export function some<T>(...options: Array<T>): Validator<T> {
	return function(value: T) {
		return options.some(option => value === option)
	}
}

export function every<T>(...options: Array<T>): Validator<T> {
	return function(value: T) {
		return options.every(option => value === option)
	}
}

export function or<X, Y>(x: Validator<X>, y: Validator<Y>): Validator<X | Y> {
	return function(value: X | Y) {
		return x(value as X) || y(value as Y)
	}
}

export function and<X>(x: Validator<X>, y: Validator<X>): Validator<X> {
	return function(value: X) {
		return x(value) && y(value)
	}
}
