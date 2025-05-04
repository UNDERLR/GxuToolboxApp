import {ScrollView, StyleSheet, ToastAndroid, View} from "react-native";
import {Button, Divider, ListItem, Text} from "@rneui/themed";
import {useEffect, useState} from "react";
import moment from "moment/moment";
import Flex from "../../../components/un-ui/Flex.tsx";
import {Picker} from "@react-native-picker/picker";
import {SchoolTerms, SchoolYears} from "../../../type/global.ts";
import {infoQuery} from "../../../js/jw/infoQuery.ts";
import {NumberInput} from "../../../components/un-ui/NumberInput.tsx";
import {Row, Rows, Table} from "react-native-reanimated-table";
import {useUserTheme} from "../../../js/theme.ts";
import {ExamInfoQueryRes} from "../../../type/api/examInfoAPI.ts";
import {store} from "../../../js/store.ts";

export function ExamInfo() {
    const {theme, userTheme} = useUserTheme();
    const [apiRes, setApiRes] = useState<ExamInfoQueryRes>({});
    const [year, setYear] = useState(moment().isBefore(moment("8", "M"), "M") ? moment().year() - 1 : moment().year());
    const [term, setTerm] = useState<string>("");
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
            borderColor: "#c8e1ff",
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
            setTableData({
                ...tableData,
                body: tableBody,
            });
            setApiRes(res);
            store.save({key: "examInfo", data: res});
            ToastAndroid.show("获取考试信息成功", ToastAndroid.SHORT);
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
                <Text h4>查询参数</Text>
                <ListItem bottomDivider>
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
                </ListItem>
                <Button>查询</Button>
                <Divider />
                <ListItem>
                    <Flex gap={10}>
                        <Text>页数</Text>
                        <Flex inline>
                            <NumberInput value={page} onChange={setPage} min={1} max={apiRes.totalPage} />
                        </Flex>
                        <Text>每页15条记录</Text>
                    </Flex>
                </ListItem>
                <Flex direction="column" gap={10} alignItems="flex-start">
                    <Flex alignItems="flex-end" gap={5}>
                        <Text h4>查询结果</Text>
                        <Text>{`第${apiRes.currentPage}/${apiRes.totalPage}页，共有${apiRes.totalCount}条结果`}</Text>
                    </Flex>
                    <ScrollView horizontal>
                        <Table style={style.table} borderStyle={style.tableBorder}>
                            <Row
                                data={tableData.header}
                                widthArr={tableData.width}
                                textStyle={style.tableText}
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
                </Flex>
                <ListItem>
                    <Flex gap={10}>
                        <Text>页数</Text>
                        <Flex inline>
                            <NumberInput value={page} onChange={setPage} min={1} max={apiRes.totalPage} />
                        </Flex>
                        <Text>每页15条记录</Text>
                    </Flex>
                </ListItem>
            </View>
        </ScrollView>
    );
}
