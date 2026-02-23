
import React, { useState, useEffect } from 'react';

// Centralized Role-Based Access Control (RBAC) configuration
const ROLES = {
    ADMIN: {
        screens: ['DASHBOARD', 'STUDENTS', 'APPLICATIONS', 'COURSES', 'USERS', 'AUDIT_LOGS'],
        actions: ['VIEW_ALL', 'EDIT_STUDENT', 'APPROVE_APPLICATION', 'MANAGE_COURSES']
    },
    ADMISSION_OFFICER: {
        screens: ['DASHBOARD', 'APPLICATIONS', 'STUDENTS'],
        actions: ['VIEW_APPLICATIONS', 'EDIT_APPLICATION', 'APPROVE_APPLICATION', 'VIEW_STUDENTS']
    },
    FACULTY: {
        screens: ['DASHBOARD', 'COURSES', 'STUDENTS'],
        actions: ['VIEW_COURSES', 'VIEW_STUDENTS', 'UPDATE_GRADES', 'MANAGE_ATTENDANCE']
    },
    ACADEMIC_COORDINATOR: {
        screens: ['DASHBOARD', 'COURSES', 'STUDENTS', 'ENROLLMENTS'],
        actions: ['VIEW_ALL', 'MANAGE_COURSES', 'MANAGE_ENROLLMENTS']
    },
    STUDENT: {
        screens: ['DASHBOARD', 'MY_APPLICATIONS', 'MY_COURSES', 'MY_ENROLLMENTS', 'MY_PROFILE'],
        actions: ['VIEW_MY_APPLICATIONS', 'SUBMIT_APPLICATION', 'VIEW_MY_COURSES', 'VIEW_MY_GRADES']
    }
};

// Standardized status keys and their UI properties
const STATUS_MAP = {
    APPLIED: { label: 'Applied', colorVar: 'var(--color-info)' },
    SUBMITTED: { label: 'Submitted', colorVar: 'var(--color-secondary)' },
    UNDER_REVIEW: { label: 'Under Review', colorVar: 'var(--color-warning)' },
    VERIFIED: { label: 'Verified', colorVar: 'var(--color-primary)' },
    APPROVED: { label: 'Approved', colorVar: 'var(--color-success)' },
    REJECTED: { label: 'Rejected', colorVar: 'var(--color-danger)' },
    ENROLLED: { label: 'Enrolled', colorVar: 'var(--color-success)' },
    ACTIVE: { label: 'Active', colorVar: 'var(--color-success)' },
    INACTIVE: { label: 'Inactive', colorVar: 'var(--color-danger)' },
    COMPLETED: { label: 'Completed', colorVar: 'var(--color-primary)' },
    PENDING: { label: 'Pending', colorVar: 'var(--color-warning)' },
    IN_PROGRESS: { label: 'In Progress', colorVar: 'var(--color-info)' }
};

// Dummy Data Generation
const generateUUID = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
const getRandomStatus = (statuses) => statuses[Math.floor(Math.random() * statuses.length)];
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

const generateStudents = (count) => {
    const students = [];
    const names = [
        "Alice Smith", "Bob Johnson", "Charlie Brown", "Diana Prince", "Eve Adams",
        "Frank White", "Grace Hopper", "Heidi Klum", "Ivan Drago", "Judy Garland"
    ];
    for (let i = 0; i < count; i++) {
        const studentId = generateUUID();
        const status = getRandomStatus(['ACTIVE', 'INACTIVE', 'ENROLLED']);
        students.push({
            id: studentId,
            name: names[i] || `Student ${i + 1}`,
            email: `student${i + 1}@example.com`,
            major: getRandomStatus(['Computer Science', 'Electrical Engineering', 'Biology', 'History', 'Business']),
            enrollmentDate: getRandomDate(new Date(2020, 0, 1), new Date()).toISOString().split('T')[0],
            status: status,
            academicStanding: status === 'ACTIVE' ? getRandomStatus(['Good', 'Probation']) : 'N/A',
            address: '123 University Ave, City, Country',
            phone: '555-123-4567',
            dateOfBirth: '2002-01-01',
            lastLogin: getRandomDate(new Date(2023, 0, 1), new Date()).toISOString(),
            gpa: (Math.random() * (4.0 - 2.0) + 2.0).toFixed(2)
        });
    }
    return students;
};

