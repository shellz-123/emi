import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../store/store';
import {enrollCourse} from '../store/slices/coursesSlice';
import {MaterialIcons} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const CourseDetailScreen = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {courseId} = route.params;

  const course = useSelector((state: RootState) =>
    [...state.courses.allCourses, ...state.courses.enrolledCourses].find(
      c => c.id === courseId,
    ),
  );

  const isEnrolled = useSelector((state: RootState) =>
    state.courses.enrolledCourses.some(c => c.id === courseId),
  );

  if (!course) {
    return (
      <View style={styles.container}>
        <Text>Course not found</Text>
      </View>
    );
  }

  const handleEnroll = () => {
    dispatch(enrollCourse(course));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <LinearGradient colors={['#6C63FF', '#4CAF50']} style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <View style={styles.courseMetaRow}>
            <View style={styles.metaItem}>
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.metaText}>{course.rating}</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialIcons name="people" size={16} color="white" />
              <Text style={styles.metaText}>
                {course.enrolled.toLocaleString()} students
              </Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialIcons name="schedule" size={16} color="white" />
              <Text style={styles.metaText}>{course.duration} hours</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this course</Text>
            <Text style={styles.description}>{course.description}</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{course.level} Level</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What you'll learn</Text>
            <View style={styles.learningPoint}>
              <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
              <Text style={styles.learningText}>
                Master the fundamentals of {course.category}
              </Text>
            </View>
            <View style={styles.learningPoint}>
              <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
              <Text style={styles.learningText}>
                Build real-world projects and applications
              </Text>
            </View>
            <View style={styles.learningPoint}>
              <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
              <Text style={styles.learningText}>
                Gain industry-relevant skills for your career
              </Text>
            </View>
            <View style={styles.learningPoint}>
              <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
              <Text style={styles.learningText}>
                Prepare for professional certifications
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills you'll gain</Text>
            <View style={styles.skillsContainer}>
              {course.skills.map((skill, index) => (
                <View key={index} style={styles.skillChip}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Course Content</Text>
            {[1, 2, 3, 4].map((module, index) => (
              <View key={index} style={styles.moduleCard}>
                <View style={styles.moduleHeader}>
                  <MaterialIcons name="play-circle-outline" size={24} color="#6C63FF" />
                  <View style={styles.moduleInfo}>
                    <Text style={styles.moduleTitle}>
                      Module {module}: Introduction to Core Concepts
                    </Text>
                    <Text style={styles.moduleDuration}>6 lessons • 2h 30m</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructor</Text>
            <View style={styles.instructorCard}>
              <View style={styles.instructorAvatar}>
                <MaterialIcons name="person" size={32} color="#6C63FF" />
              </View>
              <View style={styles.instructorInfo}>
                <Text style={styles.instructorName}>Expert Instructor</Text>
                <Text style={styles.instructorTitle}>
                  Senior {course.category} Engineer
                </Text>
                <Text style={styles.instructorStudents}>
                  100,000+ students taught
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {!isEnrolled && (
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Free</Text>
            <Text style={styles.priceSubtext}>Full access included</Text>
          </View>
          <TouchableOpacity style={styles.enrollButton} onPress={handleEnroll}>
            <LinearGradient
              colors={['#6C63FF', '#4CAF50']}
              style={styles.gradient}>
              <Text style={styles.enrollButtonText}>Enroll Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
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
  courseTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    lineHeight: 34,
  },
  courseMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    color: 'white',
    marginLeft: 6,
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
    fontSize: 16,
    color: '#7F8C8D',
    lineHeight: 24,
    marginBottom: 15,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  learningPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  learningText: {
    flex: 1,
    fontSize: 15,
    color: '#2C3E50',
    marginLeft: 12,
    lineHeight: 22,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    backgroundColor: '#F0EFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  skillText: {
    fontSize: 14,
    color: '#6C63FF',
    fontWeight: '500',
  },
  moduleCard: {
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
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moduleInfo: {
    flex: 1,
    marginLeft: 12,
  },
  moduleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  moduleDuration: {
    fontSize: 13,
    color: '#7F8C8D',
  },
  instructorCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0EFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  instructorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  instructorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  instructorTitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  instructorStudents: {
    fontSize: 13,
    color: '#6C63FF',
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  priceSubtext: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  enrollButton: {
    borderRadius: 12,
    overflow: 'hidden',
    flex: 1,
  },
  gradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  enrollButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CourseDetailScreen;
