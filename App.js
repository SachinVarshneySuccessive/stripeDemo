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

class App extends PureComponent {
  state = {
    loading: false,
    token: null,
    amount: 0,
  };

  handleCardPayPress = async () => {
    try {
      this.setState({loading: true, token: null});
      const token = await stripe.paymentRequestWithCardForm({
        // Only iOS support this options
        smsAutofillDisabled: true,
        requiredBillingAddressFields: 'full',
        prefilledInformation: {
          billingAddress: {
            name: 'Sachin Varshney',
            line1: 'Canary Place',
            line2: '3',
            city: 'Macon',
            state: 'Georgia',
            country: 'US',
            postalCode: '31217',
            email: 'sachin.varshney@successive.tech',
          },
        },
      });

      this.setState({loading: false, token: token.tokenId});
      console.log('token: ', token.tokenId);
    } catch (error) {
      this.setState({loading: false});
    }
  };

  makePayment = async () => {
    try {
      this.setState({loading: true});
      const response = await axios.post('http://localhost:5000/api/doPayment', {
        amount: this.state.amount,
        tokenId: this.state.token,
      });
      this.setState({loading: false});
      alert('payment success');
      console.log('response', response);
    } catch (error) {
      console.log('error', error);
      this.setState({loading: false});
    }
  };

  render() {
    const {loading, token} = this.state;
    return (
      <SafeAreaView>
        <View style={styles.container}>
          <Text style={styles.header}>Card Form Example</Text>
          <Text style={styles.instruction}>
            Click button to show Card Form dialog.
          </Text>
          <Button
            text="Enter you card and pay"
            loading={loading}
            onPress={this.handleCardPayPress}
          />
          <View style={styles.token}>
            {token && (
              <>
                <Text style={styles.instruction}>Token: {token}</Text>
                <TextInput
                  value={`${this.state.amount}`}
                  placeholder="Enter amount"
                  onChangeText={(text) => {
                    this.setState({amount: text});
                  }}
                />
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
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
