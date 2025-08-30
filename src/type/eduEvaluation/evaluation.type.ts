// 发请求获取评价总况的必备参数
export interface Evaluation {
    /** 教工号ID（疑似经SHA256加密）*/
    jgh_id: string;
    /** 教学班ID */
    jxb_id: string;
    /** 课程号ID */
    kch_id: string;
    /** 学生代码 */
    xsdm: string;
    /** ? */
    pjmbmcb_id: string;

    // 前端显示
    /** 评价状态 */
    tjztmc: string;
    /** 教师姓名 */
    jzgmc: string;
    /** 课程名称 */
    kcmc: string;
}

// 评价ID（传上教务系统的）
export interface EvaluationRequest {
    ztpjbl: number;
    jxb_id: string;
    jgh_id: string;
    kch_id: string;
    xsdm: string;

    modelList: EvaluationRequestModel[];
}

export interface EvaluationIds {
    formId: string;
    panelId: string;
    sections: EvaluationIdSection[];
}

/**
 * 教务系统完全不在后端做校验，仅靠前端传过去的这个数字标注状态——
 * 0:“未评完" 1:“已评完”
 **/
type EvaluationStatus = "0" | "1";

interface EvaluationIdSection {
    sectionId: string;
    questions: EvaluationIdQuestion[];
}

interface EvaluationIdQuestion {
    pfId: string;
    pjId: string;
    zsId: string;
    optionIds: string[];
}

interface EvaluationRequestModel {
    pjmbmcb_id: string;
    pjdxdm: string;
    fxzgf: null;
    py: string;
    xspfb_id: string;
    pjzt: EvaluationStatus;
    xspjList: EvaluationRequestSection[];
}

interface EvaluationRequestSection {
    pjzbxm_id: string;
    childXspjList: EvaluationRequestItem[];
}

interface EvaluationRequestItem {
    // 以下三个参数，无论选项是否为空，都必须传入
    zsmbmcb_id: string;
    pjzbxm_id: string;
    pfdjdmb_id: string;
    // 这个参数决定选哪个选项，不选则不传
    pfdjdmxmb_id?: string[5];
}
