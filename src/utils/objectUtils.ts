/**
 * 检查一个项目是否是可合并的对象
 * @param item 要检查的项目
 * @returns {boolean} 如果项目是对象则返回 true，否则返回 false
 */
function isObject(item: any): item is Record<string, any> {
    return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * 深层次合并两个对象。
 * @param target 目标对象
 * @param source 源对象
 * @returns {object} 合并后的新对象
 */
export function deepMerge<T extends object, U extends object>(target: T, source: U): T & U {
    const output = {...target} as T & U;

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            const targetValue = (target as any)[key];
            const sourceValue = (source as any)[key];

            if (isObject(targetValue) && isObject(sourceValue)) {
                (output as any)[key] = deepMerge(targetValue, sourceValue);
            } else {
                (output as any)[key] = sourceValue;
            }
        });
    }

    return output;
}
