import {ScrollView, StyleSheet, ToastAndroid, View} from "react-native";
import {Button, Divider, Text} from "@rneui/themed";
import {useEffect, useState} from "react";
import moment from "moment/moment";
import Flex from "@/components/un-ui/Flex.tsx";
import {Picker} from "@react-native-picker/picker";
import {SchoolTerms, SchoolTermValue, SchoolYears} from "@/type/global.ts";
import {infoQuery} from "@/js/jw/infoQuery.ts";
import {NumberInput} from "@/components/un-ui/NumberInput.tsx";
import {Row, Rows, Table} from "react-native-reanimated-table";
import {useUserTheme} from "@/js/theme.ts";
import {ExamScoreQueryRes} from "@/type/api/infoQuery/examInfoAPI.ts";
import {store} from "@/js/store.ts";
import {Color} from "@/js/color.ts";
import {UnPicker} from "@/components/un-ui/UnPicker.tsx";
import ExpandTable from "@/screens/tool/infoQuery/ExpandTable.tsx";

export function ExamScore() {
    const {theme} = useUserTheme();
    const [apiRes, setApiRes] = useState<ExamScoreQueryRes>({});
    const [year, setYear] = useState(moment().isBefore(moment("8", "M"), "M") ? moment().year() - 1 : moment().year());
    const [term, setTerm] = useState<SchoolTermValue>(
        moment().isBetween(moment("02", "MM"), moment("08", "MM"), "month", "[]")
            ? SchoolTerms[1][0]
            : SchoolTerms[0][0],
    );
    const [page, setPage] = useState(1);
    const [tableData, setTableData] = useState({
        header: ["学年", "课程名称", "成绩", "发布时间", "学分", "绩点", "教学班", "教师", "教学班ID"],
        width: [120, 200, 80, 150, 100, 80, 200, 140, 300],
        body: [] as string[][],
    });
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [usualScore, setUsualScore] = useState<{[key: string]: any}>({});

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
            backgroundColor: Color.mix(
                Color(theme.colors.primary),
                Color(theme.colors.background),
                theme.mode === "dark" ? 0.7 : 0.2,
            ).setAlpha(theme.mode === "dark" ? 0.3 : 0.6).rgbaString,
        },
        tableHeaderText: {},
    });

    function init() {
        store.load({key: "examScore"}).then(data => {
            setApiRes(data);
            setTableData({
                ...tableData,
                body: data.items.map((item, index) => [
                    item.xnmmc,
                    item.kcmc,
                    item.cj,
                    item.cjbdsj,
                    item.xf,
                    item.jd,
                    item.jxbmc,
                    item.jsxm,
                    item.jxb_id,
                ]),
            });
        });
    }
    const handleExpandToggle = (id: string | null) => {
        setExpandedId(id);
    };

    const handleRowPress = (id: string) => {
        console.log('点击了教学班ID:', id);
        usual(id);
    };

    function query() {
        infoQuery.getExamScore(year, term, page).then(res => {
            const tableBody = res.items.map(item => [
                item.xnmmc,
                item.kcmc,
                item.cj,
                item.cjbdsj,
                item.xf,
                item.jd,
                item.jxbmc,
                item.jsxm,
                item.jxb_id,
            ]);
            ToastAndroid.show("获取考试成绩成功", ToastAndroid.SHORT);
            setTableData({
                ...tableData,
                body: tableBody,
            });
            console.log(tableBody);
            setApiRes(res);
            console.log(apiRes.items,1);
            store.save({key: "examScore", data: res});
        });
    }
    function usual(id: string) {
        infoQuery.getUsualScore(year, term, id).then(res => {
            setUsualScore(prev => ({
                ...prev,
                [id]: res
            }));
        });
    }

    useEffect(() => {
        init();
        query();
    }, [year, term, page]);

    return (
        <ScrollView>
            <View style={style.container}>
                <Text h4>查询参数</Text>
                <Flex gap={10} direction="column" alignItems="flex-start">
                    <Flex gap={10}>
                        <Text>学期</Text>
                        <View style={{flex: 1}}>
                            <UnPicker selectedValue={year} onValueChange={setYear}>
                                {data.schoolYear.map(value => {
                                    return <Picker.Item value={+value[0]} label={value[1]} key={value[0]} />;
                                })}
                            </UnPicker>
                        </View>
                        <View style={{flex: 1}}>
                            <UnPicker selectedValue={term} onValueChange={setTerm}>
                                {data.schoolTerm.map(value => {
                                    return <Picker.Item value={value[0]} label={value[1]} key={value[0]} />;
                                })}
                            </UnPicker>
                        </View>
                    </Flex>
                    <View style={{width: "100%"}}>
                        <Button onPress={query}>查询</Button>
                    </View>
                </Flex>
                <Divider />
                <Flex direction="column" gap={15} alignItems="flex-start">
                    <Flex alignItems="flex-end" gap={5}>
                        <Text h4>查询结果</Text>
                        <Text>{`第${apiRes.currentPage ?? 1}/${apiRes.totalPage ?? 1}页，共有${
                            apiRes.totalCount ?? 0
                        }条结果`}</Text>
                    </Flex>
                    <Flex gap={10}>
                        <Text>页数</Text>
                        <Flex inline>
                            <NumberInput value={page} onChange={setPage} min={1} max={apiRes.totalPage ?? 1} />
                        </Flex>
                        <Text>每页15条记录</Text>
                    </Flex>
                    {/*<ScrollView horizontal>*/}
                    {/*    <Table style={style.table} borderStyle={style.tableBorder}>*/}
                    {/*        <Row*/}
                    {/*            data={tableData.header}*/}
                    {/*            widthArr={tableData.width}*/}
                    {/*            textStyle={style.tableText}*/}
                    {/*            style={style.tableHeader}*/}
                    {/*            height={50}*/}
                    {/*        />*/}
                    {/*        <Rows*/}
                    {/*            heightArr={new Array(tableData.body.length).map(() => 50)}*/}
                    {/*            data={tableData.body}*/}
                    {/*            widthArr={tableData.width}*/}
                    {/*            textStyle={style.tableText}*/}
                    {/*        />*/}
                    {/*    </Table>*/}
                    {/*</ScrollView>*/}
                    {/*<Flex gap={10}>*/}
                    {/*    <Text>页数</Text>*/}
                    {/*    <Flex inline>*/}
                    {/*        <NumberInput value={page} onChange={setPage} min={1} max={apiRes.totalPage ?? 1} />*/}
                    {/*    </Flex>*/}
                    {/*    <Text>每页15条记录</Text>*/}
                    {/*</Flex>*/}
                </Flex>
                <ExpandTable
                    data={apiRes.items ?? []}
                    expandedId={expandedId}
                    onRowPress={handleRowPress}
                    onExpandToggle={handleExpandToggle}
                    usualScore={usualScore}
                />
            </View>
        </ScrollView>
    );
}
