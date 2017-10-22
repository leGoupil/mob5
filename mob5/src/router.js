import React from "react";
import { Platform, StatusBar } from "react-native";
import { StackNavigator, TabNavigator } from "react-navigation";
import { FontAwesome } from "react-native-vector-icons";

import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import Contacts from "./components/Contacts/Contacts";
import Profile from "./components/Profile/Profile";
import Calendar from "./components/Calendar/Calendar";
import EditCalendar from "./components/EditCalendar/EditCalendar";
import InfoCalendar from "./components/InfoCalendar/InfoCalendar";
import EditEvent from "./components/Event/Event";
import EditFriend from "./components/EditFriend/EditFriend";

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
      InfoCalendar: { screen: InfoCalendar },
      EditFriend: { screen: EditFriend },
      Calendar: { screen: Calendar },
      EditEvent: { screen: EditEvent }
    },
    {
      headerMode: "none",
      mode: "modal",
      initialRouteName: signedIn ? "SignedIn" : "SignedOut"
    }
  );
};
