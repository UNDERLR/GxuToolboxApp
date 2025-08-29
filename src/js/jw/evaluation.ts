import {EvaListQueryRes} from "@/type/api/eduEvaluataion/studentEvaluationAPI.ts";
import {jwxt} from "@/js/jw/jwxt.ts";
import {http, objectToFormUrlEncoded} from "@/js/http.ts";
import {ToastAndroid} from "react-native";

export const evaluationApi = {
    // 获得评价列表
    getEvaluationList: (): Promise<EvaListQueryRes> => {
        return new Promise(async (resolve, reject) => {
            if (!(await jwxt.testToken())) {
                reject();
                return;
            }
            const reqBody = objectToFormUrlEncoded({
                queryModel: {
                    showCount: 150,
                },
            });
            const res = await http.post("/xspjgl/xspj_cxXspjIndex.html?doType=query&gnmkdm=N401605", reqBody);
            if (typeof res.data === "object") {
                resolve(res.data);
            } else {
                ToastAndroid.show("获取评价信息失败", ToastAndroid.SHORT);
                reject(res);
            }
        });
    },
    getEvaluationDetail: (
        shaWord: string,
        classId: string,
        courseId: string,
        xsdm: string,
        pjmbmcb_id: string,
    ): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            if (!(await jwxt.testToken())) {
                reject();
                return;
            }
            const reqBody = objectToFormUrlEncoded({
                jgh_id: shaWord,
                jxb_id: classId,
                kch_id: courseId,
                xsdm,
                pjmbmcb_id,
            });
            const res = await http.post("/xspjgl/xspj_cxXspjDisplay.html?gnmkdm=N401605", reqBody);
            if (typeof res.data === "string") {
                resolve(res.data);
            } else {
                ToastAndroid.show("获取具体评价信息失败", ToastAndroid.SHORT);
                reject(res);
            }
        });
    },
    handleEvaResult: (Params1: object, Params2: object): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            if (!(await jwxt.testToken())) {
                reject();
                return;
            }
            const reqBody = objectToFormUrlEncoded(Params1) + "&" + objectToFormUrlEncoded(Params2);
            const res = await http.post("/xspjgl/xspj_bcXspj.html?gnmkdm=N401605", reqBody);
            console.log(res.data);
            if (typeof res.data === "string") {
                ToastAndroid.show(res.data, ToastAndroid.SHORT);
                resolve(res.data);
            } else {
                ToastAndroid.show("保存失败", ToastAndroid.SHORT);
                reject(res);
            }
        });
    },
};
