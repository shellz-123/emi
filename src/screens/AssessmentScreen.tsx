import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {updateAssessmentScore, updateSkills} from '../store/slices/userSlice';
import {
  setRecommendedCourses,
  setCourses,
} from '../store/slices/coursesSlice';
import {setMatchedJobs, setJobs} from '../store/slices/jobsSlice';
import {AssessmentQuestion, Skill} from '../types';
import {mockCourses, mockJobs} from '../utils/mockData';
import {LinearGradient} from 'expo-linear-gradient';
import * as Progress from 'react-native-progress';
import {RootState} from '../store/store';

const {width} = Dimensions.get('window');

const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: '1',
    question: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correctAnswer: 1,
    skill: 'Algorithms',
    difficulty: 'medium',
  },
  {
    id: '2',
    question: 'Which design pattern ensures a class has only one instance?',
    options: ['Factory', 'Singleton', 'Observer', 'Strategy'],
    correctAnswer: 1,
    skill: 'Design Patterns',
    difficulty: 'easy',
  },
  {
    id: '3',
    question: 'What does REST stand for?',
    options: [
      'Remote State Transfer',
      'Representational State Transfer',
      'Resource State Transfer',
      'Remote Service Transfer',
    ],
    correctAnswer: 1,
    skill: 'Web Development',
    difficulty: 'easy',
  },
  {
    id: '4',
    question: 'Which SQL command is used to retrieve data?',
    options: ['GET', 'SELECT', 'FETCH', 'RETRIEVE'],
    correctAnswer: 1,
    skill: 'Database',
    difficulty: 'easy',
  },
  {
    id: '5',
    question: 'What is the purpose of useEffect in React?',
    options: [
      'State management',
      'Side effects handling',
      'Component styling',
      'Event handling',
    ],
    correctAnswer: 1,
    skill: 'React',
    difficulty: 'medium',
  },
  {
    id: '6',
    question: 'Which sorting algorithm has best average time complexity?',
    options: ['Bubble Sort', 'Quick Sort', 'Selection Sort', 'Insertion Sort'],
    correctAnswer: 1,
    skill: 'Algorithms',
    difficulty: 'medium',
  },
  {
    id: '7',
    question: 'What is the purpose of Docker?',
    options: [
      'Code versioning',
      'Containerization',
      'Database management',
      'Web hosting',
    ],
    correctAnswer: 1,
    skill: 'DevOps',
    difficulty: 'medium',
  },
  {
    id: '8',
    question: 'What does API stand for?',
    options: [
      'Application Programming Interface',
      'Advanced Programming Interface',
      'Application Process Interface',
      'Advanced Process Integration',
    ],
    correctAnswer: 0,
    skill: 'Web Development',
    difficulty: 'easy',
  },
];

const AssessmentScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers, selectedAnswer];
      setAnswers(newAnswers);

      if (currentQuestion < assessmentQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        calculateResults(newAnswers);
      }
    }
  };

  const calculateResults = (finalAnswers: number[]) => {
    let correctCount = 0;
    const skillScores: {[key: string]: {correct: number; total: number}} = {};

    assessmentQuestions.forEach((q, index) => {
      if (finalAnswers[index] === q.correctAnswer) {
        correctCount++;
      }

      if (!skillScores[q.skill]) {
        skillScores[q.skill] = {correct: 0, total: 0};
      }
      skillScores[q.skill].total++;
      if (finalAnswers[index] === q.correctAnswer) {
        skillScores[q.skill].correct++;
      }
    });

    const finalScore = Math.round(
      (correctCount / assessmentQuestions.length) * 100,
    );
    setScore(finalScore);

    const userSkills: Skill[] = Object.keys(skillScores).map((skill, idx) => ({
      id: `skill_${idx}`,
      name: skill,
      level: Math.round(
        (skillScores[skill].correct / skillScores[skill].total) * 100,
      ),
      category: 'Technical',
    }));

    dispatch(updateSkills(userSkills));
    dispatch(updateAssessmentScore(finalScore));

    const recommended = mockCourses
      .filter(course =>
        course.skills.some(s => userSkills.find(us => us.name === s)),
      )
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    dispatch(setCourses(mockCourses));
    dispatch(setRecommendedCourses(recommended));

    const matchedJobs = mockJobs
      .map(job => ({
        ...job,
        matchScore: calculateJobMatch(job, userSkills),
      }))
      .sort((a, b) => b.matchScore - a.matchScore);

    dispatch(setJobs(mockJobs));
    dispatch(setMatchedJobs(matchedJobs));

    setIsComplete(true);
  };

  const calculateJobMatch = (job: any, skills: Skill[]) => {
    const matchingSkills = job.requiredSkills.filter((req: string) =>
      skills.find(s => s.name.toLowerCase().includes(req.toLowerCase())),
    );
    return Math.round((matchingSkills.length / job.requiredSkills.length) * 100);
  };

  const handleComplete = () => {
    navigation.replace('MainTabs');
  };

  if (isComplete) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#6C63FF', '#4CAF50']}
          style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Assessment Complete!</Text>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>{score}%</Text>
            <Text style={styles.scoreLabel}>Overall Score</Text>
          </View>

          <View style={styles.resultsCard}>
            <Text style={styles.resultsCardTitle}>Your Skill Profile</Text>
            <Text style={styles.resultsCardText}>
              We've analyzed your strengths and created a personalized learning
              path just for you.
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {user?.skills?.length || 0}
                </Text>
                <Text style={styles.statText}>Skills Assessed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>5</Text>
                <Text style={styles.statText}>Courses Recommended</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statText}>Job Matches</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
              <Text style={styles.completeButtonText}>View My Dashboard</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  const question = assessmentQuestions[currentQuestion];
  const progress = (currentQuestion + 1) / assessmentQuestions.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>✕</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <Progress.Bar
            progress={progress}
            width={width - 120}
            color="#6C63FF"
            unfilledColor="#E0E0E0"
            borderWidth={0}
            height={6}
          />
          <Text style={styles.progressText}>
            {currentQuestion + 1} / {assessmentQuestions.length}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.questionNumber}>Question {currentQuestion + 1}</Text>
        <Text style={styles.question}>{question.question}</Text>

        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === index && styles.selectedOption,
              ]}
              onPress={() => handleAnswerSelect(index)}>
              <View style={styles.optionContent}>
                <View
                  style={[
                    styles.radio,
                    selectedAnswer === index && styles.radioSelected,
                  ]}>
                  {selectedAnswer === index && <View style={styles.radioDot} />}
                </View>
                <Text
                  style={[
                    styles.optionText,
                    selectedAnswer === index && styles.selectedOptionText,
                  ]}>
                  {option}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, selectedAnswer === null && styles.disabledButton]}
          onPress={handleNext}
          disabled={selectedAnswer === null}>
          <LinearGradient
            colors={
              selectedAnswer === null
                ? ['#CCC', '#CCC']
                : ['#6C63FF', '#4CAF50']
            }
            style={styles.gradient}>
            <Text style={styles.nextButtonText}>
              {currentQuestion < assessmentQuestions.length - 1
                ? 'Next Question'
                : 'Complete Assessment'}
            </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    fontSize: 24,
    color: '#2C3E50',
    marginRight: 15,
  },
  progressContainer: {
    flex: 1,
  },
  progressText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  questionNumber: {
    fontSize: 14,
    color: '#6C63FF',
    fontWeight: '600',
    marginBottom: 10,
  },
  question: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 30,
    lineHeight: 30,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  selectedOption: {
    borderColor: '#6C63FF',
    backgroundColor: '#F0EFFF',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D0D0D0',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#6C63FF',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6C63FF',
  },
  optionText: {
    fontSize: 16,
    color: '#2C3E50',
    flex: 1,
  },
  selectedOptionText: {
    color: '#6C63FF',
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.5,
  },
  gradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
  },
  scoreCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 5,
  },
  resultsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '100%',
  },
  resultsCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultsCardText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  statText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 5,
    textAlign: 'center',
  },
  completeButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AssessmentScreen;
