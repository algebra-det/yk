export type KeyValue = Record<
  number,
  { name: string; type: 'date' | 'number' | 'string' }
>
export const basicIndexToKey: KeyValue = {
  0: { name: 'name', type: 'string' },
  1: { name: 'activity', type: 'string' },
  2: { name: 'cin', type: 'string' },
  3: { name: 'registration_date', type: 'date' }
  // 4: 'category',
  // 5: 'sub_category',
  // 6: 'class',
}

export const statusIndexToKey: KeyValue = {
  0: { name: 'roc', type: 'string' },
  1: { name: 'status', type: 'string' }
}

export const financialIndexToKey: KeyValue = {
  0: { name: 'authorised_capital', type: 'number' },
  1: { name: 'paid_up_capital', type: 'number' }
}

export const contactIndexToKey: KeyValue = {
  0: { name: 'state', type: 'string' },
  1: { name: 'pin_code', type: 'number' },
  2: { name: 'country', type: 'string' },
  3: { name: 'address', type: 'string' },
  4: { name: 'email', type: 'string' }
}
