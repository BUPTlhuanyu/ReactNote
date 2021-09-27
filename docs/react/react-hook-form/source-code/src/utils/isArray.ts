// is类型判断，在调用这个函数的时候，比如isArray(val)，会告诉typescript这个val就是一个T[]

export default <T = any>(value: unknown): value is T[] => Array.isArray(value);
