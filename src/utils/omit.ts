


/**
 * Equilvalent of Lodash Omit
 */
export default function omit(object: {}, keys: string[]) {
    return Object.fromEntries(Object.entries(object).filter(k => !keys.includes(k[0])))
}
