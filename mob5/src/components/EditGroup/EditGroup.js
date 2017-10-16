import React, {Component} from 'react';
import { StyleSheet, View, Image, Text, KeyboardAvoidingView, TouchableOpacity, ScrollView } from 'react-native';
import GroupForm from './GroupForm';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3498db'
  },
  logoContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center'
  },
  logo: {
    width: 100,
    height: 100
  },
  title: {
    color: '#FFF',
    marginTop: 1,
    width: 160,
    textAlign: 'center',
    opacity: 0.9
  },
  buttonContainer: {
    backgroundColor: '#2980b9',
    paddingVertical: 15
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700'
  }
});

export default class EditCalendar extends React.Component {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../../images/logo.png')}
          />
        <Text style={styles.title}> Ajouter un calendrier </Text>
        </View>
        <View style={styles.formContainer}>
          <GroupForm navigate={this.props.navigation}/>
        </View>
        <TouchableOpacity style={styles.buttonContainer}
          onPress={() => navigate("Home")}>
          <Text style={styles.buttonText}> Retour</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    )
  }
}
