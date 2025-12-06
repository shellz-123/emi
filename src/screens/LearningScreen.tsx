import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../store/store';
import {enrollCourse, refreshCourses} from '../store/slices/coursesSlice';
import {MaterialIcons} from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import {Course} from '../types';

const {width} = Dimensions.get('window');

const LearningScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const allCourses = useSelector((state: RootState) => state.courses.allCourses);
  const recommendedCourses = useSelector(
    (state: RootState) => state.courses.recommendedCourses,
  );
  const enrolledCourses = useSelector(
    (state: RootState) => state.courses.enrolledCourses,
  );
  const isLoading = useSelector((state: RootState) => state.courses.isLoading);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [sortBy, setSortBy] = useState<'rating' | 'enrolled' | 'duration'>('rating');
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState<string[]>(['All']);

  // Extract unique categories from all courses
const getUniqueCategories = (courses: Course[]) => {
  const categories = courses.map(c => c.category);
  return ['All', ...Array.from(new Set(categories))];
};

// Filter courses based on search, category, level
const filterCourses = (
  courses: Course[],
  filters: { category: string; level: string; search: string }
) => {
  return courses.filter(course => {
    const matchesCategory =
      filters.category === 'All' || course.category === filters.category;

    const matchesLevel =
      filters.level === 'All' || course.level === filters.level;

    const matchesSearch =
      course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      course.description.toLowerCase().includes(filters.search.toLowerCase());

    return matchesCategory && matchesLevel && matchesSearch;
  });
};

