import React, {Component} from 'react';
import { StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StatusBar,
  ListView } from 'react-native';
  import DateTimePicker from 'react-native-modal-datetime-picker';
  // import DatePicker from 'react-native-datepicker'
  import CustomMultiPicker from "react-native-multiple-select-list";
  import { getToken } from '../../auth';

  export default class EventForm extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoading: false,
        events: [],
        dataList: {},
        userList: [],
        participantList: {},
        contactList: {},
        selectedP: [],
        selectedC: [],
        cantLeave: false,
        title: null,
        image: null,
        isOwner: false,
        isEditing: false,
        isEditingText: 'Ajouter un évenement',
        isDateTimePickerVisible: false
      }
    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
      this.setState({end_at: date.toISOString()});
      this._hideDateTimePicker();
    };

    componentDidMount() {
      let editEvent = null
      , calendar = null
      , event = null
      , title = '';
      if(this.props.navigate){
        const nav = this.props.navigate;
        if(nav.state){
          if(nav.state.params){
            if(nav.state.params.data){
              editEvent = nav.state.params.data;
              calendar = editEvent.calendar;
              event = editEvent.item;
              events =  calendar.events;
              if(event.id){
                this.setState({
                  event,
                  events,
                  calendar,
                  calendar_participants: calendar.calendar_participants,
                  isEditing: true,
                  isEditingText: 'Editer un évenement',
                  event_participants_attributes: event.event_participants_attributes || [],
                  title: event.title,
                  description: event.description,
                  placeHolderStart_at: event.toString().substring(0,17),
                  minDate: new Date(event.start_at),
                  start_at: event.start_at.toString().substring(0,17),
                  end_at: event.end_at.toString().substring(0,17),
                  placeHolderEnd_at: event.toString().substring(0,17)
                });
              } else {
                this.setState({
                  event,
                  events,
                  calendar,
                  calendar_participants: calendar.calendar_participants,
                  minDate: new Date(event.start_at),
                  placeHolderStart_at: event.toString().substring(0,17),
                  start_at: event.toString().substring(0,17),
                  end_at: event.toString().substring(0,17),
                  placeHolderEnd_at: event.toString().substring(0,17)
                });
              }
            }
          }
        }
      }
      console.log('calendar', calendar);
      console.log('event', event);

      return getToken()
      .then((bulkAccess) => {
        const objAccess = JSON.parse(bulkAccess);
        let isOwner = false;
        if(editEvent){
          console.log('heu test ?', calendar.owner.id, objAccess.id);
          if(objAccess.id === calendar.owner.id){
            isOwner = true;
          }
        }
        this.setState({
          objAccess,
          isOwner
        });
        return fetch('http://another-calendar.herokuapp.com/api/v1/user/contacts/', {
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
        console.log('responseBody', responseBody);
        if(responseBody.error){
          return this.setState({
            isLoading: false
          }, function () {
            alert(JSON.stringify(responseBody.error));
          });
        }

        const uglyObject2 = {};
        const beeeerk = {};
        let jpp = [];
        let ownerInfo = null;
        let cantLeave = false;
        this.state.calendar.participants.forEach((obj) => {
          if(obj.user.id === this.state.objAccess.id) { cantLeave = true; }
          ownerInfo = obj.owner;
          jpp.push(obj.user.id.toString());
          beeeerk[obj.user.id] = obj.user.id.toString();
          const toDisplay = obj.user.name ? `${obj.user.name} ${obj.user.nickname}` : obj.user.email;
          uglyObject2[obj.user.id] = toDisplay;
        });
        const ownerDisplay = ownerInfo.name ? `${ownerInfo.name} ${ownerInfo.nickname}` : ownerInfo.email;
        uglyObject2[ownerInfo.id] = ownerDisplay;
        jpp.push(ownerInfo.id.toString());
        beeeerk[ownerInfo.id] = ownerInfo.id.toString();
        const uglyObject = {};
        let jpp2 = [];
        if (responseBody){
          responseBody.forEach((obj) => {
            // if(!beeeerk[obj.user.id]){
            jpp2.push(obj.id.toString());
            const toDisplay = obj.user.name ? `${obj.user.name} ${obj.user.nickname}` : obj.user.email;
            uglyObject[obj.id] = toDisplay;
            // }
            // pas push si deja dans contacts
          })
        }
        return this.setState({
          isLoading: false,
          selectedP :jpp,
          selectedC :jpp2,
          cantLeave,
          participantList: uglyObject2,
          contactList: uglyObject,
        });
      })
      .catch((error) => {
        console.error(error);
      });
    }

    _editOrCreateEvent = () => {
      if(!this.state.title){
        alert('Merci de préciser un titre');
        return null;
      }
      if(!this.state.description){
        alert('Merci de préciser une description');
        return null;
      }
      if(!this.state.start_at){
        alert('Merci de préciser une date de début');
        return null;
      }
      if(!this.state.end_at){
        alert('Merci de préciser une date de fin');
        return null;
      }
      this.setState({
        isLoading: true,
      });

      return getToken()
      .then((bulkAccess) => {
        const objAccess = JSON.parse(bulkAccess);
        const userList = this.state.userList || [];
        const list = [];
        if(userList[0] === undefined) {
          userList.shift();
        }
        // userList.forEach((id) => {
        //   list.push(id);
        // });
        userList.forEach((id) => {
          let check = false;
          if(this.state.isEditing){
            console.log('this.state.event', this.state.event);
            this.state.event.participants.forEach((contact) => {
              if(parseInt(contact.id, 10) === parseInt(id, 10)){
                check = true;
              }
            });
          }
          if(!check){
            list.push({ participant_id: id });
          }
        });
        let check = this.state.isOwner;
        const buildBody = this.state.calendar;
        // let tmp = [];
        // if (this.state.event){
        //   let tmp = [];
        //   let check = false;
        //   this.state.events.forEach((evt) => {
        //     if(evt.id !== this.state.event.id){
        //       tmp.push(evt);
        //     }
        //   });
        // } else {
        //   tmp = this.state.events;
        // }

        let start = this.state.start_at
        let end = this.state.end_at
        if (this.state.isEditing){
          start = start.substring(0,10)
          end = end.substring(0,10)
        }
        else {
          start = new Date(start);
          end = new Date(start);
          start = start.toISOString().split('T')[0]
          end = end.toISOString().split('T')[0]
        }
        const tmp =[];
        tmp.push({
          title: this.state.title,
          description: this.state.description,
          start_at: start,
          end_at: end,
          event_participants_attributes: list
        });
        buildBody.events_attributes = tmp;

        // buildBody.events_attributes = buildEvent;
        console.log('JSON.stringify({{events_attributes: buildEvent})', {calendar: buildBody});
        if(this.state.isEditing){
          const buildEvent = {
            title: this.state.title,
            description: this.state.description,
            start_at: start,
            end_at: end,
            event_participants_attributes: list
            // event_participants: { event_participants_attributes: list}
          };
          // const test = {};
          // test.events = {events_attributes: [buildEvent]}
          // test. = ;
          // test.events = {}
          console.log('oOooo', this.state.event.id);
          return fetch(`http://another-calendar.herokuapp.com/api/v1/user/calendars/${this.state.calendar.id}/events/${this.state.event.id}`, {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              uid: objAccess.uid,
              client: objAccess.client,
              expiry: objAccess.expiry,
              access_token: objAccess.access_token
            },
            body: JSON.stringify({events_attributes: buildEvent})
          })
        }
        // return fetch(`http://another-calendar.herokuapp.com/api/v1/user/calendars/${this.state.calendar.id}/events`, {
        return fetch(`http://another-calendar.herokuapp.com/api/v1/user/calendars/${this.state.calendar.id}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            uid: objAccess.uid,
            client: objAccess.client,
            expiry: objAccess.expiry,
            access_token: objAccess.access_token
          },
          body: JSON.stringify({calendar: buildBody})
        })
      })
      .then((response) => {
        const responseHeaders = response.headers.map;
        const responseBody = JSON.parse(response._bodyText);
        console.log('response',response);
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
        const { navigate } = this.props.navigate;
        navigate('Calendar', {data: responseBody});
      })
      .catch((error) => {
        alert(JSON.stringify(error));
        console.error(error);
      });
    };

    _destroyEvent = () => {
      this.setState({
        isLoading: true,
      });

      // let lol = this.state.events;
      // const buildBody = this.state.calendar;
      // for(var i = lol.length - 1; i >= 0; i--) {
      //   if(lol[i].id === this.state.event.id) {
      //     lol.splice(i, 1);
      //   }
      // }
      // buildBody.events_attributes = [{id}];
      return getToken()
      .then((bulkAccess) => {
        const objAccess = JSON.parse(bulkAccess);
        return fetch(`http://another-calendar.herokuapp.com/api/v1/user/calendars/${this.state.calendar.id}/events/${this.state.event.id}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            uid: objAccess.uid,
            client: objAccess.client,
            expiry: objAccess.expiry,
            access_token: objAccess.access_token
          },
          // body: JSON.stringify({calendar: buildBody})
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
        if(responseBody.errors){
          return this.setState({
            isLoading: false,
          }, function () {
            alert(JSON.stringify(responseBody.errors));
          });
        }
        console.log('responseBody', responseBody);
        const { navigate } = this.props.navigate;
        navigate('Calendar', {data: responseBody});
      })
      .catch((error) => {
        alert(JSON.stringify(error));
        console.error(error);
      });
    };

    _leaveEvent = () => {
      console.log('leave event');
    };

    CreateOrEditButton = () => {
      if(!this.state.isOwner){
        return null;
      }
      if(!this.state.isEditing){
        return (
          <TouchableOpacity style={[styles.buttonContainer, {backgroundColor: 'green'}]}
            onPress={this._editOrCreateEvent}
            disabled={this.state.isLoading}>
            <Text style={styles.buttonText}> Créer un évenement </Text>
          </TouchableOpacity>
        )
      } else {
        return(
          <TouchableOpacity style={[styles.buttonContainer, {backgroundColor: 'orange'}]}
            onPress={this._editOrCreateEvent}
            disabled={this.state.isLoading}>
            <Text style={styles.buttonText}> Editer cet évenement </Text>
          </TouchableOpacity>
        )
      }
    }

    editDate = () => {
      if(!this.state.isOwner){
        return null;
      }
      return (
        <TouchableOpacity
          style={[styles.buttonContainer, {backgroundColor: '#2980b9'}]}
          onPress={this._showDateTimePicker}
          disabled={this.state.isLoading}>
          <Text style={styles.buttonText}>Modifier la date de fin</Text>
        </TouchableOpacity>
      )
    }

    LeaveOrDestroyButton = () => {
      if(!this.state.isEditing){
        return null
      }
      if(!this.state.isOwner){
        if(this.state.cantLeave){
          return null
        }else {
          return (
            <TouchableOpacity style={[styles.buttonContainer, {backgroundColor: 'red'}]}
              onPress={this._leaveEvent}
              disabled={this.state.isLoading}>
              <Text style={styles.buttonText}> Quitter cet évenement </Text>
            </TouchableOpacity>
          )
        }
      } else {
        return(
          <TouchableOpacity style={[styles.buttonContainer, {backgroundColor: 'red'}]}
            onPress={this._destroyEvent}
            disabled={this.state.isLoading}>
            <Text style={styles.buttonText}> Supprimer cet évenement </Text>
          </TouchableOpacity>
        )
      }
    }
    participantList = () => {
      if (!this.state.isOwner) {
        return (
          <CustomMultiPicker
            options={this.state.participantList}
            search={false}
            multiple={true}
            selected={this.state.selectedP}
            hideSubmitButton={true}
            callback={(lol) => this.setState({lol})}
            placeholder={`Personnes présentes a l'évenement`}
            placeholderTextColor={'rgba(255,255,255,0.7)'}
            returnValue={"value"}
            rowBackgroundColor={"#eee"}
            rowHeight={40}
            rowRadius={5}
            iconColor={"#00a2dd"}
            iconSize={30}
            selectedIconName={"ios-checkmark-circle-outline"}
            unselectedIconName={"ios-radio-button-off-outline"}
            scrollViewHeight={130}
            />
        );
      }
      return(
        <CustomMultiPicker
          options={this.state.participantList}
          search={true}
          multiple={true}
          selected={this.state.selectedP}
          placeholder={'Personnes présentes a lévenement'}
          placeholderTextColor={'rgba(255,255,255,0.7)'}
          returnValue={"value"}
          rowBackgroundColor={"#eee"}
          rowHeight={40}
          callback={(lol) => this.setState({lol})}
          rowRadius={5}
          iconColor={"#00a2dd"}
          iconSize={30}
          selectedIconName={"ios-checkmark-circle-outline"}
          unselectedIconName={"ios-radio-button-off-outline"}
          scrollViewHeight={130}
          />
      )
    }
    contactList = () => {
      if (!this.state.isOwner) {
        return null;
      }
      return(
        <View>
          <TextInput
            placeholder="Amis participant a cet evenement"
            placeholderTextColor="rgba(255,255,255,0.7)"
            editable={false}
            style={styles.input}
            />
          <CustomMultiPicker
            options={this.state.contactList}
            search={true}
            multiple={true}
            selected={this.state.selectedC}
            placeholder={'Ajouter des amis a ce calendrier'}
            placeholderTextColor={'rgba(255,255,255,0.7)'}
            returnValue={"value"}
            rowBackgroundColor={"#eee"}
            rowHeight={40}
            callback={(userList) => this.setState({userList})}
            rowRadius={5}
            iconColor={"#00a2dd"}
            iconSize={30}
            selectedIconName={"ios-checkmark-circle-outline"}
            unselectedIconName={"ios-radio-button-off-outline"}
            scrollViewHeight={130}
            />
        </View>
      )
    }

    render() {
      const isDisable = () => {
        if(!this.state.isOwner || this.state.isLoading){
          return true;
        }
        return false;
      }
      return (
        <View style={styles.container}>
          <TextInput
            placeholder="Titre de l'évènement"
            onChangeText={(title) => this.setState({title})}
            onSubmitEditing={() => this.descriptionInput.focus()}
            placeholderTextColor="rgba(255,255,255,0.7)"
            returnKeyType="next"
            value={this.state.title}
            editable={!this.isDisable}
            style={styles.input}
            />
          <TextInput
            placeholder="Description"
            placeholderTextColor="rgba(255,255,255,0.7)"
            returnKeyType="next"
            value={this.state.description}
            onChangeText={(description) => this.setState({description})}
            editable={!this.isDisable}
            autoCorrect={false}
            ref={(input) => this.descriptionInput = input}
            style={styles.input}
            />
          <TextInput
            placeholder={this.state.placeHolderStart_at}
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={this.state.start_at}
            editable={false}
            autoCorrect={false}
            style={styles.input}
            />
          <TextInput
            placeholder={this.state.placeHolderEnd_at}
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={this.state.end_at}
            editable={false}
            autoCorrect={false}
            style={styles.input}
            />
          <this.editDate/>
          <DateTimePicker
            minimumDate={this.state.minDate}
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
            />
          <TextInput
            placeholder="Membres du calendrier"
            placeholderTextColor="rgba(255,255,255,0.7)"
            editable={false}
            style={styles.input}
            />
          <this.participantList/>
          <this.contactList/>
          <this.CreateOrEditButton/>
          <this.LeaveOrDestroyButton/>
        </View>
      )
    }
  }

  const styles = StyleSheet.create({
    container: {
      padding: 20
    },
    input: {
      textAlign: 'center',
      height: 40,
      backgroundColor: 'rgba(255,255,255,0.2)',
      marginBottom: 10,
      color: '#FFF',
      paddingHorizontal: 10
    },
    buttonContainer: {
      marginBottom: 10,
      paddingVertical: 15
    },
    buttonText: {
      color: '#FFFFFF',
      textAlign: 'center',
      fontWeight: '700'
    }
  });
