// src/widget/useWidgetInfo.ts
// import {Course} from "@/type/api/infoQuery/classScheduleAPI";

const PRESET_COLORS = [
    "#007AFF", // Blue
    "#34C759", // Green
    "#FF9500", // Orange
    "#AF52DE", // Purple
    "#5856D6", // Indigo
    "#FF3B30", // Red
    "#FF2D55", // Pink
    "#00C7BE", // Teal
];
function getHashCode(str) {
    let hash = 0;
    if (str.length === 0) {
        return hash;
    }
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    // 确保结果是正数
    return Math.abs(hash);
}

/**
 * 根据课程名称，从预设颜色数组中稳定地选择一个颜色。
 * @param {string} courseName 课程名称
 * @returns {string} 颜色的十六进制代码 (e.g., '#007AFF')
 */
export function getColorForCourse(courseName) {
    if (!courseName) {
        // 如果课程名为空，返回一个默认颜色
        return PRESET_COLORS[0];
    }

    // 2. 根据课程名的哈希值，在颜色数组中取模，得到一个固定的索引
    const index = getHashCode(courseName) % PRESET_COLORS.length;

    // 3. 返回该索引对应的颜色
    return PRESET_COLORS[index];
}
