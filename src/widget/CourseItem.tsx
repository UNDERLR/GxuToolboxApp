import React from "react";
import {FlexWidget, TextWidget} from "react-native-android-widget";
import {getColorForCourse} from "@/widget/widgetData.ts";

// 定义单节课的数据接口
interface CourseItemProps {
    course: {
        name: string;
        beginTime: string; // e.g., "08:00"
        endTime: string; // e.g., "09:40"
        index: string; // e.g., "1-2"
        teacher: string;
        room: string;
    };
}

/**
 * @description 渲染单节课程的组件
 */
export function CourseItem({course}: CourseItemProps) {
    // 构造详情字符串
    const details = `第${course.index}节 | ${course.room} | ${course.teacher}`;
    const courseColor = getColorForCourse(course.name);
    return (
        // 1. 水平主容器 (Main Row)
        <FlexWidget
            style={{
                width: "match_parent",
                flexDirection: "row", // 水平排列：[时间] [竖线] [详情]
                alignItems: "center", // 垂直居中对齐
                marginVertical: 5, // 控制每个课程项之间的垂直间距
                backgroundColor: "#FFF",
                borderRadius: 12,
                padding: 8,
            }}>
            {/* 2. 左侧时间区域 (Time Column) */}
            <FlexWidget
                style={{
                    width: 40, // 固定宽度
                    flexDirection: "column", // 垂直排列
                    alignItems: "flex-end", // 内容右对齐
                }}>
                <TextWidget
                    text={course.beginTime}
                    style={{
                        fontSize: 13,
                        color: "#888888", // 灰色
                    }}
                />
                <TextWidget
                    text={course.endTime}
                    style={{
                        fontSize: 13,
                        color: "#888888", // 灰色
                        marginTop: 2, // 时间之间的微小间距
                    }}
                />
            </FlexWidget>

            <FlexWidget
                style={{
                    width: 3,
                    height: "match_parent",
                    backgroundColor: courseColor,
                    borderRadius: 2,
                    marginHorizontal: 12,
                    paddingVertical: 5,
                }}
            />

            {/* 4. 右侧课程详情区域 (Details Column) */}
            <FlexWidget
                style={{
                    flex: 1, // 占据剩余所有空间
                    flexDirection: "column", // 垂直排列
                }}>
                {/* 课程名称 */}
                <TextWidget
                    text={course.name}
                    style={{
                        fontSize: 16,
                        color: "#000000", // 黑色
                        fontFamily: "Inter-Medium", // 稍粗的字体
                    }}
                    android={{maxLines: 1}} // 单行显示，超长截断
                />
                {/* 课程详情 */}
                <TextWidget
                    text={details}
                    style={{
                        fontSize: 12,
                        color: "#888888", // 灰色
                        marginTop: 2, // 详情与名称的微小间距
                    }}
                    android={{maxLines: 1}}
                />
            </FlexWidget>
        </FlexWidget>
    );
}
