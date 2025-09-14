import {useState, useEffect} from "react";
import {ExamScoreQueryRes} from "@/type/exam.ts";

/**
 * @param score 成绩查询结果对象
 * @returns 计算出的 GPA（平均学分绩点） 值
 * @description 计算所依据的文件：《广西大学普通本科学生课程修读、考核及成绩管理办法（2019年修订）》
 *
 * 为了检查学生学习质量，学校采用课程学分绩点、平均学分绩点、加权平均成绩来衡量学生学习的质量。
 *
 * （一）课程学分绩点按以下简化公式计算：
 *
 * 课程的学分绩点＝[（课程考核成绩÷课程考核满分值）×100]/10－5
 *
 * 其中，考核不合格未取得学分的课程，其学分绩点为零。
 *
 * （二）平均学分绩点按下式计算：
 *
 * 平均学分绩点＝∑（课程学分绩点×取得的课程学分×K）/ ∑ 修读课程学分
 *
 * 其中，取得的课程学分，指修读课程中已及格课程所对应的学分；课程考核总评成绩（或折算成绩）达到合格标准（即百分制60分及以上或五级制及格及以上）的即取得学分；K为课程系数，没有特别说明时，K取值为1。
 *
 * （三）加权平均成绩按下式计算：
 *
 * 加权平均成绩＝∑[（课程考核成绩÷课程考核满分值）×100×修读课程学分×K] / ∑ 修读课程学分
 *
 * （四）平均学分绩点按学期计算的为学期平均学分绩点，按学年计算的为学年平均学分绩点，从入学后不分学期累计计算的为累计平均学分绩点，按入学后至毕业计算的为毕业平均学分绩点。加权平均成绩的计算方法与上述方法一致。
 *
 * （五）原则上计算学生课程学分绩点、平均学分绩点、加权平均成绩时，计算结果一般按四舍五入法保留至小数后两位。
 */
export function useGpa(score: ExamScoreQueryRes | null | undefined) {
    const [gpa, setGpa] = useState(0);
    // 平均加权成绩
    const [weightedAverage, setWeightedAverage] = useState(0);
    useEffect(() => {
        if (!score?.items || score.items.length === 0) {
            setGpa(0);
            setWeightedAverage(0);
            return;
        }

        const {totalWeightedScore, totalCredits} = score.items.reduce(
            (acc, item) => {
                const cj = parseFloat(item.cj);
                const xf = parseFloat(item.xf);

                if (!isNaN(cj) && !isNaN(xf) && xf > 0) {
                    acc.totalWeightedScore += cj * xf;
                    acc.totalCredits += xf;
                }
                return acc;
            },
            {totalWeightedScore: 0, totalCredits: 0},
        );

        const newWeightedAverage = totalCredits > 0 ? totalWeightedScore / totalCredits : 0;
        setWeightedAverage(newWeightedAverage);

        // 暂时将 gpa 也设置为加权平均分，以便在 UI 中显示
        setGpa(newWeightedAverage);

    }, [score]);

    return gpa;
}
