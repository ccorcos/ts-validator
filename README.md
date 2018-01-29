# Typescript Validator

> A type-safe runtime validator for parsing unsafe data.

This library provides type-checked validator functions that help you take unsafe data (e.g. data from an API request) and validate it against your Typescript interfaces.

When used correctly, Typescript will throw and error if your validator function does not match the type that you are trying to validate.

## Getting Started

Install from npm:

```sh
npm install --save typescript-validator
```

Given a type interface:

```ts
interface User {
	id: number,
	name?: string,
	email: string,
	workspaces: Array<string>
}
```

You can create a runtime validator function like this:

```ts
import * as validate from "typescript-validator"

const validator = validate.object<User>({
	id: validate.number(),
	name?: validate.optional(validate.string()),
	email: validate.string(),
	workspaces: validate.array(validate.string())
})

const valid = validator({id: 1, email: "hello", workspaces: []})
// true
```

The nice thing about this abstraction is that the type-checker will ensure that you've validated all fields of the type interface with the correct validator.

For example, here are some errors the type checker will help you with:

```ts
const validator = validate.object<User>({
	id: validate.number(),
	// name: validate.optional(validate.string()),  <-- "Property 'name' is missing in type"
	email: validate.string(),
	workspaces: validate.array(validate.string())
})

const validator = validate.object<User>({
	id: validate.number(),
	name: validate.optional(validate.string()),
	email: validate.number(), //  <-- Type 'string' is not assignable to type 'number'.
	workspaces: validate.array(validate.string())
})
```

You can easily create your own validators as well -- its just a function that returns a boolean. As you can see, we haven't verified that the email string is actually an email or the number of workspaces is not empty. We can easily write these functions ourselves.

```ts
const validator = validate.object<User>({
	id: validate.number(),
	name?: validate.optional(validate.string()),
	email: (email: string) => {
		return validate.string()(email) && /[^@]+@[^\.]+\.[a-zA-Z]+/.test(value),
	workspaces: (value: Array<string>) => {
		return validate.array((validate.string()))(value) && value.length > 0
	}
})
```

Happy hacking 🍉