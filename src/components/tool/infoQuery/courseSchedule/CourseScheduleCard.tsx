import {Card, Text} from "@rneui/themed";
import {infoQuery} from "../../../../js/jw/infoQuery.ts";
import {ToastAndroid} from "react-native";
import {store} from "../../../../js/store.ts";
import {CourseScheduleQueryRes} from "../../../../type/api/classScheduleAPI.ts";
import {useEffect, useState} from "react";
import {CourseScheduleTable} from "./CourseScheduleTable.tsx";
import {PracticalCourseList} from "./PracticalCourseList.tsx";
import Flex from "../../../un-ui/Flex.tsx";
import {UnIcon} from "../../../un-ui/UnIcon.tsx";

export function CourseScheduleCard() {
    const [apiRes, setApiRes] = useState<CourseScheduleQueryRes>();

    function getCourseSchedule() {
        infoQuery
            .getCourseSchedule()
            .then(data => {
                ToastAndroid.show("刷新课表成功", ToastAndroid.SHORT);
                setApiRes(data);
                store.save({key: "courseRes", data});
            })
            .catch(res => {
                ToastAndroid.show(`刷新课表失败，错误码：${res.status}`, ToastAndroid.SHORT);
            });
    }

    function init() {
        store.load({key: "courseRes"}).then((data: CourseScheduleQueryRes) => {
            setApiRes(data);
        });
    }

    useEffect(() => {
        init();
        getCourseSchedule();
    }, []);
    return (
        <Card>
            <Card.Title>
                <Flex justifyContent="space-between">
                    <Text h4>课表</Text>
                    <Flex gap={2}>
                        <UnIcon name=""/>
                    </Flex>
                </Flex>
            </Card.Title>
            <Card.Divider />
            <CourseScheduleTable courseList={apiRes?.kbList ?? []} />
            {apiRes?.sjkList && (
                <>
                    <Card.Divider />
                    <PracticalCourseList courseList={apiRes.sjkList} />
                </>
            )}
        </Card>
    );
}
