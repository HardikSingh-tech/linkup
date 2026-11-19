package com.linkup.controller;

import com.linkup.dto.*;
import com.linkup.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserProfileDto> getUserProfile(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getUserProfile(id, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProfileRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.updateUserProfile(id, request, userDetails.getUsername()));
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDto>> searchUsers(@RequestParam(required = false, defaultValue = "") String q) {
        return ResponseEntity.ok(userService.searchUsers(q));
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<UserDto>> getSuggestions(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getSuggestions(userDetails.getUsername()));
    }

    // Current user Experiences
    @GetMapping("/me/experiences")
    public ResponseEntity<List<ExperienceDto>> getMyExperiences(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getMyExperiences(userDetails.getUsername()));
    }

    @PostMapping("/me/experiences")
    public ResponseEntity<ExperienceDto> addExperience(
            @Valid @RequestBody ExperienceDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.addExperience(dto, userDetails.getUsername()));
    }

    @PutMapping("/me/experiences/{id}")
    public ResponseEntity<ExperienceDto> updateExperience(
            @PathVariable Long id,
            @Valid @RequestBody ExperienceDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.updateExperience(id, dto, userDetails.getUsername()));
    }

    @DeleteMapping("/me/experiences/{id}")
    public ResponseEntity<Void> deleteExperience(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        userService.deleteExperience(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    // Current user Educations
    @GetMapping("/me/educations")
    public ResponseEntity<List<EducationDto>> getMyEducations(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getMyEducations(userDetails.getUsername()));
    }

    @PostMapping("/me/educations")
    public ResponseEntity<EducationDto> addEducation(
            @Valid @RequestBody EducationDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.addEducation(dto, userDetails.getUsername()));
    }

    @PutMapping("/me/educations/{id}")
    public ResponseEntity<EducationDto> updateEducation(
            @PathVariable Long id,
            @Valid @RequestBody EducationDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.updateEducation(id, dto, userDetails.getUsername()));
    }

    @DeleteMapping("/me/educations/{id}")
    public ResponseEntity<Void> deleteEducation(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        userService.deleteEducation(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    // Current user Skills
    @GetMapping("/me/skills")
    public ResponseEntity<List<SkillDto>> getMySkills(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getMySkills(userDetails.getUsername()));
    }

    @PostMapping("/me/skills")
    public ResponseEntity<SkillDto> addSkill(
            @Valid @RequestBody SkillDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.addSkill(dto, userDetails.getUsername()));
    }

    @DeleteMapping("/me/skills/{id}")
    public ResponseEntity<Void> deleteSkill(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        userService.deleteSkill(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
