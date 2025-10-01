import {store} from "@/js/store.ts";

export const userMgr = {
    storeJWAccount: (username: string, password: string) => {
        store.save({
            key: "userAccount",
            data: {
                username,
                password,
            },
        });
    },
    getJWAccount: () => {
        return store
            .load<{username: string; password: string}>({
                key: "userAccount",
            })
            .catch(e => {
                console.warn(e);
                return null;
            });
    },
    storeAuthAccount: (username: string, password: string) => {
        store.save({
            key: "userAuthAccount",
            data: {
                username,
                password,
            },
        });
    },
    getAuthAccount: () => {
        return store
            .load<{username: string; password: string}>({
                key: "userAuthAccount",
            })
            .catch(e => {
                console.warn(e);
                return null;
            });
    },
};