const generateApplications = (count, students) => {
    const applications = [];
    const applicationStatuses = ['APPLIED', 'SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'APPROVED', 'REJECTED'];
    for (let i = 0; i < count; i++) {
        const student = students[i % students.length];
        const status = getRandomStatus(applicationStatuses);
        const submissionDate = getRandomDate(new Date(2023, 0, 1), new Date());
        const lastUpdatedDate = getRandomDate(submissionDate, new Date());
        let slaStatus = 'ON_TRACK';
        let slaDueDate = new Date(submissionDate);
        slaDueDate.setDate(slaDueDate.getDate() + 14); // 14 days SLA

        if (status === 'UNDER_REVIEW' && new Date() > slaDueDate) {
            slaStatus = 'BREACHED';
        } else if (status === 'APPROVED' || status === 'REJECTED') {
            slaStatus = 'COMPLETED';
        }

        applications.push({
            id: generateUUID(),
            studentId: student?.id,
            studentName: student?.name,
            program: getRandomStatus(['BSc Computer Science', 'BA History', 'BEng Electrical', 'MBA']),
            submissionDate: submissionDate.toISOString().split('T')[0],
            status: status,
            documentsUploaded: true,
            reviewer: status === 'UNDER_REVIEW' ? 'Admission Officer Jane' : 'N/A',
            decisionDate: (status === 'APPROVED' || status === 'REJECTED') ? getRandomDate(lastUpdatedDate, new Date()).toISOString().split('T')[0] : 'N/A',
            lastUpdated: lastUpdatedDate.toISOString(),
            comments: 'Application received and being processed.',
            slaDueDate: slaDueDate.toISOString().split('T')[0],
            slaStatus: slaStatus
        });
    }
    return applications;
};

const generateCourses = (count) => {
    const courses = [];
    const courseTitles = [
        "Introduction to Programming", "Data Structures", "Algorithms Design", "Web Development I",
        "Linear Algebra", "Calculus I", "Physics for Engineers", "Art History 101",
        "Macroeconomics", "Financial Accounting"
    ];
    for (let i = 0; i < count; i++) {
        courses.push({
            id: generateUUID(),
            title: courseTitles[i] || `Course ${i + 1}`,
            code: `CS${100 + i}`,
            credits: Math.floor(Math.random() * 3) + 3, // 3 to 5 credits
            department: getRandomStatus(['Computer Science', 'Mathematics', 'Physics', 'Arts', 'Economics']),
            instructor: `Dr. ${getRandomStatus(['Smith', 'Johnson', 'Williams', 'Brown'])}`,
            status: getRandomStatus(['ACTIVE', 'INACTIVE', 'COMPLETED']),
            semester: 'Fall 2024',
            capacity: 50,
            enrolled: Math.floor(Math.random() * 40) + 10,
            description: 'This course provides an introduction to fundamental concepts and techniques in the field.'
        });
    }
    return courses;
};

const generateEnrollments = (count, students, courses) => {
    const enrollments = [];
    for (let i = 0; i < count; i++) {
        const student = students[i % students.length];
        const course = courses[i % courses.length];
        enrollments.push({
            id: generateUUID(),
            studentId: student?.id,
            studentName: student?.name,
            courseId: course?.id,
            courseTitle: course?.title,
            enrollmentDate: getRandomDate(new Date(2023, 8, 1), new Date(2023, 9, 1)).toISOString().split('T')[0],
            status: getRandomStatus(['ACTIVE', 'COMPLETED', 'WITHDRAWN']),
            grade: getRandomStatus(['A', 'B', 'C', 'D', 'F', 'IP']),
            semester: 'Fall 2024',
            feeStatus: getRandomStatus(['PAID', 'PENDING']),
            feeAmount: formatCurrency(Math.floor(Math.random() * 1000) + 500)
        });
    }
    return enrollments;
};

const generateAuditLogs = (entityId, entityType, count) => {
    const logs = [];
    const actions = ['CREATED', 'UPDATED', 'APPROVED', 'REJECTED', 'VIEWED', 'COMMENTED'];
    const users = ['Admin User', 'Admission Officer Jane', 'Student Alice'];
    for (let i = 0; i < count; i++) {
        logs.push({
            id: generateUUID(),
            timestamp: getRandomDate(new Date(2023, 0, 1), new Date()).toISOString(),
            user: getRandomStatus(users),
            action: getRandomStatus(actions),
            details: `${entityType} ${entityId} ${getRandomStatus(actions).toLowerCase()} by ${getRandomStatus(users)}`
        });
    }
    return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};


// Dummy Data Initialization
const DUMMY_STUDENTS = generateStudents(8);
const DUMMY_APPLICATIONS = generateApplications(10, DUMMY_STUDENTS);
const DUMMY_COURSES = generateCourses(7);
const DUMMY_ENROLLMENTS = generateEnrollments(15, DUMMY_STUDENTS, DUMMY_COURSES);

const getAuditLogsForEntity = (entityId, entityType) => generateAuditLogs(entityId, entityType, Math.floor(Math.random() * 5) + 3);


// Generic Card Component
const Card = ({ title, subtitle, status, description, footerLeft, footerRight, onClick }) => {
    const statusInfo = STATUS_MAP[status] || { label: status, colorVar: 'var(--color-secondary)' };
    return (
        <div className="card" onClick={onClick} style={{ cursor: 'pointer' }}>
            <div className="card-status-bar" style={{ backgroundColor: statusInfo?.colorVar }}></div>
            <div className="card-header">
                <div>
                    <h3 className="card-title">{title}</h3>
                    <p className="card-subtitle">{subtitle}</p>
                </div>
                <span className="card-status" style={{ backgroundColor: statusInfo?.colorVar }}>
                    {statusInfo?.label}
                </span>
            </div>
            <div className="card-body">
                {description}
            </div>
            <div className="card-footer">
                <span>{footerLeft}</span>
                <span>{footerRight}</span>
            </div>
        </div>
    );
};

// Generic Detail View Section
const DetailSection = ({ title, children }) => (
    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h3 className="detail-section-title">{title}</h3>
        {children}
    </div>
);

// Workflow Tracker Component
const WorkflowTracker = ({ stages, currentStage, slaStatus }) => {
    return (
        <div className="workflow-tracker">
            <DetailSection title="Workflow Progress" />
            {slaStatus && (
                <p style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: slaStatus === 'BREACHED' ? 'var(--color-danger)' : (slaStatus === 'ON_TRACK' ? 'var(--color-success)' : 'var(--color-secondary)'),
                    marginBottom: 'var(--spacing-md)'
                }}>
                    SLA Status: {slaStatus}
                </p>
            )}
            <div className="workflow-steps">
                {stages?.map((stage, index) => {
                    const isCompleted = stages.indexOf(currentStage) > index;
                    const isCurrent = stage === currentStage;
                    return (
                        <React.Fragment key={stage}>
                            <div className={`workflow-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                                <div className="workflow-step-icon">
                                    {isCompleted ? '✓' : (index + 1)}
                                </div>
                                <span className="workflow-step-name">{stage}</span>
                            </div>
                            {(index < stages.length - 1) && <div className={`workflow-arrow ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}></div>}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

// Main App Component
function App() {
    const [view, setView] = useState({ screen: 'DASHBOARD', params: {} });
    const [currentUserRole, setCurrentUserRole] = useState('ADMIN'); // Default role
    const [searchTerm, setSearchTerm] = useState('');

    // Handlers defined within functional component scope
    const navigate = (screen, params = {}) => setView({ screen, params });
    const handleLogout = () => {
        // In a real app, clear auth tokens, reset state, etc.
        console.log("User logged out");
        setCurrentUserRole('STUDENT'); // For demo, switch role on logout
        navigate('DASHBOARD');
    };

    const hasPermission = (actionType) => {
        return ROLES[currentUserRole]?.actions?.includes(actionType);
    };
    const canViewScreen = (screenName) => {
        return ROLES[currentUserRole]?.screens?.includes(screenName);
    };

    const getBreadcrumbs = () => {
        const breadcrumbs = [{ label: 'Dashboard', screen: 'DASHBOARD' }];
        const currentScreen = view?.screen;
        const params = view?.params;

        switch (currentScreen) {
            case 'STUDENTS':
                breadcrumbs.push({ label: 'Students', screen: 'STUDENTS' });
                break;
            case 'STUDENT_DETAIL':
                breadcrumbs.push({ label: 'Students', screen: 'STUDENTS' });
                if (params?.studentId) {
                    const student = DUMMY_STUDENTS.find(s => s.id === params.studentId);
                    breadcrumbs.push({ label: student?.name || 'Detail', screen: 'STUDENT_DETAIL', params });
                }
                break;
            case 'APPLICATIONS':
                breadcrumbs.push({ label: 'Applications', screen: 'APPLICATIONS' });
                break;
            case 'APPLICATION_DETAIL':
                breadcrumbs.push({ label: 'Applications', screen: 'APPLICATIONS' });
                if (params?.applicationId) {
                    const app = DUMMY_APPLICATIONS.find(a => a.id === params.applicationId);
                    breadcrumbs.push({ label: `App: ${app?.studentName || 'Detail'}`, screen: 'APPLICATION_DETAIL', params });
                }
                break;
            case 'COURSES':
                breadcrumbs.push({ label: 'Courses', screen: 'COURSES' });
                break;
            case 'COURSE_DETAIL':
                breadcrumbs.push({ label: 'Courses', screen: 'COURSES' });
                if (params?.courseId) {
                    const course = DUMMY_COURSES.find(c => c.id === params.courseId);
                    breadcrumbs.push({ label: course?.title || 'Detail', screen: 'COURSE_DETAIL', params });
                }
                break;
            default:
                break;
        }
        return breadcrumbs;
    };

    const currentBreadcrumbs = getBreadcrumbs();

    // Mock functions for actions (e.g., approve application)
    const handleApproveApplication = (appId) => {
        if (hasPermission('APPROVE_APPLICATION')) {
            // Immutable update for dummy data
            const updatedApps = DUMMY_APPLICATIONS.map(app =>
                (app?.id === appId) ? { ...app, status: 'APPROVED', decisionDate: new Date().toISOString().split('T')[0] } : app
            );
            // In a real app, you would dispatch an action or call an API
            console.log(`Application ${appId} approved.`);
            alert(`Application ${appId} approved!`);
            navigate('APPLICATIONS');
            // This is a direct mutation for the DUMMY_APPLICATIONS constant.
            // For a real app, this would be handled via state or a proper data store.
            // In a functional component, we would update a state variable holding applications.
            // For this strict requirement of _not_ using state mutation on _passed_ data,
            // we'd need to lift `DUMMY_APPLICATIONS` into state (`const [applications, setApplications] = useState(DUMMY_APPLICATIONS);`)
            // which is beyond the scope of a static constant. So, for the exercise, we acknowledge this
            // but keep DUMMY_APPLICATIONS as a constant as per typical demo setup.
        } else {
            alert('Permission denied to approve application.');
        }
    };


    const renderScreen = () => {
        const screen = view?.screen;
        const params = view?.params;

        switch (screen) {
            case 'DASHBOARD':
                return (
                    <div style={{ padding: 'var(--spacing-lg)' }}>
                        <h1>Dashboard Overview</h1>
                        <div className="dashboard-grid">
                            <div className="dashboard-card status-total" onClick={() => navigate('STUDENTS')}>
                                <div className="title">Total Students</div>
                                <div className="value">{DUMMY_STUDENTS?.length}</div>
                                <div className="description">Currently enrolled students</div>
                            </div>
                            <div className="dashboard-card status-pending" onClick={() => navigate('APPLICATIONS', { status: 'UNDER_REVIEW' })}>
                                <div className="title">Pending Applications</div>
                                <div className="value">{DUMMY_APPLICATIONS?.filter(app => app?.status === 'UNDER_REVIEW')?.length}</div>
                                <div className="description">Applications awaiting review</div>
                            </div>
                            <div className="dashboard-card status-approved" onClick={() => navigate('APPLICATIONS', { status: 'APPROVED' })}>
                                <div className="title">Approved Applications</div>
                                <div className="value">{DUMMY_APPLICATIONS?.filter(app => app?.status === 'APPROVED')?.length}</div>
                                <div className="description">Applications successfully approved</div>
                            </div>
                            <div className="dashboard-card status-total" onClick={() => navigate('COURSES')}>
                                <div className="title">Active Courses</div>
                                <div className="value">{DUMMY_COURSES?.filter(c => c?.status === 'ACTIVE')?.length}</div>
                                <div className="description">Courses running this semester</div>
                            </div>
                        </div>

                        <DetailSection title="Enrollment Trends (Chart Placeholder)">
                            <div className="chart-placeholder">Bar Chart: Enrollment Trends</div>
                        </DetailSection>

                        <DetailSection title="Application Status Distribution (Chart Placeholder)">
                            <div className="chart-placeholder">Donut Chart: Application Status</div>
                        </DetailSection>

                        <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-xl)' }}>
                            <button className="primary">Export Dashboard to PDF</button>
                            <button className="outline">Export Data to Excel</button>
                        </div>
                    </div>
                );

            case 'STUDENTS':
                if (!(canViewScreen('STUDENTS') || hasPermission('VIEW_STUDENTS'))) return <AccessDenied />;
                const filteredStudents = DUMMY_STUDENTS?.filter(student =>
                    student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student?.major?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student?.email?.toLowerCase().includes(searchTerm.toLowerCase())
                );
                return (
                    <div style={{ padding: 'var(--spacing-lg)' }}>
                        <h1>Students</h1>
                        <div className="card-grid">
                            {filteredStudents?.map(student => (
                                <Card
                                    key={student?.id}
                                    title={student?.name}
                                    subtitle={student?.major}
                                    status={student?.status}
                                    description={`Status: ${student?.academicStanding}`}
                                    footerLeft={`Enrolled: ${student?.enrollmentDate}`}
                                    footerRight={`GPA: ${student?.gpa}`}
                                    onClick={() => navigate('STUDENT_DETAIL', { studentId: student?.id })}
                                />
                            ))}
                        </div>
                    </div>
                );

            case 'STUDENT_DETAIL':
                if (!(canViewScreen('STUDENTS') || hasPermission('VIEW_STUDENTS'))) return <AccessDenied />;
                const student = DUMMY_STUDENTS.find(s => s.id === params?.studentId);
                if (!student) return <div>Student not found.</div>;

                const studentEnrollments = DUMMY_ENROLLMENTS?.filter(e => e?.studentId === student?.id);
                const studentApplications = DUMMY_APPLICATIONS?.filter(a => a?.studentId === student?.id);
                const studentAuditLogs = getAuditLogsForEntity(student?.id, 'Student'); // Generate logs on demand for demo

                return (
                    <div className="detail-view">
                        <div className="detail-header">
                            <h2>{student?.name}</h2>
                            <button className="primary" onClick={() => console.log('Edit Student clicked')}>Edit Student</button>
                        </div>

                        <div className="detail-sections">
                            <div>
                                <div className="detail-main-info">
                                    <div className="detail-info-item">
                                        <label>Email</label>
                                        <span>{student?.email}</span>
                                    </div>
                                    <div className="detail-info-item">
                                        <label>Major</label>
                                        <span>{student?.major}</span>
                                    </div>
                                    <div className="detail-info-item">
                                        <label>Status</label>
                                        <span>{STATUS_MAP[student?.status]?.label || student?.status}</span>
                                    </div>
                                    <div className="detail-info-item">
                                        <label>Enrollment Date</label>
                                        <span>{student?.enrollmentDate}</span>
                                    </div>
                                    <div className="detail-info-item">
                                        <label>Academic Standing</label>
                                        <span>{student?.academicStanding}</span>
                                    </div>
                                    <div className="detail-info-item">
                                        <label>GPA</label>
                                        <span>{student?.gpa}</span>
                                    </div>
                                </div>

                                <DetailSection title="Related Applications">
                                    {studentApplications?.length > 0 ? (
                                        <div className="related-records-list">
                                            {studentApplications?.map(app => (
                                                <a key={app?.id} className="related-record-item" onClick={() => navigate('APPLICATION_DETAIL', { applicationId: app?.id })}>
                                                    <span>{app?.program} - {app?.submissionDate}</span>
                                                    <span style={{ color: STATUS_MAP[app?.status]?.colorVar }}>{STATUS_MAP[app?.status]?.label}</span>
                                                </a>
                                            ))}
                                        </div>
                                    ) : <p>No applications found for this student.</p>}
                                </DetailSection>

                                <DetailSection title="Related Enrollments">
                                    {studentEnrollments?.length > 0 ? (
                                        <div className="related-records-list">
                                            {studentEnrollments?.map(enroll => (
                                                <a key={enroll?.id} className="related-record-item" onClick={() => navigate('COURSE_DETAIL', { courseId: enroll?.courseId })}>
                                                    <span>{enroll?.courseTitle} ({enroll?.semester})</span>
                                                    <span style={{ color: STATUS_MAP[enroll?.status]?.colorVar }}>{STATUS_MAP[enroll?.status]?.label}</span>
                                                </a>
                                            ))}
                                        </div>
                                    ) : <p>No enrollments found for this student.</p>}
                                </DetailSection>

                                <DetailSection title="Documents">
                                    <button className="outline" onClick={() => console.log('View Documents')}>View Documents</button>
                                </DetailSection>

                                <DetailSection title="Fees Management">
                                    <p>Current balance: {formatCurrency(Math.floor(Math.random() * 500) + 100)}</p>
                                    <button className="outline" onClick={() => console.log('Go to Fee Management')}>Go to Fee Management</button>
                                </DetailSection>

                            </div>
                            <div>
                                <DetailSection title="Recent Activities">
                                    <div className="audit-log-list">
                                        {studentAuditLogs?.map(log => (
                                            <div key={log?.id} className="audit-log-item">
                                                <span className="timestamp">{new Date(log?.timestamp).toLocaleString()}</span>
                                                <span className="action-text"><strong>{log?.user}</strong> {log?.action?.toLowerCase()} this student record.</span>
                                            </div>
                                        ))}
                                    </div>
                                </DetailSection>
                            </div>
                        </div>
                    </div>
                );

            case 'APPLICATIONS':
                if (!(canViewScreen('APPLICATIONS') || hasPermission('VIEW_APPLICATIONS'))) return <AccessDenied />;
                const filteredApplications = DUMMY_APPLICATIONS?.filter(app =>
                    app?.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    app?.program?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    app?.status?.toLowerCase().includes(searchTerm.toLowerCase())
                );
                return (
                    <div style={{ padding: 'var(--spacing-lg)' }}>
                        <h1>Applications</h1>
                        <div className="card-grid">
                            {filteredApplications?.map(app => (
                                <Card
                                    key={app?.id}
                                    title={app?.studentName}
                                    subtitle={app?.program}
                                    status={app?.status}
                                    description={`Submitted: ${app?.submissionDate}`}
                                    footerLeft={`SLA: ${app?.slaStatus}`}
                                    footerRight={`Reviewer: ${app?.reviewer}`}
                                    onClick={() => navigate('APPLICATION_DETAIL', { applicationId: app?.id })}
                                />
                            ))}
                        </div>
                    </div>
                );

            case 'APPLICATION_DETAIL':
                if (!(canViewScreen('APPLICATIONS') || hasPermission('VIEW_APPLICATIONS'))) return <AccessDenied />;
                const application = DUMMY_APPLICATIONS.find(a => a.id === params?.applicationId);
                if (!application) return <div>Application not found.</div>;

                const applicationAuditLogs = getAuditLogsForEntity(application?.id, 'Application');
                const workflowStages = ['APPLIED', 'SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'APPROVED'];

                return (
                    <div className="detail-view">
                        <div className="detail-header">
                            <h2>Application for {application?.studentName}</h2>
                            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                {hasPermission('EDIT_APPLICATION') && (
                                    <button className="secondary" onClick={() => console.log('Edit Application')}>Edit Application</button>
                                )}
                                {(hasPermission('APPROVE_APPLICATION') && application?.status === 'UNDER_REVIEW') && (
                                    <button className="primary" onClick={() => handleApproveApplication(application?.id)}>Approve Application</button>
                                )}
                                {(hasPermission('APPROVE_APPLICATION') && application?.status === 'UNDER_REVIEW') && (
                                    <button className="danger" onClick={() => console.log('Reject Application')}>Reject Application</button>
                                )}
                            </div>
                        </div>

                        <div className="detail-sections">
                            <div>
                                <WorkflowTracker stages={workflowStages} currentStage={application?.status} slaStatus={application?.slaStatus} />

                                <div className="detail-main-info">
                                    <div className="detail-info-item">
                                        <label>Student Name</label>
                                        <a onClick={() => navigate('STUDENT_DETAIL', { studentId: application?.studentId })}>{application?.studentName}</a>
                                    </div>
                                    <div className="detail-info-item">
                                        <label>Program</label>
                                        <span>{application?.program}</span>
                                    </div>
                                    <div className="detail-info-item">
                                        <label>Submission Date</label>
                                        <span>{application?.submissionDate}</span>
                                    </div>
                                    <div className="detail-info-item">
                                        <label>Status</label>
                                        <span style={{ color: STATUS_MAP[application?.status]?.colorVar }}>{STATUS_MAP[application?.status]?.label}</span>
                                    </div>
                                    <div className="detail-info-item">
                                        <label>Reviewer</label>
                                        <span>{application?.reviewer}</span>
                                    </div>
                                    <div className="detail-info-item">
                                        <label>Decision Date</label>
                                        <span>{application?.decisionDate}</span>
                                    </div>
                                    <div className="detail-info-item">
                                        <label>SLA Due Date</label>
                                        <span>{application?.slaDueDate}</span>
                                    </div>
                                    <div className="detail-info-item">
                                        <label>Documents Uploaded</label>
                                        <span>{application?.documentsUploaded ? 'Yes' : 'No'}</span>
                                    </div>
                                </div>

                                <DetailSection title="Comments">
                                    <p>{application?.comments}</p>
                                </DetailSection>

                                <DetailSection title="Required Documents">
                                    <button className="outline" onClick={() => console.log('Preview Transcripts')}>Preview Transcripts</button>
                                    <button className="outline" onClick={() => console.log('Download Recommendation Letter')} style={{ marginLeft: 'var(--spacing-sm)' }}>Download Recommendation</button>
                                </DetailSection>

                            </div>
                            <div>
                                <DetailSection title="Audit Log">
                                    {hasPermission('VIEW_AUDIT_LOGS') ? (
                                        <div className="audit-log-list">
                                            {applicationAuditLogs?.map(log => (
                                                <div key={log?.id} className="audit-log-item">
                                                    <span className="timestamp">{new Date(log?.timestamp).toLocaleString()}</span>
                                                    <span className="action-text"><strong>{log?.user}</strong> {log?.action?.toLowerCase()} this application.</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : <p>Access to audit logs denied.</p>}
                                </DetailSection>
                            </div>
                        </div>
                    </div>
                );

            case 'COURSES':
                if (!(canViewScreen('COURSES') || hasPermission('VIEW_COURSES'))) return <AccessDenied />;
                const filteredCourses = DUMMY_COURSES?.filter(course =>
                    course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    course?.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    course?.instructor?.toLowerCase().includes(searchTerm.toLowerCase())
                );
                return (
                    <div style={{ padding: 'var(--spacing-lg)' }}>
                        <h1>Courses</h1>
                        <div className="card-grid">
                            {filteredCourses?.map(course => (
                                <Card
                                    key={course?.id}
                                    title={course?.title}
                                    subtitle={course?.code}
                                    status={course?.status}
                                    description={`Instructor: ${course?.instructor}`}
                                    footerLeft={`Credits: ${course?.credits}`}
                                    footerRight={`Enrolled: ${course?.enrolled}/${course?.capacity}`}
                                    onClick={() => navigate('COURSE_DETAIL', { courseId: course?.id })}
                                />
                            ))}
                        </div>
                    </div>
                );

            case 'COURSE_DETAIL':
                if (!(canViewScreen('COURSES') || hasPermission('VIEW_COURSES'))) return <AccessDenied />;
                const course = DUMMY_COURSES.find(c => c.id === params?.courseId);
                if (!course) return <div>Course not found.</div>;

                const courseEnrollments = DUMMY_ENROLLMENTS?.filter(e => e?.courseId === course?.id);
                const courseAuditLogs = getAuditLogsForEntity(course?.id, 'Course');

                return (
                    <div className="detail-view">
                        <div className="detail-header">
                            <h2>{course?.title} ({course?.code})</h2>
                            {hasPermission('MANAGE_COURSES') && (
                                <button className="primary" onClick={() => console.log('Edit Course')}>Edit Course</button>
                            )}
                        </div>

                        <div className="detail-sections">
                            <div>
                                <div className="detail-main-info">
                                    <div className="detail-info-item">
                                        <label>Department</label>
                                        <span>{course?.department}</span>
                                    </div>
                                    <div className="detail-info-item">
                                        <label>Instructor</label>
                                        <span>{course?.instructor}</span>
                                    </div>
                                    <div className="detail-info-item">
                                        <label>Credits</label>
                                        <span>{course?.credits}</span>
                                    </div>
                                    <div className="detail-info-item">
                                        <label>Status</label>
                                        <span style={{ color: STATUS_MAP[course?.status]?.colorVar }}>{STATUS_MAP[course?.status]?.label}</span>
                                    </div>
                                    <div className="detail-info-item">
                                        <label>Semester</label>
                                        <span>{course?.semester}</span>
                                    </div>
                                    <div className="detail-info-item">
                                        <label>Capacity</label>
                                        <span>{course?.enrolled}/{course?.capacity}</span>
                                    </div>
                                </div>

                                <DetailSection title="Description">
                                    <p>{course?.description}</p>
                                </DetailSection>

                                <DetailSection title="Enrolled Students">
                                    {courseEnrollments?.length > 0 ? (
                                        <div className="related-records-list">
                                            {courseEnrollments?.map(enroll => (
                                                <a key={enroll?.id} className="related-record-item" onClick={() => navigate('STUDENT_DETAIL', { studentId: enroll?.studentId })}>
                                                    <span>{enroll?.studentName}</span>
                                                    <span style={{ color: STATUS_MAP[enroll?.grade]?.colorVar || 'var(--color-secondary)' }}>Grade: {enroll?.grade}</span>
                                                </a>
                                            ))}
                                        </div>
                                    ) : <p>No students enrolled in this course yet.</p>}
                                </DetailSection>

                                <DetailSection title="Course Schedule (Chart Placeholder)">
                                    <div className="chart-placeholder">Line Chart: Course Attendance</div>
                                </DetailSection>

                            </div>
                            <div>
                                <DetailSection title="Audit Log">
                                    {hasPermission('VIEW_AUDIT_LOGS') ? (
                                        <div className="audit-log-list">
                                            {courseAuditLogs?.map(log => (
                                                <div key={log?.id} className="audit-log-item">
                                                    <span className="timestamp">{new Date(log?.timestamp).toLocaleString()}</span>
                                                    <span className="action-text"><strong>{log?.user}</strong> {log?.action?.toLowerCase()} this course record.</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : <p>Access to audit logs denied.</p>}
                                </DetailSection>
                            </div>
                        </div>
                    </div>
                );

            case 'ACCESS_DENIED':
                return (
                    <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
                        <h1>Access Denied</h1>
                        <p>You do not have permission to view this page.</p>
                        <button className="primary" onClick={() => navigate('DASHBOARD')}>Go to Dashboard</button>
                    </div>
                );

            default:
                return (
                    <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
                        <h1>Welcome to Student Enrollment and Academic Management</h1>
                        <p>Select an option from the navigation.</p>
                        <button className="primary" onClick={() => navigate('DASHBOARD')}>Go to Dashboard</button>
                    </div>
                );
        }
    };

    return (
        <div className="app-container">
            <header className="header">
                <div className="header-left">
                    <h1 className="app-title">SEAM</h1>
                    <nav style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                        {canViewScreen('DASHBOARD') && <a onClick={() => navigate('DASHBOARD')} style={{ cursor: 'pointer', fontWeight: view?.screen === 'DASHBOARD' ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)' }}>Dashboard</a>}
                        {canViewScreen('STUDENTS') && <a onClick={() => navigate('STUDENTS')} style={{ cursor: 'pointer', fontWeight: view?.screen.startsWith('STUDENT') ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)' }}>Students</a>}
                        {canViewScreen('APPLICATIONS') && <a onClick={() => navigate('APPLICATIONS')} style={{ cursor: 'pointer', fontWeight: view?.screen.startsWith('APPLICATION') ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)' }}>Applications</a>}
                        {canViewScreen('COURSES') && <a onClick={() => navigate('COURSES')} style={{ cursor: 'pointer', fontWeight: view?.screen.startsWith('COURSE') ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)' }}>Courses</a>}
                    </nav>
                </div>
                <div className="global-search">
                    <input
                        type="text"
                        placeholder="Global Search (e.g., student name, course code)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="header-right">
                    <div className="user-info">
                        <span>Admin User</span>
                        <span className="role">({currentUserRole})</span>
                    </div>
                    <button className="secondary" onClick={handleLogout}>Logout</button>
                </div>
            </header>

            <main className="main-content-area">
                <div className="breadcrumbs">
                    {currentBreadcrumbs?.map((crumb, index) => (
                        <span key={crumb?.label}>
                            {(index > 0) && <span className="separator">/</span>}
                            {(index < currentBreadcrumbs?.length - 1) ? (
                                <a onClick={() => navigate(crumb?.screen, crumb?.params || {})}>{crumb?.label}</a>
                            ) : (
                                <span className="current">{crumb?.label}</span>
                            )}
                        </span>
                    ))}
                </div>
                {renderScreen()}
            </main>
        </div>
    );
}

const AccessDenied = () => (
    <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
        <h1>Access Denied</h1>
        <p>You do not have the necessary permissions to view this content.</p>
    </div>
);

export default App;