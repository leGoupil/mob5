import React from 'react';
import { StyleSheet, View, AppRegistry, Text } from 'react-native';
import ContactList from './ContactList/ContactList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});

export default class ContactScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <ContactList navigate={this.props.navigation}/>
      </View>
    );
  }
}
