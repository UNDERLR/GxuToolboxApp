/**
 * 学校考勤系统 - 登录接口返回根结构
 */
export interface AttendanceSystemLoginResp {
    /** 业务状态码：600-成功 */
    code: number;
    /** 响应描述 */
    msg: string;
    /** 考勤系统登录数据 */
    data: AttendanceSystemLoginData;
}

/**
 * 学校考勤系统 - 登录数据载荷
 */
export interface AttendanceSystemLoginData {
    /** 访问令牌（JWT） */
    token: string;
    /** 考勤人员档案 */
    userInfo: AttendanceSystemUser;
    /** 当前人员角色编号列表 */
    roleNos: string[];
    /** 当前学期校历 */
    currentCalendar: AttendanceSystemCalendar;
    /** 当前学期第几周 */
    currentWeek: number;
    /** 学校档案列表 */
    schoolInfo: AttendanceSystemSchool[];
}

/**
 * 学校考勤系统 - 人员档案
 */
export interface AttendanceSystemUser {
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
    personInfo: AttendanceSystemPersonExtra;
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
export interface AttendanceSystemPersonExtra {
    /** 固定为 jsonb */
    type: 'jsonb';
    /** 序列化后的 JSON：{email?:string,address?:string,telephone?:string} */
    value: string;
}

/**
 * 学校考勤系统 - 学期校历
 */
export interface AttendanceSystemCalendar {
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
    isCurrent: string | null;
    holidayStr: string | null;
    calendarDaysList: string | null;
    monthDataList: string | null;
}

/**
 * 学校考勤系统 - 学校档案
 */
export interface AttendanceSystemSchool {
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
