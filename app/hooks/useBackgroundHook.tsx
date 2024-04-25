// import { useEffect } from 'react';
// import * as BackgroundFetch from 'expo-background-fetch';
// import * as TaskManager from 'expo-task-manager';
// import SSE from 'react-native-sse';

// const useBackGroundHook = () => {
//     const yourTask = async () => {
//         console.log('Background task started');
//         const eventSource = new SSE("http://localhost:3000/api/startedGamesNotifier");
//         eventSource.addEventListener('message', (res) => {
//             console.log(res.data);
//         });
//         // Keep the task running indefinitely
//         return BackgroundFetch.BackgroundFetchResult.NewData;
//     };

//     const configureBackgroundFetch = async () => {
//         await BackgroundFetch.registerTaskAsync('taskA', {
//             minimumInterval: 15,
//             startOnBoot: true,
//             stopOnTerminate: false
//         });
//     };

//     useEffect(() => {
//         TaskManager.defineTask('taskA', (body) => {
//             return yourTask();
//         });
//         configureBackgroundFetch();
//     }, []);
// };

// export default useBackGroundHook;
