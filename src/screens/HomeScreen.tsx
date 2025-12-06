import React from 'react';
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

const HomeScreen = ({navigation}: any) => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const enrolledCourses = useSelector(
    (state: RootState) => state.courses.enrolledCourses,
  );
  const matchedJobs = useSelector(
    (state: RootState) => state.jobs.matchedJobs,
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const completedCourses = enrolledCourses.filter(c => c.progress === 100).length;
  const avgProgress = enrolledCourses.length > 0
    ? enrolledCourses.reduce((sum, c) => sum + (c.progress || 0), 0) / enrolledCourses.length
    : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Enhanced Header with Gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{user?.name || 'User'}! 👋</Text>
            <View style={styles.roleBadge}>
              <MaterialIcons name="work-outline" size={14} color="white" />
              <Text style={styles.roleText}>{user?.targetRole}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => {/* TODO: Navigate to notifications */}}>
            <MaterialIcons name="notifications-none" size={26} color="white" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Progress Overview Card */}
        <View style={styles.progressOverview}>
          <View style={styles.progressRow}>
            <View style={styles.progressItem}>
              <Text style={styles.progressValue}>{Math.round(avgProgress)}%</Text>
              <Text style={styles.progressLabel}>Avg Progress</Text>
            </View>
            <View style={styles.progressDivider} />
            <View style={styles.progressItem}>
              <Text style={styles.progressValue}>{enrolledCourses.length}</Text>
              <Text style={styles.progressLabel}>Active Courses</Text>
            </View>
            <View style={styles.progressDivider} />
            <View style={styles.progressItem}>
              <Text style={styles.progressValue}>{completedCourses}</Text>
              <Text style={styles.progressLabel}>Completed</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Featured Actions Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Journey</Text>
          <View style={styles.featuredGrid}>
            <FeaturedActionCard
              icon="insights"
              title="AI Insights"
              subtitle="Get personalized recommendations"
              color="#667eea"
              onPress={() => navigation.navigate('AIInsights')}
            />
            <FeaturedActionCard
              icon="timeline"
              title="Career Roadmap"
              subtitle="View your progression path"
              color="#764ba2"
              onPress={() => navigation.navigate('CareerRoadmap')}
            />
            <FeaturedActionCard
              icon="assessment"
              title="Skill Assessment"
              subtitle="Test and improve your skills"
              color="#4CAF50"
              onPress={() => navigation.navigate('Assessment')}
            />
            <FeaturedActionCard
              icon="work-outline"
              title="Job Matches"
              subtitle={`${matchedJobs.length} opportunities`}
              color="#FF9800"
              onPress={() => navigation.navigate('Jobs')}
            />
          </View>
        </View>

        {/* Continue Learning Section */}
        {enrolledCourses.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Continue Learning</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Learning')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            {enrolledCourses.slice(0, 3).map(course => (
              <CourseProgressCard
                key={course.id}
                course={course}
                onPress={() => navigation.navigate('CourseDetail', {courseId: course.id})}
              />
            ))}
          </View>
        )}

        {/* Empty State for Courses */}
        {enrolledCourses.length === 0 && (
          <View style={styles.section}>
            <View style={styles.emptyStateCard}>
              <LinearGradient
                colors={['#E8EAF6', '#C5CAE9']}
                style={styles.emptyStateGradient}>
                <MaterialIcons name="school" size={64} color="#667eea" />
                <Text style={styles.emptyStateTitle}>Start Your Learning Journey</Text>
                <Text style={styles.emptyStateText}>
                  Discover thousands of courses tailored to your career goals
                </Text>
                <TouchableOpacity
                  style={styles.emptyStateButton}
                  onPress={() => navigation.navigate('Learning')}>
                  <Text style={styles.emptyStateButtonText}>Explore Courses</Text>
                  <MaterialIcons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        )}

        {/* Top Job Matches */}
        {matchedJobs.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Job Matches</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Jobs')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            {matchedJobs.slice(0, 3).map(job => (
              <JobMatchCard
                key={job.id}
                job={job}
                onPress={() => navigation.navigate('JobDetail', {jobId: job.id})}
              />
            ))}
          </View>
        )}

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="star"
              value={user?.assessmentScore?.toString() || '0'}
              label="Skill Score"
              color="#FFD700"
            />
            <StatCard
              icon="emoji-events"
              value={completedCourses.toString()}
              label="Certificates"
              color="#4CAF50"
            />
            <StatCard
              icon="trending-up"
              value={`${matchedJobs.filter(j => j.matchScore >= 80).length}`}
              label="Strong Matches"
              color="#FF9800"
            />
            <StatCard
              icon="schedule"
              value={`${enrolledCourses.reduce((sum, c) => sum + c.duration, 0)}h`}
              label="Learning Hours"
              color="#667eea"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const FeaturedActionCard = ({icon, title, subtitle, color, onPress}: any) => (
  <TouchableOpacity
    style={styles.featuredCard}
    onPress={onPress}
    activeOpacity={0.8}>
    <LinearGradient
      colors={[color, color + 'DD']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.featuredGradient}>
      <MaterialIcons name={icon} size={32} color="white" />
      <Text style={styles.featuredTitle}>{title}</Text>
      <Text style={styles.featuredSubtitle}>{subtitle}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const CourseProgressCard = ({course, onPress}: any) => (
  <TouchableOpacity
    style={styles.courseCard}
    onPress={onPress}
    activeOpacity={0.8}>
    <View style={styles.courseIconContainer}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.courseIcon}>
        <MaterialIcons name="school" size={24} color="white" />
      </LinearGradient>
    </View>
    
    <View style={styles.courseContent}>
      <Text style={styles.courseTitle} numberOfLines={1}>
        {course.title}
      </Text>
      <View style={styles.courseMetaRow}>
        <View style={styles.courseMeta}>
          <MaterialIcons name="schedule" size={14} color="#999" />
          <Text style={styles.courseMetaText}>{course.duration}h</Text>
        </View>
        <Text style={styles.courseProgress}>{course.progress || 0}%</Text>
      </View>
      <Progress.Bar
        progress={(course.progress || 0) / 100}
        width={width - 160}
        color="#667eea"
        unfilledColor="#E0E0E0"
        borderWidth={0}
        height={6}
        borderRadius={3}
      />
    </View>
  </TouchableOpacity>
);

