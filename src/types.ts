type Many<T> = T | ReadonlyArray<T>
type PropertyName = string | number | symbol
export type PropertyPath = Many<PropertyName>
