import { isInt, isDate, isDateTime, isTime, isLocalDateTime, isLocalTime, isDuration, int } from "neo4j-driver";

/**
 * Convert Neo4j Properties back into JavaScript types
 *
 * @param {Record<string, unknown>} myValue
 * @return {Record<string, unknown>}
 */
export function toNativeTypes(myValue: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(
        Object.keys(myValue).map((key) => {
            const value = valueToNativeType(myValue[key]);

            return [key, value];
        })
    );
}

/**
 * Convert an individual value to its JavaScript equivalent
 *
 * @param {unknown} value
 * @returns {unknown}
 */
function valueToNativeType(value: unknown): unknown {
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

/**
 * Takes an object and changes conflicting js types to native neo4j types, as neo4j uses java and some of the js types differ.
 * @param  { unknown} values
 * @return {unknown}
 */
export function neo4jTypes(values: unknown): unknown {
    const toChange = values;

    Object.keys(toChange as Record<string, unknown>).forEach((key) => {
        const value = (toChange as Record<string, unknown>)[key];

        if (typeof value === "number") {
            (toChange as Record<string, unknown>)[key] = int(value);
        }
    });
    return toChange;
}
