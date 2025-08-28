// 评价ID（传上教务系统的）
export interface EvaReq {
    ztpjbl: number;
    jxb_id: string;
    jgh_id: string;
    kch_id: string;
    xsdm: string;

    modelList: EvaReqModel[];
}

export interface EvaluationIds {
    formId: string;
    panelId: string;
    sections: EvaSection[];
}

interface EvaSection {
    sectionId: string;
    questions: EvaQuestion[];
}

interface EvaQuestion {
    pfId: string;
    pjId: string;
    zsId: string;
    optionIds: string[];
}

interface EvaReqModel {
    pjmbmcb_id: string;
    pjdxdm: string;
    fxzgf: null;
    py: string;
    xspfb_id: string;

    xspjList: EvaReqSection[];
}

interface EvaReqSection {
    pjzbxm_id: string;
    childXspjList: EvaReqProblem[];
}

interface EvaReqProblem {
    // 以下三个参数，无论选项是否为空，都必须传入
    zsmbmcb_id: string;
    pjzbxm_id: string;
    pfdjdmb_id: string;
    // 这个参数决定选哪个选项，不选则不传
    pfdjdmxmb_id?: string[5];
}

export const defaultEvaReqIds: EvaReq = {
    ztpjbl: 0,
    jxb_id: "",
    jgh_id: "",
    kch_id: "",
    xsdm: "",

    modelList: [
        {
            pjmbmcb_id: "",
            pjdxdm: "",
            fxzgf: null,
            py: "",
            xspfb_id: "",

            xspjList: [
                /* 第一部分 */
                {
                    pjzbxm_id: "",
                    childXspjList: [
                        /* 4 题 */
                        {zsmbmcb_id: "", pjzbxm_id: "", pfdjdmb_id: "", pfdjdmxmb_id: ""},
                        {zsmbmcb_id: "", pjzbxm_id: "", pfdjdmb_id: "", pfdjdmxmb_id: ""},
                        {zsmbmcb_id: "", pjzbxm_id: "", pfdjdmb_id: "", pfdjdmxmb_id: ""},
                        {zsmbmcb_id: "", pjzbxm_id: "", pfdjdmb_id: "", pfdjdmxmb_id: ""},
                    ],
                },

                /* 第二部分 */
                {
                    pjzbxm_id: "",
                    childXspjList: [
                        /* 3 题 */
                        {zsmbmcb_id: "", pjzbxm_id: "", pfdjdmb_id: "", pfdjdmxmb_id: ""},
                        {zsmbmcb_id: "", pjzbxm_id: "", pfdjdmb_id: "", pfdjdmxmb_id: ""},
                        {zsmbmcb_id: "", pjzbxm_id: "", pfdjdmb_id: "", pfdjdmxmb_id: ""},
                    ],
                },

                /* 第三部分 */
                {
                    pjzbxm_id: "",
                    childXspjList: [
                        {zsmbmcb_id: "", pjzbxm_id: "", pfdjdmb_id: "", pfdjdmxmb_id: ""},
                        {zsmbmcb_id: "", pjzbxm_id: "", pfdjdmb_id: "", pfdjdmxmb_id: ""},
                        {zsmbmcb_id: "", pjzbxm_id: "", pfdjdmb_id: "", pfdjdmxmb_id: ""},
                    ],
                },

                /* 第四部分 */
                {
                    pjzbxm_id: "",
                    childXspjList: [
                        {zsmbmcb_id: "", pjzbxm_id: "", pfdjdmb_id: "", pfdjdmxmb_id: ""},
                        {zsmbmcb_id: "", pjzbxm_id: "", pfdjdmb_id: "", pfdjdmxmb_id: ""},
                        {zsmbmcb_id: "", pjzbxm_id: "", pfdjdmb_id: "", pfdjdmxmb_id: ""},
                    ],
                },

                /* 第五部分 */
                {
                    pjzbxm_id: "",
                    childXspjList: [
                        {zsmbmcb_id: "", pjzbxm_id: "", pfdjdmb_id: "", pfdjdmxmb_id: ""},
                        {zsmbmcb_id: "", pjzbxm_id: "", pfdjdmb_id: "", pfdjdmxmb_id: ""},
                        {zsmbmcb_id: "", pjzbxm_id: "", pfdjdmb_id: "", pfdjdmxmb_id: ""},
                    ],
                },
            ],
        },
    ],
};
