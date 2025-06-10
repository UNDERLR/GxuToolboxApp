import React, {useEffect, useState} from "react";
import {ScrollView, StyleSheet, View} from "react-native";
import {Button, Divider, Text} from "@rneui/themed";
import Flex from "@/components/un-ui/Flex.tsx";
import {Picker} from "@react-native-picker/picker";
import {Schools, SchoolTerms, SchoolValue, SchoolYears} from "@/type/global.ts";
import {useUserTheme} from "@/js/theme.ts";
import moment from "moment/moment";
import {infoQuery} from "@/js/jw/infoQuery.ts";
import {UserInfo} from "@/type/infoQuery/base.ts";

export function ClassCourseSchedule() {
    const {userTheme} = useUserTheme();
    const [userInfo, setUserInfo] = useState<UserInfo>();
    const [professionList, setProfessionList] = useState<string[][]>([]);
    const [classList, setClassList] = useState<string[][]>([]);
    // params
    const [year, setYear] = useState(moment().isBefore(moment("8", "M"), "M") ? moment().year() - 1 : moment().year());
    const [term, setTerm] = useState<string>(
        moment().isBetween(moment("02", "MM"), moment("08", "MM"), "month", "[]")
            ? SchoolTerms[1][0]
            : SchoolYears[0][0],
    );
    const [school, setSchool] = useState<SchoolValue>(
        Schools[Schools.findIndex(v => v[1] === (userInfo?.school ?? Schools[0][1]))][0],
    );
    const [profession, setProfession] = useState("");
    const [grade, setGrade] = useState(moment().year());
    const [classId, setClassId] = useState("");

    const style = StyleSheet.create({
        container: {
            padding: "5%",
        },
    });

    const query = () => {};

    const init = async () => {
        const storeUserInfo = await infoQuery.getUserInfo();
        setUserInfo(storeUserInfo);
        const schoolIndex = Schools.findIndex(v => v[1] === (storeUserInfo?.school ?? Schools[0][1]));
        const newSchool = Schools[schoolIndex][0];
        setSchool(newSchool);
        const newProfessionList = await getProfessionList(newSchool, false);
        const professionIndex = newProfessionList.findIndex(
            v => v[1].indexOf(storeUserInfo.class.replace(/\d*/g, "")) > -1,
        );
        const newProfession = newProfessionList[professionIndex][0];
        setProfession(newProfession);
        const newGrade = 2000 + parseInt(storeUserInfo.class.match(/\d{2}/)![0], 10);
        setGrade(newGrade);
        const newClassList = await getClassList(newSchool, newProfession, newGrade, false);
        setClassList(newClassList);
    };

    const getProfessionList = async (schoolId = school, reload = true) => {
        const professionRes = await infoQuery.getProfessionList(schoolId);
        const newProfessionList = professionRes.map(item => [item.zyh_id, item.zymc]);
        if (reload) {
            setProfessionList(newProfessionList);
        }
        return newProfessionList;
    };

    const getClassList = async (
        schoolId: SchoolValue = school,
        professionId: string = profession,
        gradeId: number = grade,
        reload = true,
    ) => {
        const classListRes = await infoQuery.getClassList(schoolId, professionId, gradeId);
        const newClassList = classListRes.map(item => [item.bh_id, item.bj]);
        if (reload) {
            setClassList(newClassList);
        }
        console.log(newClassList);
        return newClassList;
    };

    useEffect(() => {
        getProfessionList();
    }, [school]);

    useEffect(() => {
        getClassList();
    }, [profession, grade]);

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
                    {professionList.length > 0 && (
                        <Flex gap={10}>
                            <Text>专业</Text>
                            <View style={{flex: 1}}>
                                <Picker
                                    {...userTheme.components.Picker}
                                    selectedValue={profession}
                                    onValueChange={setProfession}>
                                    {professionList.map(value => {
                                        return <Picker.Item value={value[0]} label={value[1]} key={value[0]} />;
                                    })}
                                </Picker>
                            </View>
                        </Flex>
                    )}
                    {profession && (
                        <Flex gap={10}>
                            <Text>年级</Text>
                            <View style={{flex: 1}}>
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
                    <View style={{width: "100%"}}>
                        <Button onPress={query}>查询</Button>
                    </View>
                </Flex>
                <Divider />
                <Flex direction="column" gap={15} alignItems="flex-start">
                    <Text>{profession}</Text>
                    <Text>{school}</Text>
                    <Text>{JSON.stringify(userInfo)}</Text>
                </Flex>
            </View>
        </ScrollView>
    );
}
