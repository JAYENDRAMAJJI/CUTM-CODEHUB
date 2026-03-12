package com.codelearn.backend.service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class AdminDataService {

    private final CopyOnWriteArrayList<UserDto> users = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<CourseDto> courses = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<ProblemDto> problems = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<ContestDto> contests = new CopyOnWriteArrayList<>();

    private final AtomicInteger userIdSeq = new AtomicInteger(1005);
    private final AtomicInteger courseIdSeq = new AtomicInteger(217);
    private final AtomicInteger problemIdSeq = new AtomicInteger(1005);
    private final AtomicInteger contestIdSeq = new AtomicInteger(5001);

    @PostConstruct
    void seed() {
        users.addAll(List.of(
            new UserDto("USR-1001", "Alex Student", "alex@example.com", "Student", "Active", "Jan 03, 2026"),
            new UserDto("USR-1002", "Sarah Admin", "admin@example.com", "Admin", "Active", "Dec 14, 2025"),
            new UserDto("USR-1003", "Priya Sharma", "priya@example.com", "Student", "Suspended", "Jan 28, 2026"),
            new UserDto("USR-1004", "Rohit Das", "rohit@example.com", "Student", "Active", "Feb 02, 2026"),
            new UserDto("USR-1005", "Nina Paul", "nina@example.com", "Student", "Active", "Feb 08, 2026")
        ));

        courses.addAll(List.of(
            new CourseDto("CRS-201", "DSA Foundations", "Beginner", 1240, "Published"),
            new CourseDto("CRS-202", "Dynamic Programming Mastery", "Advanced", 430, "Published"),
            new CourseDto("CRS-203", "Graphs and Trees", "Intermediate", 760, "Published"),
            new CourseDto("CRS-204", "System Design Basics", "Intermediate", 0, "Draft")
        ));

        problems.addAll(List.of(
            new ProblemDto("PROB-1001", "Two Sum", "Easy", "Admin Sarah", "Oct 12, 2023", "Published"),
            new ProblemDto("PROB-1002", "Add Two Numbers", "Medium", "Admin Sarah", "Oct 15, 2023", "Published"),
            new ProblemDto("PROB-1003", "Longest Substring Without Repeating Characters", "Medium", "Admin Sarah", "Oct 18, 2023", "Draft")
        ));

        contests.addAll(List.of(
            new ContestDto("CNT-5001", "Weekly Challenge 41", "Mar 15, 2026 7:00 PM", 120, 842, "Upcoming"),
            new ContestDto("CNT-5000", "Algo Sprint March", "Mar 10, 2026 8:00 PM", 90, 1124, "Live"),
            new ContestDto("CNT-4999", "February Open", "Feb 26, 2026 6:00 PM", 120, 2032, "Completed")
        ));
    }

    public List<UserDto> getUsers() {
        return users.stream().sorted(Comparator.comparing(UserDto::id)).toList();
    }

    public UserDto createUser(UserCreateRequest req) {
        String id = "USR-" + userIdSeq.incrementAndGet();
        UserDto created = new UserDto(id, req.name(), req.email(), req.role(), "Active", req.joinedOn());
        users.add(created);
        return created;
    }

    public UserDto updateUser(String id, UserUpdateRequest req) {
        int index = indexOfUser(id);
        if (index < 0) {
            throw new IllegalArgumentException("User not found: " + id);
        }
        UserDto updated = new UserDto(id, req.name(), req.email(), req.role(), req.status(), req.joinedOn());
        users.set(index, updated);
        return updated;
    }

    public void deleteUser(String id) {
        users.removeIf(user -> user.id().equals(id));
    }

    public List<CourseDto> getCourses() {
        return List.copyOf(courses);
    }

    public CourseDto createCourse(CourseCreateRequest req) {
        String id = "CRS-" + courseIdSeq.incrementAndGet();
        CourseDto created = new CourseDto(id, req.title(), req.level(), 0, req.status());
        courses.add(0, created);
        return created;
    }

    public List<ProblemDto> getProblems() {
        return List.copyOf(problems);
    }

    public ProblemDto createProblem(ProblemCreateRequest req) {
        String id = "PROB-" + problemIdSeq.incrementAndGet();
        ProblemDto created = new ProblemDto(id, req.title(), req.difficulty(), req.author(), req.created(), req.status());
        problems.add(0, created);
        return created;
    }

    public List<ContestDto> getContests() {
        return List.copyOf(contests);
    }

    public ContestDto createContest(ContestCreateRequest req) {
        String id = "CNT-" + contestIdSeq.incrementAndGet();
        ContestDto created = new ContestDto(id, req.title(), req.startAt(), req.durationMinutes(), 0, "Upcoming");
        contests.add(0, created);
        return created;
    }

    public AnalyticsDto getAnalytics() {
        long activeContests = contests.stream().filter(c -> "Live".equalsIgnoreCase(c.status())).count();
        return new AnalyticsDto(
            users.size(),
            problems.size(),
            (int) activeContests,
            "+8.4%",
            Math.max(1000, users.size() * 420),
            problems.size() * 12,
            contests.stream().mapToInt(ContestDto::participants).sum(),
            "62.4%"
        );
    }

    public AuthResult adminLogin(AdminLoginRequest req) {
        boolean ok = "admin@codelearn.com".equalsIgnoreCase(req.email()) && "Admin@123".equals(req.password());
        if (!ok) {
            return new AuthResult(false, "Invalid admin credentials", null);
        }
        UserSession session = new UserSession("2", "Admin Sarah", "admin@codelearn.com", "ADMIN");
        return new AuthResult(true, "Login successful", session);
    }

    public Map<String, Object> health() {
        return Map.of(
            "status", "UP",
            "users", users.size(),
            "courses", courses.size(),
            "problems", problems.size(),
            "contests", contests.size()
        );
    }

    private int indexOfUser(String id) {
        for (int i = 0; i < users.size(); i++) {
            if (users.get(i).id().equals(id)) {
                return i;
            }
        }
        return -1;
    }

    public record UserDto(String id, String name, String email, String role, String status, String joinedOn) {}

    public record UserCreateRequest(String name, String email, String role, String joinedOn) {}

    public record UserUpdateRequest(String name, String email, String role, String status, String joinedOn) {}

    public record CourseDto(String id, String title, String level, int enrolled, String status) {}

    public record CourseCreateRequest(String title, String level, String status) {}

    public record ProblemDto(String id, String title, String difficulty, String author, String created, String status) {}

    public record ProblemCreateRequest(String title, String difficulty, String author, String created, String status) {}

    public record ContestDto(String id, String title, String startAt, int durationMinutes, int participants, String status) {}

    public record ContestCreateRequest(String title, String startAt, int durationMinutes) {}

    public record AnalyticsDto(
        int totalUsers,
        int totalProblems,
        int activeContests,
        String weeklyGrowth,
        int dailyActiveUsers,
        int solvedCount,
        int contestParticipation,
        String acceptanceRate
    ) {}

    public record AdminLoginRequest(String email, String password) {}

    public record UserSession(String id, String name, String email, String role) {}

    public record AuthResult(boolean success, String message, UserSession user) {}
}
