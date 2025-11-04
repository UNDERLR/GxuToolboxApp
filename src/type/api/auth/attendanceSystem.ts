import {numBool, strNum} from "@/type/global.ts";

/**
 * 考勤系统类型定义命名空间
 */
export namespace AttendanceSystemType {
    /**
     * 分页查询参数接口
     * 用于定义分页查询所需的基本参数和可选参数
     */
    export interface PageQueryParam {
        /** 当前页码 */
        page_index: number;
        /** 每页显示记录数 */
        page_size: number;
        /** 排序字段 */
        order_by?: string;
        /** 搜索参数 */
        search?: SearchParam;
    }

    /**
     * 搜索参数接口
     * 用于定义搜索条件的相关参数
     */
    export interface SearchParam {
        /** 开始日期 */
        ksrq?: string;
        /** 结束日期 */
        jsrq?: string;
        /** 课程ID */
        courseId?: string;
    }

    /**
     * 通用响应结果接口
     * 用于封装API返回的通用结构
     * @template T - 返回数据的具体类型
     */
    export interface ResRoot<T> {
        /** 响应状态码 */
        code: number;
        /** 响应数据 */
        data: T;
        /** 响应消息 */
        msg: string;
    }

    /**
     * 分页响应结果接口
     * 用于封装分页查询的响应结果
     * @template T - 分页数据中每条记录的类型
     */
    export interface PageRes<T> {
        /** 响应状态码 */
        code: number;
        /** 分页数据 */
        data: {
            /** 当前页记录列表 */
            records: T[];
            /** 总记录数 */
            total_record: number;
            /** 总页数 */
            total_page: number;
            /** 当前页码 */
            page_index: number;
            /** 当前页实际记录数 */
            curren_records: number;
            /** 每页显示记录数 */
            page_size: number;
        };
        /** 响应消息 */
        msg: string;
    }

    /**
     * 学校考勤系统 - 登录数据载荷
     */
    export interface LoginData {
        /** 访问令牌（JWT） */
        token: string;
        /** 考勤人员档案 */
        userInfo: User;
        /** 当前人员角色编号列表 */
        roleNos: string[];
        /** 当前学期校历 */
        currentCalendar: Calendar;
        /** 当前学期第几周 */
        currentWeek: number;
        /** 学校档案列表 */
        schoolInfo: School[];
    }

    /**
     * 学校考勤系统 - 人员档案
     */
    export interface User {
        /** 人员主键ID */
        userId: number;
        /** 学工号（考勤唯一标识） */
        userNo: string;
        /** 姓名 */
        userName: string;
        /** 人员类别：4-学生 */
        userType: number;
        /** 行政班/部门ID */
        deptId: number;
        /** 行政班/部门编号 */
        deptNo: string;
        /** 行政班/部门名称 */
        deptName: string;
        /** 职务（教师） */
        userDuty: string | null;
        /** 联系电话 */
        phoneNo: string;
        /** 身份证号（脱敏） */
        userIdentity: string;
        /** 性别：1-男 2-女 */
        userSex: number;
        /** 指纹特征串（占位） */
        userFinger: string;
        /** 是否有校园卡：1-有 */
        userCard: number;
        /** 人脸特征（Base64，空表示未采集） */
        userPhoto: string | null;
        /** 证件照相对路径（用于考勤比对） */
        photoSrc: string;
        /** 人脸特征路径（空表示未采集） */
        userFace: string | null;
        /** 扩展信息（邮箱、地址、固话） */
        personInfo: PersonExtra;
        /** 学院ID */
        instituteId: number;
        /** 学院名称 */
        instituteName: string;
        /** 年级ID */
        gradeId: number;
        /** 年级名称 */
        gradeName: string;
        /** 专业ID */
        majorId: number;
        /** 专业名称 */
        majorName: string;
        /** 邮箱 */
        email: string;
        /** 账号状态：1-正常 */
        userState: number;
        /** 备注 */
        remark: string;
        /** 排序权重 */
        showOrder: number;
        /** 创建时间（ISO） */
        ctDate: string | null;
        /** 最后修改时间（ISO） */
        ltDate: string | null;
        /** 角色名称（冗余） */
        roleNames: string | null;
        /**  */
        userPassword: string | null;
        /**  */
        externalInfo: string | null;
        /**  */
        userWorkday: string | null;
        /**  */
        limitBegin: string | null;
        /**  */
        limitEnd: string | null;
        /**  */
        ctUserId: string | null;
        /**  */
        ltUserId: string | null;
        /**  */
        version: string | null;
        /**  */
        roleNos: string | null;
    }

    /**
     * 学校考勤系统 - 人员扩展信息
     */
    export interface PersonExtra {
        /** 固定为 jsonb */
        type: "jsonb";
        /** 序列化后的 JSON：{email?:string,address?:string,telephone?:string} */
        value: string;
    }

