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

/**
 * 教务系统完全不在后端做校验，仅靠前端传过去的这个数字标注状态——
 * 0:“未评完" 1:“已评完”
 **/
type EvaStatus = "0" | "1";

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
    pjzt: EvaStatus;
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

export interface EvaSelected {
    modelList: [{
        pjzt: string;
        xspjList: [{
            childXspjList: [pfdjdmxmb_id: string],
        }],
    }];
}
