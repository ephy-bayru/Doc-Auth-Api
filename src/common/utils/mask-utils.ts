/**
 * Utility to mask sensitive information in data objects.
 */

// Extend sensitive keys to include tokens and other sensitive information
const sensitiveKeys = new Set([
  'password',
  'token',
  'creditCard',
  'ssn',
  'phoneNumber',
]);

/**
 * Masks a value if deemed sensitive, leaving other values untouched.
 * @param value The value to potentially mask.
 * @returns The masked value or the original value.
 */
function maskValue(value: string): string {
  return value.replace(/./g, '*');
}

/**
 * Recursively masks sensitive information within an object.
 * @param data The data object that might contain sensitive information.
 * @param keySet A set of keys for which values should be masked.
 * @returns A new object with sensitive information masked.
 */
function maskSensitiveData(
  data: any,
  keySet: Set<string> = sensitiveKeys,
): any {
  if (Array.isArray(data)) {
    return data.map((item) => maskSensitiveData(item, keySet));
  } else if (data !== null && typeof data === 'object') {
    return Object.entries(data).reduce((acc, [key, value]) => {
      acc[key] = keySet.has(key)
        ? maskValue(value.toString())
        : maskSensitiveData(value, keySet);
      return acc;
    }, {});
  }
  return data;
}

export { maskSensitiveData };
