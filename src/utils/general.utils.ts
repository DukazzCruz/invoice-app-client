/**
 * Pads invoice number with zeros to attain a uniform invoice number width
 */
export const zeroPad = (num: number, places: number): string => String(num).padStart(places, '0');

