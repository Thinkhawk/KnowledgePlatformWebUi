import { HttpParams } from '@angular/common/http';

/**
 * Converts a plain object/interface into HttpParams.
 * Handles Strings, Numbers, Booleans, Dates, and Arrays.
 */
export function toHttpParams<T extends object>(model: T): HttpParams {
  let params = new HttpParams();

  // Iterate over the object entries
  Object.entries(model).forEach(([key, value]) => {

    // 1. Skip null or undefined
    if (value === null || value === undefined) {
      return;
    }

    // 2. Handle Arrays (e.g., tags: ['urgent', 'work'])
    if (Array.isArray(value)) {
      value.forEach(item => {
        if (item !== null && item !== undefined) {
          params = params.append(key, item.toString());
        }
      });
    }
    // 3. Handle Date objects (convert to ISO string)
    else if (value instanceof Date) {
      params = params.set(key, value.toISOString());
    }
    // 4. Handle everything else (string, number, boolean)
    else {
      params = params.set(key, value.toString());
    }
  });

  return params;
}
