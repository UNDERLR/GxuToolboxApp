import {ScrollView, StyleSheet, ToastAndroid} from "react-native";
import {Tab, TabView, Text, useTheme} from "@rneui/themed";
import React, {useEffect, useState} from "react";
import {CourseScheduleTable} from "@/components/tool/infoQuery/courseSchedule/CourseScheduleTable.tsx";
import {Flex, NumberInput, UnRefreshControl, UnTermSelector, vw} from "@/components/un-ui";
import {AttendanceQuickLogin} from "@/components/tool/auth/AttendanceQuickLogin.tsx";
import {Color} from "@/js/color.ts";
import {Row, Rows, Table} from "react-native-reanimated-table";
import {AttendanceSystemType as AST} from "@/type/api/auth/attendanceSystem.ts";
import {attendanceSystemApi} from "@/js/auth/attendanceSystem.ts";
import {AttendanceCourseClass, AttendanceDataClass} from "@/class/auth/attendanceSystem.ts";
import moment from "moment/moment";
import {AttendanceCourseItem} from "@/components/tool/auth/AttendanceCourseItem.tsx";
import {useSchoolTerm} from "@/hooks/jw.ts";

const style = StyleSheet.create({
    container: {
        padding: vw(5),
    },
    tab: {
        width: "100%",
    },
});

export default function AttendanceInfoQueryScreen() {
    const {year, term, setBoth} = useSchoolTerm();
    const [calender, setCalender] = useState<AST.Calendar>();
    const [tabIndex, setTabIndex] = useState(0);
    const {theme} = useTheme();

    const [quickLoginShow, setQuickLoginShow] = useState(false);

    async function init() {}

    async function testToken() {
        const testRes = await attendanceSystemApi.testTokenExpired();
        if (!testRes) {
            setQuickLoginShow(true);
            ToastAndroid.show("考勤系统Token已过期，请输入验证码进行快速登录", ToastAndroid.SHORT);
        }
        return testRes;
    }

    useEffect(() => {
        testToken();
    }, []);

    useEffect(() => {
        init();
    }, [quickLoginShow]);

    useEffect(() => {
        attendanceSystemApi.calenderData.getBySchoolTerm(year, term).then(setCalender);
    }, [year, term]);

    return (
        <>
            <AttendanceQuickLogin visible={quickLoginShow} onClose={() => setQuickLoginShow(false)} />
            <UnTermSelector year={year} term={term} onChange={setBoth} />
            <Tab
                value={tabIndex}
                dense={true}
                titleStyle={{color: theme.colors.primary}}
                indicatorStyle={{backgroundColor: theme.colors.primary}}
                onChange={setTabIndex}>
                <Tab.Item title="考勤课表" />
                <Tab.Item title="考勤记录" />
            </Tab>
            <TabView
                value={tabIndex}
                tabItemContainerStyle={{overflow: "hidden"}}
                animationType="timing"
                onChange={setTabIndex}>
                <TabView.Item style={style.tab}>
                    <TableScreen calender={calender} onTestToken={testToken} />
                </TabView.Item>
                <TabView.Item style={style.tab}>
                    <RecordScreen calender={calender} onTestToken={testToken} />
                </TabView.Item>
            </TabView>
        </>
    );
}

interface ScreenType {
    onTestToken: () => Promise<boolean>;
    calender?: AST.Calendar;
}

