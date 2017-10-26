import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native';
import {Agenda, LocaleConfig} from 'react-native-calendars';
import Swipeable from 'react-native-swipeable';
import { FontAwesome } from "react-native-vector-icons";
import { getToken } from '../../auth';

export default class AgendaScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      isOpen: null,
      leftIcon: 'trash-o',
      leftBackgroundColor: 'red',
      rightIcon: 'edit',
      rightBackgroundColor: 'orange',
    };
  }

  componentDidMount() {
    let calendar = null;
    if(this.props.navigate){
      const nav = this.props.navigate;
      if(nav.state){
        if(nav.state.params){
          if(nav.state.params.data){
            calendar = nav.state.params.data;
            this.setState({calendar});
          }
        }
      }
    }
    const data = {};
    if(calendar){
      return getToken()
      .then((bulkAccess) => {
        const objAccess = JSON.parse(bulkAccess);
        let isOwner = false;
        if(objAccess.id === calendar.owner.id){
          isOwner = true;
        }
        this.setState({isOwner});
        return fetch(`http://another-calendar.herokuapp.com/api/v1/user/calendars/${calendar.id}`, {
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
            isLoading: false,
          }, function () {
            alert(JSON.stringify(responseBody.error));
          });
        }
        responseBody.events.forEach((evt) => {
          const date = this.timeToString(evt.start_at);
          if(!data[date]){
            data[date] = [];
          }
          console.log('evt', evt);
          data[date].push({
            id: evt.id,
            title: evt.title,
            description: evt.description,
            important: evt.important,
            start_at: evt.start_at,
            end_at: evt.end_at,
            participants: evt.participants,
            height: 100
          });
        })
        this.setState({
        })
        return this.setState({
          isLoading: false,
          calendar: responseBody,
          items: data
        });
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }


  render() {
    LocaleConfig.locales['fr'] = {
      monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
      monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
      dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
      dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.']
    };
    LocaleConfig.defaultLocale = 'fr';
    return (
      <Agenda
        items={this.state.items}
        loadItemsForMonth={this.loadItems.bind(this)}
        selected={'2017-10-24'}
        renderItem={this.renderItem.bind(this)}
        renderEmptyDate={this.renderEmptyDate.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
        //markingType={'interactive'}
        //markedDates={{
          //  '2017-05-08': [{textColor: '#666'}],
          //  '2017-05-09': [{textColor: '#666'}],
          //  '2017-05-14': [{startingDay: true, color: 'blue'}, {endingDay: true, color: 'blue'}],
          //  '2017-05-21': [{startingDay: true, color: 'blue'}],
          //  '2017-05-22': [{endingDay: true, color: 'gray'}],
          //  '2017-05-24': [{startingDay: true, color: 'gray'}],
          //  '2017-05-25': [{color: 'gray'}],
          //  '2017-05-26': [{endingDay: true, color: 'gray'}]}}
          // monthFormat={'yyyy'}
          // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
          //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
          />
      );
    }

    loadItems(day) {
      setTimeout(() => {
        for (let i = -15; i < 85; i++) {
          const time = day.timestamp + i * 24 * 60 * 60 * 1000;
          const strTime = this.timeToString(time);
          if(this.state.calendar){
            if(!this.state.items[strTime]){
              this.state.items[strTime] = [];
            }
          }
        }
        const newItems = {};
        Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
        this.setState({
          items: newItems
        });
      }, 1000);
    }

    renderItem(item) {
      const { navigate } = this.props.navigate
      , data = {};
      data.calendar = this.state.calendar;
      data.item = item;
      return (
        <TouchableOpacity style={styles.button} onPress={() => navigate("EditEvent", {data})}>
          <View style={[styles.item, {height: item.height}]}>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    renderEmptyDate(item) {
      const { navigate } = this.props.navigate
      , data = {};
      data.calendar = this.state.calendar;
      data.item = item;
      data.calendar = this.state.calendar;
      if(this.state.isOwner){
        return (
          <TouchableOpacity style={styles.button} onPress={() => navigate("EditEvent", {data})}>
            <View style={styles.emptyDate}><Text>Aucune entrée a cette date la</Text></View>
          </TouchableOpacity>
        );
      } else {
        return (
          <View style={styles.emptyDate}><Text>Aucune entrée a cette date la</Text></View>
        );
      }
    }

    rowHasChanged(r1, r2) {
      return r1.title !== r2.title;
    }

    timeToString(time) {
      const date = new Date(time);
      return date.toISOString().split('T')[0];
    }
  }

  const styles = StyleSheet.create({
    item: {
      backgroundColor: 'white',
      flex: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      marginTop: 17
    },
    emptyDate: {
      height: 15,
      flex:1,
      paddingTop: 30
    },
    container: {
      flex: 1,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      marginLeft: 12,
      fontSize: 16,
    },
    photo: {
      height: 40,
      width: 40,
      borderRadius: 20,
    },
    leftSwipeItem: {
      flex: 1,
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingRight: 20
    },
  });
