import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Make a deep clone from and object
 * @param o object to clone
 * @returns {any} cloned object
 */
export const deepObjectClone = (o) => {
  return JSON.parse(JSON.stringify(o));
};
