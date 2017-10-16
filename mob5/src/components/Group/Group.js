import React from 'react';
import { StyleSheet, View, AppRegistry, Text } from 'react-native';
import GroupList from './GroupList/GroupList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});

export default class GroupScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <GroupList navigate={this.props.navigation}/>
      </View>
    );
  }
}
