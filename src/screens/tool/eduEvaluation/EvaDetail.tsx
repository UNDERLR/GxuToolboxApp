import {RouteProp, useRoute} from "@react-navigation/native";
import {Evaluation} from "@/type/eduEvaluation/evaluation.ts";
import {FlatList, StyleSheet, TouchableOpacity, View} from "react-native";
import {Button, Text, useTheme} from "@rneui/themed";
import {infoQuery} from "@/js/jw/infoQuery.ts";
import {memo, useCallback, useEffect, useLayoutEffect, useState} from "react";
import cheerio from "react-native-cheerio";
import Flex from "@/components/un-ui/Flex.tsx";
import {Color} from "@/js/color.ts";
import {UnOption} from "@/components/un-ui/UnOption.tsx";

type RootStackParamList = {
    EvaDetail: {evaluationItem: Evaluation};
};

type SelectedMap = Record<number, Record<string, number>>;

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

interface Evaluation {
    kcmc: any;
    jzgmc: any;
    tjztmc: any;
    course: string;
    classTime: string;
    className: string;
    studentCount: number;
    teachers: Teacher[];
}

const CatEle = memo(({cat, catIdx, styles, onSelect}: {cat: Category; catIdx: number} & any) => (
    <View style={styles.category}>
        <Text style={styles.categoryName}>
            {cat.name} (权重 {cat.qzz})
        </Text>

        {cat.items.map((it, itIdx) => (
            <UnOption
                key={it.pfdjdmb_id + it.pjzbxm_id}
                options={it.options.map(item => ({
                    ...item,
                    key: item.pfdjdmxmb_id,
                    checked: item.checked === true,
                }))}
                label={it.title}
                onSelect={optIdx => onSelect(catIdx, itIdx, optIdx)}
            />
        ))}
    </View>
));