    /**
     * 学校考勤系统 - 学期校历
     */
    export interface Calendar {
        /** 校历主键 */
        calendarId: number;
        /** 校历名称：2025-3 表示 2025 学年秋季学期 */
        calendarName: string;
        /** 第一周开始日期（YYYY-MM-DD） */
        firstWeekBegin: string;
        /** 最后一周结束日期（YYYY-MM-DD） */
        lastWeekEnd: string;
        /** 总周数 */
        weekTotal: number;
        /** 每天最大节次 */
        periodMax: number;
        /** 系统可用开始日期 */
        systemBegin: string;
        /** 系统可用结束日期 */
        systemEnd: string;
        /** 系统时间描述 */
        systemTimeStr: string;
        /** 其余字段保留，暂无业务含义 */
        useStatusId: string | null;
        remark: string | null;
        holidayList: string | null;
        sourceNo: string | null;
        isCurrent: numBool | null;
        holidayStr: string | null;
        calendarDaysList: string | null;
        monthDataList: string | null;
    }

    /**
     * 学校考勤系统 - 学校档案
     */
    export interface School {
        /** 学校主键 */
        schoolId: number;
        /** 学校全称 */
        schoolName: string;
        /** 学校编号（保留） */
        schoolNo: string | null;
        /** Logo 相对路径 */
        logoUrl: string;
        /** 系统状态：1-启用 */
        systemState: number;
        /** 初始密码（首次登录强制修改） */
        initPassword: string;
        /** 首页附件路径（保留） */
        homepageAttUrl: string;
        /** 其余字段保留，暂无业务含义 */
        systemVer: string | null;
        address: string | null;
        email: string | null;
        telephone: string | null;
        post: string | null;
        homepageAttId: number;
        diffServerTime: string | null;
    }

    /**
     * 考勤统计数据接口
     * 用于描述单个用户的考勤统计信息
     */
    export interface AttendanceDataStatistic {
        /** 统计日期 */
        day: string | null;
        /** 用户ID */
        userId: string | null;
        /** 用户姓名 */
        userName: string | null;
        /** 用户学工号 */
        userNo: string | null;
        /** 节次 */
        period: string | null;
        /** 分节次 */
        periodSplit: string | null;
        /** 连续节次描述 */
        periodConnect: string | null;
        /** 课程名称 */
        courseName: string | null;
        /** 教室名称 */
        roomName: string | null;
        /** 考勤状态ID */
        atdStateId: string | null;
        /** 考勤状态名称 */
        atdStateName: string | null;
        /** 考勤时间 */
        atdTime: string | null;
        /** 应到节次 */
        stPeriod: number;
        /** 实到节次 */
        rtPeriod: number;
        /** 未到节次 */
        ntPeriod: number;
        /** 是否正常 */
        isNormal: null;
        /** 是否迟到 */
        isLate: number;
        /** 是否早退 */
        isLeaveearly: null;
        /** 是否请假 */
        isLeave: number;
        /** 是否旷课 */
        isTruant: null;
        /** 出勤率 */
        attendanceRate: `${number}%`;
        /** 申诉次数 */
        appealCount: number;
    }

    /**
     * 考勤数据接口
     * 用于描述单个用户的详细考勤记录
     */
    export interface AttendanceData {
        /** 日期 */
        day: `${number}-${number}-${number}` | null;
        /** 用户ID */
        userId: number | null;
        /** 用户姓名 */
        userName: string | null;
        /** 用户学工号 */
        userNo: strNum | null;
        /** 节次 */
        period: string | null;
        /** 分节次 */
        periodSplit: string | null;
        /** 连续节次描述 */
        periodConnect: string | null;
        /** 课程名称 */
        courseName: string | null;
        /** 教室名称 */
        roomName: string | null;
        /** 考勤状态ID */
        atdStateId: AttendanceState | null;
        /** 考勤状态名称 */
        atdStateName: "正常" | "迟到" | "未到" | string | null;
        /** 考勤时间 */
        atdTime: string | null;
        /** 应到节次 */
        stPeriod: number | null;
        /** 实到节次 */
        rtPeriod: number | null;
        /** 未到节次 */
        ntPeriod: number | null;
        /** 是否正常 */
        isNormal: number | null;
        /** 是否迟到 */
        isLate: number | null;
        /** 是否早退 */
        isLeaveearly: number | null;
        /** 是否请假 */
        isLeave: number | null;
        /** 是否旷课 */
        isTruant: number | null;
        /** 出勤率 */
        attendanceRate: `${number}%` | null;
        /** 申诉次数 */
        appealCount: number | null;
    }

    /**
     * 考勤状态枚举
     */
    export enum AttendanceState {
        /** 正常 */
        Normal = 1,
        /** 迟到 */
        Late = 2,
        /** 缺席 */
        Absent = 4,
        /** 未开始 */
        NotStarted = 5,
        /** 不需要打卡，自定义类型 */
        NoNeed = 100,
    }

