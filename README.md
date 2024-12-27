<p align="center"><img src="assets\cLockbox.png" height="250" width="250"/></p>

# cLockbox - A clock with a lockbox. cLockbox

cLockbox is a unique take on the traditional clock. It combines the functionality of a clock with the security of a lockbox. This lockbox is able to store files, images/videos, and notes hosted directly within the user's browser (nothing is sent to a server!).


View a live demo here: [clock.0kb.org](https://clock.0kb.org/)

## Table of Contents

[Features](#features)

[Technologies Used](#technologies-used)

[Installation](#installation)

[Usage](#usage)

## Features

- **Clock Functionality:** Display the current time on both a digital and analog clock
- **Built-in Stopwatch:** Start, stop, lap, and reset a stopwatch with precise timing, down to the miliseconds.
- **Pomodoro Timer:** Work in focused 25-minute increments, with scheduled breaks and customizable intervals.
- **Lockbox Functionality:** Store files, images, and notes directly in the user's browser via IndexedDB
- **Secured Passwords:** Store passwords securely using the browser's local storage as a SHA256 hash.
- **100% Serverless:** Your data is stored locally on your browser, nothing is ever sent to a server.

## Technologies Used

- **React**: For building the user interface.
- **Tailwind CSS**: For styling and responsive design.
- **Babel**: For JavaScript transpilation.
- **IndexedDB**: For storing files, images, and notes locally.

## Installation

To run cLockbox locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/9-5/cLockbox.git
   cd cLockbox
   ```

2. Open `index.html` in your web browser.No additional setup is required, as the project is designed to run directly from the HTML file.

**You can optionally host the project on [GitHub Pages](https://pages.github.com/) as a static website.**

## Usage
1. Open `index.html` in your web browser.
2. Use the clock, timer or stopwatch as needed.
3. Access your lockbox by clicking on the Hour hand (thicker one) 5 times.
