import * as Joi from '@hapi/joi';

/**
 * TODO: Migrate to another library more generic;
 * - has to validate that the response contains next and previous page related keys when using pagination
 */
export module QueryParamValidator {
  export enum AUTHORIZED_KEYS {
    EQUAL = 'eq',
    NOT_EQUAL = 'ne',
    SORT_BY = 'sortBy',
    GREATER_THAN = 'gt',
    GREATER_OR_EQUAL_THAN = 'gte',
    LOWER_THAN = 'lt',
    LOWER_OR_EQUAL_THAN = 'lte',
  }

  export enum AUTHORIZED_TYPES {
    NUMBER = 'number',
    STRING = 'string',
    BOOLEAN = 'boolean',
  }

  const {
    EQUAL,
    NOT_EQUAL,
    SORT_BY,
    GREATER_THAN,
    GREATER_OR_EQUAL_THAN,
    LOWER_THAN,
    LOWER_OR_EQUAL_THAN,
  } = AUTHORIZED_KEYS;

  const generateValidators = (type: AUTHORIZED_TYPES) => ({
    [EQUAL]: Joi[type]().allow(null),
    [NOT_EQUAL]: Joi[type]().allow(null),
    [SORT_BY]: Joi.string().valid('asc', 'desc'),
    [GREATER_THAN]: Joi[type](),
    [GREATER_OR_EQUAL_THAN]: Joi[type](),
    [LOWER_THAN]: Joi[type](),
    [LOWER_OR_EQUAL_THAN]: Joi[type](),
  });

  export const filterValidator = (
    type: AUTHORIZED_TYPES,
    keys?: AUTHORIZED_KEYS[],
  ) => {
    const validators = generateValidators(type);

    if (keys) {
      return Joi.object(
        keys.reduce(
          (accumulator, key) => ({
            ...accumulator,
            [key]: Joi[type](),
          }),
          {},
        ),
      );
    }

    const defaultFilters = Joi.object({
      [EQUAL]: validators[EQUAL],
      [NOT_EQUAL]: validators[NOT_EQUAL],
      [SORT_BY]: validators[SORT_BY],
    });

    const numberFilters = Joi.object({
      [GREATER_THAN]: validators[GREATER_THAN],
      [GREATER_OR_EQUAL_THAN]: validators[GREATER_OR_EQUAL_THAN],
      [LOWER_THAN]: validators[LOWER_THAN],
      [LOWER_OR_EQUAL_THAN]: validators[LOWER_OR_EQUAL_THAN],
    });

    return type === AUTHORIZED_TYPES.NUMBER
      ? defaultFilters.concat(numberFilters)
      : defaultFilters;
  };

  export const paginationValidator = Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .default(1),
    limit: Joi.number()
      .integer()
      .min(1)
      .default(10),
  });
}
