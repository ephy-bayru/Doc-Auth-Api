class CustomError extends Error {
  constructor(
    message: string,
    public cause?: any,
    public errorType: string = 'CustomError',
  ) {
    super(message);
    this.name = errorType;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class SerializationError extends CustomError {
  constructor(message: string, cause?: any) {
    super(message, cause, 'SerializationError');
  }
}

class DeserializationError extends CustomError {
  constructor(message: string, cause?: any) {
    super(message, cause, 'DeserializationError');
  }
}

export function serialize<T>(data: T, excludeKeys: string[] = []): string {
  const cache = new Set();
  try {
    return JSON.stringify(data, (key, value) => {
      if (excludeKeys.includes(key)) return undefined;
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) return '[Circular]';
        cache.add(value);
      }
      return value;
    });
  } catch (error) {
    throw new SerializationError('Failed to serialize data', error);
  } finally {
    cache.clear();
  }
}

export function deserialize<T>(jsonStr: string): T | null {
  try {
    return JSON.parse(jsonStr, (key, value) => {
      const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
      if (typeof value === 'string' && datePattern.test(value)) {
        return new Date(value);
      }
      return value;
    }) as T;
  } catch (error) {
    throw new DeserializationError('Failed to deserialize JSON string', error);
  }
}
