import React from "react";
import { Platform, StatusBar } from "react-native";
import { StackNavigator, TabNavigator } from "react-navigation";
import { FontAwesome } from "react-native-vector-icons";

import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import Contacts from "./components/Contacts/Contacts";
import Profile from "./components/Profile/Profile";
import Group from "./components/Group/Group";
import EditCalendar from "./components/EditCalendar/EditCalendar";
import EditFriend from "./components/EditFriend/EditFriend";
import EditGroup from "./components/EditGroup/EditGroup";

const headerStyle = {
  marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
};

export const SignedOut = StackNavigator({
  Register: {
    screen: Register,
    navigationOptions: {
      title: "Register",
      headerStyle
    }
  },
  Login: {
    screen: Login,
    navigationOptions: {
      title: "Login",
      headerStyle
    }
  }
});

export const SignedIn = TabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarLabel: "Calendriers",
        tabBarIcon: ({ tintColor }) =>
          <FontAwesome name="calendar" size={30} color={tintColor} />
      }
    },
    Contacts: {
      screen: Contacts,
      navigationOptions: {
        tabBarLabel: "Amis",
        tabBarIcon: ({ tintColor }) =>
          <FontAwesome name="address-book" size={30} color={tintColor} />
      }
    },
    Group: {
      screen: Group,
      navigationOptions: {
        tabBarLabel: "Groupes",
        tabBarIcon: ({ tintColor }) =>
          <FontAwesome name="group" size={30} color={tintColor} />
      }
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarLabel: "Profile",
        tabBarIcon: ({ tintColor }) =>
          <FontAwesome name="user" size={30} color={tintColor} />
      }
    }
  },
  {
    lazy: true,
    swipeEnabled: false,
    tabBarOptions: {
      style: {
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
      }
    }
  }
);

export const createRootNavigator = (signedIn = false) => {
  return StackNavigator(
    {
      SignedIn: {
        screen: SignedIn,
        navigationOptions: {
          gesturesEnabled: false
        }
      },
      SignedOut: {
        screen: SignedOut,
        navigationOptions: {
          gesturesEnabled: false
        }
      },
      EditCalendar: { screen: EditCalendar },
      EditFriend: { screen: EditFriend },
      EditGroup: { screen: EditGroup }
    },
    {
      headerMode: "none",
      mode: "modal",
      initialRouteName: signedIn ? "SignedIn" : "SignedOut"
    }
  );
};
