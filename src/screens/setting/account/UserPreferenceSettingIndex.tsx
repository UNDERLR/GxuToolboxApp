import {ScrollView} from "react-native";
import {useContext} from "react";
import {UserConfigContext} from "@/components/AppProvider.tsx";
import {UnListSection, UnSectionList} from "@/components/un-ui/UnSectionList.tsx";

export function UserPreferenceSettingIndex() {
    const {userConfig, updateUserConfig} = useContext(UserConfigContext);

    const settingList: UnListSection[] = [
        {
            title: "信息显示",
            data: [
                {
                    label: "课程元素详情显示",
                    type: "navigation",
                    value: "CourseItemDetailSetting",
                },
                {
                    label: "考试元素详情显示",
                    type: "navigation",
                    value: "ExamItemDetailSetting",
                },
            ],
        },
    ];

    return (
        <ScrollView style={{padding: "5%"}}>
            <UnSectionList list={settingList} />
        </ScrollView>
    );
}
