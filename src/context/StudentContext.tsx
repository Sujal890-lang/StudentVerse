import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Subject,
  Assignment,
  TimetableEntry,
  CareerGoal,
  Opportunity,
  CommunityPost,
  Project,
  StudyNote,
  PlacementApplication,
  AttendanceRecord,
} from '../types';
import {
  initialSubjects,
  initialAssignments,
  initialTimetable,
  initialCareerGoals,
  initialOpportunities,
  initialCommunityPosts,
  initialProjects,
  initialStudyNotes,
  initialPlacementApplications,
} from '../data/mockData';
import confetti from 'canvas-confetti';

interface StudentContextType {
  subjects: Subject[];
  assignments: Assignment[];
  timetable: TimetableEntry[];
  careerGoals: CareerGoal[];
  opportunities: Opportunity[];
  communityPosts: CommunityPost[];
  projects: Project[];
  studyNotes: StudyNote[];
  placementApplications: PlacementApplication[];
  attendanceRecords: AttendanceRecord[];
  
  // Subject & Attendance methods
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  deleteSubject: (id: string) => void;
  recordAttendance: (subjectId: string, status: 'present' | 'absent', note?: string) => void;
  updateSubjectTarget: (id: string, targetPct: number) => void;
  
  // Assignment methods
  addAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  toggleAssignmentStatus: (id: string) => void;

  // Timetable methods
  addTimetableEntry: (entry: Omit<TimetableEntry, 'id'>) => void;
  deleteTimetableEntry: (id: string) => void;

  // Opportunities methods
  toggleOpportunityBookmark: (id: string) => void;
  updateOpportunityStatus: (id: string, status: Opportunity['status']) => void;

  // Community methods
  createCommunityPost: (post: { title: string; content: string; tags: string[]; author_name: string; author_avatar: string; author_college: string; author_course: string }) => void;
  upvoteCommunityPost: (id: string) => void;
  addCommentToPost: (postId: string, commentText: string, authorName: string, authorAvatar: string) => void;

  // Projects methods
  createProject: (project: Omit<Project, 'id' | 'stars'>) => void;
  starProject: (id: string) => void;

  // Study Notes methods
  createStudyNote: (note: Omit<StudyNote, 'id' | 'updated_at'>) => void;
  toggleNoteBookmark: (id: string) => void;
  deleteStudyNote: (id: string) => void;

