import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {MaterialIcons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import * as Progress from 'react-native-progress';

const {width} = Dimensions.get('window');

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  skills: string[];
  completed: boolean;
  current: boolean;
  courses?: string[];
  certifications?: string[];
}

const CareerRoadmapScreen = ({navigation}: any) => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);
  const [selectedPath, setSelectedPath] = useState<'junior' | 'mid' | 'senior'>('junior');

  useEffect(() => {
    if (user) {
      generateRoadmap();
    }
  }, [user, selectedPath]);

  const generateRoadmap = () => {
    const targetRole = user?.targetRole || 'Software Developer';
    
    // Generate career progression roadmap based on target role
    const roadmapData: RoadmapStep[] = [
      {
        id: '1',
        title: `Junior ${targetRole}`,
        description: 'Build foundational skills and gain practical experience',
        timeframe: '0-2 years',
        skills: ['JavaScript', 'React', 'Git', 'HTML/CSS'],
        completed: user?.currentLevel === 'Beginner' ? false : true,
        current: user?.currentLevel === 'Beginner',
        courses: ['Complete React Native Development', 'Full Stack MERN Development'],
        certifications: ['Meta React Certification'],
      },
      {
        id: '2',
        title: `Mid-Level ${targetRole}`,
        description: 'Develop expertise and take on complex projects',
        timeframe: '2-5 years',
        skills: ['TypeScript', 'System Design', 'Testing', 'Mentoring'],
        completed: user?.currentLevel === 'Advanced' || user?.currentLevel === 'Expert',
        current: user?.currentLevel === 'Intermediate',
        courses: ['Advanced Algorithms', 'System Design Fundamentals'],
        certifications: ['AWS Solutions Architect'],
      },
      {
        id: '3',
        title: `Senior ${targetRole}`,
        description: 'Lead technical initiatives and architect solutions',
        timeframe: '5-8 years',
        skills: ['Architecture', 'Leadership', 'Strategic Thinking'],
        completed: user?.currentLevel === 'Expert',
        current: user?.currentLevel === 'Advanced',
        courses: ['Advanced System Design', 'Engineering Leadership'],
        certifications: ['Google Professional Cloud Architect'],
      },
      {
        id: '4',
        title: `Staff/Principal ${targetRole}`,
        description: 'Drive technical strategy across the organization',
        timeframe: '8+ years',
        skills: ['Technical Strategy', 'Cross-team Leadership', 'Innovation'],
        completed: false,
        current: user?.currentLevel === 'Expert',
        courses: ['Engineering Management', 'Product Strategy'],
        certifications: ['Senior Leadership Certification'],
      },
    ];

    setRoadmap(roadmapData);
  };

  const getProgressPercentage = () => {
    const completedSteps = roadmap.filter(step => step.completed).length;
    return (completedSteps / roadmap.length) * 100;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Career Roadmap</Text>
        <Text style={styles.headerSubtitle}>
          Personalized path to {user?.targetRole}
        </Text>
        
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Overall Progress</Text>
            <Text style={styles.progressValue}>{Math.round(getProgressPercentage())}%</Text>
          </View>
          <Progress.Bar
            progress={getProgressPercentage() / 100}
            width={width - 80}
            color="#4CAF50"
            unfilledColor="rgba(255,255,255,0.3)"
            borderWidth={0}
            height={10}
            borderRadius={5}
          />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.timeline}>
          {roadmap.map((step, index) => (
            <RoadmapStepCard
              key={step.id}
              step={step}
              index={index}
              isLast={index === roadmap.length - 1}
              navigation={navigation}
            />
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Accelerate Your Progress</Text>
          
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Learning')}>
            <View style={styles.actionIconContainer}>
              <MaterialIcons name="school" size={28} color="#667eea" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Explore Courses</Text>
              <Text style={styles.actionDescription}>
                Find courses aligned with your roadmap
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Jobs')}>
            <View style={styles.actionIconContainer}>
              <MaterialIcons name="work" size={28} color="#4CAF50" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Browse Jobs</Text>
              <Text style={styles.actionDescription}>
                Find positions matching your current level
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const RoadmapStepCard = ({step, index, isLast, navigation}: any) => {
  const getStatusColor = () => {
    if (step.completed) return '#4CAF50';
    if (step.current) return '#FF9800';
    return '#999';
  };

  const getStatusIcon = () => {
    if (step.completed) return 'check-circle';
    if (step.current) return 'radio-button-checked';
    return 'radio-button-unchecked';
  };

  return (
    <View style={styles.stepContainer}>
      {/* Timeline connector */}
      <View style={styles.timelineConnector}>
        <View style={[styles.statusIcon, {backgroundColor: getStatusColor()}]}>
          <MaterialIcons name={getStatusIcon()} size={24} color="white" />
        </View>
        {!isLast && <View style={[styles.connector, {backgroundColor: getStatusColor()}]} />}
      </View>

      {/* Step content */}
      <View style={[
        styles.stepCard,
        step.current && styles.currentStepCard
      ]}>
        {step.current && (
          <View style={styles.currentBadge}>
            <Text style={styles.currentBadgeText}>CURRENT STAGE</Text>
          </View>
        )}
        
        <View style={styles.stepHeader}>
          <Text style={styles.stepTitle}>{step.title}</Text>
          <View style={styles.timeframeBadge}>
            <MaterialIcons name="schedule" size={14} color="#667eea" />
            <Text style={styles.timeframeText}>{step.timeframe}</Text>
          </View>
        </View>

        <Text style={styles.stepDescription}>{step.description}</Text>

        {/* Skills */}
        {step.skills && step.skills.length > 0 && (
          <View style={styles.skillsSection}>
            <Text style={styles.sectionLabel}>Key Skills:</Text>
            <View style={styles.skillsContainer}>
              {step.skills.map((skill: string, idx: number) => (
                <View key={idx} style={styles.skillChip}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Recommended courses */}
        {step.courses && step.courses.length > 0 && (
          <View style={styles.coursesSection}>
            <Text style={styles.sectionLabel}>Recommended Courses:</Text>
            {step.courses.map((course: string, idx: number) => (
              <View key={idx} style={styles.courseItem}>
                <MaterialIcons name="play-circle-outline" size={18} color="#667eea" />
                <Text style={styles.courseText}>{course}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {step.certifications && step.certifications.length > 0 && (
          <View style={styles.certificationsSection}>
            <Text style={styles.sectionLabel}>Certifications:</Text>
            {step.certifications.map((cert: string, idx: number) => (
              <View key={idx} style={styles.certItem}>
                <MaterialIcons name="verified" size={18} color="#4CAF50" />
                <Text style={styles.certText}>{cert}</Text>
              </View>
            ))}
          </View>
        )}

        {step.current && (
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('Learning')}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.ctaGradient}>
              <Text style={styles.ctaText}>Start Learning</Text>
              <MaterialIcons name="arrow-forward" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        )}
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
    padding: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 20,
  },
  progressCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  progressValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  timeline: {
    marginBottom: 30,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineConnector: {
    width: 40,
    alignItems: 'center',
    marginRight: 15,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  connector: {
    width: 3,
    flex: 1,
    minHeight: 60,
  },
  stepCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  currentStepCard: {
    borderWidth: 2,
    borderColor: '#FF9800',
    shadowColor: '#FF9800',
    shadowOpacity: 0.3,
  },
  currentBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  stepHeader: {
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  timeframeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeframeText: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
    marginLeft: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 15,
  },
  skillsSection: {
    marginBottom: 15,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  skillChip: {
    backgroundColor: '#E8EAF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  skillText: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
  },
  coursesSection: {
    marginBottom: 15,
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  courseText: {
    fontSize: 13,
    color: '#2C3E50',
    flex: 1,
    marginLeft: 8,
  },
  certificationsSection: {
    marginBottom: 15,
  },
  certItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  certText: {
    fontSize: 13,
    color: '#2C3E50',
    flex: 1,
    marginLeft: 8,
  },
  ctaButton: {
    marginTop: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  ctaGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  ctaText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  actionsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 13,
    color: '#7F8C8D',
  },
});

export default CareerRoadmapScreen;

