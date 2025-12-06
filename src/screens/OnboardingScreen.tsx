import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {useDispatch} from 'react-redux';
import {setUser, completeOnboarding} from '../store/slices/userSlice';
import {User} from '../types';

const {width} = Dimensions.get('window');

const OnboardingScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [experience, setExperience] = useState('');

  const roles = [
    'Software Developer',
    'Data Scientist',
    'UI/UX Designer',
    'Product Manager',
    'DevOps Engineer',
    'Digital Marketer',
  ];

  const experienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const handleComplete = () => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      skills: [],
      completedCourses: [],
      currentLevel: experience,
      targetRole,
    };

    dispatch(setUser(newUser));
    dispatch(completeOnboarding());
    navigation.replace('Assessment');
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Welcome to SkillForge</Text>
            <Text style={styles.subtitle}>
              Your AI-powered career companion
            </Text>
            <View style={styles.featureContainer}>
              <FeatureItem
                icon="🎯"
                title="AI Skill Assessment"
                description="Discover your strengths"
              />
              <FeatureItem
                icon="📚"
                title="Personalized Learning"
                description="Custom learning paths"
              />
              <FeatureItem
                icon="💼"
                title="Job Matching"
                description="Find perfect opportunities"
              />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setStep(1)}>
              <LinearGradient
                colors={['#6C63FF', '#4CAF50']}
                style={styles.gradient}>
                <Text style={styles.buttonText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Tell us about yourself</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => setStep(2)}
              disabled={!name || !email}>
              <LinearGradient
                colors={['#6C63FF', '#4CAF50']}
                style={styles.gradient}>
                <Text style={styles.buttonText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>What's your target role?</Text>
            <ScrollView style={styles.optionsContainer}>
              {roles.map((role, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    targetRole === role && styles.selectedOption,
                  ]}
                  onPress={() => setTargetRole(role)}>
                  <Text
                    style={[
                      styles.optionText,
                      targetRole === role && styles.selectedOptionText,
                    ]}>
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setStep(3)}
              disabled={!targetRole}>
              <LinearGradient
                colors={['#6C63FF', '#4CAF50']}
                style={styles.gradient}>
                <Text style={styles.buttonText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>What's your experience level?</Text>
            <View style={styles.optionsContainer}>
              {experienceLevels.map((level, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    experience === level && styles.selectedOption,
                  ]}
                  onPress={() => setExperience(level)}>
                  <Text
                    style={[
                      styles.optionText,
                      experience === level && styles.selectedOptionText,
                    ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleComplete}
              disabled={!experience}>
              <LinearGradient
                colors={['#6C63FF', '#4CAF50']}
                style={styles.gradient}>
                <Text style={styles.buttonText}>Start Assessment</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderStep()}</View>;
};

const FeatureItem = ({icon, title, description}: any) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  stepContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 40,
  },
  featureContainer: {
    marginBottom: 40,
  },
  featureItem: {
    alignItems: 'center',
    marginBottom: 30,
  },
  featureIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#2C3E50',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedOption: {
    borderColor: '#6C63FF',
    backgroundColor: '#F0EFFF',
  },
  optionText: {
    fontSize: 16,
    color: '#2C3E50',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#6C63FF',
    fontWeight: '600',
  },
});

export default OnboardingScreen;
