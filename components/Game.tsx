import { GameDTO } from '@/app/models/GameModels';
import { Link, router, useNavigation } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Text, Image, Pressable } from 'react-native';

const Game = (props : GameDTO) => {

  return (
    <Pressable style={styles.card} onPress={() => router.push(`/addGame/${props.gameId}`)}>
      <View style={styles.row}>
        <Text>{props.homeTeam.teamName}</Text>
        <Image source={{uri : `https://cdn.nba.com/logos/nba/${props.homeTeam.teamId}/global/L/logo.svg`}} style={{height:50, width:50}}></Image>
      </View>
        <View style={{alignItems: 'center'}}>
        <View style={styles.row}>
        <Text>{props.homeTeam.score}</Text>
        <Text>:</Text>
        <Text>{props.awayTeam.score}</Text>
        </View>
        <Text>{props.gameTime.gameStatusText}</Text>
        </View>
        <View  style={styles.row}>
        <Image source={{uri : `https://cdn.nba.com/logos/nba/${props.awayTeam.teamId}/global/L/logo.svg`}} style={{height:50, width:50}}></Image>
        <Text>{props.awayTeam.teamName}</Text>
        </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems :'center',
    justifyContent :'center',
    flexDirection : 'row',
    backgroundColor: 'gray',
    padding: 20,
    borderRadius: 10,
    gap : 30
  },
  row : {
    flexDirection : 'row',
    alignItems :'center'
  }
});
export default Game;