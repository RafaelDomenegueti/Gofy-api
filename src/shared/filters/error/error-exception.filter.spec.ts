import { ErrorExceptionFilter } from './error-exception.filter';
import { expect, describe, it } from '@jest/globals';

describe('ErrorExceptionFilter', () => {
  it('should be defined', () => {
    expect(new ErrorExceptionFilter()).toBeDefined();
  });
});
