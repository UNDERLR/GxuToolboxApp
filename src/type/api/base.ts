import {Class, Profession} from "@/type/infoQuery/base.ts";
import {PageModel} from "@/type/global.ts";

export interface GetProfessionListRes extends Array<Profession & PageModel> {}
export interface GetClassListRes extends Array<Class & PageModel> {}
