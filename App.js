/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {PureComponent} from 'react';
import {StyleSheet, Text, View, SafeAreaView, TextInput} from 'react-native';
import Button from './components/Button';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import axios from 'axios';
import stripe from 'tipsi-stripe';
stripe.setOptions({
  publishableKey:
    'pk_test_51HWcHnFFDcBiZd3l0ESq8eZIz1PJ78qldFhpUBTBH7eHjXvrCq3loB9cfaAeGyAivGTrNWilrXSF4ir2yi5SELRJ00YwhBU9SP',
});

const options = {
  requiredBillingAddressFields: 'full',
  prefilledInformation: {
    billingAddress: {
      name: 'Sachin Varshney',
      line1: 'Successive technology',
      line2: 'Noida',
      city: 'Noida',
      state: 'UP',
      country: 'INDIA',
      postalCode: '201301',
    },
  },
};

const params = {
  // mandatory
  number: '4242424242424242',
  expMonth: 11,
  expYear: 23,
  cvc: '223',
  // optional
  name: 'Sachin Varshney',
  currency: 'usd',
  addressLine1: '123 Test Street',
  addressLine2: 'Apt. 5',
  addressCity: 'Test City',
  addressState: 'Test State',
  addressCountry: 'Test Country',
  addressZip: '55555',
};

class App extends PureComponent {
  state = {
    loading: false,
    token: null,
    amount: '',
  };

  handleCardPayPress = async () => {
    try {
      console.log('getting token');
      this.setState({loading: true, token: null});

      // const token = await stripe.createTokenWithCard(params);
      const token = await stripe.paymentRequestWithCardForm(options);
      this.setState({loading: false, token: token.tokenId});
      console.log('token: ', token.tokenId);
    } catch (error) {
      console.log('Error in token', error);
      this.setState({loading: false});
    }
  };

  // makeApicall = () => {
  //   fetch('http://127.0.0.1:5000/api/doPayment', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       amount: this.state.amount,
  //       tokenId: this.state.token,
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       alert('payment success');
  //       this.setState({loading: false});
  //       console.log('Success:', data);
  //     })
  //     .catch((error) => {
  //       this.setState({loading: false});
  //       console.error('Error:', error);
  //     });
  // };

  makePayment = async () => {
    try {
      if (this.state.amount === '') {
        alert('Enter the amount')
        return;
      }
      this.setState({loading: true});
      const response = await axios.post('http://localhost:5000/api/doPayment', {
        amount: this.state.amount * 100,
        tokenId: this.state.token,
      });
      this.setState({loading: false, amount: ''});
      alert('Payment successful')
      console.log('response', response);
    } catch (error) {
      this.setState({loading: false});
      console.log('error', error);
    }
  };

  render() {
    const {loading, token} = this.state;
    return (
      <SafeAreaView>
        <View style={styles.container}>
          <Text style={styles.header}>Card Form Example</Text>
          <Button
            text="Enter you card and pay"
            loading={loading}
            onPress={this.handleCardPayPress}
          />
          <View style={styles.token}>
            {token && (
              <>
                <Text style={styles.instruction}>Generated Token: {token}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter amount"
                  onChangeText={(text) => {
                    this.setState({amount: text});
                  }}>{`${this.state.amount}`}</TextInput>
                <Button
                  text="Make payment"
                  loading={loading}
                  onPress={this.makePayment}
                />
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  header: {fontSize: 30, color: 'black', fontWeight: '900'},
  instruction: {fontSize: 14, color: 'red'},
  input: {marginVertical: 10, borderBottomWidth: 1},
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  token: {
    margin: 10,
  },
});

export default App;
