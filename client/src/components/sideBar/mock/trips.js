const mocktrips = [
  {
    id: 1,
    tripName: 'My First Trip',
    destinationCity: 'Toronto',
    destinationLongitude: -79.347015,
    destinationLatitude: 43.6532,
    stagesPerDay: 5,
    budget: 1000,
    numberOfDays: 5,
    //     days: [
    //       {
    //         day: 'day1',
    //         stages: [
    //           '5172a61b-eb40-4029-97c1-b299838ba871',
    //           'e04a8085-5f8d-4deb-865d-aecdeb8d1fd3',
    //         ],

    //       },
    //     ],
  },
  {
    id: 2,
    tripName: 'Another Trip UWU',
    destinationCity: 'Etobicoke',
    destinationLongitude: -79.5132,
    destinationLatitude: 43.6205,
    stagesPerDay: 5,
    budget: 1000,
    numberOfDays: 5,
  },
  { id: 3, tripName: 'A Third Trip' },
]

const stage1 = {
  id: '5172a61b-eb40-4029-97c1-b299838ba871',
  stageName: 'breakfast',
  locationName: 'Cute Cafe',
  description: 'A favourite breakfast spot for gourmet foodies',
}

export default mocktrips
