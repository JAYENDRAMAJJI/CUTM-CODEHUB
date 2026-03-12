package com.codelearn.backend.controller;

import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codelearn.backend.service.AdminDataService;
import com.codelearn.backend.service.MongoHealthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class AdminController {

    private final AdminDataService service;
    private final MongoHealthService mongoHealthService;

    public AdminController(AdminDataService service, MongoHealthService mongoHealthService) {
        this.service = service;
        this.mongoHealthService = mongoHealthService;
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> response = new LinkedHashMap<>(service.health());
        response.putAll(mongoHealthService.health());
        return response;
    }

    @PostMapping("/auth/admin/login")
    public ResponseEntity<AdminDataService.AuthResult> adminLogin(@RequestBody @Valid AdminDataService.AdminLoginRequest req) {
        AdminDataService.AuthResult result = service.adminLogin(req);
        if (!result.success()) {
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/admin/users")
    public List<AdminDataService.UserDto> getUsers() {
        return service.getUsers();
    }

    @PostMapping("/admin/users")
    public AdminDataService.UserDto createUser(@RequestBody @Valid AdminDataService.UserCreateRequest req) {
        return service.createUser(req);
    }

    @PutMapping("/admin/users/{id}")
    public AdminDataService.UserDto updateUser(@PathVariable String id, @RequestBody @Valid AdminDataService.UserUpdateRequest req) {
        return service.updateUser(id, req);
    }

    @DeleteMapping("/admin/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        service.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/admin/courses")
    public List<AdminDataService.CourseDto> getCourses() {
        return service.getCourses();
    }

    @PostMapping("/admin/courses")
    public AdminDataService.CourseDto createCourse(@RequestBody @Valid AdminDataService.CourseCreateRequest req) {
        return service.createCourse(req);
    }

    @GetMapping("/admin/problems")
    public List<AdminDataService.ProblemDto> getProblems() {
        return service.getProblems();
    }

    @PostMapping("/admin/problems")
    public AdminDataService.ProblemDto createProblem(@RequestBody @Valid AdminDataService.ProblemCreateRequest req) {
        return service.createProblem(req);
    }

    @GetMapping("/admin/contests")
    public List<AdminDataService.ContestDto> getContests() {
        return service.getContests();
    }

    @PostMapping("/admin/contests")
    public AdminDataService.ContestDto createContest(@RequestBody @Valid AdminDataService.ContestCreateRequest req) {
        return service.createContest(req);
    }

    @GetMapping("/admin/analytics")
    public AdminDataService.AnalyticsDto getAnalytics() {
        return service.getAnalytics();
    }
}
