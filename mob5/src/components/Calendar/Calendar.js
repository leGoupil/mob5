import React, {Component} from 'react';
import { StyleSheet, View, Image, Text, KeyboardAvoidingView, TouchableOpacity, ScrollView } from 'react-native';
import Agenda from './Agenda';


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
  buttonContainer2: {
    backgroundColor: '#2980b9',
    paddingVertical: 15
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700'
  }
});

export default class Calendar extends React.Component {
  constructor() {
    super();
    this.state = { calendar: null };
  }
  componentDidMount() {
    let calendar = null;
    if(this.props.navigate){
      const nav = this.props.navigate;
      if(nav.state){
        if(nav.state.params){
          if(nav.state.params.data){
            calendar = nav.state.params.data;
          }
        }
      }
    }
    if(calendar){
      this.setState({ calendar });
    }
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Agenda navigate={this.props.navigation} />
      </KeyboardAvoidingView>
    )
  }
}
