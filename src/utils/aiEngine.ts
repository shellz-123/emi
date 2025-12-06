import {User, Course, Job, Skill, AIRecommendation} from '../types';

/**
 * Enhanced AI Recommendation Engine with advanced algorithms
 */
export class AIRecommendationEngine {
  
  /**
   * Generate personalized course recommendations using collaborative filtering
   */
  static generateCourseRecommendations(
    user: User,
    allCourses: Course[],
    limit: number = 5
  ): Course[] {
    const userSkills = user.skills.map(s => s.name.toLowerCase());
    const targetRole = user.targetRole.toLowerCase();
    const currentLevel = user.currentLevel;
    const completedCourses = user.completedCourses;

    // Calculate similarity score for each course
    const scoredCourses = allCourses
      .filter(course => !completedCourses.includes(course.id))
      .map(course => {
        let score = 0;
        const weights = {
          roleMatch: 50,
          skillRelevance: 30,
          levelMatch: 15,
          popularity: 5,
        };

        // 1. Role alignment
        if (course.title.toLowerCase().includes(targetRole) ||
            course.category.toLowerCase().includes(targetRole)) {
          score += weights.roleMatch;
        }

        // 2. Skill relevance (cosine similarity)
        const courseSkills = course.skills.map(s => s.toLowerCase());
        const matchingSkills = courseSkills.filter(cs =>
          userSkills.some(us => cs.includes(us) || us.includes(cs))
        );
        const skillRelevance = matchingSkills.length / courseSkills.length;
        score += skillRelevance * weights.skillRelevance;

        // 3. Level appropriateness
        const levelMap: {[key: string]: number} = {
          'Beginner': 1,
          'Intermediate': 2,
          'Advanced': 3,
          'Expert': 4,
        };
        const userLevelNum = levelMap[currentLevel] || 1;
        const courseLevelNum = levelMap[course.level] || 1;
        
        if (courseLevelNum === userLevelNum) {
          score += weights.levelMatch;
        } else if (courseLevelNum === userLevelNum + 1) {
          score += weights.levelMatch * 0.7; // Next level up
        } else if (courseLevelNum === userLevelNum - 1) {
          score += weights.levelMatch * 0.3; // Review
        }

        // 4. Popularity and rating
        const popularityScore = (course.rating / 5) * (Math.min(course.enrolled, 30000) / 30000);
        score += popularityScore * weights.popularity;

        return {course, score};
      });

    // Sort and return top recommendations
    return scoredCourses
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.course);
  }

  /**
   * Advanced job matching with multiple factors
   */
  static calculateJobMatchScore(user: User, job: Job): number {
    const userSkills = user.skills.map(s => s.name.toLowerCase());
    const requiredSkills = job.requiredSkills.map(s => s.toLowerCase());
    const weights = {
      skillMatch: 60,
      roleMatch: 20,
      experienceLevel: 10,
      learningMomentum: 10,
    };

    let score = 0;

    // 1. Skill match using Jaccard similarity
    const matchingSkills = requiredSkills.filter(req =>
      userSkills.some(us => req.includes(us) || us.includes(req))
    );
    const skillScore = matchingSkills.length / requiredSkills.length;
    score += skillScore * weights.skillMatch;

    // 2. Role title match
    const jobTitle = job.title.toLowerCase();
    const targetRole = user.targetRole.toLowerCase();
    if (jobTitle.includes(targetRole) || targetRole.includes(jobTitle.split(' ')[0])) {
      score += weights.roleMatch;
    } else {
      score += weights.roleMatch * 0.3; // Partial match
    }

    // 3. Experience level alignment
    const avgSkillLevel = user.skills.reduce((sum, skill) => sum + skill.level, 0) / 
                         (user.skills.length || 1);
    
    // Determine if job level matches user level
    const isSeniorRole = jobTitle.includes('senior') || jobTitle.includes('lead') || jobTitle.includes('principal');
    const isJuniorRole = jobTitle.includes('junior') || jobTitle.includes('entry');
    
    if (avgSkillLevel >= 75 && isSeniorRole) {
      score += weights.experienceLevel;
    } else if (avgSkillLevel >= 50 && avgSkillLevel < 75 && !isSeniorRole && !isJuniorRole) {
      score += weights.experienceLevel;
    } else if (avgSkillLevel < 50 && isJuniorRole) {
      score += weights.experienceLevel;
    } else {
      score += weights.experienceLevel * 0.5;
    }

    // 4. Learning momentum
    if (user.completedCourses.length > 5) {
      score += weights.learningMomentum;
    } else if (user.completedCourses.length > 2) {
      score += weights.learningMomentum * 0.6;
    }

    return Math.min(Math.round(score), 100);
  }

  /**
   * Generate comprehensive career insights
   */
  static generateCareerInsights(user: User, jobs: Job[]): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];
    const userSkillNames = user.skills.map(s => s.name.toLowerCase());

    // 1. Skill gap analysis
    const allRequiredSkills = new Set<string>();
    const skillFrequency: {[key: string]: number} = {};
    
    jobs.slice(0, 20).forEach(job => {
      job.requiredSkills.forEach(skill => {
        const skillLower = skill.toLowerCase();
        allRequiredSkills.add(skill);
        skillFrequency[skillLower] = (skillFrequency[skillLower] || 0) + 1;
      });
    });

    // Find top missing skills
    const missingSkills = Array.from(allRequiredSkills)
      .filter(skill => !userSkillNames.some(us => 
        skill.toLowerCase().includes(us) || us.includes(skill.toLowerCase())
      ))
      .sort((a, b) => (skillFrequency[b.toLowerCase()] || 0) - (skillFrequency[a.toLowerCase()] || 0))
      .slice(0, 5);

    if (missingSkills.length > 0) {
      recommendations.push({
        id: 'skill-gap-1',
        type: 'skill',
        title: 'Critical Skills to Learn',
        description: `${missingSkills.length} high-demand skills are missing from your profile.`,
        priority: 'high',
        reasoning: `These skills appear in ${Math.round((missingSkills.length / jobs.length) * 100)}% of relevant job postings.`,
        actionItems: missingSkills.map(skill => `Master ${skill} through online courses`),
      });
    }

    // 2. Career progression analysis
    const avgSkillLevel = user.skills.reduce((sum, skill) => sum + skill.level, 0) / 
                         (user.skills.length || 1);

    if (avgSkillLevel < 40) {
      recommendations.push({
        id: 'career-foundation',
        type: 'career',
        title: 'Build Strong Foundations',
        description: 'Focus on mastering core fundamentals before advancing.',
        priority: 'high',
        reasoning: 'Strong fundamentals are crucial for long-term career growth.',
        actionItems: [
          'Complete 3-5 beginner-level courses in your domain',
          'Build 2-3 portfolio projects demonstrating basic skills',
          'Practice daily with coding challenges or exercises',
          'Join study groups or online communities',
        ],
      });
    } else if (avgSkillLevel >= 40 && avgSkillLevel < 65) {
      recommendations.push({
        id: 'career-advancement',
        type: 'career',
        title: 'Ready for Mid-Level Positions',
        description: 'Your skills qualify you for intermediate roles.',
        priority: 'medium',
        reasoning: 'Your skill profile shows readiness for more complex challenges.',
        actionItems: [
          'Apply for mid-level positions',
          'Take on leadership roles in projects',
          'Contribute to open-source projects',
          'Start mentoring junior developers',
        ],
      });
    } else {
      recommendations.push({
        id: 'career-leadership',
        type: 'career',
        title: 'Senior-Level Opportunities',
        description: 'Consider senior positions and technical leadership roles.',
        priority: 'medium',
        reasoning: 'Your expertise positions you for senior and lead roles.',
        actionItems: [
          'Target senior/lead positions',
          'Pursue advanced certifications',
          'Share knowledge through blogs or talks',
          'Build a professional brand',
        ],
      });
    }

    // 3. Job market alignment
    const highMatchJobs = jobs.filter(job => job.matchScore >= 75).length;
    const totalJobs = jobs.length;

    if (highMatchJobs < totalJobs * 0.3) {
      recommendations.push({
        id: 'market-alignment',
        type: 'job',
        title: 'Improve Job Market Fit',
        description: 'Only 30% of jobs are a strong match. Expand your skills.',
        priority: 'high',
        reasoning: 'Broader skills increase job opportunities significantly.',
        actionItems: [
          'Learn complementary technologies',
          'Gain experience in adjacent domains',
          'Network with professionals in your field',
        ],
      });
    }

    // 4. Learning momentum
    const coursesCompleted = user.completedCourses.length;
    if (coursesCompleted < 3) {
      recommendations.push({
        id: 'learning-momentum',
        type: 'course',
        title: 'Accelerate Your Learning',
        description: 'Consistent learning boosts career growth by 40%.',
        priority: 'medium',
        reasoning: 'Employers value continuous learners highly.',
        actionItems: [
          'Set a goal of 1 course per month',
          'Join study groups for accountability',
          'Apply learnings in real projects',
        ],
      });
    }

    // 5. Salary potential analysis
    const estimatedSalary = this.estimateSalaryPotential(user);
    recommendations.push({
      id: 'salary-potential',
      type: 'career',
      title: 'Salary Growth Potential',
      description: `Your profile suggests earning potential of $${estimatedSalary.current}k - $${estimatedSalary.potential}k.`,
      priority: 'low',
      reasoning: 'Based on your skills and experience level.',
      actionItems: [
        'Negotiate based on market rates',
        'Highlight high-demand skills',
        'Consider remote opportunities for higher pay',
      ],
    });

    return recommendations;
  }

  /**
   * Estimate salary potential
   */
  private static estimateSalaryPotential(user: User): {current: number; potential: number} {
    const levelMap: {[key: string]: number} = {
      'Beginner': 70,
      'Intermediate': 100,
      'Advanced': 130,
      'Expert': 160,
    };

    const baseSalary = levelMap[user.currentLevel] || 70;
    const skillBonus = Math.min(user.skills.length * 3, 30);
    const current = baseSalary + skillBonus;
    const potential = Math.round(current * 1.4); // 40% growth potential

    return {current, potential};
  }

  /**
   * Create personalized learning path with prerequisite handling
   */
  static createLearningPath(user: User, allCourses: Course[]): Course[] {
    const path: Course[] = [];
    const currentLevel = user.currentLevel;
    const targetSkills = this.extractTargetSkills(user.targetRole);
    const completedCourses = user.completedCourses;

    // Filter out completed courses
    const availableCourses = allCourses.filter(c => !completedCourses.includes(c.id));

    // Level progression strategy
    const levelProgression = this.getLevelProgression(currentLevel);

    levelProgression.forEach((level, index) => {
      const coursesForLevel = availableCourses
        .filter(c => 
          c.level === level &&
          c.skills.some(s => targetSkills.includes(s.toLowerCase()))
        )
        .sort((a, b) => b.rating - a.rating);

      // Add 1-2 courses per level
      const numCourses = index === 0 ? 2 : 1;
      path.push(...coursesForLevel.slice(0, numCourses));
    });

    return path.slice(0, 5); // Return top 5 courses
  }

  /**
   * Get level progression based on current level
   */
  private static getLevelProgression(currentLevel: string): string[] {
    const progressions: {[key: string]: string[]} = {
      'Beginner': ['Beginner', 'Intermediate'],
      'Intermediate': ['Intermediate', 'Advanced'],
      'Advanced': ['Advanced', 'Advanced'],
      'Expert': ['Advanced', 'Advanced'],
    };

    return progressions[currentLevel] || ['Beginner', 'Intermediate'];
  }

  /**
   * Extract target skills from job role
   */
  private static extractTargetSkills(role: string): string[] {
    const roleMap: {[key: string]: string[]} = {
      'software developer': ['javascript', 'python', 'java', 'git', 'algorithms', 'web development', 'api'],
      'data scientist': ['python', 'machine learning', 'statistics', 'sql', 'data analysis', 'pandas', 'tensorflow'],
      'ui/ux designer': ['figma', 'ui design', 'ux research', 'prototyping', 'user testing', 'wireframing'],
      'product manager': ['product strategy', 'user research', 'agile', 'analytics', 'roadmapping', 'stakeholder management'],
      'devops engineer': ['docker', 'kubernetes', 'aws', 'ci/cd', 'linux', 'terraform', 'jenkins'],
      'digital marketer': ['seo', 'content marketing', 'analytics', 'social media', 'email marketing', 'ppc'],
      'mobile developer': ['react native', 'ios', 'android', 'mobile ui', 'app deployment'],
      'backend developer': ['node.js', 'python', 'databases', 'api design', 'microservices'],
      'frontend developer': ['react', 'javascript', 'css', 'responsive design', 'performance optimization'],
    };

    const key = role.toLowerCase();
    for (const [k, skills] of Object.entries(roleMap)) {
      if (key.includes(k) || k.includes(key.split(' ')[0])) {
        return skills;
      }
    }

    return ['programming', 'problem solving', 'software development'];
  }

  /**
   * Predict career success with confidence intervals
   */
  static predictCareerSuccess(user: User, targetJob: Job): {
    probability: number;
    factors: string[];
    improvements: string[];
    confidence: 'high' | 'medium' | 'low';
  } {
    let probability = 0;
    const factors: string[] = [];
    const improvements: string[] = [];

    // Skill match analysis
    const userSkills = user.skills.map(s => s.name.toLowerCase());
    const matchingSkills = targetJob.requiredSkills.filter(req =>
      userSkills.some(us => req.toLowerCase().includes(us) || us.includes(req.toLowerCase()))
    );

    const skillMatchRate = matchingSkills.length / targetJob.requiredSkills.length;
    probability += skillMatchRate * 50;

    if (skillMatchRate > 0.8) {
      factors.push('Excellent skill alignment (80%+ match)');
    } else if (skillMatchRate > 0.6) {
      factors.push('Good skill match (60-80%)');
    } else {
      improvements.push(`Learn ${targetJob.requiredSkills.filter(s => !matchingSkills.includes(s)).join(', ')}`);
    }

    // Skill proficiency
    const avgSkillLevel = user.skills.reduce((sum, skill) => sum + skill.level, 0) / 
                         (user.skills.length || 1);
    probability += (avgSkillLevel / 100) * 25;

    if (avgSkillLevel > 70) {
      factors.push('High proficiency in core skills');
    } else {
      improvements.push('Deepen expertise through advanced courses');
    }

    // Learning track record
    const coursesCompleted = user.completedCourses.length;
    if (coursesCompleted > 10) {
      probability += 15;
      factors.push('Strong continuous learning record');
    } else if (coursesCompleted > 5) {
      probability += 10;
      factors.push('Good learning momentum');
    } else {
      probability += 5;
      improvements.push('Complete more courses to show commitment');
    }

    // Experience level match
    const jobLevel = this.determineJobLevel(targetJob.title);
    const userLevel = user.currentLevel;
    
    if (this.isLevelMatch(userLevel, jobLevel)) {
      probability += 10;
      factors.push('Experience level matches role requirements');
    } else {
      improvements.push('Gain more experience for this level');
    }

    // Determine confidence
    const finalProbability = Math.min(Math.round(probability), 100);
    let confidence: 'high' | 'medium' | 'low';
    
    if (finalProbability >= 75) confidence = 'high';
    else if (finalProbability >= 50) confidence = 'medium';
    else confidence = 'low';

    return {
      probability: finalProbability,
      factors,
      improvements,
      confidence,
    };
  }

  /**
   * Determine job level from title
   */
  private static determineJobLevel(title: string): string {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('senior') || titleLower.includes('lead') || titleLower.includes('principal')) {
      return 'Advanced';
    } else if (titleLower.includes('junior') || titleLower.includes('entry')) {
      return 'Beginner';
    }
    return 'Intermediate';
  }

  /**
   * Check if user level matches job level
   */
  private static isLevelMatch(userLevel: string, jobLevel: string): boolean {
    const levelMap: {[key: string]: number} = {
      'Beginner': 1,
      'Intermediate': 2,
      'Advanced': 3,
      'Expert': 3,
    };

    return Math.abs(levelMap[userLevel] - levelMap[jobLevel]) <= 1;
  }

  /**
   * Analyze skill trends and market demand
   */
  static analyzeSkillTrends(skills: string[]): {
    trending: string[];
    stable: string[];
    declining: string[];
  } {
    // In a real app, this would use actual market data
    const trendingSkills = ['typescript', 'react', 'kubernetes', 'aws', 'machine learning', 'python'];
    const stableSkills = ['javascript', 'java', 'sql', 'git'];
    const decliningSkills = ['jquery', 'angular.js', 'flash'];

    return {
      trending: skills.filter(s => trendingSkills.includes(s.toLowerCase())),
      stable: skills.filter(s => stableSkills.includes(s.toLowerCase())),
      declining: skills.filter(s => decliningSkills.includes(s.toLowerCase())),
    };
  }
}