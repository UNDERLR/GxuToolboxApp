import React, {useEffect, useState} from "react";
import {ScrollView, StyleSheet, ToastAndroid, View} from "react-native";
import {Button, Divider, Text} from "@rneui/themed";
import Flex from "@/components/un-ui/Flex.tsx";
import {Picker} from "@react-native-picker/picker";
import {PageModel, Schools, SchoolTerms, SchoolTermValue, SchoolValue, SchoolYears} from "@/type/global.ts";
import {useUserTheme} from "@/js/theme.ts";
import moment from "moment/moment";
import {infoQuery} from "@/js/jw/infoQuery.ts";
import {Class, UserInfo} from "@/type/infoQuery/base.ts";
import {CourseSchedule} from "@/type/infoQuery/course/course.ts";
import {CourseScheduleQueryRes} from "@/type/api/infoQuery/classScheduleAPI.ts";

export function ClassCourseSchedule() {
    const {userTheme} = useUserTheme();
    const [userInfo, setUserInfo] = useState<UserInfo>();
    const [subjectList, setSubjectList] = useState<string[][]>([]);
    const [classList, setClassList] = useState<string[][]>([]);
    // params
    const [year, setYear] = useState(moment().isBefore(moment("8", "M"), "M") ? moment().year() - 1 : moment().year());
    const [term, setTerm] = useState<SchoolTermValue>(
        moment().isBetween(moment("02", "MM"), moment("08", "MM"), "month", "[]")
            ? SchoolTerms[1][0]
            : SchoolTerms[0][0],
    );
    const [school, setSchool] = useState<SchoolValue>(
        Schools[Schools.findIndex(v => v[1] === (userInfo?.school ?? Schools[0][1]))][0],
    );
    const [subject, setSubject] = useState("");
    const [grade, setGrade] = useState(moment().year());
    const [classId, setClassId] = useState("");
    // scheduleList
    const [classScheduleList, setClassScheduleList] = useState<Array<CourseSchedule & Class & PageModel>>([]);
    const [classScheduleIndex, setClassScheduleIndex] = useState<number>();
    const [classSchedule, setClassSchedule] = useState<CourseScheduleQueryRes>();

    const style = StyleSheet.create({
        container: {
            padding: "5%",
        },
    });

    const queryClassCourseScheduleList = async () => {
        ToastAndroid.show("正在获取班级课表列表", ToastAndroid.SHORT);
        const res = await infoQuery.getClassCourseScheduleList(year, term, school, subject, grade, classId);
        setClassScheduleList(res.items);
        setClassScheduleIndex(0);
        queryClassCourseSchedule(res.items[0]);
    };

    useEffect(() => {
        queryClassCourseScheduleList();
    }, [classId]);

    const queryClassCourseSchedule = async (item = {}) => {
        ToastAndroid.show("正在获取班级课表", ToastAndroid.SHORT);
        const {xnm, xqm, njdm_id, jgdm, zyh_id, bh_id} = {...classScheduleList[classScheduleIndex ?? 0], ...item};
        const res = await infoQuery.getClassCourseSchedule(+xnm, xqm, jgdm, zyh_id, +njdm_id, bh_id);
        console.log(res);
        setClassSchedule(res);
    };

    useEffect(() => {
        queryClassCourseSchedule();
    }, [classScheduleIndex]);

    const init = async () => {
        const storeUserInfo = await infoQuery.getUserInfo();
        setUserInfo(storeUserInfo);

        const schoolIndex = Schools.findIndex(v => v[1] === (storeUserInfo?.school ?? Schools[0][1]));
        const newSchool = Schools[schoolIndex][0];
        setSchool(newSchool);

        const newSubjectList = await getSubjectList(newSchool, false);
        const subjectIndex = newSubjectList.findIndex(v => v[1].indexOf(storeUserInfo.subject_id) > -1);
        const newSubject = newSubjectList[subjectIndex][0];
        setSubject(newSubject);

        const newGrade = storeUserInfo.grade ?? moment().year();
        setGrade(newGrade);

        const newClassList = await getClassList(newSchool, newSubject, newGrade, false);
        setClassList(newClassList);

        const newClassIndex = newClassList.findIndex(v => v[1].indexOf(storeUserInfo.class) > -1);
        setClassId(newClassList[newClassIndex][0]);
    };

    const getSubjectList = async (schoolId = school, reload = true) => {
        const subjectRes = await infoQuery.getSubjectList(schoolId);
        const newSubjectList = subjectRes.map(item => [item.zyh_id, item.zymc]);
        if (reload) {
            setSubjectList(newSubjectList);
        }
        return newSubjectList;
    };

    const getClassList = async (
        schoolId: SchoolValue = school,
        subjectId: string = subject,
        gradeId: number = grade,
        reload = true,
    ) => {
        const classListRes = await infoQuery.getClassList(schoolId, subjectId, gradeId);
        const newClassList = classListRes.map(item => [item.bh_id, item.bj]);
        if (reload) {
            setClassList(newClassList);
        }
        return newClassList;
    };

    useEffect(() => {
        getSubjectList();
    }, [school]);

    useEffect(() => {
        getClassList();
    }, [subject, grade]);

    useEffect(() => {
        init();
    }, []);
    return (
        <ScrollView>
            <View style={style.container}>
                <Text h4>查询参数</Text>
                <Flex gap={10} direction="column" alignItems="flex-start">
                    <Flex gap={10}>
                        <Text>学期</Text>
                        <View style={{flex: 1}}>
                            <Picker {...userTheme.components.Picker} selectedValue={year} onValueChange={setYear}>
                                {SchoolYears.map(value => {
                                    return <Picker.Item value={+value[0]} label={value[1]} key={value[0]} />;
                                })}
                            </Picker>
                        </View>
                        <View style={{flex: 1}}>
                            <Picker {...userTheme.components.Picker} selectedValue={term} onValueChange={setTerm}>
                                {SchoolTerms.map(value => {
                                    return <Picker.Item value={value[0]} label={value[1]} key={value[0]} />;
                                })}
                            </Picker>
                        </View>
                    </Flex>
                    <Flex gap={10}>
                        <Text>学院</Text>
                        <View style={{flex: 1}}>
                            <Picker {...userTheme.components.Picker} selectedValue={school} onValueChange={setSchool}>
                                {Schools.map(value => {
                                    return <Picker.Item value={value[0]} label={value[1]} key={value[0]} />;
                                })}
                            </Picker>
                        </View>
                    </Flex>
                    {subjectList.length > 0 && (
                        <Flex gap={10}>
                            <Text>专业</Text>
                            <View style={{flex: 1}}>
                                <Picker
                                    {...userTheme.components.Picker}
                                    selectedValue={subject}
                                    onValueChange={setSubject}>
                                    {subjectList.map(value => {
                                        return <Picker.Item value={value[0]} label={value[1]} key={value[0]} />;
                                    })}
                                </Picker>
                            </View>
                        </Flex>
                    )}
                    {subject && (
                        <Flex gap={10}>
                            <Text>年级</Text>
                            <View style={{width: "30%"}}>
                                <Picker {...userTheme.components.Picker} selectedValue={grade} onValueChange={setGrade}>
                                    {Array(25)
                                        .fill(0)
                                        .map((_, index) => {
                                            const optionV = 2003 + index;
                                            return <Picker.Item value={optionV} label={optionV + ""} key={optionV} />;
                                        })}
                                </Picker>
                            </View>
                            {classList.length > 0 && (
                                <>
                                    <Text>班级</Text>
                                    <View style={{flex: 1}}>
                                        <Picker
                                            {...userTheme.components.Picker}
                                            selectedValue={classId}
                                            onValueChange={setClassId}>
                                            {classList.map(value => {
                                                return <Picker.Item value={value[0]} label={value[1]} key={value[0]} />;
                                            })}
                                        </Picker>
                                    </View>
                                </>
                            )}
                        </Flex>
                    )}
                </Flex>
                <Divider />
                {classScheduleList.length > 0 && (
                    <>
                        <Text h4>课表查询结果</Text>
                        <Flex gap={10} direction="column" alignItems="flex-start">
                            <Flex>
                                <View style={{flex: 1}}>
                                    <Picker
                                        {...userTheme.components.Picker}
                                        selectedValue={classScheduleIndex}
                                        onValueChange={setClassScheduleIndex}>
                                        {classScheduleList.map((value, index) => {
                                            return <Picker.Item value={index} label={value.tjkbmc} key={value.id} />;
                                        })}
                                    </Picker>
                                </View>
                            </Flex>
                            <View style={{width: "100%"}}>
                                <Button onPress={() => queryClassCourseSchedule()}>查看课表</Button>
                            </View>
                        </Flex>
                        <Divider />
                    </>
                )}{" "}
                {classSchedule && (
                    <>
                        <Text h4>课表预览</Text>
                        <Divider />
                    </>
                )}
                <Flex direction="column" gap={15} alignItems="flex-start">
                    <Text>{subject}</Text>
                    <Text>{school}</Text>
                    <Text>{JSON.stringify(userInfo)}</Text>
                </Flex>
            </View>
        </ScrollView>
    );
}
