import {store} from "@/js/store.ts";
import {AttendanceSystemLoginResp} from "@/type/api/auth/attendanceSystem.ts";

export const userMgr = {
    storeJWAccount: (username: string, password: string) => {
        return store.save({
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
        return store.save({
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
    attendanceSystem: {
        storeAccount: (username: string, password: string) => {
            return store.save({
                key: "attendanceSystemAccount",
                data: {
                    username,
                    password,
                },
            });
        },
        getAccount: () => {
            return store
                .load<{username: string; password: string}>({
                    key: "attendanceSystemAccount",
                })
                .catch(e => {
                    console.warn(e);
                    return null;
                });
        },
        storeLoginRes: (res: AttendanceSystemLoginResp) => {
            return store.save({
                key: "attendanceSystemLoginRes",
                data: res,
            });
        },

        getLoginRes: () => {
            return store
                .load<AttendanceSystemLoginResp>({
                    key: "attendanceSystemLoginRes",
                })
                .catch(e => {
                    console.warn(e);
                    return null;
                });
        },
    },
};
