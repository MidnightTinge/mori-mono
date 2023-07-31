// Return the data type of a Sequelize model. If the parent type is not a model, then we simply proxy it back out.
type UnwrapModel<T extends import('sequelize').Model<any, any>> = T extends import('sequelize').Model<infer Y, any> ? Y : T;

// Return the data type of an array. If the parent type is not an array, then we simply proxy it back out.
type UnwrapArray<T extends any[]> = T extends Array<infer Y> ? Y : T;
