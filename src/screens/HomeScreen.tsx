import {ScrollView} from "react-native";
import {CourseScheduleCard} from "../components/tool/infoQuery/courseSchedule/CourseScheduleCard.tsx";
import {ComingExamCard} from "../components/tool/infoQuery/examInfo/ComingExamCard.tsx";

export function HomeScreen() {
    return (
        <ScrollView>
            {/*<ComingExamCard />*/}
            <CourseScheduleCard />
        </ScrollView>
    );
}
