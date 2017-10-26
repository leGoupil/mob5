import React, {Component} from 'react';
import { StyleSheet, View, Image, Text, KeyboardAvoidingView, TouchableOpacity, ScrollView } from 'react-native';
// import CalendarForm from './CalendarForm';


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

export default class InfoCalendar extends React.Component {
  constructor() {
    super();
    this.state = {
      title: '',
      owner: '',
      displayName: '',
      creationDate: 'tarace'
    };
  }

  nameOrEmail = () => {
    return 'lol';
    if(this.state.calendar.owner.name){
      this.setState({
        displayName: `${this.state.calendar.owner.name} ${this.state.calendar.owner.nickname}`
      })
    }
    return this.state.calendar.owner.email
  }
  componentDidMount() {
    let calendar = null;
    if(this.props.navigate){
      const nav = this.props.navigate;
      if(nav.state){
        if(nav.state.params){
          if(nav.state.params.data){
            calendar = nav.state.params.data;
            this.setState({
              calendar,
              title: calendar.title
            });
          }
        }
      }
    }
    if(calendar){
    }
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../../images/logo.png')}
          />
        <Text style={styles.title}> {this.state.title} </Text>
        <Text style={styles.title}> Crée le {this.state.creationDate} </Text>
        <Text style={styles.title}> Par {this.nameOrEmail} </Text>
        </View>
        <TouchableOpacity style={styles.buttonContainer}
          onPress={() => navigate("Home")}>
          <Text style={styles.buttonText}> Retour</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    )
  }
}
