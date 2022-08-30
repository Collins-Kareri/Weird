import { isInt, isDate, isDateTime, isTime, isLocalDateTime, isLocalTime, isDuration, int } from "neo4j-driver";

// tag::toNativeTypes[]
/**
 * Convert Neo4j Properties back into JavaScript types
 *
 * @param {Record<string, any>} properties
 * @return {Record<string, any>}
 */
export function toNativeTypes(properties: Record<string, unknown>) {
    return Object.fromEntries(
        Object.keys(properties).map((key) => {
            const value = valueToNativeType(properties[key]);

            return [key, value];
        })
    );
}

/**
 * Convert an individual value to its JavaScript equivalent
 *
 * @param {any} value
 * @returns {any}
 */
function valueToNativeType(value: unknown) {
    if (Array.isArray(value)) {
        value = value.map((innerValue) => valueToNativeType(innerValue));
    } else if (isInt(value)) {
        value = value.toNumber();
    } else if (
        isDate(value as Record<string, unknown>) ||
        isDateTime(value as Record<string, unknown>) ||
        isTime(value as Record<string, unknown>) ||
        isLocalDateTime(value as Record<string, unknown>) ||
        isLocalTime(value as Record<string, unknown>) ||
        isDuration(value as Record<string, unknown>)
    ) {
        value = (value as Record<string, unknown>).toString();
    } else if (typeof value === "object" && value !== undefined && value !== null) {
        value = toNativeTypes(value as Record<string, unknown>);
    }

    return value;
}

export function neo4jTypes(values: unknown) {
    const toChange = values;

    Object.keys(toChange as string).forEach((key) => {
        const value = (toChange as Record<string, unknown>)[key as keyof Record<string, unknown>];

        if (typeof value === "number") {
            (toChange as Record<string, unknown>)[key as keyof Record<string, unknown>] = int(value);
        }
    });
    return toChange;
}
