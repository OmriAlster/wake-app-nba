import {create} from 'zustand';
import {persist} from 'zustand/middleware'

type AlarmStore = {
  alarms: AlarmSettingsProps[];
  addAlarm: (newAlarm: AlarmSettingsProps) => void;
  deleteAlarm : (gameIdToDelete : number) => void;
};

export interface AlarmTimeProps {
    period : number,
    leftTimeInPeriod : number
  }
  
export interface AlarmSettingsProps {
    time : AlarmTimeProps,
    diff? : number,
    gameId : number
  }

export const useAlarmStore = create(persist<AlarmStore>(
    (set, get) => ({
        alarms : [],
        addAlarm: (newAlarm) => {
          const { alarms } = get();
          const index = alarms.findIndex((alarm) => alarm.gameId === newAlarm.gameId);
        
          if (index !== -1) {
            const updatedAlarms = [...alarms];
            updatedAlarms[index] = newAlarm;
            set({ alarms: updatedAlarms });
          } else {
            set({ alarms: [...alarms, newAlarm] });
          }
        },
        deleteAlarm: (gameIdToDelete : number) => {
          const { alarms } = get();
          const updatedAlarms = alarms.filter((alarm) => alarm.gameId !== gameIdToDelete);
          set({ alarms: updatedAlarms });
        }
    }),
    { name : 'alarms-storage'}
));
