import * as Joi from '@hapi/joi';

export module QueryParamValidator {
  export const filterValidator = (type: 'number' | 'string') =>
    Joi.object({
      eq: Joi[type](),
      ne: Joi[type](),
      gt: Joi[type](),
      gte: Joi[type](),
      lt: Joi[type](),
      lte: Joi[type](),
      sortBy: Joi.string().valid('asc', 'desc'),
    });

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
