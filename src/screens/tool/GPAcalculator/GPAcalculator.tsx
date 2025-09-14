import {ScrollView, View, StyleSheet} from "react-native";
import {ChooseTerm} from "@/components/tool/infoQuery/examInfo/ChooseTerm.tsx";
import {examApi} from "@/js/jw/exam.ts";
import {Text, useTheme} from "@rneui/themed";
import {useState} from "react";
import {ExamScoreQueryRes} from "@/type/exam.ts";
import {useGpa} from "@/hooks/useGpa.ts";

export function GPAcalculator() {
    const {theme} = useTheme();
    const [score, setScore] = useState<ExamScoreQueryRes | null>();
    const gpa = useGpa(score);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        listContainer: {
            paddingHorizontal: 16,
        },
        headerRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 10,
            borderBottomWidth: 2,
            borderBottomColor: theme.colors.primary,
            marginBottom: 5,
        },
        headerText: {
            fontWeight: "bold",
            fontSize: 16,
            color: theme.colors.black,
            flex: 1,
        },
        scoreRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey4,
        },
        courseName: {
            flex: 2,
            fontSize: 15,
            color: theme.colors.black,
        },
        creditText: {
            flex: 1,
            textAlign: "right",
            fontSize: 15,
            color: theme.colors.grey1,
        },
        scoreText: {
            flex: 1,
            textAlign: "center",
            fontSize: 15,
            fontWeight: "bold",
            color: theme.colors.black,
        },
        gpaContainer: {
            marginHorizontal: 10,
            marginTop: 10,
            padding: 20,
            backgroundColor: theme.colors.white,
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center",
        },
        gpaValue: {
            fontSize: 32,
            fontWeight: "bold",
            color: theme.colors.primary,
        },
        listTitle: {
            marginHorizontal: 15,
            marginTop: 15,
            marginBottom: 5,
            fontSize: 16,
            fontWeight: "bold",
            color: theme.colors.grey1,
        },
    });

    return (
        <View style={styles.container}>
            <ChooseTerm
                onTermSelect={async (year, term) => {
                    const res = await examApi.getExamScore(year, term, 1, 100);
                    setScore(res);
                }}
            />
            <View style={styles.gpaContainer}>
                <Text style={styles.gpaValue}>{gpa.toFixed(3)}</Text>
            </View>
            <Text style={styles.listTitle}>数据来源</Text>
            <ScrollView style={styles.listContainer}>
                {score?.items && score.items.length > 0 && (
                    <View style={styles.headerRow}>
                        <Text style={[styles.headerText, {flex: 2, textAlign: "left"}]}>课程名称</Text>
                        <Text style={[styles.headerText, {textAlign: "center"}]}>分数</Text>
                        <Text style={[styles.headerText, {textAlign: "right"}]}>学分</Text>
                    </View>
                )}
                {score?.items?.map((item, index) => (
                    <View key={index} style={styles.scoreRow}>
                        <Text style={styles.courseName}>{item.kcmc}</Text>
                        <Text style={styles.scoreText}>{item.cj}</Text>
                        <Text style={styles.creditText}>{item.xf}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
