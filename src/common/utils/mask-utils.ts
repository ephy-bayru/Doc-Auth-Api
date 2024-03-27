/**
 * Utility to mask sensitive information in data objects.
 */

// Define keys considered sensitive and should be masked.
const sensitiveKeys = new Set(['password', 'creditCard', 'ssn', 'phoneNumber']);

/**
 * Masks a value if deemed sensitive, leaving other values untouched.
 * This simplistic approach replaces sensitive values with asterisks,
 * but you could adapt it to use different masking strategies.
 *
 * @param value The value to potentially mask.
 * @returns The masked value or the original value.
 */
function maskValue(value: string): string {
  return value.replace(/./g, '*');
}

/**
 * Recursively masks sensitive information within an object.
 *
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
  } else if (typeof data === 'object' && data !== null) {
    return Object.entries(data).reduce((acc, [key, value]) => {
      // Mask the value if the key is sensitive, or recurse into the object/array.
      acc[key] = keySet.has(key)
        ? maskValue(value.toString())
        : maskSensitiveData(value, keySet);
      return acc;
    }, {} as any);
  }
  return data;
}

export { maskSensitiveData };