// Sort courses by rating, enrolled, or duration
const sortCourses = (courses: Course[], sortBy: 'rating' | 'enrolled' | 'duration') => {
  return [...courses].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'enrolled') return b.enrolled - a.enrolled;
    if (sortBy === 'duration') return a.duration - b.duration;
    return 0;
  });
};

  // Extract categories from courses
  useEffect(() => {
    if (allCourses.length > 0) {
      const cats = getUniqueCategories(allCourses);
      setCategories(cats);
    }
  }, [allCourses]);

  // Filter and sort courses
  const filteredCourses = React.useMemo(() => {
    let filtered = filterCourses(allCourses, {
      category: selectedCategory,
      level: selectedLevel,
      search: searchQuery,
    });
    
    return sortCourses(filtered, sortBy);
  }, [allCourses, searchQuery, selectedCategory, selectedLevel, sortBy]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // @ts-ignore
      await dispatch(refreshCourses());
    } catch (error) {
      console.error('Refresh failed:', error);
    }
    setRefreshing(false);
  }, [dispatch]);

  const handleEnroll = useCallback((course: Course) => {
    dispatch(enrollCourse(course));
  }, [dispatch]);

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Render course card
  const renderCourseCard = ({item: course}: {item: Course}) => {
    const isEnrolled = enrolledCourses.some(c => c.id === course.id);
    
    return (
      <TouchableOpacity
        style={styles.courseCard}
        onPress={() => navigation.navigate('CourseDetail', {courseId: course.id})}
        activeOpacity={0.7}>
        <View style={styles.courseHeader}>
          <View style={styles.courseIconContainer}>
            <MaterialIcons name="school" size={28} color="#667eea" />
          </View>
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle} numberOfLines={2}>
              {course.title}
            </Text>
            <Text style={styles.courseInstructor} numberOfLines={1}>
              {course.instructor}
            </Text>
          </View>
        </View>

        <Text style={styles.courseDescription} numberOfLines={2}>
          {course.description}
        </Text>

        <View style={styles.courseMeta}>
          <View style={styles.metaItem}>
            <MaterialIcons name="schedule" size={16} color="#7F8C8D" />
            <Text style={styles.metaText}>{course.duration}h</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.metaText}>{course.rating.toFixed(1)}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="people" size={16} color="#7F8C8D" />
            <Text style={styles.metaText}>
              {course.enrolled >= 1000000
                ? `${(course.enrolled / 1000000).toFixed(1)}M`
                : course.enrolled >= 1000
                ? `${(course.enrolled / 1000).toFixed(0)}k`
                : course.enrolled}
            </Text>
          </View>
        </View>

        <View style={styles.skillsContainer}>
          {course.skills.slice(0, 3).map((skill, index) => (
            <View key={index} style={styles.skillChip}>
              <Text style={styles.skillText} numberOfLines={1}>
                {skill}
              </Text>
            </View>
          ))}
          {course.skills.length > 3 && (
            <Text style={styles.moreSkills}>+{course.skills.length - 3}</Text>
          )}
        </View>

        <View style={styles.courseFooter}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{course.level}</Text>
          </View>

          {isEnrolled ? (
            <View style={styles.enrolledBadge}>
              <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
              <Text style={styles.enrolledText}>Enrolled</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.enrollButton}
              onPress={(e) => {
                e.stopPropagation();
                handleEnroll(course);
              }}>
              <MaterialIcons name="add" size={18} color="white" />
              <Text style={styles.enrollButtonText}>Enroll</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // List header with filters
  const renderListHeader = () => (
    <View>
      {/* Recommended Section */}
      {recommendedCourses.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          <FlatList
            horizontal
            data={recommendedCourses.slice(0, 5)}
            renderItem={renderRecommendedCard}
            keyExtractor={item => `rec_${item.id}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>
      )}

      {/* Continue Learning */}
      {enrolledCourses.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
          <FlatList
            horizontal
            data={enrolledCourses.slice(0, 5)}
            renderItem={renderProgressCard}
            keyExtractor={item => `enrolled_${item.id}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>
      )}

      {/* Filter/Sort Controls */}
      <View style={styles.controlsContainer}>
        <Text style={styles.sectionTitle}>All Courses</Text>
        
        {/* Sort buttons */}
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'rating' && styles.sortButtonActive]}
            onPress={() => setSortBy('rating')}>
            <MaterialIcons name="star" size={16} color={sortBy === 'rating' ? 'white' : '#667eea'} />
            <Text style={[styles.sortText, sortBy === 'rating' && styles.sortTextActive]}>
              Rating
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'enrolled' && styles.sortButtonActive]}
            onPress={() => setSortBy('enrolled')}>
            <MaterialIcons name="people" size={16} color={sortBy === 'enrolled' ? 'white' : '#667eea'} />
            <Text style={[styles.sortText, sortBy === 'enrolled' && styles.sortTextActive]}>
              Popular
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'duration' && styles.sortButtonActive]}
            onPress={() => setSortBy('duration')}>
            <MaterialIcons name="schedule" size={16} color={sortBy === 'duration' ? 'white' : '#667eea'} />
            <Text style={[styles.sortText, sortBy === 'duration' && styles.sortTextActive]}>
              Duration
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.resultCount}>
          {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
        </Text>
      </View>
    </View>
  );

  const renderRecommendedCard = ({item: course}: {item: Course}) => (
    <TouchableOpacity
      style={styles.recommendedCard}
      onPress={() => navigation.navigate('CourseDetail', {courseId: course.id})}>
      <View style={styles.recommendedHeader}>
        <MaterialIcons name="auto-awesome" size={24} color="#FFD700" />
      </View>
      <Text style={styles.recommendedTitle} numberOfLines={2}>
        {course.title}
      </Text>
      <View style={styles.recommendedMeta}>
        <MaterialIcons name="star" size={14} color="#FFD700" />
        <Text style={styles.recommendedRating}>{course.rating.toFixed(1)}</Text>
        <Text style={styles.recommendedDuration}>• {course.duration}h</Text>
      </View>
    </TouchableOpacity>
  );

  const renderProgressCard = ({item: course}: {item: Course}) => (
    <TouchableOpacity
      style={styles.progressCard}
      onPress={() => navigation.navigate('CourseDetail', {courseId: course.id})}>
      <Text style={styles.progressTitle} numberOfLines={2}>
        {course.title}
      </Text>
      <View style={styles.progressSection}>
        <Text style={styles.progressPercent}>{course.progress || 0}%</Text>
        <Progress.Bar
          progress={(course.progress || 0) / 100}
          width={180}
          color="#667eea"
          unfilledColor="#E0E0E0"
          borderWidth={0}
          height={6}
          borderRadius={3}
        />
      </View>
    </TouchableOpacity>
  );

  if (isLoading && allCourses.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading courses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with search */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Learning</Text>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#7F8C8D" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#7F8C8D"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="close" size={20} color="#7F8C8D" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category filter */}
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          data={categories}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedCategory === item && styles.filterChipActive,
              ]}
              onPress={() => setSelectedCategory(item)}>
              <Text
                style={[
                  styles.filterText,
                  selectedCategory === item && styles.filterTextActive,
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        />
      </View>

      {/* Level filter */}
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          data={levels}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedLevel === item && styles.filterChipActive,
              ]}
              onPress={() => setSelectedLevel(item)}>
              <Text
                style={[
                  styles.filterText,
                  selectedLevel === item && styles.filterTextActive,
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        />
      </View>

      {/* Courses list */}
      <FlatList
        data={filteredCourses}
        renderItem={renderCourseCard}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderListHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#667eea']} />
        }
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7F8C8D',
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
  filtersContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterList: {
    paddingHorizontal: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    marginRight: 10,
  },
  filterChipActive: {
    backgroundColor: '#667eea',
  },
  filterText: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  filterTextActive: {
    color: 'white',
  },
  listContent: {
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
  horizontalList: {
    paddingRight: 20,
  },
  recommendedCard: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  recommendedHeader: {
    marginBottom: 12,
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
    lineHeight: 22,
  },
  recommendedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendedRating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 4,
  },
  recommendedDuration: {
    fontSize: 14,
    color: '#7F8C8D',
    marginLeft: 4,
  },
  progressCard: {
    width: 220,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
    lineHeight: 20,
  },
  progressSection: {
    gap: 8,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
  },
  controlsContainer: {
    marginBottom: 20,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  sortLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginRight: 12,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F0EFFF',
    marginRight: 8,
  },
  sortButtonActive: {
    backgroundColor: '#667eea',
  },
  sortText: {
    fontSize: 13,
    color: '#667eea',
    fontWeight: '600',
    marginLeft: 4,
  },
  sortTextActive: {
    color: 'white',
  },
  resultCount: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 8,
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  courseHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  courseIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F0EFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
    lineHeight: 23,
  },
  courseInstructor: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  courseDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 12,
  },
  courseMeta: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 13,
    color: '#7F8C8D',
    marginLeft: 4,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
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
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelBadge: {
    backgroundColor: '#F0EFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
  },
  enrollButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#667eea',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  enrollButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  enrolledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  enrolledText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default LearningScreen;
