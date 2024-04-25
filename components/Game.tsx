import { GameDTO, GameStatus, GameTime } from '@/app/models/GameModels';
import { Link, router, useNavigation } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import { View, useThemeColor, Text } from './Themed';
import moment from 'moment';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useAlarmStore } from '@/app/store/alarmStore';
import { useShallow } from 'zustand/react/shallow';
import LiveIcon from './LiveIcon';

const Game = (props : GameDTO) => {
  const primary = useThemeColor({}, 'primary')
  const secondary = useThemeColor({}, 'secondary')
  const accent = useThemeColor({}, 'accent')
  const text = useThemeColor({}, 'text')
  const alarms = useAlarmStore(useShallow(state => state.alarms));
  const currAlarm = useMemo(() => alarms.find(alarm => alarm.gameId === props.gameId),[alarms, props])

  return (
    <View style={{...styles.card, backgroundColor : primary, opacity : props.gameTime.gameStatus === GameStatus.Final ? 0.75 : 1}}>
      {props.gameTime.gameStatus !== GameStatus.Final && 
        (currAlarm ? 
        <MaterialCommunityIcons name='alarm-check' size={28} color={accent} 
        style={{top :5, left : 5, position : 'absolute'}} onPress={() => router.push(`/addGame/${props.gameId}`)}
       />
      // <TouchableOpacity
      //  style={{top :5, left : 5, position : 'absolute', padding : 2, borderRadius : 8, backgroundColor : secondary}}
      //  onPress={() => router.push(`/addGame/${props.gameId}`)}>
      //   <Text style={{textAlign : 'center'}}>{`${currAlarm.time.period}° ${currAlarm.time.leftTimeInPeriod}${currAlarm.diff ? `\n` + currAlarm.diff : ''}`}</Text>
      // </TouchableOpacity>
        :
        <MaterialIcons name='add-alarm' size={28} color={secondary} 
        style={{top :5, left : 5, position : 'absolute'}}
        onPress={() => router.push(`/addGame/${props.gameId}`)}
       />)}
      <div style={styles.row}>
        <Text>{props.homeTeam.teamName}</Text>
        <Image source={{uri : `https://cdn.nba.com/logos/nba/${props.homeTeam.teamId}/global/L/logo.svg`}} style={{height:50, width:50}}></Image>
      </div>
      <GameStatusText {...props}/>
      <div style={styles.row}>
        <Image source={{uri : `https://cdn.nba.com/logos/nba/${props.awayTeam.teamId}/global/L/logo.svg`}} style={{height:50, width:50}}></Image>
        <Text>{props.awayTeam.teamName}</Text>
      </div>
    </View>
  );
};

const GameStatusText = (game : GameDTO) => {
  return (
  <div style={{display : 'flex', flexDirection : 'column', alignItems :'center', width : 80}}>
    { game.gameTime.gameStatus === GameStatus.Before ?
    <>
    <Text style={{fontSize : 20, fontWeight :'bold'}}>{ moment.utc(game.gameTime.gameTimeUTC).local().format('HH:mm')}</Text>
    <Text style={{fontSize : 12, fontWeight :'bold'}}>{ moment.utc(game.gameTime.gameTimeUTC).local().format('DD/MM')}</Text>
    </>
    :
    <>
    <Text style={{fontSize : 20, fontWeight :'bold', letterSpacing : -0.75}}>{`${game.homeTeam.score} : ${game.awayTeam.score}`}</Text>
    <Text style={{fontSize : 12, fontWeight :'bold', letterSpacing : -0.75}}>{game.gameTime.gameStatusText}</Text>
    </>
    }
  </div>)
}

const styles = StyleSheet.create({
  card: {
    alignItems :'center',
    justifyContent :'center',
    flexDirection : 'row',
    padding: 20,
    borderRadius: 10,
    gap : 5
  },
  row : {
    flexDirection : 'row',
    alignItems :'center',
    display :'flex',
    gap : 5
  }
});
export default Game;