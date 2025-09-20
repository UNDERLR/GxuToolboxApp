import {httpBE} from "@/js/be.ts";
import {AxiosResponse} from "axios";

export const beQuery = {
    postLog: async (username: string): Promise<AxiosResponse> => {
        return await httpBE.post("/app/record", {
            studentId: username,
        });
    },
};
