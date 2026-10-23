# clothingPlace

## Project Description

clothingPlace is a React Native mobile application built with Expo. The project is intended to provide a mobile clothing experience and is currently in the skeleton stage.

## Installation Instructions

Install Git, Node.js LTS, and Expo Go on an iOS or Android phone. Clone the repository and switch to the `skeleton` branch:

```bash
git clone <repository-url>
cd clothingPlace
git switch skeleton
cd mobile
```

Install the project dependencies:

```bash
npm install
```

## Build Instructions

The project currently runs through Expo Go and does not require a separate native build. To create an exported production bundle, run:

```bash
npx expo export
```

## Run Instructions

Start the Expo development server from the `mobile` directory:

```bash
npx expo start
```

Scan the QR code shown in the terminal with Expo Go. The phone and computer should be connected to the same Wi-Fi network.

If the phone cannot connect directly, start Expo with a tunnel:

```bash
npx expo start --tunnel
```

These instructions will be updated as the project gains additional features and build requirements.