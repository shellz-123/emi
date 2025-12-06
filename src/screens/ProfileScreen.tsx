import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {MaterialIcons} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Progress from 'react-native-progress';
import {Course, Skill} from '../types';

const ProfileScreen = ({navigation}: any) => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const enrolledCourses = useSelector(
    (state: RootState) => state.courses.enrolledCourses,
  );
  const savedJobs = useSelector((state: RootState) => state.jobs.savedJobs);

  const completedCourses = enrolledCourses.filter(
    (c: Course) => c.progress === 100,
  ).length;

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#6C63FF', '#4CAF50']} style={styles.header}>
        <View style={styles.profileCircle}>
          <Text style={styles.profileInitial}>
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </Text>
        </View>
        <Text style={styles.profileName}>{user?.name || 'User'}</Text>
        <Text style={styles.profileEmail}>{user?.email || ''}</Text>
        <View style={styles.targetRole}>
          <Text style={styles.targetRoleText}>{user?.targetRole}</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.assessmentScore || 0}</Text>
            <Text style={styles.statLabel}>Skill Score</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{enrolledCourses.length}</Text>
            <Text style={styles.statLabel}>Enrolled Courses</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{completedCourses}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Skills</Text>
          {user?.skills && user.skills.length > 0 ? (
            user.skills.map((skill: Skill) => (
              <View key={skill.id} style={styles.skillCard}>
                <View style={styles.skillHeader}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <Text style={styles.skillLevel}>{skill.level}%</Text>
                </View>
                <Progress.Bar
                  progress={skill.level / 100}
                  width={null}
                  color="#6C63FF"
                  unfilledColor="#E0E0E0"
                  borderWidth={0}
                  height={8}
                  borderRadius={4}
                />
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="school" size={50} color="#E0E0E0" />
              <Text style={styles.emptyText}>
                Complete assessment to see your skills
              </Text>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('Assessment')}>
                <Text style={styles.actionButtonText}>Take Assessment</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <MaterialIcons name="school" size={24} color="#6C63FF" />
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Active Courses</Text>
                <Text style={styles.activityValue}>{enrolledCourses.length}</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Completed Courses</Text>
                <Text style={styles.activityValue}>{completedCourses}</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <MaterialIcons name="bookmark" size={24} color="#FF6B6B" />
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Saved Jobs</Text>
                <Text style={styles.activityValue}>{savedJobs.length}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity style={styles.settingItem}>
            <MaterialIcons name="person-outline" size={24} color="#2C3E50" />
            <Text style={styles.settingText}>Edit Profile</Text>
            <MaterialIcons name="chevron-right" size={24} color="#7F8C8D" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <MaterialIcons name="notifications-none" size={24} color="#2C3E50" />
            <Text style={styles.settingText}>Notifications</Text>
            <MaterialIcons name="chevron-right" size={24} color="#7F8C8D" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <MaterialIcons name="lock-outline" size={24} color="#2C3E50" />
            <Text style={styles.settingText}>Privacy</Text>
            <MaterialIcons name="chevron-right" size={24} color="#7F8C8D" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <MaterialIcons name="help-outline" size={24} color="#2C3E50" />
            <Text style={styles.settingText}>Help & Support</Text>
            <MaterialIcons name="chevron-right" size={24} color="#7F8C8D" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <MaterialIcons name="info-outline" size={24} color="#2C3E50" />
            <Text style={styles.settingText}>About</Text>
            <MaterialIcons name="chevron-right" size={24} color="#7F8C8D" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  profileCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 15,
  },
  targetRole: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  targetRoleText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 10,
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
  skillCard: {
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
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  skillName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  skillLevel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  activityInfo: {
    flex: 1,
    marginLeft: 15,
  },
  activityTitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  activityValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 15,
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginVertical: 20,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 10,
    marginBottom: 15,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProfileScreen;
