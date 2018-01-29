import * as validate from "../src/index"
import test from "ava"

interface Everything {
	a: number
	b: string
	c: Array<number>
	d: string | number
	e: {
		a: number
		b: { a: number; b: string }
	}
	f: Array<{ a: number; b: Array<string> }>
	g?: number
}

const validator = validate.object<Everything>({
	a: validate.number(),
	b: validate.string(),
	c: validate.array(validate.number()),
	d: validate.or(validate.string(), validate.number()),
	e: validate.object({
		a: validate.number(),
		b: validate.object({
			a: validate.number(),
			b: validate.string(),
		}),
	}),
	f: validate.array(
		validate.object({
			a: validate.number(),
			b: validate.array(validate.string()),
		})
	),
	g: validate.optional(validate.number()),
})

test(async t => {
	t.is(validator({} as any), false)
	t.is(
		validator({
			a: 1,
			b: "1",
			c: [1],
			d: 1,
			e: {
				a: 1,
				b: {
					a: 1,
					b: "1",
				},
			},
			f: [{ a: 1, b: ["1"] }],
			g: 1,
		} as any),
		true
	)
	t.is(
		validator({
			a: 1,
			b: "1",
			c: [1],
			d: 1,
			e: {
				a: 1,
				b: {
					a: 1,
					b: "1",
				},
			},
			f: [{ a: 1, b: ["1"] }],
		} as any),
		true
	)
	t.is(
		validator({
			a: 1,
			c: [1],
			d: 1,
			e: {
				a: 1,
				b: {
					a: 1,
					b: "1",
				},
			},
			f: [{ a: 1, b: ["1"] }],
		} as any),
		false
	)
})
