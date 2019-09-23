import * as Joi from '@hapi/joi';

/**
 * TODO: Migrate to another library more generic;
 * - has to validate that the response contains next and previous page related keys when using pagination
 */
export module QueryParamValidator {
  export const filterValidator = (type: 'number' | 'string' | 'boolean') => {
    const defaultFilters = Joi.object({
      eq: Joi[type](),
      ne: Joi[type](),
      sortBy: Joi.string().valid('asc', 'desc'),
    });

    return type === 'number'
      ? defaultFilters.concat(
          Joi.object({
            gt: Joi[type](),
            gte: Joi[type](),
            lt: Joi[type](),
            lte: Joi[type](),
          }),
        )
      : defaultFilters;
  };

  export const paginationValidator = Joi.object({
    page: Joi.number()
      .integer()
      .min(0)
      .default(1),
    limit: Joi.number()
      .integer()
      .min(1)
      .default(10),
  });
}
