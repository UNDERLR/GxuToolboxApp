import {RouteProp, useRoute} from "@react-navigation/native";
import {ActivityIndicator, ScrollView, StyleSheet, ToastAndroid, TouchableOpacity, View} from "react-native";
import {Button, Text, useTheme} from "@rneui/themed";
import {useCallback, useEffect, useLayoutEffect, useState} from "react";
import {Color} from "@/js/color.ts";
import {EvaPOST} from "@/type/eduEvaluation/evaDetail.ts";
import {parseEvaluationHTML} from "@/js/jw/evaParser.ts";
import {EvaCategory} from "@/components/tool/eduEvaluation/EvaCategory.tsx";
import {EvaluationIds, EvaReq, EvaSelected} from "@/type/eduEvaluation/evaReqForIds.ts";
import {evaluationApi} from "@/js/jw/evaluation.ts";

type RootStackParamList = {
    EvaDetail: {evaluationItem: EvaPOST};
};

type SelectedMap = Record<number, Record<number, Record<number, number>>>;

interface Option {
    label: string; // 选项文字
    score: number; // 对应分值
    pfdjdmxmb_id: string; // 选项 ID
    checked?: boolean; // 是否默认选中
}

interface Item {
    title: string; // 指标标题
    qzz: number; // 权重
    options: Option[];
    // 其它业务字段
    pjzbxm_id: string;
    pfdjdmb_id: string;
}

interface Category {
    name: string; // 大指标名，如“师德表现”
    qzz: number; // 大指标权重
    items: Item[];
}

interface Teacher {
    name: string; // 教师姓名
    categories: Category[];
    comment?: string; // 评语
}

