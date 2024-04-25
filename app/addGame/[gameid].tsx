import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Platform, StyleSheet, TextInput, Switch, Image, Pressable } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View, useThemeColor } from '@/components/Themed';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { GameDTO, GameStatus } from '../models/GameModels';
import NumberInput from 'react-native-numeric-input';
import InputSpinner from "react-native-input-spinner";
import { AlarmSettingsProps, useAlarmStore } from '../store/alarmStore';
import moment from 'moment';

export default function ModalScreen() {
  const {gameId} = useLocalSearchParams<{gameId : string}>();
  const [game, setGame] = useState<GameDTO>();
  const [alarmSettings, setAlarmSettings] = useState<AlarmSettingsProps>({time : {leftTimeInPeriod  :12, period : 1}, gameId : Number(gameId)})
  const [useDiff, setUseDiff] = useState<boolean>(false);
  const navigation = useNavigation()
  const {alarms, addAlarm} = useAlarmStore();
  const currAlarm = useMemo(() => game && alarms.find(alarm => alarm.gameId === game.gameId),[alarms, game])

  useEffect(() => {
    if(currAlarm) {
       setAlarmSettings(currAlarm);
       setUseDiff(currAlarm.diff !== undefined)
    }
  },[currAlarm])

  const textColor = useThemeColor({}, 'text');

  const fetchGameById = async () => {
    const response : AxiosResponse<GameDTO> = await axios.get(`http://192.168.16.55:3000/api/games/${gameId}`);
    setGame(response.data)
  }

  const redirectToHome = () => {
     // Replace 'Home' with the name of your home screen
     router.replace('/');
  };

  useEffect(() => {
    if (game){
      if (game.gameTime.gameStatus === GameStatus.Final) {
        redirectToHome();
        return;
      }
      const additionalString = game.gameTime.gameStatus === GameStatus.During ? ` ${game.homeTeam.score} :  ${game.awayTeam.score} ${game.gameTime.gameStatusText}` : moment.utc(game.gameTime.gameTimeUTC).local().format('HH:mm (DD/MM)')
      navigation.setOptions({
        title : `${game.homeTeam.teamName} - ${game.awayTeam.teamName}, ${additionalString}`
      })
    }
  }, [game])

  useEffect(() => {
    fetchGameById();
  },[gameId])

  return ( game ?
    <View style={styles.container}>
      <div style={{display : 'flex', placeContent :'center', alignItems : 'center', gap : 5, width : '80%'}}>
      <Image source={{uri : `https://cdn.nba.com/logos/nba/${game.homeTeam.teamId}/global/L/logo.svg`}} style={{height:150, width:150}}/>
      <Text style={{fontSize : 20, fontWeight : 'bold'}}>VS</Text>
      <Image source={{uri : `https://cdn.nba.com/logos/nba/${game.awayTeam.teamId}/global/L/logo.svg`}} style={{height:150, width:150}}/>
      </div>
      <div style={styles.inputBox}>
      <Text style={{width :80}}>Period</Text>
      <InputSpinner textColor={textColor} color='#009688' style={styles.inputSpinner} min={1} max={4} editable value={alarmSettings.time.period} onChange={(newPeriod : number) => setAlarmSettings(curr => ({...curr,
         time : {...curr.time, period : newPeriod}}))} showBorder rounded={false}/> 
      </div>
      <div style={styles.inputBox}>
      <Text style={{width :80}}>Time Left In Peiod</Text>
      <InputSpinner textColor={textColor} color='#009688' style={styles.inputSpinner} showBorder rounded={false} min={1} max={12} editable value={alarmSettings.time.leftTimeInPeriod} onChange={(newLeftTime : number) => setAlarmSettings(curr => ({...curr, time : {...curr.time, leftTimeInPeriod : newLeftTime}}))}/> 
      </div>
      <div style={styles.inputBox}>
      <Switch
        // trackColor={{false: '#767577', true: '#81b0ff'}}
        // thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        //ios_backgroundColor="#3e3e3e"
        onValueChange={setUseDiff}
        value={useDiff}
      />
      <div style={{...styles.inputBox, opacity : useDiff ? 1 : 0.2, width : '100%'}}>
      <Text style={{width : 35}}>Diff</Text>
      <InputSpinner color='#009688' textColor={textColor} style={styles.inputSpinner} showBorder rounded={false} disabled={!useDiff} value={alarmSettings.diff} onChange={(newDiff : number) => setAlarmSettings(curr => ({...curr, diff : newDiff}))}/> 
      </div>
      </div>
      <Pressable style={styles.button} onPress={() => {
        console.log(alarmSettings)
        addAlarm({...alarmSettings, diff : useDiff ? alarmSettings.diff : undefined})
        navigation.goBack();
        }}>
        <Text>Submit</Text>
      </Pressable>
    </View> :
      <ActivityIndicator size="large" color="#0000ff" />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap : 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  button : {
    backgroundColor : '#009688',
    width : '80%',
    alignItems : 'center',
    height : 40,
    justifyContent : 'center',
    borderRadius : 8
  },
  inputBox : {
    display : 'flex',
    flexDirection : 'row',
    alignItems : 'center',
    width : '80%',
    gap : 5
  },
  inputSpinner : {
    flex : 1
  }
});
