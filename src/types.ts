type Many<T> = T | Array<T>
type PropertyName = string | number | Symbol
export type PropertyPath = Many<PropertyName>