  // Placement methods
  addPlacementApplication: (app: Omit<PlacementApplication, 'id'>) => void;
  updatePlacementStatus: (id: string, status: PlacementApplication['status'], nextStepDate?: string, notes?: string) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or use initial defaults
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('sv_subjects');
    return saved ? JSON.parse(saved) : initialSubjects;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('sv_assignments');
    return saved ? JSON.parse(saved) : initialAssignments;
  });

  const [timetable, setTimetable] = useState<TimetableEntry[]>(() => {
    const saved = localStorage.getItem('sv_timetable');
    return saved ? JSON.parse(saved) : initialTimetable;
  });

  const [careerGoals, setCareerGoals] = useState<CareerGoal[]>(() => {
    const saved = localStorage.getItem('sv_careerGoals');
    return saved ? JSON.parse(saved) : initialCareerGoals;
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem('sv_opportunities');
    return saved ? JSON.parse(saved) : initialOpportunities;
  });

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('sv_communityPosts');
    return saved ? JSON.parse(saved) : initialCommunityPosts;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('sv_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [studyNotes, setStudyNotes] = useState<StudyNote[]>(() => {
    const saved = localStorage.getItem('sv_studyNotes');
    return saved ? JSON.parse(saved) : initialStudyNotes;
  });

  const [placementApplications, setPlacementApplications] = useState<PlacementApplication[]>(() => {
    const saved = localStorage.getItem('sv_placementApplications');
    return saved ? JSON.parse(saved) : initialPlacementApplications;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('sv_attendanceRecords');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist all states to localStorage
  useEffect(() => { localStorage.setItem('sv_subjects', JSON.stringify(subjects)); }, [subjects]);
  useEffect(() => { localStorage.setItem('sv_assignments', JSON.stringify(assignments)); }, [assignments]);
  useEffect(() => { localStorage.setItem('sv_timetable', JSON.stringify(timetable)); }, [timetable]);
  useEffect(() => { localStorage.setItem('sv_careerGoals', JSON.stringify(careerGoals)); }, [careerGoals]);
  useEffect(() => { localStorage.setItem('sv_opportunities', JSON.stringify(opportunities)); }, [opportunities]);
  useEffect(() => { localStorage.setItem('sv_communityPosts', JSON.stringify(communityPosts)); }, [communityPosts]);
  useEffect(() => { localStorage.setItem('sv_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('sv_studyNotes', JSON.stringify(studyNotes)); }, [studyNotes]);
  useEffect(() => { localStorage.setItem('sv_placementApplications', JSON.stringify(placementApplications)); }, [placementApplications]);
  useEffect(() => { localStorage.setItem('sv_attendanceRecords', JSON.stringify(attendanceRecords)); }, [attendanceRecords]);

  // Subject & Attendance
  const addSubject = (sub: Omit<Subject, 'id'>) => {
    const newSubject: Subject = {
      ...sub,
      id: `sub-${Date.now()}`,
    };
    setSubjects((prev) => [...prev, newSubject]);
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const recordAttendance = (subjectId: string, status: 'present' | 'absent', note?: string) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id === subjectId) {
          const total = s.total_classes + 1;
          const attended = status === 'present' ? s.attended_classes + 1 : s.attended_classes;
          return {
            ...s,
            total_classes: total,
            attended_classes: attended,
          };
        }
        return s;
      })
    );

    const subjectObj = subjects.find((s) => s.id === subjectId);
    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      subject_id: subjectId,
      subject_name: subjectObj?.name || 'Class',
      date: new Date().toISOString().split('T')[0],
      status,
      notes: note,
    };
    setAttendanceRecords((prev) => [newRecord, ...prev]);
  };

  const updateSubjectTarget = (id: string, targetPct: number) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, target_percentage: targetPct } : s))
    );
  };

  // Assignments
  const addAssignment = (asg: Omit<Assignment, 'id'>) => {
    const newAsg: Assignment = {
      ...asg,
      id: `asg-${Date.now()}`,
    };
    setAssignments((prev) => [newAsg, ...prev]);
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleAssignmentStatus = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextStatus = a.status === 'completed' ? 'pending' : 'completed';
          if (nextStatus === 'completed') {
            confetti({
              particleCount: 70,
              spread: 60,
              origin: { y: 0.7 },
              colors: ['#8B5CF6', '#38BDF8', '#22C55E'],
            });
          }
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );
  };

  // Timetable
  const addTimetableEntry = (entry: Omit<TimetableEntry, 'id'>) => {
    const newEntry: TimetableEntry = {
      ...entry,
      id: `tt-${Date.now()}`,
    };
    setTimetable((prev) => [...prev, newEntry]);
  };

  const deleteTimetableEntry = (id: string) => {
    setTimetable((prev) => prev.filter((t) => t.id !== id));
  };

  // Opportunities
  const toggleOpportunityBookmark = (id: string) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === id ? { ...o, is_bookmarked: !o.is_bookmarked } : o))
    );
  };

  const updateOpportunityStatus = (id: string, status: Opportunity['status']) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  // Community
  const createCommunityPost = (post: {
    title: string;
    content: string;
    tags: string[];
    author_name: string;
    author_avatar: string;
    author_college: string;
    author_course: string;
  }) => {
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author_name: post.author_name,
      author_avatar: post.author_avatar,
      author_college: post.author_college,
      author_course: post.author_course,
      title: post.title,
      content: post.content,
      tags: post.tags,
      upvotes: 1,
      has_upvoted: true,
      comment_count: 0,
      comments: [],
      created_at: 'Just now',
    };
    setCommunityPosts((prev) => [newPost, ...prev]);
  };

  const upvoteCommunityPost = (id: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const hasUpvoted = p.has_upvoted;
          return {
            ...p,
            upvotes: hasUpvoted ? p.upvotes - 1 : p.upvotes + 1,
            has_upvoted: !hasUpvoted,
          };
        }
        return p;
      })
    );
  };

  const addCommentToPost = (postId: string, commentText: string, authorName: string, authorAvatar: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            author_name: authorName,
            author_avatar: authorAvatar,
            content: commentText,
            created_at: 'Just now',
          };
          return {
            ...p,
            comment_count: p.comment_count + 1,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );
  };

  // Projects
  const createProject = (project: Omit<Project, 'id' | 'stars'>) => {
    const newProj: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      stars: 1,
      has_starred: true,
    };
    setProjects((prev) => [newProj, ...prev]);
  };

  const starProject = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const isStarred = p.has_starred;
          return {
            ...p,
            stars: isStarred ? p.stars - 1 : p.stars + 1,
            has_starred: !isStarred,
          };
        }
        return p;
      })
    );
  };

  // Study Notes
  const createStudyNote = (note: Omit<StudyNote, 'id' | 'updated_at'>) => {
    const newNote: StudyNote = {
      ...note,
      id: `note-${Date.now()}`,
      updated_at: new Date().toISOString().split('T')[0],
    };
    setStudyNotes((prev) => [newNote, ...prev]);
  };

  const toggleNoteBookmark = (id: string) => {
    setStudyNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_bookmarked: !n.is_bookmarked } : n))
    );
  };

  const deleteStudyNote = (id: string) => {
    setStudyNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Placements
  const addPlacementApplication = (app: Omit<PlacementApplication, 'id'>) => {
    const newApp: PlacementApplication = {
      ...app,
      id: `place-${Date.now()}`,
    };
    setPlacementApplications((prev) => [newApp, ...prev]);
  };

  const updatePlacementStatus = (id: string, status: PlacementApplication['status'], nextStepDate?: string, notes?: string) => {
    setPlacementApplications((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status, next_step_date: nextStepDate ?? p.next_step_date, notes: notes ?? p.notes } : p))
    );
  };

  return (
    <StudentContext.Provider
      value={{
        subjects,
        assignments,
        timetable,
        careerGoals,
        opportunities,
        communityPosts,
        projects,
        studyNotes,
        placementApplications,
        attendanceRecords,
        addSubject,
        deleteSubject,
        recordAttendance,
        updateSubjectTarget,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        toggleAssignmentStatus,
        addTimetableEntry,
        deleteTimetableEntry,
        toggleOpportunityBookmark,
        updateOpportunityStatus,
        createCommunityPost,
        upvoteCommunityPost,
        addCommentToPost,
        createProject,
        starProject,
        createStudyNote,
        toggleNoteBookmark,
        deleteStudyNote,
        addPlacementApplication,
        updatePlacementStatus,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};

