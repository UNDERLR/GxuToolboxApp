import {useEffect, useState} from "react";
import {infoQuery} from "@/js/jw/infoQuery.ts";
import {Evaluation} from "@/type/eduEvaluation/evaluation.ts";
import {Dimensions, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import {Row, Table} from "react-native-reanimated-table";
import {useNavigation} from "@react-navigation/native";
import {Color} from "@/js/color.ts";
import {useTheme} from "@rneui/themed";

export function StuEvaluation() {
    const {theme} = useTheme();
    const [evaList, setEvaList] = useState<Evaluation[]>([]);
    const navigation = useNavigation<any>();
    const screenWidth = Dimensions.get("window").width;
    const colWidths = [screenWidth * 0.45, screenWidth * 0.3, screenWidth * 0.25];
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
            backgroundColor: theme.colors.background,
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
            borderBottomColor: theme.colors.primary,
            alignItems: "center",
            backgroundColor: theme.colors.background,
        },
        rowText: {
            textAlign: "center",
            color: theme.colors.black,
            fontSize: 14,
        },
    });

    async function init() {
        const res = await infoQuery.getEvaluateList();
        setEvaList(res.items);
        console.log(res.items);
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={{width: "100%"}}>
                <Table>
                    <Row
                        data={["课程", "教师", "评价"]}
                        style={styles.header}
                        widthArr={colWidths}
                        textStyle={styles.headerText}
                    />
                    {evaList.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => handleRowPress(item)}>
                            <Row
                                data={[item.kcmc, item.jzgmc, item.tjztmc]}
                                style={styles.row}
                                widthArr={colWidths}
                                textStyle={styles.rowText}
                            />
                        </TouchableOpacity>
                    ))}
                </Table>
            </View>
        </ScrollView>
    );
}
