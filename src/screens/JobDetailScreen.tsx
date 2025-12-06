import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../store/store';
import {toggleSaveJob} from '../store/slices/jobsSlice';
import {MaterialIcons} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const JobDetailScreen = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {jobId} = route.params;

  const job = useSelector((state: RootState) =>
    [...state.jobs.matchedJobs, ...state.jobs.allJobs].find(
      j => j.id === jobId,
    ),
  );

  const isSaved = useSelector((state: RootState) =>
    state.jobs.savedJobs.includes(jobId),
  );

  const userSkills = useSelector(
    (state: RootState) => state.user.currentUser?.skills || [],
  );

  if (!job) {
    return (
      <View style={styles.container}>
        <Text>Job not found</Text>
      </View>
    );
  }

  const handleSave = () => {
    dispatch(toggleSaveJob(jobId));
  };

  const handleApply = () => {
    Linking.openURL('https://www.example.com/apply');
  };

  const matchingSkills = job.requiredSkills.filter(reqSkill =>
    userSkills.some(userSkill =>
      userSkill.name.toLowerCase().includes(reqSkill.toLowerCase()),
    ),
  );

  const missingSkills = job.requiredSkills.filter(
    reqSkill =>
      !userSkills.some(userSkill =>
        userSkill.name.toLowerCase().includes(reqSkill.toLowerCase()),
      ),
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={24} color="#2C3E50" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <MaterialIcons
                name={isSaved ? 'bookmark' : 'bookmark-border'}
                size={24}
                color="#6C63FF"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.companyLogo}>
            <MaterialIcons name="business" size={40} color="#6C63FF" />
          </View>

          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.company}>{job.company}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MaterialIcons name="location-on" size={18} color="#7F8C8D" />
              <Text style={styles.metaText}>{job.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialIcons name="work-outline" size={18} color="#7F8C8D" />
              <Text style={styles.metaText}>{job.type}</Text>
            </View>
          </View>

          <View style={styles.salaryContainer}>
            <Text style={styles.salary}>{job.salary}</Text>
            <Text style={styles.salaryLabel}>per year</Text>
          </View>

          <View style={styles.matchContainer}>
            <View style={styles.matchCircle}>
              <Text style={styles.matchScore}>{job.matchScore}%</Text>
            </View>
            <Text style={styles.matchLabel}>Match Score</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About the Role</Text>
            <Text style={styles.description}>{job.description}</Text>
            <Text style={styles.description}>
              We're looking for a talented professional to join our growing team.
              This is an excellent opportunity to work on innovative projects and
              grow your career in a dynamic environment.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Required Skills</Text>
            <View style={styles.skillsContainer}>
              {job.requiredSkills.map((skill, index) => {
                const isMatching = matchingSkills.includes(skill);
                return (
                  <View
                    key={index}
                    style={[
                      styles.skillChip,
                      isMatching ? styles.matchingSkill : styles.missingSkill,
                    ]}>
                    {isMatching && (
                      <MaterialIcons name="check-circle" size={14} color="#4CAF50" />
                    )}
                    <Text
                      style={[
                        styles.skillText,
                        isMatching
                          ? styles.matchingSkillText
                          : styles.missingSkillText,
                      ]}>
                      {skill}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Skill Match</Text>
            <View style={styles.skillMatchCard}>
              <View style={styles.skillMatchRow}>
                <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
                <View style={styles.skillMatchInfo}>
                  <Text style={styles.skillMatchLabel}>Matching Skills</Text>
                  <Text style={styles.skillMatchValue}>
                    {matchingSkills.length} of {job.requiredSkills.length}
                  </Text>
                </View>
              </View>

              {missingSkills.length > 0 && (
                <View style={styles.missingSkillsContainer}>
                  <Text style={styles.missingSkillsTitle}>
                    Skills to improve:
                  </Text>
                  {missingSkills.map((skill, index) => (
                    <Text key={index} style={styles.missingSkillItem}>
                      • {skill}
                    </Text>
                  ))}
                  <TouchableOpacity
                    style={styles.learnButton}
                    onPress={() => navigation.navigate('Learning')}>
                    <Text style={styles.learnButtonText}>
                      Find Courses to Learn
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Responsibilities</Text>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Design and develop high-quality solutions
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Collaborate with cross-functional teams
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Participate in code reviews and technical discussions
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Mentor junior team members and share knowledge
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Company Benefits</Text>
            <View style={styles.benefitItem}>
              <MaterialIcons name="local-hospital" size={24} color="#6C63FF" />
              <Text style={styles.benefitText}>Health Insurance</Text>
            </View>
            <View style={styles.benefitItem}>
              <MaterialIcons name="home-work" size={24} color="#6C63FF" />
              <Text style={styles.benefitText}>Remote Work Options</Text>
            </View>
            <View style={styles.benefitItem}>
              <MaterialIcons name="event" size={24} color="#6C63FF" />
              <Text style={styles.benefitText}>Flexible Schedule</Text>
            </View>
            <View style={styles.benefitItem}>
              <MaterialIcons name="school" size={24} color="#6C63FF" />
              <Text style={styles.benefitText}>Learning & Development</Text>
            </View>
          </View>

          <View style={styles.postedInfo}>
            <Text style={styles.postedText}>Posted {job.postedDate}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <LinearGradient
            colors={['#6C63FF', '#4CAF50']}
            style={styles.gradient}>
            <Text style={styles.applyButtonText}>Apply Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0EFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyLogo: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#F0EFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    alignSelf: 'center',
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  company: {
    fontSize: 18,
    color: '#7F8C8D',
    marginBottom: 15,
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginLeft: 6,
  },
  salaryContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  salary: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  salaryLabel: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  matchContainer: {
    alignItems: 'center',
  },
  matchCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  matchLabel: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  description: {
    fontSize: 15,
    color: '#7F8C8D',
    lineHeight: 24,
    marginBottom: 12,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  matchingSkill: {
    backgroundColor: '#E8F5E9',
  },
  missingSkill: {
    backgroundColor: '#FFF3E0',
  },
  skillText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  matchingSkillText: {
    color: '#4CAF50',
  },
  missingSkillText: {
    color: '#FF9800',
  },
  skillMatchCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skillMatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  skillMatchInfo: {
    marginLeft: 15,
  },
  skillMatchLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  skillMatchValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  missingSkillsContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 15,
  },
  missingSkillsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9800',
    marginBottom: 8,
  },
  missingSkillItem: {
    fontSize: 13,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  learnButton: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  learnButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bullet: {
    fontSize: 16,
    color: '#6C63FF',
    marginRight: 10,
    fontWeight: 'bold',
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    color: '#7F8C8D',
    lineHeight: 22,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  benefitText: {
    fontSize: 15,
    color: '#2C3E50',
    marginLeft: 15,
  },
  postedInfo: {
    alignItems: 'center',
    paddingTop: 10,
  },
  postedText: {
    fontSize: 12,
    color: '#95A5A6',
  },
  footer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  applyButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default JobDetailScreen;
