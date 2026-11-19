package com.linkup.config;

import com.linkup.entity.*;
import com.linkup.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ExperienceRepository experienceRepository;
    private final EducationRepository educationRepository;
    private final SkillRepository skillRepository;
    private final ConnectionRepository connectionRepository;
    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final CommentRepository commentRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final MessageRepository messageRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return;
        }

        String encodedPassword = passwordEncoder.encode("Password@123");

        User hardik = User.builder()
                .firstName("Hardik").lastName("Singh").email("hardik@linkup.com").password(encodedPassword)
                .headline("Lead Software Architect & Full-Stack Engineer | Building LinkUp").location("San Francisco, CA")
                .about("Passionate engineering leader building modern enterprise cloud platforms and high-throughput real-time distributed systems.")
                .avatarUrl("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces")
                .bannerUrl("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=300&fit=crop")
                .build();

        User sarah = User.builder()
                .firstName("Sarah").lastName("Jenkins").email("sarah.jenkins@techcorp.io").password(encodedPassword)
                .headline("Senior Product Manager @ Google | ex-Stripe | AI & Growth").location("New York, NY")
                .about("Product leader focused on developer experience, AI-first productivity tools, and high-growth consumer products.")
                .avatarUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces")
                .bannerUrl("https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=300&fit=crop")
                .build();

        User david = User.builder()
                .firstName("David").lastName("Chen").email("david.chen@cloudscale.net").password(encodedPassword)
                .headline("Principal DevOps & SRE Engineer | Kubernetes, Terraform & AWS").location("Seattle, WA")
                .about("Specializing in 99.999% uptime architectures, GitOps workflows, and zero-trust cloud infrastructure.")
                .avatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces")
                .bannerUrl("https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop")
                .build();

        User elena = User.builder()
                .firstName("Elena").lastName("Rostova").email("elena.rostova@designworks.com").password(encodedPassword)
                .headline("Staff Product Designer | Design Systems & Human-Centered UX").location("Austin, TX")
                .about("Crafting delightful, intuitive, and accessible enterprise software experiences through systematic UI architecture.")
                .avatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces")
                .bannerUrl("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&h=300&fit=crop")
                .build();

        User marcus = User.builder()
                .firstName("Marcus").lastName("Vance").email("marcus.vance@finflow.co").password(encodedPassword)
                .headline("VP of Engineering @ FinFlow | Scaling Teams 10x to 100x").location("Boston, MA")
                .about("Helping fast-moving fintech companies scale their engineering culture, technical roadmap, and architectural excellence.")
                .avatarUrl("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces")
                .bannerUrl("https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=300&fit=crop")
                .build();

        User aisha = User.builder()
                .firstName("Aisha").lastName("Patel").email("aisha.patel@datahub.ai").password(encodedPassword)
                .headline("Machine Learning Research Scientist | LLMs & Retrieval Systems").location("San Jose, CA")
                .about("PhD in Computer Science. Researching context optimization, sparse attention mechanisms, and multi-agent collaborative workflows.")
                .avatarUrl("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces")
                .bannerUrl("https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=300&fit=crop")
                .build();

        User alex = User.builder()
                .firstName("Alex").lastName("Kim").email("alex.kim@frontendlabs.dev").password(encodedPassword)
                .headline("Senior Frontend Engineer | React 19, TypeScript & Web Performance").location("Chicago, IL")
                .about("Obsessed with 60fps animations, tiny bundle sizes, accessible WCAG standards, and micro-frontend design patterns.")
                .avatarUrl("https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=faces")
                .bannerUrl("https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&h=300&fit=crop")
                .build();

        User rachel = User.builder()
                .firstName("Rachel").lastName("Green").email("rachel.green@talentforge.hr").password(encodedPassword)
                .headline("Head of Technical Talent Acquisition | We're Hiring Engineers!").location("Denver, CO")
                .about("Connecting world-class engineering, design, and product talent with hyper-growth venture-backed startups.")
                .avatarUrl("https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces")
                .bannerUrl("https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&h=300&fit=crop")
                .build();

        userRepository.saveAll(List.of(hardik, sarah, david, elena, marcus, aisha, alex, rachel));

        // Experiences
        experienceRepository.saveAll(List.of(
            Experience.builder().user(hardik).title("Lead Systems Architect").company("LinkUp Networks Inc.")
                .location("San Francisco, CA").startDate(LocalDate.of(2023, 1, 15)).isCurrent(true)
                .description("Spearheading overall system architecture, microservices layout, and cloud scalability.").build(),
            Experience.builder().user(hardik).title("Senior Backend Engineer").company("Stripe").location("San Francisco, CA")
                .startDate(LocalDate.of(2020, 6, 1)).endDate(LocalDate.of(2022, 12, 31)).isCurrent(false)
                .description("Engineered high-throughput payment processing APIs handling 50k+ requests/sec.").build(),
            Experience.builder().user(sarah).title("Senior Product Manager").company("Google").location("New York, NY")
                .startDate(LocalDate.of(2021, 3, 1)).isCurrent(true)
                .description("Leading product strategy for developer tooling and cloud integrations.").build()
        ));

        // Educations
        educationRepository.saveAll(List.of(
            Education.builder().user(hardik).school("Stanford University").degree("Master of Science")
                .fieldOfStudy("Computer Science").startDate(LocalDate.of(2018, 9, 1)).endDate(LocalDate.of(2020, 6, 1))
                .description("Focused on distributed databases and cloud computing architectures.").build(),
            Education.builder().user(sarah).school("Harvard Business School").degree("MBA")
                .fieldOfStudy("Technology & Operations").startDate(LocalDate.of(2017, 9, 1)).endDate(LocalDate.of(2019, 5, 1)).build(),
            Education.builder().user(david).school("UC Berkeley").degree("Bachelor of Science")
                .fieldOfStudy("Electrical Engineering & Computer Science").startDate(LocalDate.of(2014, 8, 1)).endDate(LocalDate.of(2018, 5, 1)).build()
        ));

        // Skills
        skillRepository.saveAll(List.of(
            Skill.builder().user(hardik).name("Java").build(),
            Skill.builder().user(hardik).name("Spring Boot").build(),
            Skill.builder().user(hardik).name("React").build(),
            Skill.builder().user(hardik).name("Distributed Systems").build(),
            Skill.builder().user(sarah).name("Product Management").build(),
            Skill.builder().user(sarah).name("Agile Strategy").build(),
            Skill.builder().user(david).name("Kubernetes").build(),
            Skill.builder().user(david).name("Terraform").build(),
            Skill.builder().user(elena).name("Design Systems").build(),
            Skill.builder().user(elena).name("Figma").build(),
            Skill.builder().user(alex).name("TypeScript").build(),
            Skill.builder().user(alex).name("Web Performance").build()
        ));

        // Connections
        Connection c1 = Connection.builder().requester(hardik).receiver(sarah).status(ConnectionStatus.ACCEPTED).build();
        Connection c2 = Connection.builder().requester(david).receiver(hardik).status(ConnectionStatus.ACCEPTED).build();
        Connection c3 = Connection.builder().requester(hardik).receiver(elena).status(ConnectionStatus.ACCEPTED).build();
        Connection c4 = Connection.builder().requester(marcus).receiver(hardik).status(ConnectionStatus.PENDING).build();
        Connection c5 = Connection.builder().requester(aisha).receiver(hardik).status(ConnectionStatus.PENDING).build();
        connectionRepository.saveAll(List.of(c1, c2, c3, c4, c5));

        // 15 Posts
        Post p1 = Post.builder().author(hardik).content("Thrilled to announce the launch of LinkUp! We engineered this professional platform with Spring Boot 3, React 18, and modern enterprise clean architecture. Desktop-first, lightning fast, and privacy-oriented.")
                .mediaUrl("https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&h=500&fit=crop").build();
        Post p2 = Post.builder().author(sarah).content("Product leadership tip: When launching a new enterprise SaaS product, prioritize time-to-first-value over feature count. If users can't find clarity within 30 seconds, engagement falls off a cliff.")
                .mediaUrl("https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=900&h=500&fit=crop").build();
        Post p3 = Post.builder().author(david).content("Migrated 40 microservices to Kubernetes multi-cluster architecture today without a single second of downtime! Zero-trust networking with Cilium and automated rollbacks via ArgoCD.")
                .mediaUrl("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&h=500&fit=crop").build();
        Post p4 = Post.builder().author(elena).content("Design systems aren't just a Figma library; they are a contract between design and engineering. */ Consistent spacing tokens and atomic color scales save hundreds of developer hours.")
                .mediaUrl("https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=900&h=500&fit=crop").build();
        Post p5 = Post.builder().author(marcus).content("Hiring update: FinFlow is scaling our core infrastructure team! Looking for backend engineers with deep experience in Java, high concurrency, and distributed ledger tech. Drop me a DM if interested.").build();
        Post p6 = Post.builder().author(aisha).content("Fascinating breakthrough in retrieval-augmented generation (RAG): using hybrid vector-lexical reranking reduces hallucinations by up to 42% on complex technical documentation.")
                .mediaUrl("https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&h=500&fit=crop").build();
        Post p7 = Post.builder().author(alex).content("React 19 compiler eliminates the need for manual useMemo and useCallback! Excited to benchmark the latest production builds against our LinkUp interface.").build();
        Post p8 = Post.builder().author(rachel).content("Resume tip for engineers in 2026: Quantify your business impact. Instead of 'built an API', write 'engineered REST API handling 20k RPS with sub-30ms p99 latency, reducing cloud costs by 28%.'").build();
        Post p9 = Post.builder().author(hardik).content("Clean Architecture reminder: Keep your core domain decoupled from frameworks and database tables. Entities should encapsulate business invariants, not just ORM column mappings.").build();
        Post p10 = Post.builder().author(sarah).content("Enjoying the vibrant tech community meetup in NYC tonight! Great conversations about agentic AI workflows and collaborative software engineering.")
                .mediaUrl("https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&h=500&fit=crop").build();
        Post p11 = Post.builder().author(david).content("Infrastructure as Code best practice: Always run automated drift detection against your cloud providers. Catch out-of-band manual changes before they break your deployments.").build();
        Post p12 = Post.builder().author(elena).content("Typography hierarchy is the unsung hero of clean enterprise dashboards. Simple adjustments to line-height and weight can make dense tables 10x more readable.").build();
        Post p13 = Post.builder().author(marcus).content("Leadership isn't about having all the answers; it's about asking the right questions and empowering your teams to execute with psychological safety.").build();
        Post p14 = Post.builder().author(aisha).content("Excited to speak next week at NeurIPS on multi-agent consensus protocols in autonomous code generation!").build();
        Post p15 = Post.builder().author(alex).content("Tailwind CSS has drastically reduced our CSS bundle overhead. Combined with Vite, HMR reload happens in under 25ms. Unbeatable DX!")
                .mediaUrl("https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&h=500&fit=crop").build();

        postRepository.saveAll(List.of(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15));

        // Post likes & comments
        postLikeRepository.saveAll(List.of(
            PostLike.builder().post(p1).user(sarah).build(),
            PostLike.builder().post(p1).user(david).build(),
            PostLike.builder().post(p2).user(hardik).build(),
            PostLike.builder().post(p3).user(hardik).build()
        ));

        commentRepository.saveAll(List.of(
            Comment.builder().post(p1).author(sarah).content("Congratulations Hardik! The architecture and UI look remarkably sleek and responsive.").build(),
            Comment.builder().post(p1).author(david).content("Awesome tech stack choice. Looking forward to testing the REST APIs and feed throughput!").build()
        ));

        // 12 Jobs
        Job j1 = Job.builder().poster(rachel).title("Staff Backend Engineer").company("TalentForge Systems").location("San Francisco, CA")
                .employmentType("Full-time").workplaceType("Hybrid").salaryRange("$185,000 - $230,000")
                .description("Looking for a Staff Engineer to architect real-time event streaming and high-concurrency microservices in Java and Spring Boot.").build();
        Job j2 = Job.builder().poster(sarah).title("Principal Product Manager - Cloud").company("Google").location("New York, NY")
                .employmentType("Full-time").workplaceType("Hybrid").salaryRange("$210,000 - $270,000")
                .description("Drive next-generation developer cloud tooling, telemetry visualization, and agent integrations.").build();
        Job j3 = Job.builder().poster(david).title("Senior DevOps / Infrastructure Engineer").company("CloudScale Network").location("Seattle, WA")
                .employmentType("Full-time").workplaceType("Remote").salaryRange("$160,000 - $205,000")
                .description("Build scalable Kubernetes clusters, manage Terraform multi-region states, and design automated deployment pipelines.").build();
        Job j4 = Job.builder().poster(elena).title("Lead UI/UX Systems Designer").company("DesignWorks Studio").location("Austin, TX")
                .employmentType("Full-time").workplaceType("Hybrid").salaryRange("$140,000 - $180,000")
                .description("Design component libraries, token schemas, and interactive micro-interactions for enterprise web platforms.").build();
        Job j5 = Job.builder().poster(marcus).title("VP of Engineering").company("FinFlow Technologies").location("Boston, MA")
                .employmentType("Full-time").workplaceType("On-site").salaryRange("$260,000 - $340,000")
                .description("Scale an engineering organization from 20 to 120 engineers while fostering engineering excellence and delivery velocity.").build();
        Job j6 = Job.builder().poster(aisha).title("Staff AI Research Scientist").company("DataHub AI").location("San Jose, CA")
                .employmentType("Full-time").workplaceType("Hybrid").salaryRange("$220,000 - $290,000")
                .description("Lead frontier research on RAG architectures, model fine-tuning, and sparse agent evaluation pipelines.").build();
        Job j7 = Job.builder().poster(alex).title("Senior React & Frontend Architect").company("FrontendLabs").location("Chicago, IL")
                .employmentType("Full-time").workplaceType("Remote").salaryRange("$155,000 - $195,000")
                .description("Spearhead React 19 migration, state management optimization with Zustand, and modern Tailwind design tokens.").build();
        Job j8 = Job.builder().poster(rachel).title("Site Reliability Engineer").company("TalentForge Systems").location("Denver, CO")
                .employmentType("Full-time").workplaceType("Remote").salaryRange("$150,000 - $190,000")
                .description("Ensure 99.99% service availability, manage incident response, and implement Prometheus/Grafana observability.").build();
        Job j9 = Job.builder().poster(hardik).title("Full Stack Software Engineer").company("LinkUp Networks Inc.").location("San Francisco, CA")
                .employmentType("Full-time").workplaceType("Hybrid").salaryRange("$160,000 - $210,000")
                .description("Help build out LinkUp core messaging, notification engine, and high-performance feed ranking systems.").build();
        Job j10 = Job.builder().poster(marcus).title("Fintech Security Architect").company("FinFlow Technologies").location("New York, NY")
                .employmentType("Full-time").workplaceType("Hybrid").salaryRange("$190,000 - $245,000")
                .description("Implement zero-trust security policies, OAuth 2.1, and HSM-backed cryptographic key management.").build();
        Job j11 = Job.builder().poster(sarah).title("Associate Product Manager").company("Google").location("San Francisco, CA")
                .employmentType("Full-time").workplaceType("On-site").salaryRange("$130,000 - $160,000")
                .description("Kickstart your product leadership career rotating across core search and developer ecosystem teams.").build();
        Job j12 = Job.builder().poster(rachel).title("Technical Recruiter").company("TalentForge Systems").location("Austin, TX")
                .employmentType("Contract").workplaceType("Remote").salaryRange("$80,000 - $110,000")
                .description("Partner with hiring managers to source world-class software engineering and infrastructure talent.").build();

        jobRepository.saveAll(List.of(j1, j2, j3, j4, j5, j6, j7, j8, j9, j10, j11, j12));

        // Hardik applied to Google job
        jobApplicationRepository.save(JobApplication.builder()
                .job(j2).applicant(hardik).status("SUBMITTED").notes("Excited to bring deep distributed systems experience to Google Cloud.").build());

        // Messages
        messageRepository.saveAll(List.of(
            Message.builder().sender(sarah).recipient(hardik).content("Hey Hardik, saw your new LinkUp launch post! Looking fantastic!").isRead(true).build(),
            Message.builder().sender(hardik).recipient(sarah).content("Thanks Sarah! We focused hard on clean architecture and high performance.").isRead(true).build(),
            Message.builder().sender(sarah).recipient(hardik).content("Would love to connect next week to discuss cloud developer tooling.").isRead(false).build(),
            Message.builder().sender(david).recipient(hardik).content("Hey Hardik, how are you handling the static file serving for post uploads?").isRead(true).build(),
            Message.builder().sender(hardik).recipient(david).content("Using Spring WebMvcConfig with an uploads directory mapped statically! Simple and fast.").isRead(true).build()
        ));

        // Notifications for Hardik
        notificationRepository.saveAll(List.of(
            Notification.builder().recipient(hardik).actor(marcus).type(NotificationType.CONNECTION_REQUEST).referenceId(c4.getId())
                .message("Marcus Vance sent you a connection request.").isRead(false).build(),
            Notification.builder().recipient(hardik).actor(aisha).type(NotificationType.CONNECTION_REQUEST).referenceId(c5.getId())
                .message("Aisha Patel sent you a connection request.").isRead(false).build(),
            Notification.builder().recipient(hardik).actor(sarah).type(NotificationType.POST_LIKE).referenceId(p1.getId())
                .message("Sarah Jenkins liked your post.").isRead(true).build(),
            Notification.builder().recipient(hardik).actor(david).type(NotificationType.POST_COMMENT).referenceId(p1.getId())
                .message("David Chen commented on your post.").isRead(true).build()
        ));
    }
}
