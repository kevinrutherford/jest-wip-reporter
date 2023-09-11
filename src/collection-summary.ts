import { Reporters } from './reporters'

export type CollectionSummary = {
  passedCount: number,
  failedCount: number,
  wipTitles: Array<string>,
}

export const create = (): CollectionSummary => ({
  passedCount: 0,
  wipTitles: [],
  failedCount: 0,
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const register = (host: Reporters): void => {
}
