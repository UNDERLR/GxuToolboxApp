import {Class, Profession} from "@/type/infoQuery/base.ts";
import {PageModel} from "@/type/global.ts";

export interface GetProfessionListApiRes extends Array<Profession & PageModel> {}
export interface GetClassListApiRes extends Array<Class & PageModel> {}
