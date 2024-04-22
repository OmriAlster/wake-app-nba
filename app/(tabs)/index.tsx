import { FlatList, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import Game from '@/components/Game';
import moment from 'moment';
import CalendarStrip from 'react-native-calendar-strip'
import { useEffect, useState } from 'react';
import axios, {AxiosResponse} from 'axios';
import React from 'react';
import { GameDTO } from '../models/GameModels';

type GamesPerDate = Record<string, GameDTO[]>

export default function TabOneScreen() {
  const [gamesPerDate, setGamesPerDate] = useState<GamesPerDate>({})
  const [selectedDate, setSelectedDate] = useState<Date>(moment().toDate());

    const fetchGames = async (startDate : string, endDate : string) => {
      const response : AxiosResponse<GameDTO[]> = await axios.get(`http://localhost:3000/api/games?startDate=${startDate}&endDate=${endDate}`);
      setGamesPerDate(gamesByDate(response.data))
    }

  const gamesByDate = (gamesList : GameDTO[]) => {
		return gamesList.reduce((acc : GamesPerDate,game: GameDTO) => {
      const gameDate = game.gameTime.gameDate;
			if (!acc[gameDate]) {
				acc[gameDate] = [];
			}
			acc[gameDate].push(game);
      return acc;
		},{} as GamesPerDate);
  }

  return (
    <View style={styles.container}>
      <CalendarStrip
       style={{height:100, paddingTop: 10, marginBottom:10, width:'100%'}}
       calendarAnimation={{type: 'sequence', duration: 30}}
     //  daySelectionAnimation={{type: 'background', duration: 200, highlightColor : 'red'}}
       calendarHeaderStyle={{color: 'white'}}
       calendarColor={'#8e7254'}
       selectedDate={selectedDate}
       dateNumberStyle={{color: 'white'}}
       dateNameStyle={{color: 'white'}}
       onWeekChanged={async (firstDayInWeek) => {await fetchGames(firstDayInWeek.format('YYYY-MM-DD'), firstDayInWeek.endOf('isoWeek').format('YYYY-MM-DD'))}}
       onDateSelected={(newDate) => setSelectedDate(newDate.toDate())}
       highlightDateNumberStyle={{color: 'orange'}}
       highlightDateNameStyle={{color: 'orange'}}
       useNativeDriver
       iconContainer={{flex: 0.1}}
       
    />
      {/* <CalendarProvider
      date={'2024-04-16'}
      onDateChanged={setSelectedDate} >
    <WeekCalendar
    firstDay={6}
      /> */}
       <FlatList
       style={{width:'90%'}}
       contentContainerStyle={{ gap: 5}}
      data={selectedDate ? gamesPerDate[moment(selectedDate).format('YYYY-MM-DD')] : []}
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
