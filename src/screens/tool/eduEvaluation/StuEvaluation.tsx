import {useEffect, useState} from "react";
import {infoQuery} from "@/js/jw/infoQuery.ts";
import {Evaluation} from "@/type/eduEvaluation/evaluation.ts";
import {Dimensions, ScrollView, TouchableOpacity, View} from "react-native";
import {Row, Table} from "react-native-reanimated-table";
import {useNavigation} from "@react-navigation/native";

export function StuEvaluation() {
    const [evaList, setEvaList] = useState<Evaluation[]>([]);
    const navigation = useNavigation<any>();
    const screenWidth = Dimensions.get("window").width;
    const colWidths = [
        screenWidth * 0.45,
        screenWidth * 0.30,
        screenWidth * 0.25,
    ];
    const handleRowPress = (item: Evaluation) => {
        navigation.navigate("EvaDetail", {evaluationItem: item});
    };

    const styles = {
        list: {
            padding: 15,
            fontSize: 18,
            borderBottomWidth: 1,
            borderBottomColor: "yellow",
        },
    };

    async function init() {
        const res = await infoQuery.getEvaluateList();
        setEvaList(res.items);
        console.log(res.items);
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <ScrollView style={{flex: 1}}>
            <View style={{width: "100%"}}>
                <Table>
                    <Row
                        data={["课程", "教师", "评价"]}
                        style={styles.list}
                        widthArr={colWidths}/>
                    {evaList.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => handleRowPress(item)}>
                            <Row
                                data={[item.kcmc, item.jzgmc, item.tjztmc]}
                                style={styles.list}
                                widthArr={colWidths}/>
                        </TouchableOpacity>
                    ))}
                </Table>
            </View>
        </ScrollView>
    );
}
