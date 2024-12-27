export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: "admin" | "player";
}

export interface AdminUser extends User {
  role: "admin";
  arcades: number[];
}

export const usersDatabase: (User | AdminUser)[] = [
  {
    id: 1,
    username: "patrocinio",
    email: "patrocinioluisf@gmail.com",
    password: "123456",
    role: "admin",
    arcades: [44],
  },
  {
    id: 2,
    username: "joaquim",
    email: "joaquim@gmail.com",
    password: "123456",
    role: "player",
  },
  {
    id: 3,
    username: "maria",
    email: "maria@gmail.com",
    password: "123456",
    role: "player",
  },
  {
    id: 4,
    username: "carlos",
    email: "carlos@gmail.com",
    password: "123456",
    role: "admin",
    arcades: [55, 66],
  },
  {
    id: 5,
    username: "ana",
    email: "ana@gmail.com",
    password: "123456",
    role: "player",
  },
];