    /**
     * 考勤系统 - 首页数据接口
     */
    export interface MenuData {
        /** 用户ID */
        userId: null;
        /** 菜单角色 */
        menuRole: string;
        /** 首页路由URL */
        homeRouteUrl: string;
        /** 角色编号列表 */
        roleNos: string[];
        /** 菜单列表 */
        menuList: Menu[];
        /** 所有菜单角色 */
        allMenuRole: MenuRole[];
        /** 校历列表 */
        calendarList: Calendar[];
    }

    /**
     * 菜单项接口
     */
    export interface Menu {
        /** 菜单业务ID */
        menuBusinessId: number;
        /** 菜单业务名称 */
        menuBusinessName: string;
        /** 是否显示子菜单 */
        isSubShow: null;
        /** 路由URL */
        routeUrl: string | null;
        /** 图标路径 */
        icon: string | null;
        /** 激活状态图标路径 */
        iconActive: string | null;
        /** 子菜单列表 */
        subMenus: SubMenu[];
    }

    /**
     * 子菜单项接口
     */
    export interface SubMenu {
        /** 菜单业务ID */
        menuBusinessId: number;
        /** 菜单业务名称 */
        menuBusinessName: string;
        /** 父级菜单业务ID */
        ptMenuBusinessId: number;
        /** 路由URL */
        routeUrl: string;
    }

    /**
     * 菜单角色接口
     */
    export interface MenuRole {
        /** 菜单ID */
        menuId: number;
        /** 菜单名称 */
        menuName: string;
        /** 部门ID */
        bsDeptId: null;
        /** 显示顺序 */
        showOrder: null;
        /** 使用状态ID */
        useStatusId: null;
        /** 备注 */
        remark: null;
        /** 创建时间 */
        ctDate: null;
        /** 创建用户ID */
        ctUserId: null;
        /** 最后更新时间 */
        ltDate: null;
        /** 最后更新用户ID */
        ltUserId: null;
        /** 版本 */
        version: null;
        /** 业务角色编号 */
        bsRoleNo: string;
        /** 首页菜单业务ID */
        homeMenuBusinessId: null;
        /** 首页路由URL */
        homeRouteUrl: string;
        /** 菜单编号 */
        menuNo: string;
        /** 角色编号 */
        roleNo: string;
    }

    /**
     * 学生课表
     */
    export interface StudentClassTable {
        periodMax: number;
        periodTime: null;
        roomRankList: null;
        studentRankList: null;
        teacherRankList: null;
        weekTotal: number;
        periodTimeAll: PeriodTimeItem[];
        resTableRankList: DayInfo[];
        weekList: WeekItem[];
    }

    /**
     * 日课表信息
     */
    export interface DayInfo {
        /** 星期（日期）yyyy-MM-dd */
        weekDay: string | null;
        /** 星期几 0-6 */
        dayOfWeek: number | null;
        /** 星期描述 */
        dayOfWeekStr: string | null;
        /** 当日所有课程 */
        courses: CourseItem[];
    }

    /**
     * 课程信息(数组元素类)
     */
    export interface CourseItem {
        /** 星期（日期）yyyy-MM-dd */
        weekDay: string | null;
        /** 星期几 0-6 */
        dayOfWeek: number | null;
        /** 星期描述 */
        dayOfWeekStr: string | null;
        /** 学科 ID */
        subjectId: number | null;
        /** 学科名称 */
        subjectName: string | null;
        /** 连堂次数 */
        connectCount: number;
        /** 课程名称 */
        courseName: string | null;
        /** 课程状态 */
        courseState: number | null;
        /** 课程类型 */
        courseType: number | null;
        /** 是否连堂 -1=否 其他=是 */
        isConnect: number;
        /** 节次 */
        period: number | null;
        /** 节次数组 */
        periodArry: number[] | null;
        /** 节次数组描述 */
        periodArryStr: string | null;
        /** 修正考勤结果 */
        reviseAtdResult: number | null;
        /** 教室 ID */
        roomId: number | null;
        /** 教室名称 */
        roomName: string | null;
        /** 教师名称 */
        teacherName: string | null;
    }

    /**
     * 考勤时间段信息(数组元素类)
     */
    export interface PeriodTimeItem {
        /** 考勤开始时间 HH:mm */
        atdBegin: string;
        /** 考勤结束时间 HH:mm */
        atdEnd: string;
        /** 部门/校区 ID */
        bsDeptId: number;
        /** 上课开始时间 HH:mm */
        courseBegin: string;
        /** 上课结束时间 HH:mm */
        courseEnd: string;
        /** 单节课时长（分钟） */
        courseMinute: number;
        /** 是否首节 1=是 0=否 */
        firstPeriod: number;
        /** 节次序号 */
        period: number;
        /** 节次名称 */
        periodName: string;
    }

    /**
     * 周次信息(数组元素类)
     */
    export interface WeekItem {
        /** 星期（日期）yyyy-MM-dd */
        weekDay: string;
        /** 星期几 0-6，null 表示未赋值 */
        dayOfWeek: number | null;
        /** 星期描述，如“星期一” */
        dayOfWeekStr: string | null;
    }
}