const JobMatchCard = ({job, onPress}: any) => (
  <TouchableOpacity
    style={styles.jobCard}
    onPress={onPress}
    activeOpacity={0.8}>
    <View style={styles.jobHeader}>
      <View style={styles.companyIcon}>
        <MaterialIcons name="business" size={28} color="#667eea" />
      </View>
      <View style={styles.jobInfo}>
        <Text style={styles.jobTitle} numberOfLines={1}>
          {job.title}
        </Text>
        <Text style={styles.jobCompany}>{job.company}</Text>
        <View style={styles.jobMetaRow}>
          <MaterialIcons name="location-on" size={14} color="#999" />
          <Text style={styles.jobMetaText}>{job.location}</Text>
          {job.remote && (
            <>
              <View style={styles.jobMetaDot} />
              <MaterialIcons name="home" size={14} color="#4CAF50" />
              <Text style={[styles.jobMetaText, {color: '#4CAF50'}]}>Remote</Text>
            </>
          )}
        </View>
      </View>
    </View>

    <View style={styles.jobFooter}>
      <Text style={styles.jobSalary}>{job.salary}</Text>
      <View style={[styles.matchBadge, {
        backgroundColor: job.matchScore >= 80 ? '#4CAF50' : 
                        job.matchScore >= 60 ? '#FF9800' : '#999'
      }]}>
        <Text style={styles.matchText}>{job.matchScore}%</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const StatCard = ({icon, value, label, color}: any) => (
  <View style={styles.statCard}>
    <View style={[styles.statIcon, {backgroundColor: color + '20'}]}>
      <MaterialIcons name={icon} size={24} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    borderWidth: 2,
    borderColor: 'white',
  },
  progressOverview: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 20,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  progressItem: {
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  progressDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  seeAll: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  featuredGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  featuredCard: {
    width: (width - 52) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    margin: 6,
  },
  featuredGradient: {
    padding: 20,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
  },
  featuredSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  courseCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  courseIconContainer: {
    marginRight: 15,
  },
  courseIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseContent: {
    flex: 1,
    justifyContent: 'center',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  courseMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseMetaText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  courseProgress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
  },
  jobCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  companyIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  jobCompany: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 6,
  },
  jobMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobMetaText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  jobMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#999',
    marginHorizontal: 4,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  jobSalary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  matchBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  matchText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  statCard: {
    width: (width - 52) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 6,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  emptyStateCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyStateGradient: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default HomeScreen;

