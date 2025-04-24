/**
 * @description CustomError is the error object from the custom error
 * @example
 * {
 *  "error": "Request body data is not following the promised type."
 * }
 */
type CustomError = {
  error: string;
};

/**
 * @description TypiaError is the error object from the Typia library
 * @example
 * {
 *  "path": "$input.title",
 *  "reason": "Error on TypedBody(): invalid type on $input.title, expect to be string & MinLength<5>",
 *  "expected": "string & MinLength<5>",
 *  "value": "",
 *  "message": "Request body data is not following the promised type."
 * }
 */
type TypiaError = {
  path: string;
  reason: string;
  expected: string;
  value: string;
  message: string;
};

/**
 * @description ValidationError is the error object from the validation library
 * @example
 * {
 *  "message": "Request body data is not following the promised type.",
 *  "error": [
 *    {
 *      "path": "$input.title",
 *      "reason": "Error on TypedBody(): invalid type on $input.title, expect to be string & MinLength<5>",
 *      "expected": "string & MinLength<5>",
 *      "value": "",
 *      "message": "Request body data is not following the promised type."
 *    }
 *  ]
 * }
 */

type ValidationError = {
  message: string;
  error: any[];
  reason: number;
};

export type Error = CustomError | TypiaError | ValidationError;
