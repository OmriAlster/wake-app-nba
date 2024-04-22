import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Platform, StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { GameDTO } from '../models/GameModels';

export interface ModalProps {
  game : GameDTO
}

export default function ModalScreen() {
  const {gameId} = useLocalSearchParams<{gameId : string}>();
  const [game, setGame] = useState<GameDTO>();
  const navigation = useNavigation()

  const fetchGameById = async () => {
    const response : AxiosResponse<GameDTO> = await axios.get(`http://localhost:3000/api/games/${gameId}`);
    setGame(response.data)
  }

  useEffect(() => {
    navigation.setOptions({
      title : game?.awayTeam.teamName
    })
  }, [game])

  useEffect(() => {
    fetchGameById();
  },[gameId])

  return ( game ?
    <View style={styles.container}>
     <Text>{game.homeTeam.teamName}</Text>
    </View> :
      <ActivityIndicator size="large" color="#0000ff" />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
});
