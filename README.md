<p align="center"><img src="assets\cLockbox.png" height="250" width="250"/></p>

# cLockbox - A clock with a lockbox. cLockbox.

cLockbox is a unique take on the traditional clock. It combines the functionality of a clock with the security of a lockbox. This lockbox is able to store files, images/videos, and notes hosted directly within the user's browser (nothing is sent to a server!).


Instances: [clock.0kb.org](https://clock.0kb.org) | [clock.ż.co](https://clock.ż.co/)

## Table of Contents

[Screenshots](#screenshots)

[Features](#features)

[Technologies Used](#technologies-used)

[Installation](#installation)

[Usage](#usage)

## Screenshots
<div align="center">
<img src="https://github.com/user-attachments/assets/db55881f-8c6a-42bd-a930-5ca1ebf54e1b" width="23%"></img><img src="https://github.com/user-attachments/assets/a1b2c8c4-91e0-4ea1-8cdf-58f360343df3" width="23%"></img><img src="https://github.com/user-attachments/assets/d3f8ed05-39e8-4627-8005-2e200a4f4fcb" width="23%"></img><img src="https://github.com/user-attachments/assets/70858431-b895-461b-81f7-6fce69ae8377" width="23%"></img><img src="https://github.com/user-attachments/assets/6140b70a-deb2-439e-be0a-4d5ebf1b3629" width="23%"></img><img src="https://github.com/user-attachments/assets/c0c2e048-c422-42fb-9e0a-77dae429d5cf" width="23%"></img><img src="https://github.com/user-attachments/assets/3c7b51ea-2fb8-4b64-bab7-89b24798af41" width="23%"></img><img src="https://github.com/user-attachments/assets/d68a0c4a-2e2f-4241-bf27-4725077e7db8" width="23%"></img>
</div>

## Features

- **Alarm:** Set an alarm for a specific time and date. The alarm will sound when the time is up.
- **Clock Functionality:** Display the current time on both a digital and analog clock
- **Built-in Stopwatch:** Start, stop, lap, and reset a stopwatch with precise timing, down to the miliseconds.
- **Timer:** Set a timer for a specific amount of time, with options to repeat or reset. A chime will sound when the timer goes off.
- **Lockbox Functionality:** Store files, images, and notes directly in the user's browser via IndexedDB
- **Secured Passwords:** Store passwords securely using the browser's local storage as a SHA256 hash.
- **Secure Storage:** The lockbox is entirely encrypted, allowing for reasonably secure storage of your data.
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
