"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Profile,
  Subject,
  AttendanceRecord,
  TimetableEntry,
  Assignment,
  StudyNote,
  CareerGoal,
  Opportunity,
  CommunityPost,
  Project,
  PlacementApp,
} from "@/types/database";
import {
  initialProfile,
  initialSubjects,
  initialAttendanceRecords,
  initialTimetable,
  initialAssignments,
  initialCareerGoals,
  initialOpportunities,
  initialNotes,
  initialPosts,
  initialProjects,
  initialPlacements,
} from "./mock-data";

// Helper for local storage persistence
function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = window.localStorage.getItem(`studentverse_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(`studentverse_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

export function useStudentStore() {
  const [profile, setProfileState] = useState<Profile>(initialProfile);
  const [subjects, setSubjectsState] = useState<Subject[]>(initialSubjects);
  const [attendance, setAttendanceState] = useState<AttendanceRecord[]>(initialAttendanceRecords);
  const [timetable, setTimetableState] = useState<TimetableEntry[]>(initialTimetable);
  const [assignments, setAssignmentsState] = useState<Assignment[]>(initialAssignments);
  const [careerGoals, setCareerGoalsState] = useState<CareerGoal[]>(initialCareerGoals);
  const [opportunities, setOpportunitiesState] = useState<Opportunity[]>(initialOpportunities);
  const [bookmarkedOppIds, setBookmarkedOppIds] = useState<string[]>(["opp-1", "opp-2"]);
  const [notes, setNotesState] = useState<StudyNote[]>(initialNotes);
  const [posts, setPostsState] = useState<CommunityPost[]>(initialPosts);
  const [projects, setProjectsState] = useState<Project[]>(initialProjects);
  const [placements, setPlacementsState] = useState<PlacementApp[]>(initialPlacements);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync from localStorage on client mount
  useEffect(() => {
    setProfileState(getStorage("profile", initialProfile));
    setSubjectsState(getStorage("subjects", initialSubjects));
    setAttendanceState(getStorage("attendance", initialAttendanceRecords));
    setTimetableState(getStorage("timetable", initialTimetable));
    setAssignmentsState(getStorage("assignments", initialAssignments));
    setCareerGoalsState(getStorage("careerGoals", initialCareerGoals));
    setOpportunitiesState(getStorage("opportunities", initialOpportunities));
    setBookmarkedOppIds(getStorage("bookmarkedOppIds", ["opp-1", "opp-2"]));
    setNotesState(getStorage("notes", initialNotes));
    setPostsState(getStorage("posts", initialPosts));
    setProjectsState(getStorage("projects", initialProjects));
    setPlacementsState(getStorage("placements", initialPlacements));
    setIsLoaded(true);
  }, []);

  // --- Profile Operations ---
  const updateProfile = useCallback((updated: Partial<Profile>) => {
    setProfileState((prev) => {
      const next = { ...prev, ...updated, updated_at: new Date().toISOString() };
      setStorage("profile", next);
      return next;
    });
  }, []);

  // --- Subject Operations ---
  const addSubject = useCallback((sub: Omit<Subject, "id" | "user_id" | "created_at">) => {
    const newSubject: Subject = {
      ...sub,
      id: `sub-${Date.now()}`,
      user_id: profile.id,
      created_at: new Date().toISOString(),
    };
    setSubjectsState((prev) => {
      const next = [newSubject, ...prev];
      setStorage("subjects", next);
      return next;
    });
    return newSubject;
  }, [profile.id]);

  const updateSubject = useCallback((id: string, updated: Partial<Subject>) => {
    setSubjectsState((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...updated } : s));
      setStorage("subjects", next);
      return next;
    });
  }, []);

  const deleteSubject = useCallback((id: string) => {
    setSubjectsState((prev) => {
      const next = prev.filter((s) => s.id !== id);
      setStorage("subjects", next);
      return next;
    });
    // Also remove timetable and assignments for this subject
    setTimetableState((prev) => {
      const next = prev.filter((t) => t.subject_id !== id);
      setStorage("timetable", next);
      return next;
    });
  }, []);

  // --- Attendance Operations ---
  const logAttendance = useCallback((subjectId: string, present: boolean, note?: string) => {
    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      user_id: profile.id,
      subject_id: subjectId,
      date: new Date().toISOString().split("T")[0],
      present,
      note: note || null,
      created_at: new Date().toISOString(),
    };

    setAttendanceState((prev) => {
      const next = [newRecord, ...prev];
      setStorage("attendance", next);
      return next;
    });

    // Update subject counters
    setSubjectsState((prev) => {
      const next = prev.map((s) => {
        if (s.id === subjectId) {
          return {
            ...s,
            total_classes: s.total_classes + 1,
            attended_classes: present ? s.attended_classes + 1 : s.attended_classes,
          };
        }
        return s;
      });
      setStorage("subjects", next);
      return next;
    });
  }, [profile.id]);

  // --- Timetable Operations ---
  const addTimetableEntry = useCallback((entry: Omit<TimetableEntry, "id" | "user_id" | "created_at">) => {
    const newEntry: TimetableEntry = {
      ...entry,
      id: `tt-${Date.now()}`,
      user_id: profile.id,
      created_at: new Date().toISOString(),
    };
    setTimetableState((prev) => {
      const next = [...prev, newEntry];
      setStorage("timetable", next);
      return next;
    });
  }, [profile.id]);

  const deleteTimetableEntry = useCallback((id: string) => {
    setTimetableState((prev) => {
      const next = prev.filter((t) => t.id !== id);
      setStorage("timetable", next);
      return next;
    });
  }, []);

  // --- Assignments Operations ---
  const addAssignment = useCallback((asg: Omit<Assignment, "id" | "user_id" | "created_at" | "completed_at">) => {
    const newAsg: Assignment = {
      ...asg,
      id: `asg-${Date.now()}`,
      user_id: profile.id,
      completed_at: asg.status === "completed" ? new Date().toISOString() : null,
      created_at: new Date().toISOString(),
    };
    setAssignmentsState((prev) => {
      const next = [newAsg, ...prev];
      setStorage("assignments", next);
      return next;
    });
  }, [profile.id]);

  const updateAssignment = useCallback((id: string, updated: Partial<Assignment>) => {
    setAssignmentsState((prev) => {
      const next = prev.map((a) => {
        if (a.id === id) {
          const isCompleted = updated.status === "completed" || (a.status === "completed" && updated.status !== "pending" && updated.status !== "in_progress");
          return {
            ...a,
            ...updated,
            completed_at: isCompleted ? (a.completed_at || new Date().toISOString()) : null,
          };
        }
        return a;
      });
      setStorage("assignments", next);
      return next;
    });
  }, []);

  const deleteAssignment = useCallback((id: string) => {
    setAssignmentsState((prev) => {
      const next = prev.filter((a) => a.id !== id);
      setStorage("assignments", next);
      return next;
    });
  }, []);

  // --- Career Goals Operations ---
  const toggleSkill = useCallback((goalId: string, skillName: string) => {
    setCareerGoalsState((prev) => {
      const next = prev.map((goal) => {
        if (goal.id === goalId) {
          const updatedSkills = goal.skills.map((s) =>
            s.name === skillName ? { ...s, completed: !s.completed } : s
          );
          const completedCount = updatedSkills.filter((s) => s.completed).length;
          const pct = Math.round((completedCount / updatedSkills.length) * 100);
          return {
            ...goal,
            skills: updatedSkills,
            completion_pct: pct,
            progress: {
              ...goal.progress,
              completed_skills: completedCount,
            },
            updated_at: new Date().toISOString(),
          };
        }
        return goal;
      });
      setStorage("careerGoals", next);
      return next;
    });
  }, []);

  const toggleLearningPlan = useCallback((goalId: string, week: number) => {
    setCareerGoalsState((prev) => {
      const next = prev.map((goal) => {
        if (goal.id === goalId) {
          const updatedPlan = goal.learning_plan.map((item) =>
            item.week === week ? { ...item, completed: !item.completed } : item
          );
          return {
            ...goal,
            learning_plan: updatedPlan,
            updated_at: new Date().toISOString(),
          };
        }
        return goal;
      });
      setStorage("careerGoals", next);
      return next;
    });
  }, []);

  // --- Opportunities & Bookmarks ---
  const toggleBookmark = useCallback((oppId: string) => {
    setBookmarkedOppIds((prev) => {
      const next = prev.includes(oppId) ? prev.filter((id) => id !== oppId) : [...prev, oppId];
      setStorage("bookmarkedOppIds", next);
      return next;
    });
  }, []);

  // --- Notes Operations ---
  const addNote = useCallback((note: Omit<StudyNote, "id" | "user_id" | "created_at" | "updated_at">) => {
    const newNote: StudyNote = {
      ...note,
      id: `note-${Date.now()}`,
      user_id: profile.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setNotesState((prev) => {
      const next = [newNote, ...prev];
      setStorage("notes", next);
      return next;
    });
  }, [profile.id]);

  const deleteNote = useCallback((id: string) => {
    setNotesState((prev) => {
      const next = prev.filter((n) => n.id !== id);
      setStorage("notes", next);
      return next;
    });
  }, []);

  // --- Community Posts ---
  const addPost = useCallback((post: Omit<CommunityPost, "id" | "user_id" | "likes_count" | "comments_count" | "is_reported" | "created_at" | "updated_at" | "author" | "user_has_liked">) => {
    const newPost: CommunityPost = {
      ...post,
      id: `post-${Date.now()}`,
      user_id: profile.id,
      likes_count: 0,
      comments_count: 0,
      is_reported: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: profile,
      user_has_liked: false,
    };
    setPostsState((prev) => {
      const next = [newPost, ...prev];
      setStorage("posts", next);
      return next;
    });
  }, [profile]);

  const togglePostLike = useCallback((postId: string) => {
    setPostsState((prev) => {
      const next = prev.map((p) => {
        if (p.id === postId) {
          const hasLiked = !p.user_has_liked;
          return {
            ...p,
            user_has_liked: hasLiked,
            likes_count: hasLiked ? p.likes_count + 1 : Math.max(0, p.likes_count - 1),
          };
        }
        return p;
      });
      setStorage("posts", next);
      return next;
    });
  }, []);

  // --- Projects Operations ---
  const addProject = useCallback((proj: Omit<Project, "id" | "user_id" | "created_at" | "updated_at" | "owner">) => {
    const newProj: Project = {
      ...proj,
      id: `proj-${Date.now()}`,
      user_id: profile.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner: profile,
    };
    setProjectsState((prev) => {
      const next = [newProj, ...prev];
      setStorage("projects", next);
      return next;
    });
  }, [profile]);

  // --- Placements Operations ---
  const addPlacement = useCallback((plc: Omit<PlacementApp, "id" | "user_id" | "created_at" | "updated_at">) => {
    const newPlc: PlacementApp = {
      ...plc,
      id: `plc-${Date.now()}`,
      user_id: profile.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setPlacementsState((prev) => {
      const next = [newPlc, ...prev];
      setStorage("placements", next);
      return next;
    });
  }, [profile.id]);

  const updatePlacementStatus = useCallback((id: string, status: PlacementApp["status"]) => {
    setPlacementsState((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, status, updated_at: new Date().toISOString() } : p));
      setStorage("placements", next);
      return next;
    });
  }, []);

  return {
    isLoaded,
    profile,
    updateProfile,
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    attendance,
    logAttendance,
    timetable,
    addTimetableEntry,
    deleteTimetableEntry,
    assignments,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    careerGoals,
    toggleSkill,
    toggleLearningPlan,
    opportunities,
    bookmarkedOppIds,
    toggleBookmark,
    notes,
    addNote,
    deleteNote,
    posts,
    addPost,
    togglePostLike,
    projects,
    addProject,
    placements,
    addPlacement,
    updatePlacementStatus,
  };
}