function TableScreen(props: ScreenType) {
    const [week, setWeek] = useState(1);
    const [attendanceData, setAttendanceData] = useState<AttendanceDataClass>();
    const [courseList, setCourseList] = useState<AttendanceCourseClass[]>([]);

    async function getData() {
        const res = await attendanceSystemApi.getAttendanceTable(week, props.calender?.calendarId);
        if (res) {
            setCourseList(res.getCourseList.flat());
        }
    }

    async function getAttendanceData() {
        if (!props.calender) return;
        const res = await attendanceSystemApi.getPersonalData(props.calender?.calendarId, {
            page_size: 1000,
        });
        if (res) setAttendanceData(new AttendanceDataClass(res.data.records, props.calender));
    }
    useEffect(() => {
        getAttendanceData();
    }, [props.calender]);

    const [refreshing, setRefreshing] = useState(false);
    async function onRefresh() {
        setRefreshing(true);
        const testToken = await props.onTestToken();
        if (testToken) {
            await getData();
        }
        setRefreshing(false);
    }

    useEffect(() => {
        getData();
    }, [week, props.calender]);

    return (
        <ScrollView
            contentContainerStyle={style.container}
            refreshControl={<UnRefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <Flex>
                <Flex>
                    <Text>周数</Text>
                </Flex>
                <NumberInput value={week} onChange={setWeek} max={20} min={1} />
            </Flex>
            <CourseScheduleTable<AttendanceCourseClass>
                currentWeek={week}
                itemList={courseList}
                isItemShow={(item, day) => moment(item.weekDay).isSame(day, "d")}
                itemRender={item => <AttendanceCourseItem attendanceData={attendanceData} course={item} />}
                startDay={props.calender?.firstWeekBegin}
                showDate
                showDayHighlight
                showTimeSpanHighlight
            />
        </ScrollView>
    );
}

function RecordScreen(props: ScreenType) {
    const {theme} = useTheme();
    const [page, setPage] = useState(1);
    const [apiRes, setApiRes] = useState<AST.PageRes<AST.AttendanceData>>();

    const [tableData, setTableData] = useState({
        header: ["日期", "课程名称", "状态", "打卡时间", "教室", "节次"],
        width: [100, 200, 50, 150, 80, 80],
        body: [] as string[][],
    });

    const [refreshing, setRefreshing] = useState(false);
    async function onRefresh() {
        setRefreshing(true);
        const testToken = await props.onTestToken();
        if (testToken) {
            await getData();
        }
        setRefreshing(false);
    }

    async function getData() {
        const res = await attendanceSystemApi.getPersonalData(props.calender?.calendarId ?? 18, {
            page_index: page,
            page_size: 20,
        });
        if (res?.code === 600) {
            setApiRes(res);
            tableData.body = res.data.records.map<string[]>(record => [
                record.day!,
                record.courseName!,
                record.atdStateName!,
                record.atdTime!,
                record.roomName!,
                record.periodConnect!,
            ]);
            setTableData({...tableData});
        }
    }

    useEffect(() => {
        getData();
    }, [page, props.calender]);

    const style = StyleSheet.create({
        container: {
            padding: "5%",
        },
        tableText: {
            color: theme.colors.black,
            margin: 5,
        },
        tableBorder: {
            borderWidth: 2,
            borderColor: Color.mix(theme.colors.primary, theme.colors.grey4, 0.4).rgbaString,
        },
        tableHeader: {
            backgroundColor: Color.mix(
                Color(theme.colors.primary),
                Color(theme.colors.background),
                theme.mode === "dark" ? 0.7 : 0.2,
            ).setAlpha(theme.mode === "dark" ? 0.3 : 0.6).rgbaString,
        },
    });

    return (
        <ScrollView
            contentContainerStyle={style.container}
            refreshControl={<UnRefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <Flex direction="column" align="flex-start" gap={15} justify="flex-start">
                <Text>
                    {`第${apiRes?.data.page_index ?? 1}/${apiRes?.data.total_page ?? 1}页，共有${
                        apiRes?.data.total_record ?? 0
                    }条结果`}
                </Text>
                <Flex gap={10}>
                    <Text>页数</Text>
                    <Flex inline>
                        <NumberInput value={page} onChange={setPage} min={1} max={apiRes?.data.total_page ?? 1} />
                    </Flex>
                    <Text>每页20条记录</Text>
                </Flex>
                <ScrollView horizontal>
                    <Table borderStyle={style.tableBorder}>
                        <Row
                            data={tableData.header}
                            widthArr={tableData.width}
                            textStyle={style.tableText}
                            style={style.tableHeader}
                            height={50}
                        />
                        <Rows
                            heightArr={new Array(tableData.body.length).fill(50)}
                            data={tableData.body}
                            widthArr={tableData.width}
                            textStyle={style.tableText}
                        />
                    </Table>
                </ScrollView>
                <Flex gap={10}>
                    <Text>页数</Text>
                    <Flex inline>
                        <NumberInput value={page} onChange={setPage} min={1} max={apiRes?.data.total_page ?? 1} />
                    </Flex>
                    <Text>每页20条记录</Text>
                </Flex>
            </Flex>
        </ScrollView>
    );
}
