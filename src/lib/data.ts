
import { Hall, Machine } from "@/types";

export const mockHalls: Hall[] = [
  {
    id: "a1",
    name: "Hall A1",
    isStarred: false,
    machines: [
      {
        id: "a1-w",
        name: "Washer",
        type: "washer",
        status: "available",
        hallId: "a1",
      },
      {
        id: "a1-d",
        name: "Dryer",
        type: "dryer",
        status: "done",
        timeRemaining: 1,
        hallId: "a1",
      },
    ],
  },
  {
    id: "e1",
    name: "Hall E1",
    isStarred: true,
    machines: [
      {
        id: "e1-w",
        name: "W",
        type: "washer",
        status: "available",
        hallId: "e1",
      },
      {
        id: "e1-d",
        name: "D",
        type: "dryer",
        status: "running",
        timeRemaining: 35,
        hallId: "e1",
      },
    ],
  },
  {
    id: "c1",
    name: "Hall C1",
    isStarred: true,
    machines: [
      {
        id: "c1-w",
        name: "W",
        type: "washer",
        status: "available",
        hallId: "c1",
      },
      {
        id: "c1-d",
        name: "D",
        type: "dryer",
        status: "available",
        hallId: "c1",
      },
    ],
  },
  {
    id: "b2",
    name: "Hall B2",
    isStarred: false,
    machines: [
      {
        id: "b2-w",
        name: "W",
        type: "washer",
        status: "running",
        timeRemaining: 3,
        hallId: "b2",
      },
      {
        id: "b2-d",
        name: "D",
        type: "dryer",
        status: "available",
        hallId: "b2",
      },
    ],
  },
  {
    id: "b1",
    name: "Hall B1",
    isStarred: false,
    machines: [
      {
        id: "b1-w",
        name: "W",
        type: "washer",
        status: "running",
        timeRemaining: 23,
        hallId: "b1",
      },
      {
        id: "b1-d",
        name: "D",
        type: "dryer",
        status: "done",
        timeRemaining: 14,
        hallId: "b1",
      },
    ],
  },
  {
    id: "d1",
    name: "Hall D1",
    isStarred: false,
    machines: [
      {
        id: "d1-w",
        name: "W",
        type: "washer",
        status: "running",
        timeRemaining: 18,
        hallId: "d1",
      },
      {
        id: "d1-d",
        name: "D",
        type: "dryer",
        status: "running",
        timeRemaining: 42,
        hallId: "d1",
      },
    ],
  },
];
