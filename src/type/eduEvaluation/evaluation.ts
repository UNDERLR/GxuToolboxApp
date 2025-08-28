export interface Evaluation {
    // 发请求获取评价总况的必备参数
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
