import {ScrollView, StyleSheet, ToastAndroid, View} from "react-native";
import {Button, Divider, Text} from "@rneui/themed";
import {useEffect, useState} from "react";
import moment from "moment/moment";
import Flex from "@/components/un-ui/Flex.tsx";
import {Picker} from "@react-native-picker/picker";
import {SchoolTerms, SchoolYears} from "@/type/global.ts";
import {infoQuery} from "@/js/jw/infoQuery.ts";
import {NumberInput} from "@/components/un-ui/NumberInput.tsx";
import {Row, Rows, Table} from "react-native-reanimated-table";
import {useUserTheme} from "@/js/theme.ts";
import {ExamInfoQueryRes} from "@/type/api/examInfoAPI.ts";
import {store} from "@/js/store.ts";
import {Color} from "@/js/color.ts";

export function ExamInfo() {
    const {theme, userTheme} = useUserTheme();
    const [apiRes, setApiRes] = useState<ExamInfoQueryRes>({});
    const [year, setYear] = useState(moment().isBefore(moment("8", "M"), "M") ? moment().year() - 1 : moment().year());
    const [term, setTerm] = useState<string>(
        moment().isBetween(moment("02", "MM"), moment("08", "MM"), "month", "[]")
            ? SchoolTerms[1][0]
            : SchoolYears[0][0],
    );
    const [page, setPage] = useState(1);
    const [tableData, setTableData] = useState({
        header: ["课程名称", "考试时间", "考试校区", "考试地点", "考试座号", "学年", "学期", "教学班", "考试名称"],
        width: [170, 200, 80, 100, 80, 100, 70, 190, 300],
        body: [] as string[][],
    });

    const data = {
        schoolYear: [["", "全部"], ...SchoolYears],
        schoolTerm: [["", "全部"], ...SchoolTerms],
    };

    const style = StyleSheet.create({
        container: {
            padding: "5%",
        },
        table: {
            width: "100%",
        },
        tableText: {
            color: theme.colors.black,
            margin: 5,
        },
        tableBorder: {
            borderWidth: 2,
            borderColor: Color.mix(Color(theme.colors.primary), Color(theme.colors.grey4), 0.4).rgbaString,
        },
        tableHeader: {
            backgroundColor: Color
                .mix(
                    Color(theme.colors.primary),
                    Color(theme.colors.background),
                    theme.mode === "dark" ? 0.7 : 0.2,
                )
                .setAlpha(theme.mode === "dark" ? 0.3 : 0.6).rgbaString,
        },
        tableHeaderText: {},
    });

    function init() {
        store.load({key: "examInfo"}).then(data => {
            setApiRes(data);
        });
    }

    function query() {
        infoQuery.getExamInfo(year, term, page).then(res => {
            const tableBody = res.items.map((item, index) => [
                item.kcmc,
                item.kssj,
                item.cdxqmc,
                item.cdmc,
                item.zwh,
                item.xnmc,
                item.xqmmc,
                item.jxbmc,
                item.ksmc,
            ]);
            ToastAndroid.show("获取考试信息成功", ToastAndroid.SHORT);
            setTableData({
                ...tableData,
                body: tableBody,
            });
            setApiRes(res);
            store.save({key: "examInfo", data: res});
        });
    }

    useEffect(() => {
        init();
        query();
    }, [year, term, page]);

    return (
        <ScrollView>
            <View style={style.container}>
                <Text h3>考试信息查询</Text>
                <Divider />
                <Flex gap={10} direction="column" alignItems="flex-start">
                    <Text h4>查询参数</Text>
                    <Flex gap={10}>
                        <Text>学期</Text>
                        <View style={{flex: 1}}>
                            <Picker
                                {...userTheme.components.Picker}
                                selectedValue={year}
                                onValueChange={(v, index) => setYear(v)}>
                                {data.schoolYear.map(value => {
                                    return <Picker.Item value={+value[0]} label={value[1]} key={value[0]} />;
                                })}
                            </Picker>
                        </View>
                        <View style={{flex: 1}}>
                            <Picker
                                {...userTheme.components.Picker}
                                selectedValue={term}
                                onValueChange={(v, index) => setTerm(v)}>
                                {data.schoolTerm.map(value => {
                                    return <Picker.Item value={value[0]} label={value[1]} key={value[0]} />;
                                })}
                            </Picker>
                        </View>
                    </Flex>
                    <View style={{width:"100%"}}>
                        <Button onPress={query}>查询</Button>
                    </View>
                </Flex>
                <Divider />
                <Flex direction="column" gap={15} alignItems="flex-start">
                    <Flex alignItems="flex-end" gap={5}>
                        <Text h4>查询结果</Text>
                        <Text>{`第${apiRes.currentPage ?? 1}/${apiRes.totalPage ?? 1}页，共有${apiRes.totalCount ?? 0}条结果`}</Text>
                    </Flex>
                    <Flex gap={10}>
                        <Text>页数</Text>
                        <Flex inline>
                            <NumberInput value={page} onChange={setPage} min={1} max={apiRes.totalPage ?? 1} />
                        </Flex>
                        <Text>每页15条记录</Text>
                    </Flex>
                    <ScrollView horizontal>
                        <Table style={style.table} borderStyle={style.tableBorder}>
                            <Row
                                data={tableData.header}
                                widthArr={tableData.width}
                                textStyle={style.tableText}
                                style={style.tableHeader}
                                height={50}
                            />
                            <Rows
                                heightArr={new Array(tableData.body.length).map(() => 50)}
                                data={tableData.body}
                                widthArr={tableData.width}
                                textStyle={style.tableText}
                            />
                        </Table>
                    </ScrollView>
                    <Flex gap={10}>
                        <Text>页数</Text>
                        <Flex inline>
                            <NumberInput value={page} onChange={setPage} min={1} max={apiRes.totalPage ?? 1} />
                        </Flex>
                        <Text>每页15条记录</Text>
                    </Flex>
                </Flex>
            </View>
        </ScrollView>
    );
}
