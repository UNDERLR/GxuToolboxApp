import {useEffect, useState} from "react";
import {infoQuery} from "@/js/jw/infoQuery.ts";
import {Evaluation} from "@/type/eduEvaluation/evaluation.ts";
import {ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import {Row, Table} from "react-native-reanimated-table";
import {useNavigation} from "@react-navigation/native";
import {Color} from "@/js/color.ts";
import {Text, useTheme} from "@rneui/themed";
import Flex from "@/components/un-ui/Flex.tsx";

export function StuEvaluation() {
    const {theme} = useTheme();
    const [evaList, setEvaList] = useState<Evaluation[]>([]);
    const navigation = useNavigation();
    const colWidths = [9, 6, 5];
    const handleRowPress = (item: Evaluation) => {
        navigation.navigate("EvaDetail", {evaluationItem: item});
    };
    const defaultColor = Color.mix(
        Color(theme.colors.primary),
        Color(theme.colors.background),
        theme.mode === "dark" ? 0.1 : 0.4,
    ).setAlpha(theme.mode === "dark" ? 0.3 : 0.8).rgbaString;
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: 10,
            paddingVertical: 15,
        },
        header: {
            height: 50,
            backgroundColor: defaultColor,
        },
        headerText: {
            textAlign: "center",
            fontWeight: "bold",
            color: theme.colors.black,
            fontSize: 16,
        },
        row: {
            height: 45,
            borderBottomWidth: 1,
            borderBottomColor: Color(theme.colors.primary).setAlpha(0.3).rgbaString,
            alignItems: "center",
        },
        rowText: {
            textAlign: "center",
            fontSize: 14,
        },
    });

    const colorMap: Record<string, string> = {
        已评完: theme.colors.success,
        未评完: theme.colors.warning,
        未评: theme.colors.error,
    };
    const statusList = Object.keys(colorMap);

    async function init() {
        const res = await infoQuery.getEvaluateList();
        res.items.sort((a, b) => statusList.indexOf(a.tjztmc) - statusList.indexOf(b.tjztmc));
        setEvaList(res.items);
    }

    useEffect(() => {
        navigation.addListener("focus", init);
    }, []);

    useEffect(() => {
        init();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Flex direction="column" gap={10}>
                <Text style={{fontSize: 14}}>请点击下方评价列表中的元素进入详情页进行评价</Text>
                <Text style={{fontSize: 14}}>
                    当前共有 {evaList.length}
                    项评价，其中 {evaList.filter(eva => eva.tjztmc === statusList[0]).length} 项已评完，
                    {evaList.filter(eva => eva.tjztmc === statusList[1]).length} 项未评完，
                    {evaList.filter(eva => eva.tjztmc === statusList[2]).length} 项未评
                </Text>
                <Table style={{width: "100%"}}>
                    <Row
                        data={["课程", "教师", "评价"]}
                        style={styles.header}
                        flexArr={colWidths}
                        textStyle={styles.headerText}
                    />
                    {evaList.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => handleRowPress(item)}>
                            <Row
                                cellTextStyle={cell => ({color: colorMap[cell] ?? theme.colors.black})}
                                data={[item.kcmc, item.jzgmc, item.tjztmc]}
                                style={styles.row}
                                flexArr={colWidths}
                                textStyle={styles.rowText}
                            />
                        </TouchableOpacity>
                    ))}
                </Table>
            </Flex>
        </ScrollView>
    );
}