export function EvaDetail({navigation}) {
    const {theme} = useTheme();
    const [response, setResponse] = useState<string>("");
    const [data, setData] = useState<Evaluation>();
    const [categories, setCategories] = useState<Category[]>([]);
    const [comment, setComment] = useState<string>("");
    const [ids, setIds] = useState();
    const [selected, setSelected] = useState<SelectedMap>({});
    const route = useRoute<RouteProp<RootStackParamList, "EvaDetail">>();
    const {evaluationItem} = route.params;

    const onSelect = useCallback((catIdx: number, itIdx: number, optIdx: number) => {
        const itemKey = `0-${catIdx}-${itIdx}`;
        selected["0"] = {
            ...(selected["0"] || {}),
            [itemKey]: optIdx,
        };
    }, []);

    useEffect(() => {
        console.log("Selected state updated:", selected);
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

    /** 解析HTML页面 */
    const parseEvaluationHTML = (html: string): any => {
        /* ---------- 0. 基本环境 ---------- */
        const $ = cheerio.load(html);

        /* ---------- 1. 课程头部信息 ---------- */

        /* ---------- 2. 教师列表 ---------- */
        const teachers: Teacher[] = [];
        const $panels = $(".panel-pjdx");

        $panels.each((idx: number, panel: any) => {
            const $panel = $(panel);

            /* 2.1 教师姓名 */
            const rawTitle = $panel.find(".panel-title").text();
            const teacherName = rawTitle.match(/评价对象（教师）(.*?)总分/)?.[1]?.trim() || "";

            /* 2.2 大指标（blockquotes） */
            const categories: Category[] = [];
            const $blockquotes = $panel.find("blockquote");

            $blockquotes.each((bIdx, bq) => {
                const $bq = $(bq);
                const categoryName = $bq.find("p").text().trim();

                const $table = $bq.next("table");
                if ($table.length === 0) {
                    console.error("      ❌ blockquote 后没有 table！");
                    return;
                }
                const categoryQzz = parseFloat($table.attr("data-qzz") || "1");

                /* 2.3 小指标 tr */
                const items: Item[] = [];
                const $trs = $table.find("tr.tr-xspj");

                $trs.each((tIdx, tr) => {
                    const $tr = $(tr);
                    const title = $tr.find("td").first().text().trim();
                    const qzz = parseFloat($tr.attr("data-qzz") || "1");

                    /* 2.4 选项 */
                    const options: Option[] = [];
                    const $labels = $tr.find(".radio-inline");

                    $labels.each((oIdx, label) => {
                        const $label = $(label);
                        const input = $label.find("input");
                        const opt: Option = {
                            label: $label.text().trim(),
                            score: parseInt(input.attr("data-dyf")!, 10),
                            pfdjdmxmb_id: input.attr("data-pfdjdmxmb_id")!,
                            checked: input.is("[checked]"),
                        };
                        if (opt.checked) {
                            const itemId = `${idx}-${bIdx}-${tIdx}`;
                            setSelected(prev => {
                                return {
                                    ...prev,
                                    [idx]: {
                                        ...prev[idx],
                                        [itemId]: oIdx,
                                    },
                                };
                            });
                        }
                        options.push(opt);
                    });

                    items.push({
                        title,
                        qzz,
                        options,
                        pjzbxm_id: $tr.attr("data-pjzbxm_id")!,
                        pfdjdmb_id: $tr.attr("data-pfdjdmb_id")!,
                    });
                });

                categories.push({name: categoryName, qzz: categoryQzz, items});
            });

            /* 2.5 评语 */
            const commentTextarea = $panel.nextAll("#pyDiv").find("textarea");
            const comment = commentTextarea.attr("placeholder") || "";

            teachers.push({name: teacherName, categories, comment});
        });

        /* ---------- 3. 返回 ---------- */
        return {
            teachers,
        };
    };

    /** 解析被SHA1加密的请求ID */
    const EvaIds = (html: string): any => {
        return Array.from(
            (html.match(/data-(?:xspfb_id\s*=\s*['"]{2}|[\w_]+_id\s*=\s*['"]([0-9A-F]{32})['"])/gi) || []).map(m => {
                // 判断是否是 xspfb_id
                if (m.includes("xspfb_id")) {
                    // 如果是，则尝试匹配ID。匹配到则返回ID，否则返回空字符串
                    const idMatch = m.match(/[0-9a-f]{32}/i);
                    return idMatch ? idMatch[0] : "";
                } else {
                    // 如果不是 xspfb_id，则使用原有的逻辑，直接提取ID
                    return m.match(/[0-9a-f]{32}/i)![0];
                }
            }),
        );
    };

    const FastSubmit = () => {
        console.log(selected);
        const defaultSelected = {
            "0": {
                "0-0-0": 0,
                "0-0-1": 0,
                "0-0-2": 0,
                "0-0-3": 0,
                "0-1-0": 0,
                "0-1-1": 0,
                "0-1-2": 0,
                "0-2-0": 0,
                "0-2-1": 0,
                "0-2-2": 1,
                "0-3-0": 0,
                "0-3-1": 0,
                "0-3-2": 0,
                "0-4-0": 0,
                "0-4-1": 0,
                "0-4-2": 0,
            },
        };
        setSelected(defaultSelected);
        const defaultComment =
            "老师专业功底深厚，治学态度严谨。在教学中，您逻辑清晰，重点突出，" +
            "善于运用启发式教学引导我们独立思考，将理论与实践紧密结合。课堂富有感染力，" +
            "不仅传授了我们前沿的知识，更点燃了我们对该领域的探索热情。是我们学术道路上当之无愧的引路人。" +
            "老师的悉心栽培令我们受益匪浅！";
        setComment(defaultComment);
        handleSubmit(defaultSelected, defaultComment);
    };
    /** 点击提交按钮触发提交 */
    const handleSubmit = async (submitSelected = selected, submitComment: string = comment) => {
        console.log('start-saving');
        const f = (x: number, y: number, z: number) => {
            if (x === 0) {
                return 7 + 8 * y + z;
            }
            return 40 + 25 * (x - 1) + 8 * y + z;
        };
        let newsub = {};
        console.log(submitSelected, selected);
        Object.entries(submitSelected[0]).forEach(([key, z]) => {
            const [xStr, yStr] = key.split("-").slice(1); // 忽略第一个"0"
            const x = parseInt(xStr, 10);
            const y = parseInt(yStr, 10);
            const result = f(x, y, z);
            newsub = {
                ...newsub,
                [`modelList[0].xspjList[${x}].childXspjList[${y}].pfdjdmxmb_id`]: ids![result],
            };
        });
        console.log(selected[0], newsub, ids.length);
        await infoQuery.handleEvaResult(
            {
                ztpjbl: 100,
                jxb_id: evaluationItem.jxb_id,
                jgh_id: evaluationItem.jgh_id,
                kch_id: evaluationItem.kch_id,
                xsdm: evaluationItem.xsdm,

                "modelList[0].pjmbmcb_id": ids![1],
                "modelList[0].pjdxdm": "01",
                "modelList[0].fxzgf": null,
                "modelList[0].py": submitComment,
                "modelList[0].xspfb_id": ids![2],

                "modelList[0].xspjList[0].pjzbxm_id": ids![3],
                "modelList[0].xspjList[0].childXspjList[0].zsmbmcb_id": ids![4],
                "modelList[0].xspjList[0].childXspjList[0].pjzbxm_id": ids![5],
                "modelList[0].xspjList[0].childXspjList[0].pfdjdmb_id": ids![6],

                "modelList[0].xspjList[0].childXspjList[1].zsmbmcb_id": ids![12],
                "modelList[0].xspjList[0].childXspjList[1].pjzbxm_id": ids![13],
                "modelList[0].xspjList[0].childXspjList[1].pfdjdmb_id": ids![14],

                "modelList[0].xspjList[0].childXspjList[2].zsmbmcb_id": ids![20],
                "modelList[0].xspjList[0].childXspjList[2].pjzbxm_id": ids![21],
                "modelList[0].xspjList[0].childXspjList[2].pfdjdmb_id": ids![22],

                "modelList[0].xspjList[0].childXspjList[3].zsmbmcb_id": ids![28],
                "modelList[0].xspjList[0].childXspjList[3].pjzbxm_id": ids![29],
                "modelList[0].xspjList[0].childXspjList[3].pfdjdmb_id": ids![30],

                "modelList[0].xspjList[1].pjzbxm_id": ids![3 + 33],
                "modelList[0].xspjList[1].childXspjList[0].zsmbmcb_id": ids![4 + 33],
                "modelList[0].xspjList[1].childXspjList[0].pjzbxm_id": ids![5 + 33],
                "modelList[0].xspjList[1].childXspjList[0].pfdjdmb_id": ids![6 + 33],
                "modelList[0].xspjList[1].childXspjList[1].zsmbmcb_id": ids![12 + 33],
                "modelList[0].xspjList[1].childXspjList[1].pjzbxm_id": ids![13 + 33],
                "modelList[0].xspjList[1].childXspjList[1].pfdjdmb_id": ids![14 + 33],
                "modelList[0].xspjList[1].childXspjList[2].zsmbmcb_id": ids![20 + 33],
                "modelList[0].xspjList[1].childXspjList[2].pjzbxm_id": ids![21 + 33],
                "modelList[0].xspjList[1].childXspjList[2].pfdjdmb_id": ids![22 + 33],

                "modelList[0].xspjList[2].pjzbxm_id": ids![3 + 33 + 25],
                "modelList[0].xspjList[2].childXspjList[0].zsmbmcb_id": ids![4 + 33 + 25],
                "modelList[0].xspjList[2].childXspjList[0].pjzbxm_id": ids![5 + 33 + 25],
                "modelList[0].xspjList[2].childXspjList[0].pfdjdmb_id": ids![6 + 33 + 25],
                "modelList[0].xspjList[2].childXspjList[1].zsmbmcb_id": ids![12 + 33 + 25],
                "modelList[0].xspjList[2].childXspjList[1].pjzbxm_id": ids![13 + 33 + 25],
                "modelList[0].xspjList[2].childXspjList[1].pfdjdmb_id": ids![14 + 33 + 25],
                "modelList[0].xspjList[2].childXspjList[2].zsmbmcb_id": ids![20 + 33 + 25],
                "modelList[0].xspjList[2].childXspjList[2].pjzbxm_id": ids![21 + 33 + 25],
                "modelList[0].xspjList[2].childXspjList[2].pfdjdmb_id": ids![22 + 33 + 25],

                "modelList[0].xspjList[3].pjzbxm_id": ids![3 + 33 + 50],
                "modelList[0].xspjList[3].childXspjList[0].zsmbmcb_id": ids![4 + 33 + 50],
                "modelList[0].xspjList[3].childXspjList[0].pjzbxm_id": ids![5 + 33 + 50],
                "modelList[0].xspjList[3].childXspjList[0].pfdjdmb_id": ids![6 + 33 + 50],
                "modelList[0].xspjList[3].childXspjList[1].zsmbmcb_id": ids![12 + 33 + 50],
                "modelList[0].xspjList[3].childXspjList[1].pjzbxm_id": ids![13 + 33 + 50],
                "modelList[0].xspjList[3].childXspjList[1].pfdjdmb_id": ids![14 + 33 + 50],
                "modelList[0].xspjList[3].childXspjList[2].zsmbmcb_id": ids![20 + 33 + 50],
                "modelList[0].xspjList[3].childXspjList[2].pjzbxm_id": ids![21 + 33 + 50],
                "modelList[0].xspjList[3].childXspjList[2].pfdjdmb_id": ids![22 + 33 + 50],

                "modelList[0].xspjList[4].pjzbxm_id": ids![3 + 33 + 75],
                "modelList[0].xspjList[4].childXspjList[0].zsmbmcb_id": ids![4 + 33 + 75],
                "modelList[0].xspjList[4].childXspjList[0].pjzbxm_id": ids![5 + 33 + 75],
                "modelList[0].xspjList[4].childXspjList[0].pfdjdmb_id": ids![6 + 33 + 75],
                "modelList[0].xspjList[4].childXspjList[1].zsmbmcb_id": ids![12 + 33 + 75],
                "modelList[0].xspjList[4].childXspjList[1].pjzbxm_id": ids![13 + 33 + 75],
                "modelList[0].xspjList[4].childXspjList[1].pfdjdmb_id": ids![14 + 33 + 75],
                "modelList[0].xspjList[4].childXspjList[2].zsmbmcb_id": ids![20 + 33 + 75],
                "modelList[0].xspjList[4].childXspjList[2].pjzbxm_id": ids![21 + 33 + 75],
                "modelList[0].xspjList[4].childXspjList[2].pfdjdmb_id": ids![22 + 33 + 75],

                "modelList[0].pjzt": 0,
                tjzt: 0,
            },
            newsub,
        );
        setSelected(submitSelected);
        init();
    };

    async function init() {
        const res = await infoQuery.getEvaluateDetail(
            evaluationItem.jgh_id,
            evaluationItem.jxb_id,
            evaluationItem.kch_id,
            evaluationItem.xsdm,
            evaluationItem.pjmbmcb_id,
        );
        setResponse(res);
        const k = parseEvaluationHTML(res);
        setData(k);
        setCategories(k.teachers![0].categories);
        console.log("fuck", k.teachers![0].categories);
        const l = EvaIds(res);
        setIds(l);
    }

    useEffect(() => {
        init();
    }, []);

    if (!data) {
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Text>网页正在载入数据中.请等待......</Text>
            </View>
        );
    }

    return (
        <Flex direction="column">
            <FlatList
                data={data.teachers}
                keyExtractor={(_, idx) => idx.toString()}
                renderItem={({item: teacher}) => (
                    <>
                        {ids.length >= 135 && (
                            <>
                                {/*<Button onPress={init}>refresh</Button>*/}
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
                            {categories.map((cat, catIdx) => (
                                <CatEle
                                    key={cat.name + cat.qzz}
                                    cat={cat}
                                    catIdx={catIdx}
                                    styles={styles}
                                    onSelect={onSelect}
                                />
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
                        {ids.length >= 135 && (
                            <TouchableOpacity onPress={() => handleSubmit()} style={styles.submitButton}>
                                <Text style={styles.submitButtonText}>保存</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}
            />
        </Flex>
    );
}
