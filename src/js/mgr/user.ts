import {store} from "@/js/store.ts";

export const userMgr = {
    storeAccount: (username: string, password: string) => {
        store.save({
            key: "userAccount",
            data: {
                username,
                password,
            },
        });
    },
    storeToken: (token: string) => {
        store.save({
            key: "userToken",
            data: token,
        });
    },
    getAccount: () => {
        return store
            .load<{username: string; password: string}>({
                key: "userAccount",
            })
            .catch(e => {
                console.warn(e);
                return null;
            });
    },
    getToken: () => {
        return store.load<string>({
            key: "userToken",
        });
    },
};
