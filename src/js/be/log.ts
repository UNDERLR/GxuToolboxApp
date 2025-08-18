import {httpBE} from "@/js/be.ts";
import {AxiosResponse} from "axios";

export const beQuery = {
    postLog: async (username: string): Promise<AxiosResponse> => {
        console.log(username);
        return await httpBE.post("/api/jwt/log/record",
            {
                studentId:username,
            });
    },
};
