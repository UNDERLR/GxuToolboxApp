import {Class, Subject} from "@/type/infoQuery/base.ts";
import {PageModel} from "@/type/global.ts";

export interface GetSubjectListRes extends Array<Subject & PageModel> {}
export interface GetClassListRes extends Array<Class & PageModel> {}
