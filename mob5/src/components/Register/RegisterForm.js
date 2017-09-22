import React, {Component} from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, StatusBar } from 'react-native';
import { onSignIn } from '../../auth';

export default class RegisterForm extends Component {
  // export default ({ navigation }) => (
  render() {
    const { navigate } = this.props.navigate;
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          />
        <TextInput
          placeholder="username or email"
          placeholderTextColor="rgba(255,255,255,0.7)"
          returnKeyType="next"
          onSubmitEditing={() => this.passwordInput.focus()}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          />
        <TextInput
          placeholder="password"
          placeholderTextColor="rgba(255,255,255,0.7)"
          returnKeyType="next"
          onSubmitEditing={() => this.confirmPasswordInput.focus()}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          ref={(input) => this.passwordInput = input}
          />
        <TextInput
          placeholder="confirm password"
          placeholderTextColor="rgba(255,255,255,0.7)"
          returnKeyType="done"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          ref={(input) => this.confirmPasswordInput = input}
          />
        <TouchableOpacity style={styles.buttonContainer}
          onPress={() => {
            onSignIn().then(() => navigate("SignedIn"));
        }}>
          <Text style={styles.buttonText}> REGISTER </Text>
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
