import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Login from './pages/authentication/Login';
import SignUp from './pages/authentication/SignUp';
import Splash from './pages/Splash';
import Invoices from './pages/main/Invoices';
import Customers from './pages/main/Customers';
import Items from './pages/main/Items';
import CustomerForm from './pages/form-pages/CustomerForm';
import ItemForm from './pages/form-pages/ItemForm';
import InvoiceForm from './pages/form-pages/InvoiceForm';
import Profile from './pages/Profile';
import Employees from './pages/main/Employees';
import EmployeeForm from './pages/form-pages/EmployeeForm';
import { RootStackParamList, AuthStackParamList, HomeTabParamList, RootState } from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStackNav = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<HomeTabParamList>();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff',
  },
};

type TabBarIconProps = {
  color: string;
  size: number;
};

const getTabBarIcon = (routeName: string, color: string, size: number): React.ReactElement => {
  const iconMap: Record<string, string> = {
    Facturas: 'file-document-outline',
    Clientes: 'account-group-outline',
    Items: 'tag-outline',
    Empleados: 'account-tie-outline',
  };
  const iconName = iconMap[routeName] || 'circle-outline';
  return <MaterialCommunityIcons name={iconName as any} color={color} size={size} />;
};

const HomeTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#1c313a',
      tabBarIcon: ({ color, size }: TabBarIconProps) => getTabBarIcon(route.name, color, size),
    })}
  >
    <Tab.Screen name="Facturas" component={Invoices} />
    <Tab.Screen name="Clientes" component={Customers} />
    <Tab.Screen name="Items" component={Items} />
    <Tab.Screen name="Empleados" component={Employees} />
  </Tab.Navigator>
);

const AppStack: React.FC = () => (
  <RootStack.Navigator screenOptions={{ headerShown: false }}>
    <RootStack.Screen name="Splash" component={Splash} />
    <RootStack.Screen name="HomeTabs" component={HomeTabs} />
    <RootStack.Screen name="CustomerForm" component={CustomerForm} />
    <RootStack.Screen name="ItemForm" component={ItemForm} />
    <RootStack.Screen name="InvoiceForm" component={InvoiceForm} />
    <RootStack.Screen name="Profile" component={Profile} />
    <RootStack.Screen name="EmployeeForm" component={EmployeeForm} />
  </RootStack.Navigator>
);

const AuthStack: React.FC = () => (
  <AuthStackNav.Navigator screenOptions={{ headerShown: false }}>
    <AuthStackNav.Screen name="Login" component={Login} />
    <AuthStackNav.Screen name="SignUp" component={SignUp} />
  </AuthStackNav.Navigator>
);

const Main: React.FC = () => {
  const isLoggedIn = useSelector(
    (state: RootState) => state.authReducer?.authData?.isLoggedIn,
  );

  return (
    <NavigationContainer theme={navigationTheme}>
      {isLoggedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Main;

