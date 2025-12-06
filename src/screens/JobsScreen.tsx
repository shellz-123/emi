import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../store/store';
import {toggleSaveJob} from '../store/slices/jobsSlice';
import {MaterialIcons} from '@expo/vector-icons';

const JobsScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const matchedJobs = useSelector((state: RootState) => state.jobs.matchedJobs);
  const savedJobs = useSelector((state: RootState) => state.jobs.savedJobs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Remote'];

  const filteredJobs = matchedJobs.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || job.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleSaveJob = (jobId: string) => {
    dispatch(toggleSaveJob(jobId));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Job Matches</Text>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#7F8C8D" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs or companies..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#7F8C8D"
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.typesContainer}>
        {jobTypes.map((type, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.typeChip,
              selectedType === type && styles.selectedChip,
            ]}
            onPress={() => setSelectedType(type)}>
            <Text
              style={[
                styles.typeText,
                selectedType === type && styles.selectedTypeText,
              ]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.matchCount}>
            {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} match
            your profile
          </Text>
          {filteredJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={savedJobs.includes(job.id)}
              onSave={() => handleSaveJob(job.id)}
              onPress={() => navigation.navigate('JobDetail', {jobId: job.id})}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const JobCard = ({job, isSaved, onSave, onPress}: any) => (
  <TouchableOpacity style={styles.jobCard} onPress={onPress}>
    <View style={styles.jobHeader}>
      <View style={styles.companyLogo}>
        <MaterialIcons name="business" size={32} color="#6C63FF" />
      </View>
      <View style={styles.jobInfo}>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <Text style={styles.jobCompany}>{job.company}</Text>
        <View style={styles.jobMeta}>
          <View style={styles.metaItem}>
            <MaterialIcons name="location-on" size={14} color="#7F8C8D" />
            <Text style={styles.metaText}>{job.location}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="work-outline" size={14} color="#7F8C8D" />
            <Text style={styles.metaText}>{job.type}</Text>
          </View>
        </View>
        <Text style={styles.salary}>{job.salary}</Text>
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <MaterialIcons
          name={isSaved ? 'bookmark' : 'bookmark-border'}
          size={24}
          color={isSaved ? '#6C63FF' : '#7F8C8D'}
        />
      </TouchableOpacity>
    </View>

    <View style={styles.matchSection}>
      <View style={styles.matchBar}>
        <View
          style={[styles.matchFill, {width: `${job.matchScore}%`}]}
        />
      </View>
      <Text style={styles.matchText}>{job.matchScore}% Match</Text>
    </View>

    <View style={styles.skillsContainer}>
  {job.requiredSkills.slice(0, 3).map((skill: string, index: number) => (
    <View key={index} style={styles.skillChip}>
      <Text style={styles.skillText}>{skill}</Text>
    </View>
  ))}
  {job.requiredSkills.length > 3 && (
    <Text style={styles.moreSkills}>
      +{job.requiredSkills.length - 3} more
    </Text>
  )}
</View>

    <Text style={styles.postedDate}>Posted {job.postedDate}</Text>
  </TouchableOpacity>
);

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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#2C3E50',
  },
  typesContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    marginRight: 10,
  },
  selectedChip: {
    backgroundColor: '#4CAF50',
  },
  typeText: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  selectedTypeText: {
    color: 'white',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  matchCount: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 15,
  },
  jobCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F0EFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
    marginBottom: 8,
  },
  jobMeta: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginLeft: 4,
  },
  salary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  saveButton: {
    padding: 4,
  },
  matchSection: {
    marginBottom: 12,
  },
  matchBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 6,
    overflow: 'hidden',
  },
  matchFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  matchText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  skillChip: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  skillText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  moreSkills: {
    fontSize: 12,
    color: '#7F8C8D',
    alignSelf: 'center',
  },
  postedDate: {
    fontSize: 11,
    color: '#95A5A6',
  },
});

export default JobsScreen;
