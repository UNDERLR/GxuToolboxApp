import React from "react";
import type { WidgetTaskHandlerProps } from "react-native-android-widget";
import { CourseScheduleWidget } from "./CourseScheduleWidget.tsx";

const nameToWidget = {
    CourseScheduleWidget: CourseScheduleWidget,
};

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
    const widgetInfo = props.widgetInfo;
    const Widget =
        nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];

    switch (props.widgetAction) {
        case "WIDGET_ADDED":
            props.renderWidget(<Widget todayCourse={[]} tomorrowCourse={[]} />);
            break;

        case "WIDGET_UPDATE":
            // Not needed for now
            break;

        case "WIDGET_RESIZED":
            // Not needed for now
            break;

        case "WIDGET_DELETED":
            // Not needed for now
            break;

        case "WIDGET_CLICK":
            // Not needed for now
            break;

        default:
            break;
    }
}
