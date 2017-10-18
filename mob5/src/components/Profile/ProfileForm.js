import React, {Component} from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, StatusBar } from 'react-native';
import CustomMultiPicker from "react-native-multiple-select-list";
import { getToken } from '../../auth';

export default class GroupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      email: null,
      firstname: null,
      lastname: null
    }
  }

  componentDidMount() {
    return getToken()
    .then((bulkAccess) => {
      const objAccess = JSON.parse(bulkAccess);
      return fetch(`http://another-calendar.herokuapp.com/api/v1/users/${objAccess.id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          uid: objAccess.uid,
          client: objAccess.client,
          expiry: objAccess.expiry,
          access_token: objAccess.access_token
        }
      })
    })
    .then((response) => {
      const responseHeaders = response.headers.map;
      const responseBody = JSON.parse(response._bodyText);
      if(responseBody.error){
        return this.setState({
          isLoading: false
        }, function () {
          alert(JSON.stringify(responseBody.error));
        });
      }
      return this.setState({
        isLoading: false,
        email: responseBody.email,
        firstname: responseBody.name,
        lastname: responseBody.nickname
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  _onPressButton = () => {
  if(!this.state.firstname || !this.state.lastname){
    alert('Merci de préciser un prénom et un nom');
    return null;
  }
  this.setState({
    isLoading: true,
  });
  return getToken()
  .then((bulkAccess) => {
    const objAccess = JSON.parse(bulkAccess);
    return fetch(`http://another-calendar.herokuapp.com/api/v1/users/${objAccess.id}`, {
      method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          uid: objAccess.uid,
          client: objAccess.client,
          expiry: objAccess.expiry,
          access_token: objAccess.access_token
        },
        body: JSON.stringify({
          name: this.state.firstname,
          nickname: this.state.lastname
        })
      })
  })
  .then((response) => {
    console.log('response', response);
    const responseHeaders = response.headers.map;
    const responseBody = JSON.parse(response._bodyText);
    if(responseBody.error){
      return this.setState({
        isLoading: false
      }, function () {
        alert(JSON.stringify(responseBody.error));
      });
    }
    alert('Votre profil a été modifié')
  })
  .catch((error) => {
    alert(JSON.stringify(error));
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
      placeholder="email"
      placeholderTextColor="rgba(255,255,255,0.7)"
      value={this.state.email}
      disabled={true}
      style={styles.input}
      />
      <TextInput
      placeholder="Prénom"
      placeholderTextColor="rgba(255,255,255,0.7)"
      returnKeyType="next"
      onSubmitEditing={() => this.lastnameInput.focus()}
      value={this.state.firstname}
      onChangeText={(firstname) => this.setState({firstname})}
      disabled={this.state.isLoading}
      autoCorrect={false}
      style={styles.input}
      />
      <TextInput
      placeholder="Nom"
      placeholderTextColor="rgba(255,255,255,0.7)"
      returnKeyType="go"
      value={this.state.lastname}
      onChangeText={(lastname) => this.setState({lastname})}
      disabled={this.state.isLoading}
      autoCorrect={false}
      style={styles.input}
      ref={(input) => this.lastnameInput = input}
      />
      <TouchableOpacity style={styles.buttonContainer}
        disabled={this.state.isLoading}
        onPress={this._onPressButton}>
        <Text style={styles.buttonText}> Sauvegarder les modifications </Text>
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
