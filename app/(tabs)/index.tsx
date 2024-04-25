import { FlatList, StyleSheet } from 'react-native';
import { Text, View, useThemeColor } from '@/components/Themed';
import Game from '@/components/Game';
import moment, { Moment } from 'moment-timezone';
import CalendarStrip from 'react-native-calendar-strip'
import { useCallback, useEffect, useState } from 'react';
import axios, {AxiosResponse} from 'axios';
import React from 'react';
import { GameDTO, GameStatus } from '../models/GameModels';
import { useAlarmStore } from '../store/alarmStore';
import { useShallow } from 'zustand/react/shallow';

type GamesPerDate = Record<string, GameDTO[]>

export default function TabOneScreen() {
  const [gamesPerDate, setGamesPerDate] = useState<GamesPerDate>({})
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(moment.tz('America/New_York').format('YYYY-MM-DD')));
  const primary = useThemeColor({}, 'primary');
  const secondary = useThemeColor({}, 'secondary');
  const text = useThemeColor({}, 'text');
  const background = useThemeColor({}, 'background');
  const accent = useThemeColor({}, 'accent');
  const alarms = useAlarmStore(useShallow((state) => state.alarms));
  console.log(new Date(moment.tz('America/New_York').format('YYYY-MM-DD')))
    const fetchGames = async (startDate : string, endDate : string) => {
      const response : AxiosResponse<GameDTO[]> = await axios.get(`http://192.168.16.55:3000/api/games?startDate=${startDate}&endDate=${endDate}`);
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

  const gameStatusToColor : Record<GameStatus, string> = {
    1 : 'yellow',
    "2" : 'green',
    "3" : 'gray'
  }

  const markedDatesFunc = (date : Moment) => {
    const alarmsIds = alarms.map(alarm => alarm.gameId);
    const currDayGames = gamesPerDate[moment(date).format('YYYY-MM-DD')];
      return {
        dots:  currDayGames?.filter(game => alarmsIds.includes(game.gameId)).map(game => ({color : gameStatusToColor[game.gameTime.gameStatus]})),
        lines: date.format('YYYY-MM-DD') === moment(selectedDate).format('YYYY-MM-DD') ? { color : 'blue'} : {}
      }
  }

  return (
    <View style={styles.container}>
      <CalendarStrip
       style={{height:100, paddingTop: 10, marginBottom:10, width:'100%'}}
       calendarAnimation={{type: 'sequence', duration: 30}}
     //  daySelectionAnimation={{type: 'background', duration: 200, highlightColor : 'red'}}
       calendarHeaderStyle={{color: text}}
       calendarColor={primary}
       selectedDate={selectedDate}
       dateNumberStyle={{color: text}}
       dateNameStyle={{color: text}}
       markedDates={markedDatesFunc}
      //  minDate={moment(selectedDate).days(-2)}
      //  maxDate={moment(selectedDate).days(2)}
       onWeekChanged={async (firstDayInWeek) => {
        await fetchGames(firstDayInWeek.format('YYYY-MM-DD'), firstDayInWeek.endOf('isoWeek').format('YYYY-MM-DD'))
      }}
       onDateSelected={(newDate) => setSelectedDate(newDate.toDate())}
       highlightDateNumberStyle={{}}
       highlightDateNameStyle={{color: background}}
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
       contentContainerStyle={{ gap: 20}}
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
    justifyContent: 'center'
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
