import { Question } from '../types/quiz';

export const mockQuestions: Record<string, Question[]> = {
  '1': [ // Fun with Numbers
    {
      id: '1',
      quizId: '1',
      text: 'What comes after the number 9?',
      options: ['8', '10', '11', '7'],
      correctOption: 1,
      explanation: 'After 9 comes 10! Numbers keep getting bigger by one each time.',
    },
    {
      id: '2',
      quizId: '1',
      text: 'If you have 5 apples and get 3 more, how many apples do you have?',
      options: ['7', '8', '6', '9'],
      correctOption: 1,
      explanation: '5 apples plus 3 more apples equals 8 apples! 5 + 3 = 8',
    },
    {
      id: '3',
      quizId: '1',
      text: 'Which number is bigger: 15 or 51?',
      options: ['15', '51', 'They are the same', 'Neither'],
      correctOption: 1,
      explanation: '51 is bigger than 15. When we write numbers, the position of each digit matters!',
    },
  ],
  '2': [ // Animal Kingdom
    {
      id: '1',
      quizId: '2',
      text: 'Which animal is known as the King of the Jungle?',
      options: ['Tiger', 'Lion', 'Elephant', 'Giraffe'],
      correctOption: 1,
      explanation: 'Lions are often called the King of the Jungle because they are very strong and brave!',
    },
    {
      id: '2',
      quizId: '2',
      text: 'What do pandas love to eat the most?',
      options: ['Bamboo', 'Pizza', 'Ice Cream', 'Carrots'],
      correctOption: 0,
      explanation: 'Pandas love to eat bamboo! They can eat up to 40 pounds (18 kg) of bamboo every day.',
    },
    {
      id: '3',
      quizId: '2',
      text: 'Which animal has a very long neck?',
      options: ['Zebra', 'Monkey', 'Giraffe', 'Penguin'],
      correctOption: 2,
      explanation: 'Giraffes have very long necks that help them reach leaves high up in trees!',
    },
  ],
  '3': [ // Space Adventure
    {
      id: '1',
      quizId: '3',
      text: 'What is the closest star to Earth?',
      options: ['Moon', 'Sun', 'Mars', 'Venus'],
      correctOption: 1,
      explanation: 'The Sun is our closest star! It gives us light and heat every day.',
    },
    {
      id: '2',
      quizId: '3',
      text: 'Which planet is known as the Red Planet?',
      options: ['Jupiter', 'Mars', 'Saturn', 'Earth'],
      correctOption: 1,
      explanation: 'Mars is called the Red Planet because it looks red from Earth!',
    },
  ],
  '4': [ // English Word Fun
    {
      id: '1',
      quizId: '4',
      text: 'Which word means the opposite of "big"?',
      options: ['Huge', 'Small', 'Giant', 'Tall'],
      correctOption: 1,
      explanation: 'Small is the opposite of big! These words are called antonyms.',
    },
    {
      id: '2',
      quizId: '4',
      text: 'What animal says "meow"?',
      options: ['Dog', 'Cat', 'Bird', 'Fish'],
      correctOption: 1,
      explanation: 'Cats say "meow"! Each animal makes its own special sound.',
    },
  ],
};
