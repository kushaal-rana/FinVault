export const BUCKET_KEYS = [
  'passive_income',
  'must',
  'desire',
  'self_pampering',
  'personal_growth',
  'make_a_difference',
  'buffer',
] as const

export type BucketKey = (typeof BUCKET_KEYS)[number]

export interface BucketConfig {
  key: BucketKey
  label: string
  shortLabel: string
  color: string
  bgColor: string
  lightBg: string
  borderColor: string
  textColor: string
  description: string
  icon: string
}

export interface BucketSummary {
  bucket: BucketKey
  allocated: number
  spent: number
  remaining: number
  percentUsed: number
}
