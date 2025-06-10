import {SchoolLabel} from "@/type/global.ts";

export interface Subject {
    /** 学院代码 */
    jg_id: string;
    /** 学院名称 */
    jgmc: string;
    /**  */
    jgpxzd: string;
    /** 专业代码 */
    zyh: string;
    /** 专业代码 */
    zyh_id: string;
    /** 专业名称和专业代码 */
    zymc: string;
}

export interface Class extends Subject {
    /** 班级代号 */
    bh: string;
    /** 班级代号 */
    bh_id: string;
    /** 班级名称 */
    bj: string;
    /** 年级id */
    njdm_id: string;
    /** 年级名称 */
    njmc: string;
    /**  */
    xqh_id: string;
}

export interface UserInfo {
    /** 名字 */
    name: string;
    /** 用户身份 */
    character: "学生";
    /** 学院 */
    school: SchoolLabel;
    /** 班级 */
    class: string;
    /** 专业 */
    subject: string;
}
