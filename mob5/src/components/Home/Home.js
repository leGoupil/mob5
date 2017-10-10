import React from 'react';
import { StyleSheet, View, AppRegistry, Text } from 'react-native';
import CalendarList from './CalendarList/CalendarList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

export default class HomeScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <CalendarList navigate={this.props.navigation}/>
      </View>
    );
  }
}
