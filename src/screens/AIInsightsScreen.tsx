import React, {useEffect, useState} from 'react';
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
import {AIRecommendationEngine} from '../utils/aiEngine';
import {AIRecommendation} from '../types';

const {width} = Dimensions.get('window');

const AIInsightsScreen = ({navigation}: any) => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const matchedJobs = useSelector((state: RootState) => state.jobs.matchedJobs);
  const [insights, setInsights] = useState<AIRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    if (user) {
      // Simulate AI analysis
      setTimeout(() => {
        const recommendations = AIRecommendationEngine.generateCareerInsights(
          user,
          matchedJobs
        );
        setInsights(recommendations);
        setIsAnalyzing(false);
      }, 1500);
    }
  }, [user, matchedJobs]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Please complete your profile</Text>
      </View>
    );
  }

  if (isAnalyzing) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#6C63FF', '#4CAF50']}
          style={styles.loadingGradient}>
          <MaterialIcons name="psychology" size={60} color="white" />
          <Text style={styles.loadingText}>AI is analyzing your profile...</Text>
          <Text style={styles.loadingSubtext}>
            Generating personalized insights
          </Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#6C63FF', '#4CAF50']} style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Career Insights</Text>
        <Text style={styles.headerSubtitle}>
          Personalized recommendations powered by AI
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Career Success Prediction */}
        {matchedJobs.length > 0 && (
          <View style={styles.predictionCard}>
            <View style={styles.predictionHeader}>
              <MaterialIcons name="trending-up" size={28} color="#4CAF50" />
              <Text style={styles.predictionTitle}>Career Success Prediction</Text>
            </View>
            
            {(() => {
              const topJob = matchedJobs[0];
              const prediction = AIRecommendationEngine.predictCareerSuccess(
                user,
                topJob
              );
              
              return (
                <>
                  <View style={styles.probabilityContainer}>
                    <Text style={styles.probabilityValue}>
                      {prediction.probability}%
                    </Text>
                    <Text style={styles.probabilityLabel}>
                      Success Rate for {topJob.title}
                    </Text>
                  </View>

                  <View style={styles.factorsSection}>
                    <Text style={styles.factorsTitle}>✅ Your Strengths:</Text>
                    {prediction.factors.map((factor, idx) => (
                      <Text key={idx} style={styles.factorText}>
                        • {factor}
                      </Text>
                    ))}
                  </View>

                  {prediction.improvements.length > 0 && (
                    <View style={styles.factorsSection}>
                      <Text style={styles.improvementsTitle}>
                        💡 Areas to Improve:
                      </Text>
                      {prediction.improvements.map((imp, idx) => (
                        <Text key={idx} style={styles.improvementText}>
                          • {imp}
                        </Text>
                      ))}
                    </View>
                  )}
                </>
              );
            })()}
          </View>
        )}

        {/* AI Recommendations */}
        <Text style={styles.sectionTitle}>Personalized Recommendations</Text>
        {insights.map(insight => (
          <InsightCard key={insight.id} insight={insight} navigation={navigation} />
        ))}

        {/* Skill Gap Analysis */}
        <View style={styles.skillGapCard}>
          <Text style={styles.cardTitle}>Skill Gap Analysis</Text>
          <Text style={styles.cardDescription}>
            Based on {matchedJobs.length} job matches
          </Text>
          
          <View style={styles.gapStats}>
            <View style={styles.gapStat}>
              <Text style={styles.gapValue}>
                {user.skills.length}
              </Text>
              <Text style={styles.gapLabel}>Current Skills</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={24} color="#6C63FF" />
            <View style={styles.gapStat}>
              <Text style={styles.gapValue}>
                {user.skills.length + 3}
              </Text>
              <Text style={styles.gapLabel}>Target Skills</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Learning')}>
            <Text style={styles.actionButtonText}>View Recommended Courses</Text>
          </TouchableOpacity>
        </View>

        {/* Learning Progress Insights */}
        <View style={styles.progressCard}>
          <Text style={styles.cardTitle}>Your Learning Journey</Text>
          
          <View style={styles.journeyStats}>
            <View style={styles.journeyStat}>
              <MaterialIcons name="school" size={32} color="#6C63FF" />
              <Text style={styles.journeyValue}>
                {user.completedCourses.length}
              </Text>
              <Text style={styles.journeyLabel}>Courses Completed</Text>
            </View>
            <View style={styles.journeyStat}>
              <MaterialIcons name="emoji-events" size={32} color="#FFD700" />
              <Text style={styles.journeyValue}>
                {Math.floor(user.skills.reduce((sum, s) => sum + s.level, 0) / user.skills.length) || 0}%
              </Text>
              <Text style={styles.journeyLabel}>Avg Skill Level</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const InsightCard = ({insight, navigation}: any) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#FF6B6B';
      case 'medium':
        return '#FF9800';
      case 'low':
        return '#4CAF50';
      default:
        return '#6C63FF';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'course':
        return 'school';
      case 'skill':
        return 'build';
      case 'job':
        return 'work';
      case 'career':
        return 'trending-up';
      default:
        return 'lightbulb';
    }
  };

  return (
    <View style={styles.insightCard}>
      <View style={styles.insightHeader}>
        <View
          style={[
            styles.priorityBadge,
            {backgroundColor: getPriorityColor(insight.priority) + '20'},
          ]}>
          <Text
            style={[
              styles.priorityText,
              {color: getPriorityColor(insight.priority)},
            ]}>
            {insight.priority.toUpperCase()}
          </Text>
        </View>
        <MaterialIcons
          name={getIcon(insight.type) as any}
          size={28}
          color="#6C63FF"
        />
      </View>

      <Text style={styles.insightTitle}>{insight.title}</Text>
      <Text style={styles.insightDescription}>{insight.description}</Text>

      <View style={styles.reasoningBox}>
        <Text style={styles.reasoningLabel}>Why this matters:</Text>
        <Text style={styles.reasoningText}>{insight.reasoning}</Text>
      </View>

      <Text style={styles.actionsLabel}>Recommended Actions:</Text>
      {insight.actionItems?.map((action: string, idx: number) => (
  <View key={idx} style={styles.actionItem}>
    <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
    <Text style={styles.actionText}>{action}</Text>
  </View>
))}

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
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 10,
    textAlign: 'center',
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
  },
  content: {
    padding: 20,
  },
  predictionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  predictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  predictionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 12,
  },
  probabilityContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  probabilityValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  probabilityLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 8,
    textAlign: 'center',
  },
  factorsSection: {
    marginTop: 15,
  },
  factorsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 8,
  },
  factorText: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 6,
    marginLeft: 8,
  },
  improvementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9800',
    marginBottom: 8,
  },
  improvementText: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 6,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  insightCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  insightDescription: {
    fontSize: 15,
    color: '#7F8C8D',
    lineHeight: 22,
    marginBottom: 15,
  },
  reasoningBox: {
    backgroundColor: '#F0EFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  reasoningLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6C63FF',
    marginBottom: 4,
  },
  reasoningText: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
  },
  actionsLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 10,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#2C3E50',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  skillGapCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 20,
  },
  gapStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  gapStat: {
    alignItems: 'center',
  },
  gapValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  gapLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
  },
  actionButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  journeyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  journeyStat: {
    alignItems: 'center',
  },
  journeyValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 8,
  },
  journeyLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default AIInsightsScreen;

