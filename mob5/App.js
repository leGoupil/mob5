// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';
//
// export default class App extends React.Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text>Open up App.js to start working on your app!</Text>
//         <Text>Changes you make will automatically reload.</Text>
//         <Text>Shake your phone to open the developer menu.</Text>
//       </View>
//     );
//   }
// }



import React from 'react';
import { StyleSheet, View, AppRegistry, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';
import LoginScreen from './src/components/Login/Login';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// class HomeScreen extends React.Component {
//   static navigationOptions = {
//     title: 'Welcome',
//   };
//   render() {
//         return (
//           <View style={styles.container}>
//             <Text>Open up App.js to start working on your app!</Text>
//             <Text>Changes you make will automatically reload.</Text>
//             <Text>Shake your phone to open the developer menu.</Text>
//           </View>
//         );
//   }
// }
class HomeScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
      </View>
    );
  }
}
// export default class App extends React.Component {
export default SimpleApp = StackNavigator({
  Home: { screen: LoginScreen },
});

// if you are using create-react-native-app you don't need this line
// AppRegistry.registerComponent('SimpleApp', () => SimpleApp);
