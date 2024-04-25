import { FlatList, StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import Game from '@/components/Game';
import { useAlarmStore } from '../store/alarmStore';
import { useShallow } from 'zustand/react/shallow'
import { useEffect, useState } from 'react';
import { GameDTO } from '../models/GameModels';
import axios, { AxiosResponse } from 'axios';

export default function TabTwoScreen() {
  const alarms = useAlarmStore(useShallow((state) => state.alarms));
  const [games, setGames] = useState<GameDTO[]>([]);

  useEffect(() => {
    const updateGames = async () => {
      const games = await Promise.all(alarms.map(async (alarm) => 
      await fetchGameById(alarm.gameId)
    ));
    setGames(games.sort((a,b) => new Date(a.gameTime.gameTimeUTC).getTime() - new Date(b.gameTime.gameTimeUTC).getTime()))
  }

    updateGames();
  }, [alarms])

  const fetchGameById = async (gameId : number) : Promise<GameDTO> => {
    const response : AxiosResponse<GameDTO> = await axios.get(`http://192.168.16.55:3000/api/games/${gameId}`);
    return response.data;
  }

  return (
    <View style={styles.container}>
    <FlatList
       style={{width:'90%', marginTop : 15}}
       contentContainerStyle={{ gap: 20}}
        data={games}
       renderItem={props => 
        <Game {...props.item}/>}
    />
    </View>
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