export function EvaDetail({navigation}) {
    const {theme} = useTheme();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<{teachers: Teacher[]}>();
    const [comment, setComment] = useState<string>("");
    const [ids, setIds] = useState<EvaluationIds>();
    const [selected, setSelected] = useState<SelectedMap>({});
    const [defaultReq, setDefaultReq] = useState<EvaReq>();
    const route = useRoute<RouteProp<RootStackParamList, "EvaDetail">>();
    const {evaluationItem} = route.params;

    const onSelect = useCallback((catIdx: number, itIdx: number, optIdx: number) => {
        const teacherIdx = 0; // 一个老师，就定义成常量
        setSelected(prev => ({
            ...prev,
            [teacherIdx]: {
                ...(prev[teacherIdx] || {}),
                [catIdx]: {
                    ...(prev[teacherIdx]?.[catIdx] || {}),
                    [itIdx]: optIdx,
                },
            },
        }));
    }, []);

    useEffect(() => {
        console.log("Selected state updated:", selected[0]);
        // for (const teacherIdx in selected) {
        //     for (const categoryIdx in selected[teacherIdx]) {
        //         for (const itemIdx in selected[teacherIdx][categoryIdx]) {
        //             const optionIdx = selected[teacherIdx][categoryIdx][itemIdx];
        //             console.log(`Teacher: ${teacherIdx}, Cat: ${categoryIdx}, Item: ${itemIdx}, Opt: ${optionIdx}`);
        //             console.log(ids?.sections[categoryIdx].questions[itemIdx].optionIds[optionIdx]);
        //         }
        //     }
        // }
    }, [selected]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: `学生评价细节 - ${evaluationItem.jzgmc}（${evaluationItem.kcmc}）`,
        });
    }, [navigation, evaluationItem]);

    const defaultColor = Color.mix(
        theme.colors.primary,
        theme.colors.black,
        theme.mode === "dark" ? 0.2 : 0.1,
    ).setAlpha(theme.mode === "dark" ? 0.5 : 0.8).rgbaString;

    const styles = StyleSheet.create({
        header: {fontSize: 24, fontWeight: "bold", marginBottom: 4},
        card: {padding: 12, marginVertical: 8, borderRadius: 8},
        category: {marginBottom: 10},
        categoryName: {fontSize: 16, fontWeight: "500", color: defaultColor, marginBottom: 4},
        item: {marginBottom: 8},
        itemTitle: {fontSize: 14, marginBottom: 4, marginLeft: 10, marginRight: 10},
        commentInput: {
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: defaultColor,
            backgroundColor: theme.colors.background,
            borderRadius: 8,
            marginBottom: 9,
            marginHorizontal: "3%",
            height: "auto",
        },
        optionButton: {
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: defaultColor,
            borderRadius: 8,
            marginBottom: 9,
        },
        optionButtonChecked: {
            backgroundColor: defaultColor,
        },
        optionText: {fontSize: 15, color: theme.colors.black},
        optionTextChecked: {color: "#fff", fontWeight: "bold"},
        comment: {marginTop: 8, fontSize: 13, fontStyle: "italic", color: defaultColor},
        submitButton: {
            backgroundColor: defaultColor,
            borderRadius: 8,
            paddingVertical: 12,
            paddingHorizontal: 20,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 10,
            marginHorizontal: 20,
        },
        submitButtonText: {
            color: "#fff",
            fontSize: 16,
            fontWeight: "bold",
        },
    });

    const FastSubmit = () => {
        const goodSelected = {
            0: {
                0: {0: 0, 1: 0, 2: 0, 3: 0},
                1: {0: 0, 1: 0, 2: 0},
                2: {0: 0, 1: 0, 2: 1},
                3: {0: 0, 1: 0, 2: 0},
                4: {0: 0, 1: 0, 2: 0},
            },
        };
        setSelected(goodSelected);
        const defaultComment =
            "老师专业功底深厚，治学态度严谨。在教学中，您逻辑清晰，重点突出，" +
            "善于运用启发式教学引导我们独立思考，将理论与实践紧密结合。课堂富有感染力，" +
            "不仅传授了我们前沿的知识，更点燃了我们对该领域的探索热情。是我们学术道路上当之无愧的引路人。" +
            "老师的悉心栽培令我们受益匪浅！";
        setComment(defaultComment);
        handleSubmit(goodSelected, defaultComment);
    };
    /** 点击提交按钮触发提交 */
    const handleSubmit = async (submitSelected = selected, submitComment: string = comment) => {
        console.log("start-saving");

        const reqToSend: EvaReq = JSON.parse(JSON.stringify(defaultReq));

        if (reqToSend.modelList[0]) {
            reqToSend.modelList[0].py = submitComment;
        }

        // 填充pfdjdmxmb_id
        for (const teacherIdx in submitSelected) {
            for (const categoryIdx in submitSelected[teacherIdx]) {
                for (const itemIdx in submitSelected[teacherIdx][categoryIdx]) {
                    const optionIdx = submitSelected[teacherIdx][categoryIdx][itemIdx];
                    const categoryIndex = Number(categoryIdx);
                    const itemIndex = Number(itemIdx);

                    const targetQuestion =
                        reqToSend.modelList?.[0]?.xspjList?.[categoryIndex]?.childXspjList?.[itemIndex];
                    const optionId = ids.sections?.[categoryIndex]?.questions?.[itemIndex]?.optionIds?.[optionIdx];

                    if (targetQuestion && optionId) {
                        targetQuestion.pfdjdmxmb_id = optionId;
                    } else {
                        console.warn(`无法为[${categoryIndex}-${itemIndex}]找到对应的请求路径或选项ID`);
                    }
                }
            }
        }

        const res = await evaluationApi.handleEvaResult(defaultReq, reqToSend);
        console.log(res);
        ToastAndroid.showWithGravity(res, ToastAndroid.SHORT, 5);
        setSelected(submitSelected);
        init();
    };

    // init，一点开页面就调用
    async function init() {
        setLoading(true);
        try {
            const HtmlText = await evaluationApi.getEvaluationDetail(
                evaluationItem.jgh_id,
                evaluationItem.jxb_id,
                evaluationItem.kch_id,
                evaluationItem.xsdm,
                evaluationItem.pjmbmcb_id,
            );
            const {idObj, teachers, selected} = parseEvaluationHTML(HtmlText);
            setData({teachers});
            setSelected(selected || {});
            setIds(idObj);
            console.log(idObj);
            const k: EvaReq = {
                jgh_id: evaluationItem.jgh_id,
                jxb_id: evaluationItem.jxb_id,
                kch_id: evaluationItem.kch_id,
                modelList: [
                    {
                        pjmbmcb_id: idObj.panelId,
                        pjdxdm: "",
                        xspfb_id: idObj.formId,
                        fxzgf: null,
                        py: "",
                        xspjList: [
                            {
                                pjzbxm_id: idObj.sections[0].sectionId,
                                childXspjList: [
                                    {
                                        zsmbmcb_id: idObj.sections[0].questions[0].zsId,
                                        pjzbxm_id: idObj.sections[0].questions[0].pjId,
                                        pfdjdmb_id: idObj.sections[0].questions[0].pfId,
                                    },
                                    {
                                        zsmbmcb_id: idObj.sections[0].questions[1].zsId,
                                        pjzbxm_id: idObj.sections[0].questions[1].pjId,
                                        pfdjdmb_id: idObj.sections[0].questions[1].pfId,
                                    },
                                    {
                                        pfdjdmb_id: idObj.sections[0].questions[2].pfId,
                                        pjzbxm_id: idObj.sections[0].questions[2].pjId,
                                        zsmbmcb_id: idObj.sections[0].questions[2].zsId,
                                    },
                                    {
                                        zsmbmcb_id: idObj.sections[0].questions[3].zsId,
                                        pjzbxm_id: idObj.sections[0].questions[3].pjId,
                                        pfdjdmb_id: idObj.sections[0].questions[3].pfId,
                                    },
                                ],
                            },
                            {
                                pjzbxm_id: idObj.sections[1].sectionId,
                                childXspjList: [
                                    {
                                        zsmbmcb_id: idObj.sections[1].questions[0].zsId,
                                        pjzbxm_id: idObj.sections[1].questions[0].pjId,
                                        pfdjdmb_id: idObj.sections[1].questions[0].pfId,
                                    },
                                    {
                                        zsmbmcb_id: idObj.sections[1].questions[1].zsId,
                                        pjzbxm_id: idObj.sections[1].questions[1].pjId,
                                        pfdjdmb_id: idObj.sections[1].questions[1].pfId,
                                    },
                                    {
                                        pfdjdmb_id: idObj.sections[1].questions[2].pfId,
                                        pjzbxm_id: idObj.sections[1].questions[2].pjId,
                                        zsmbmcb_id: idObj.sections[1].questions[2].zsId,
                                    },
                                ],
                            },
                            {
                                pjzbxm_id: idObj.sections[2].sectionId,
                                childXspjList: [
                                    {
                                        zsmbmcb_id: idObj.sections[2].questions[0].zsId,
                                        pjzbxm_id: idObj.sections[2].questions[0].pjId,
                                        pfdjdmb_id: idObj.sections[2].questions[0].pfId,
                                    },
                                    {
                                        zsmbmcb_id: idObj.sections[2].questions[1].zsId,
                                        pjzbxm_id: idObj.sections[2].questions[1].pjId,
                                        pfdjdmb_id: idObj.sections[2].questions[1].pfId,
                                    },
                                    {
                                        pfdjdmb_id: idObj.sections[2].questions[2].pfId,
                                        pjzbxm_id: idObj.sections[2].questions[2].pjId,
                                        zsmbmcb_id: idObj.sections[2].questions[2].zsId,
                                    },
                                ],
                            },
                            {
                                pjzbxm_id: idObj.sections[3].sectionId,
                                childXspjList: [
                                    {
                                        zsmbmcb_id: idObj.sections[3].questions[0].zsId,
                                        pjzbxm_id: idObj.sections[3].questions[0].pjId,
                                        pfdjdmb_id: idObj.sections[3].questions[0].pfId,
                                    },
                                    {
                                        zsmbmcb_id: idObj.sections[3].questions[1].zsId,
                                        pjzbxm_id: idObj.sections[3].questions[1].pjId,
                                        pfdjdmb_id: idObj.sections[3].questions[1].pfId,
                                    },
                                    {
                                        pfdjdmb_id: idObj.sections[3].questions[2].pfId,
                                        pjzbxm_id: idObj.sections[3].questions[2].pjId,
                                        zsmbmcb_id: idObj.sections[3].questions[2].zsId,
                                    },
                                ],
                            },
                            {
                                pjzbxm_id: idObj.sections[4].sectionId,
                                childXspjList: [
                                    {
                                        zsmbmcb_id: idObj.sections[4].questions[0].zsId,
                                        pjzbxm_id: idObj.sections[4].questions[0].pjId,
                                        pfdjdmb_id: idObj.sections[4].questions[0].pfId,
                                    },
                                    {
                                        zsmbmcb_id: idObj.sections[4].questions[1].zsId,
                                        pjzbxm_id: idObj.sections[4].questions[1].pjId,
                                        pfdjdmb_id: idObj.sections[4].questions[1].pfId,
                                    },
                                    {
                                        pfdjdmb_id: idObj.sections[4].questions[2].pfId,
                                        pjzbxm_id: idObj.sections[4].questions[2].pjId,
                                        zsmbmcb_id: idObj.sections[4].questions[2].zsId,
                                    },
                                ],
                            },
                        ],
                    },
                ],
                xsdm: "01",
                ztpjbl: 100,
            };
            setDefaultReq(k);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        init();
    }, []);

    if (loading) {
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Text style={{color: theme.colors.error}}>评教页面加载失败: {error}</Text>
                <Button onPress={init}>重试</Button>
            </View>
        );
    }

    return (
        <ScrollView>
            {1 && (
                <>
                    <TouchableOpacity onPress={FastSubmit} style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>应用默认评价示例</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleSubmit()} style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>保存</Text>
                    </TouchableOpacity>
                </>
            )}
            <View style={styles.card}>
                <Text style={styles.header}>
                    {evaluationItem.kcmc}——{evaluationItem.jzgmc}：{evaluationItem.tjztmc}
                </Text>
                {data!.teachers![0].categories.map((cat, catIdx) => (
                    <EvaCategory key={cat.name + cat.qzz} cat={cat} catIdx={catIdx} onSelect={onSelect} />
                ))}
            </View>
            <View>
                <Text style={[styles.categoryName, {paddingLeft: "3%"}]}>评语</Text>
                <TouchableOpacity
                    style={styles.commentInput}
                    onPress={() =>
                        navigation.navigate("Comment", {
                            initialComment: comment,
                            onSave: setComment,
                        })
                    }>
                    <Text style={{color: "#999"}}>{comment || "请输入评语"}</Text>
                </TouchableOpacity>
            </View>
            {1 && (
                <TouchableOpacity onPress={() => handleSubmit()} style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>保存</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
}
