import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider, useDispatch} from 'react-redux';
import {MaterialIcons} from '@expo/vector-icons';
import {store} from './src/store/store';
import {loadCourses} from './src/store/slices/coursesSlice';
import {View, ActivityIndicator, StyleSheet} from 'react-native';


// Existing Screens
import HomeScreen from './src/screens/HomeScreen';
import AssessmentScreen from './src/screens/AssessmentScreen';
import LearningScreen from './src/screens/LearningScreen';
import JobsScreen from './src/screens/JobsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import CourseDetailScreen from './src/screens/CourseDetailScreen';
import JobDetailScreen from './src/screens/JobDetailScreen';

// NEW SCREENS
import AIInsightsScreen from './src/screens/AIInsightsScreen';
import CareerRoadmapScreen from './src/screens/CareerRoadmapScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: keyof typeof MaterialIcons.glyphMap;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Learning':
              iconName = 'school';
              break;
            case 'Jobs':
              iconName = 'work';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 100,
          paddingBottom: 20,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: -2},
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Learning" 
        component={LearningScreen}
        options={{
          tabBarLabel: 'Learn',
        }}
      />
      <Tab.Screen 
        name="Jobs" 
        component={JobsScreen}
        options={{
          tabBarLabel: 'Jobs',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * Data Loader Component
 * Loads CSV data and persisted state when app starts
 */
const DataLoader = ({children}: {children: React.ReactNode}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
      
        // @ts-ignore - Redux Thunk typing
        await dispatch(loadCourses());
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return <>{children}</>;
};

const AppNavigator = () => {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({current, layouts}) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}>
      {/* Onboarding Flow */}
      <Stack.Screen 
        name="Onboarding" 
        component={OnboardingScreen}
      />
      
      {/* Main App */}
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs}
      />
      
      {/* Assessment */}
      <Stack.Screen 
        name="Assessment" 
        component={AssessmentScreen}
      />
      
      {/* Course Details */}
      <Stack.Screen 
        name="CourseDetail" 
        component={CourseDetailScreen}
      />
      
      {/* Job Details */}
      <Stack.Screen 
        name="JobDetail" 
        component={JobDetailScreen}
      />
      
      {/* NEW SCREENS */}
      <Stack.Screen 
        name="AIInsights" 
        component={AIInsightsScreen}
        options={{
          title: 'AI Insights',
        }}
      />
      
      <Stack.Screen 
        name="CareerRoadmap" 
        component={CareerRoadmapScreen}
        options={{
          title: 'Career Roadmap',
        }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <DataLoader>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </DataLoader>
    </Provider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
});

export default App;
