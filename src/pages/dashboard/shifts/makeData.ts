export type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
  status: 'relationship' | 'complicated' | 'single';
  subRows?: Person[];
};

export function makeData() {
  return [
    {
      firstName: 'Lue',
      lastName: 'Schowalter',
      age: 10,
      visits: 917,
      progress: 8,
      status: 'single',
    },
    {
      firstName: 'Kira',
      lastName: 'Nitzsche',
      age: 36,
      visits: 947,
      progress: 90,
      status: 'single',
    },
    {
      firstName: 'Victoria',
      lastName: 'Langosh',
      age: 14,
      visits: 400,
      progress: 24,
      status: 'single',
    },
    {
      firstName: 'Summer',
      lastName: 'Beahan',
      age: 33,
      visits: 995,
      progress: 93,
      status: 'relationship',
    },
    {
      firstName: 'Rusty',
      lastName: 'Welch',
      age: 18,
      visits: 752,
      progress: 64,
      status: 'single',
    },
    {
      firstName: 'Maryjane',
      lastName: 'Pagac',
      age: 3,
      visits: 605,
      progress: 56,
      status: 'complicated',
    },
    {
      firstName: 'Pearline',
      lastName: 'Nicolas',
      age: 25,
      visits: 719,
      progress: 86,
      status: 'single',
    },
    {
      firstName: 'Sincere',
      lastName: 'King',
      age: 38,
      visits: 567,
      progress: 48,
      status: 'complicated',
    },
    {
      firstName: 'Tyson',
      lastName: 'Gleason',
      age: 30,
      visits: 230,
      progress: 10,
      status: 'single',
    },
    {
      firstName: 'Shany',
      lastName: 'Hayes',
      age: 18,
      visits: 613,
      progress: 18,
      status: 'single',
    },
    {
      firstName: 'Stephan',
      lastName: 'Cummerata',
      age: 12,
      visits: 71,
      progress: 90,
      status: 'relationship',
    },
    {
      firstName: 'Ebony',
      lastName: 'Bergstrom',
      age: 17,
      visits: 555,
      progress: 68,
      status: 'complicated',
    },
    {
      firstName: 'Kyler',
      lastName: 'Pfeffer-Effertz',
      age: 39,
      visits: 636,
      progress: 49,
      status: 'single',
    },
    {
      firstName: 'Rhiannon',
      lastName: 'Armstrong',
      age: 10,
      visits: 813,
      progress: 37,
      status: 'complicated',
    },
    {
      firstName: 'Shirley',
      lastName: 'Durgan',
      age: 30,
      visits: 778,
      progress: 37,
      status: 'single',
    },
    {
      firstName: 'Clemens',
      lastName: 'Nienow',
      age: 32,
      visits: 15,
      progress: 68,
      status: 'complicated',
    },
    {
      firstName: 'Kiarra',
      lastName: 'Cartwright',
      age: 36,
      visits: 157,
      progress: 56,
      status: 'relationship',
    },
    {
      firstName: 'Alexandro',
      lastName: 'Halvorson',
      age: 1,
      visits: 619,
      progress: 4,
      status: 'single',
    },
    {
      firstName: 'Jana',
      lastName: 'Stamm',
      age: 3,
      visits: 60,
      progress: 36,
      status: 'single',
    },
    {
      firstName: 'Milo',
      lastName: "D'Amore",
      age: 15,
      visits: 946,
      progress: 74,
      status: 'complicated',
    },
  ];
}
