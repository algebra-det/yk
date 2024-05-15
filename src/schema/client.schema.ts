import z, { TypeOf } from 'zod'
/*
  name String
  activity String
  cin String
  registration_date String
  roc String
  status String
  autorised_capital Int
  paid_up_capital Int

  state String
  pin_code Int
  country String
  address String
  email String
*/

export const baseBody = {
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required'
      })
      .trim()
      .min(4),
    activity: z.string({
      required_error: 'activity is required'
    }),
    cin: z
      .string({
        required_error: 'cin is required'
      })
      .length(21, 'cin should be 21 characters long'),
    registration_date: z.string({
      required_error: 'registeration is required'
    }),
    roc: z.string({
      required_error: 'registeration is required'
    }),
    status: z.string({
      required_error: 'status is required'
    }),
    authorised_capital: z.number({
      required_error: 'authorized_capital is required'
    }),
    paid_up_capital: z.number({
      required_error: 'paid_up_capital is required'
    }),
    link: z.string({
      required_error: 'link is required'
    }).default(''),
    state: z.string({
      required_error: 'state is required'
    }),
    pin_code: z
      .number({
        required_error: 'pin_code is required'
      })
      .min(100000, 'pin_code should be 6 characters')
      .max(999999, 'pin_code should be 6 characters'),
    country: z.string({
      required_error: 'country is required'
    }),
    address: z.string({
      required_error: 'address is required'
    }),
    email: z.string({
      required_error: 'email is required'
    })
  })
}
export const clientSchema = z.object({
  ...baseBody
})

export const updateSchema = z.object({
  body: baseBody.body.partial(),
  params: z.object({
    id: z
      .string({ required_error: 'id is required' })
      .transform(id => Number(id))
  })
})

export const paramSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'id is required' })
      .transform(id => parseInt(id))
  })
})

export const querySchema = z.object({
  query: z.object({
    q: z.string().optional(),
    query: z.string().optional(),
    limit: z.coerce.number().min(0).max(100).optional(),
    page: z.coerce.number().min(1).optional()
  })
})

export type ClientInput = TypeOf<typeof clientSchema>
export type UpdateInput = TypeOf<typeof updateSchema>
export type ParamInput = TypeOf<typeof paramSchema>
export type QueryInput = TypeOf<typeof querySchema>

export type ClientOutput = ClientInput['body'] & {
  id: number
  createdAt: Date;
  updatedAt: Date;
}
