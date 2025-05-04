import {ScrollView} from "react-native";
import {CourseScheduleCard} from "../components/tool/infoQuery/courseSchedule/CourseScheduleCard.tsx";

export function HomeScreen() {
    return (
        <ScrollView>
            <CourseScheduleCard />
        </ScrollView>
    );
}
