package com.linkup.service;

import com.linkup.dto.*;
import com.linkup.entity.*;
import com.linkup.exception.BadRequestException;
import com.linkup.exception.ResourceNotFoundException;
import com.linkup.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ExperienceRepository experienceRepository;
    private final EducationRepository educationRepository;
    private final SkillRepository skillRepository;
    private final ConnectionRepository connectionRepository;
    private final AuthService authService;

    public UserProfileDto getUserProfile(Long targetUserId, String currentEmail) {
        User target = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + targetUserId));
        User currentUser = authService.getCurrentUser(currentEmail);

        List<ExperienceDto> exps = experienceRepository.findByUserIdOrderByStartDateDesc(targetUserId).stream()
                .map(this::mapExperienceToDto).collect(Collectors.toList());
        List<EducationDto> edus = educationRepository.findByUserIdOrderByStartDateDesc(targetUserId).stream()
                .map(this::mapEducationToDto).collect(Collectors.toList());
        List<SkillDto> skills = skillRepository.findByUserIdOrderByNameAsc(targetUserId).stream()
                .map(this::mapSkillToDto).collect(Collectors.toList());

        long connCount = connectionRepository.findAcceptedConnections(targetUserId).size();

        String status = "NONE";
        Long connId = null;
        if (targetUserId.equals(currentUser.getId())) {
            status = "SELF";
        } else {
            Optional<Connection> connOpt = connectionRepository.findConnectionBetween(currentUser.getId(), targetUserId);
            if (connOpt.isPresent()) {
                Connection c = connOpt.get();
                connId = c.getId();
                if (c.getStatus() == ConnectionStatus.ACCEPTED) {
                    status = "ACCEPTED";
                } else if (c.getStatus() == ConnectionStatus.PENDING) {
                    status = c.getRequester().getId().equals(currentUser.getId()) ? "PENDING" : "RECEIVED";
                }
            }
        }

        return UserProfileDto.builder()
                .user(authService.mapToDto(target))
                .experiences(exps)
                .educations(edus)
                .skills(skills)
                .connectionCount(connCount)
                .connectionStatus(status)
                .connectionId(connId)
                .build();
    }

    @Transactional
    public UserDto updateUserProfile(Long id, UpdateProfileRequest req, String currentEmail) {
        User currentUser = authService.getCurrentUser(currentEmail);
        if (!currentUser.getId().equals(id)) {
            throw new BadRequestException("You can only update your own profile");
        }

        currentUser.setFirstName(req.getFirstName());
        currentUser.setLastName(req.getLastName());
        currentUser.setHeadline(req.getHeadline());
        currentUser.setLocation(req.getLocation());
        currentUser.setAbout(req.getAbout());
        if (req.getAvatarUrl() != null && !req.getAvatarUrl().isBlank()) {
            currentUser.setAvatarUrl(req.getAvatarUrl());
        }
        if (req.getBannerUrl() != null && !req.getBannerUrl().isBlank()) {
            currentUser.setBannerUrl(req.getBannerUrl());
        }

        return authService.mapToDto(userRepository.save(currentUser));
    }

    public List<UserDto> searchUsers(String query) {
        if (query == null || query.isBlank()) {
            return userRepository.findAll().stream().limit(20).map(authService::mapToDto).collect(Collectors.toList());
        }
        return userRepository.searchUsers(query).stream().map(authService::mapToDto).collect(Collectors.toList());
    }

    public List<UserDto> getSuggestions(String currentEmail) {
        User currentUser = authService.getCurrentUser(currentEmail);
        List<Long> excludedIds = connectionRepository.findAllAssociatedUserIds(currentUser.getId());
        excludedIds.add(currentUser.getId());

        return userRepository.findAll().stream()
                .filter(u -> !excludedIds.contains(u.getId()))
                .limit(10)
                .map(authService::mapToDto)
                .collect(Collectors.toList());
    }

    // Experience CRUD
    public List<ExperienceDto> getMyExperiences(String email) {
        User user = authService.getCurrentUser(email);
        return experienceRepository.findByUserIdOrderByStartDateDesc(user.getId()).stream()
                .map(this::mapExperienceToDto).collect(Collectors.toList());
    }

    @Transactional
    public ExperienceDto addExperience(ExperienceDto dto, String email) {
        User user = authService.getCurrentUser(email);
        Experience exp = Experience.builder()
                .user(user)
                .title(dto.getTitle())
                .company(dto.getCompany())
                .location(dto.getLocation())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .isCurrent(dto.isCurrent())
                .description(dto.getDescription())
                .build();
        return mapExperienceToDto(experienceRepository.save(exp));
    }

    @Transactional
    public ExperienceDto updateExperience(Long id, ExperienceDto dto, String email) {
        User user = authService.getCurrentUser(email);
        Experience exp = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found"));
        if (!exp.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to experience");
        }
        exp.setTitle(dto.getTitle());
        exp.setCompany(dto.getCompany());
        exp.setLocation(dto.getLocation());
        exp.setStartDate(dto.getStartDate());
        exp.setEndDate(dto.getEndDate());
        exp.setCurrent(dto.isCurrent());
        exp.setDescription(dto.getDescription());
        return mapExperienceToDto(experienceRepository.save(exp));
    }

    @Transactional
    public void deleteExperience(Long id, String email) {
        User user = authService.getCurrentUser(email);
        Experience exp = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found"));
        if (!exp.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to experience");
        }
        experienceRepository.delete(exp);
    }

    // Education CRUD
    public List<EducationDto> getMyEducations(String email) {
        User user = authService.getCurrentUser(email);
        return educationRepository.findByUserIdOrderByStartDateDesc(user.getId()).stream()
                .map(this::mapEducationToDto).collect(Collectors.toList());
    }

    @Transactional
    public EducationDto addEducation(EducationDto dto, String email) {
        User user = authService.getCurrentUser(email);
        Education edu = Education.builder()
                .user(user)
                .school(dto.getSchool())
                .degree(dto.getDegree())
                .fieldOfStudy(dto.getFieldOfStudy())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .description(dto.getDescription())
                .build();
        return mapEducationToDto(educationRepository.save(edu));
    }

    @Transactional
    public EducationDto updateEducation(Long id, EducationDto dto, String email) {
        User user = authService.getCurrentUser(email);
        Education edu = educationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Education not found"));
        if (!edu.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to education");
        }
        edu.setSchool(dto.getSchool());
        edu.setDegree(dto.getDegree());
        edu.setFieldOfStudy(dto.getFieldOfStudy());
        edu.setStartDate(dto.getStartDate());
        edu.setEndDate(dto.getEndDate());
        edu.setDescription(dto.getDescription());
        return mapEducationToDto(educationRepository.save(edu));
    }

    @Transactional
    public void deleteEducation(Long id, String email) {
        User user = authService.getCurrentUser(email);
        Education edu = educationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Education not found"));
        if (!edu.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to education");
        }
        educationRepository.delete(edu);
    }

    // Skill CRUD
    public List<SkillDto> getMySkills(String email) {
        User user = authService.getCurrentUser(email);
        return skillRepository.findByUserIdOrderByNameAsc(user.getId()).stream()
                .map(this::mapSkillToDto).collect(Collectors.toList());
    }

    @Transactional
    public SkillDto addSkill(SkillDto dto, String email) {
        User user = authService.getCurrentUser(email);
        Skill skill = Skill.builder()
                .user(user)
                .name(dto.getName())
                .build();
        return mapSkillToDto(skillRepository.save(skill));
    }

    @Transactional
    public void deleteSkill(Long id, String email) {
        User user = authService.getCurrentUser(email);
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));
        if (!skill.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to skill");
        }
        skillRepository.delete(skill);
    }

    public ExperienceDto mapExperienceToDto(Experience e) {
        return ExperienceDto.builder()
                .id(e.getId())
                .title(e.getTitle())
                .company(e.getCompany())
                .location(e.getLocation())
                .startDate(e.getStartDate())
                .endDate(e.getEndDate())
                .isCurrent(e.isCurrent())
                .description(e.getDescription())
                .build();
    }

    public EducationDto mapEducationToDto(Education ed) {
        return EducationDto.builder()
                .id(ed.getId())
                .school(ed.getSchool())
                .degree(ed.getDegree())
                .fieldOfStudy(ed.getFieldOfStudy())
                .startDate(ed.getStartDate())
                .endDate(ed.getEndDate())
                .description(ed.getDescription())
                .build();
    }

    public SkillDto mapSkillToDto(Skill s) {
        return SkillDto.builder()
                .id(s.getId())
                .name(s.getName())
                .build();
    }
}
