import React, {Component} from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, StatusBar } from 'react-native';
import CustomMultiPicker from "react-native-multiple-select-list";
import { getToken } from '../../auth';

export default class CalendarForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      emailField: null
    }
  }

  _onPressButton = () => {
  if(!this.state.emailField){
    alert('Merci de préciser un email dans le champ email');
    return null;
  }
  this.setState({
    isLoading: true,
  });
  return getToken()
  .then((bulkAccess) => {
    const objAccess = JSON.parse(bulkAccess);
    return fetch('http://another-calendar.herokuapp.com/api/v1/user/contacts', {
      method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          uid: objAccess.uid,
          client: objAccess.client,
          expiry: objAccess.expiry,
          access_token: objAccess.access_token
        },
        body: JSON.stringify({
          // email: this.state.emailField
          contact: { 'email': this.state.emailField }
        })
      })
  })
  .then((response) => {
    if(response){
      if(!response.ok){
        return this.setState({
          isLoading: false,
        }, function () {
          alert(JSON.stringify(response._bodyText));
        });
      }
    }
    const responseHeaders = response.headers.map;
    const responseBody = JSON.parse(response._bodyText);
    if(responseBody.error){
      return this.setState({
        isLoading: false,
      }, function () {
        alert(JSON.stringify(responseBody.error));
      });
    }
    if(responseBody.errors){
      return this.setState({
        isLoading: false,
      }, function () {
        alert(JSON.stringify(responseBody.errors));
      });
    }
    return this.setState({
      isLoading: false,
    }, function () {
      alert('votre ami a bien été ajouté');
    });
  })
  .catch((error) => {
    console.log(error);
  });
};

  render() {
    const { navigate } = this.props.navigate;
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
        />
        <TextInput
        placeholder="Email de l'ami"
        placeholderTextColor="rgba(255,255,255,0.7)"
        returnKeyType="go"
        disabled={this.state.isLoading}
        value={this.state.description}
        onChangeText={(emailField) => this.setState({emailField})}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        />

        <TouchableOpacity style={styles.buttonContainer}
          onPress={this._onPressButton}
          disabled={this.state.isLoading}>
          <Text style={styles.buttonText}> Ajouter un ami </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  input: {
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 10,
    color: '#FFF',
    paddingHorizontal: 10
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
