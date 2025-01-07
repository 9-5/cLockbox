const { useState, useEffect } = React;
const alarmSound = new Audio('assets/audio/alarm.mp3');
const timerSound = new Audio('assets/audio/timer.mp3');

function App() {
    const [mediaElements, setMediaElements] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [setPasswordModalVisibleState, setSetPasswordModalVisibleState] = useState(false);
    const [password, setPassword] = useState('');
    const [setPasswordState, setSetPasswordState] = useState('');
    const [galleryVisible, setGalleryVisible] = useState(true);
    const [filesVisible, setFilesVisible] = useState(false);
    const [db, setDb] = useState(null);
    const [toastVisible, setToastVisible] = useState(false);
    const [nonMediaElements, setNonMediaElements] = useState([]);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [alarmTime, setAlarmTime] = useState('');
    const [isAlarmActive, setIsAlarmActive] = useState(false);
    const [timer, setTimer] = useState(1500);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [stopwatch, setStopwatch] = useState(0);
    const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
    const [laps, setLaps] = useState([]);
    const [activeTab, setActiveTab] = useState('clock');
    const [isAnalogClockEnabled, setIsAnalogClockEnabled] = useState(() => {return localStorage.getItem('clkEnabled') === 'true';});
    const themes = [{ name: 'Ocean', className: '' }, { name: 'Sky', className: 'sky' }, { name: 'Forest', className: 'forest' }, { name: 'Bamboo', className: 'bamboo' }, { name: 'Crimson', className: 'crimson' }, { name: 'Blush', className: 'blush' }, { name: 'Petal', className: 'petal' }, { name: 'Lotus', className: 'lotus' }, { name: 'Amethyst', className: 'amethyst' }];
    const [currentTheme, setCurrentTheme] = useState(() => {return localStorage.getItem('theme') || 'Ocean';});
    const [trackHourClicks, setTrackedHourClicks] = useState(0);
    const [trackMinuteClicks, setTrackedMinuteClicks] = useState(0);
    const [showLockbox, setShowLockbox] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showAbout, setShowAbout] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [exportData, setExportData] = useState([]);
    const [importFile, setImportFile] = useState(null);
    const [notesVisible, setNotesVisible] = useState(false);
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState({ content: '' });
    const [editNote, setEditNote] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [enableServiceWorker, setEnableServiceWorker] = useState(() => {
        const savedPreference = localStorage.getItem('offlineMode');
        return savedPreference !== null ? savedPreference === 'true' : false;
    });

    useEffect(() => {
        if (enableServiceWorker && 'serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log(`ServiceWorker registration successful with scope: ${registration.scope}`);
                })
                .catch(err => {
                    console.log(`ServiceWorker registration failed: ${err}`);
                });
        }
    }, [enableServiceWorker]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 100);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isAlarmActive && alarmTime) {
            const interval = setInterval(() => {
                const now = new Date();
                const [alarmHours, alarmMinutes] = alarmTime.split(':');
                if (now.getHours() === parseInt(alarmHours) && now.getMinutes() === parseInt(alarmMinutes)) {
                    alarmSound.play();
                    setIsAlarmActive(false);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isAlarmActive, alarmTime]);

    useEffect(() => {
        let timerInterval;
        if (isTimerRunning) {
            timerInterval = setInterval(() => {
                setTimer((prev) => {
                    if (prev > 0) {
                        return prev - 1;
                    } else {
                        timerSound.play();
                        setIsTimerRunning(false);
                        return 0;
                    }
                });
            }, 1000);
        }
        return () => clearInterval(timerInterval);
    }, [isTimerRunning]);

    useEffect(() => {
        let stopwatchInterval;
        if (isStopwatchRunning) {
            stopwatchInterval = setInterval(() => {
                setStopwatch(prev => prev + 10);
            }, 10);
        }
        return () => clearInterval(stopwatchInterval);
    }, [isStopwatchRunning]);

    useEffect(() => {
        localStorage.setItem('clkEnabled', isAnalogClockEnabled);
        localStorage.setItem('theme', currentTheme);
        localStorage.setItem('offlineMode', enableServiceWorker);
    }, [isAnalogClockEnabled, currentTheme, enableServiceWorker]);

    useEffect(() => {
        document.body.className = currentTheme === 'Ocean' ? '' : currentTheme.toLowerCase();
        localStorage.setItem('theme', currentTheme);
    }, [currentTheme]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const handleSetAlarm = () => {
        if (alarmTime) {
            setIsAlarmActive(true);
        }
    };
    
    const handleCancelAlarm = () => {
        setIsAlarmActive(false);
    };

    const formatStopwatch = (time) => {
        const milliseconds = time % 1000;
        const seconds = Math.floor(time / 1000) % 60;
        const minutes = Math.floor(time / 60000);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`;
    };

    const handleLap = () => {
        setLaps([...laps, stopwatch]);
    };

    const getClockHandsStyle = () => {
        const timeNow = new Date();
        let seconds = timeNow.getSeconds();
        let minutes = timeNow.getMinutes();
        let hours = timeNow.getHours();
        
        hours = hours % 12;
        
        const referenceHours = 9;
        const referenceMinutes = 45;
        const referenceSeconds = 45;

        const secondsAngle = ((seconds * 6) - (referenceSeconds * 6)) % 360;
        const minutesAngle = ((minutes * 6) + (seconds/10) - (referenceMinutes * 6)) % 360;
        const hoursAngle = ((hours * 30) + (minutes/2) + (seconds/120) - (referenceHours * 30)) % 360;
    
        return {
            secondHand: { transform: `rotate(${secondsAngle}deg)` },
            minuteHand: { transform: `rotate(${minutesAngle}deg)` },
            hourHand: { transform: `rotate(${hoursAngle}deg)` }
        };
    };

    const { secondHand, minuteHand, hourHand } = getClockHandsStyle();

    const handleHourHandClick = () => {
        setTrackedHourClicks(prev => {
            const newCount = prev + 1;
            if (newCount === 5) {
                setShowLockbox(true);
                setTrackedHourClicks(0);
            }
            return newCount;
        });
    };
    
    const handleMinuteHandClick = () => {
        setTrackedMinuteClicks(prev => {
            const newCount = prev + 1;
            if (newCount === 5) {
                setShowAbout(true);
                setTrackedMinuteClicks(0);
            }
            return newCount;
        });
    };
    
    const renderClock = () => {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="mb-8">
                {isAnalogClockEnabled && (
                    <div className="clock">
                        <div className="hand hour" style={hourHand} onClick={() => handleHourHandClick()}></div>
                        <div className="hand minute" style={minuteHand} onClick={() => handleMinuteHandClick()}></div>
                        <div className="hand second" style={secondHand}></div>
                    </div>
                )}
            </div>
            <div className="text-center">
                {activeTab === 'alarm' && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold">Alarm</h2>
                        <div className="flex items-center justify-center mb-4">
                            <input
                                type="time"
                                value={alarmTime}
                                onChange={(e) => setAlarmTime(e.target.value)}
                                className="w-30 p-2 bg-gray-700 text-white rounded mr-2"
                            />
                        </div>
                        <div>
                            <button
                                className="bg-transparent hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={handleSetAlarm}
                            >
                                <i class="fas fa-plus"></i>
                            </button>
                            <button
                                className="bg-transparent hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                onClick={handleCancelAlarm}
                            >
                                <i class="fas fa-ban"></i>
                            </button>
                        </div>
                        {isAlarmActive && (
                            <p className="text-xl">Alarm set for {alarmTime}</p>
                        )}
                    </div>
                )}
                {activeTab === 'clock' && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold">Current Time</h2>
                        <p className="text-xl">{currentTime.toLocaleTimeString()}</p>
                    </div>
                )}
                {activeTab === 'timer' && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold">Timer</h2>
                        <div className="flex items-center justify-center mb-4">
                            <input
                                type="number"
                                value={Math.floor(timer / 60)}
                                onChange={(e) => setTimer(parseInt(e.target.value) * 60)}
                                className="w-20 p-2 bg-gray-700 text-white rounded mr-2"
                                placeholder="Minutes"
                            />
                            <button
                                className="bg-transparent hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => setTimer(timer)}
                            >
                                <i class="fas fa-hourglass-half"></i>
                            </button>
                        </div>
                        <p className="text-xl">{formatTime(timer)}</p>
                        <button className="bg-transparent hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={() => setIsTimerRunning(!isTimerRunning)}>
                            {isTimerRunning ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>}
                        </button>
                        <button className="bg-transparent hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => { setTimer(timer); setIsTimerRunning(false); }}>
                            <i className="fas fa-redo"></i>
                        </button>
                    </div>
                )}
                {activeTab === 'stopwatch' && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold">Stopwatch</h2>
                        <p className="text-xl">{formatStopwatch(stopwatch)}</p>
                        <button className="bg-transparent hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={() => setIsStopwatchRunning(!isStopwatchRunning)}>
                            {isStopwatchRunning ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>}
                        </button>
                        <button className="bg-transparent hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={handleLap}>
                            <i className="fas fa-stopwatch"></i>
                        </button>
                        <button className="bg-transparent hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => { setStopwatch(0); setIsStopwatchRunning(false); setLaps([]); }}>
                            <i className="fas fa-redo"></i>
                        </button>
                        <div className="mt-4">
                            <h3 className="text-xl font-semibold">Laps</h3>
                            <ul>
                                {laps.map((lap, index) => (
                                    <li key={index} className="text-lg">{`Lap ${index + 1}: ${formatStopwatch(lap)}`}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                {activeTab === 'settings' && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold">Settings</h2>
                        <div className="mt-4">
                            <div className="flex">
                                <label className="mr-2 mt-4">Theme</label>
                                <select 
                                    className="mt-2 w-full p-2 bg-gray-700 text-white rounded" 
                                    style={{ 'text-align': 'center' }}
                                    value={currentTheme} 
                                    onChange={(e) => setCurrentTheme(e.target.value)}
                                >
                                    {themes.map((theme, index) => (
                                        <option key={index} value={theme.name}>
                                            {theme.name}
                                        </option>
                                    ))}
                                </select>
                                
                            </div>
                            <div className="flex items-center">
                                <label className="mr-2">Enable Analog Clock</label>
                                <input type="checkbox" checked={isAnalogClockEnabled} onChange={() => setIsAnalogClockEnabled(!isAnalogClockEnabled)} />
                            </div>
                            <div className="flex items-center">
                                <button className="bg-red-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={() => {resetToDefaults();}}>Reset to Defaults</button>
                            </div>
                            <div className="flex items-center">
                            <label>
                                    Enable Offline Mode
                                    <input
                                        type="checkbox"
                                        checked={enableServiceWorker}
                                        onChange={(e) => setEnableServiceWorker(e.target.checked)}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                )}
                <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center"> 
                    <button className={`bg-transparent font-bold py-2 px-4 rounded ${activeTab === 'alarm' ? 'text-blue-500' : 'text-white'}`} onClick={() => setActiveTab('alarm')}>
                        <i class="fas fa-bed"></i>
                    </button>
                    <button className={`bg-transparent font-bold py-2 px-4 rounded ${activeTab === 'timer' ? 'text-blue-500' : 'text-white'}`} onClick={() => setActiveTab('timer')}>
                        <i className="fas fa-hourglass-start"></i>
                    </button>
                    <button className={`bg-transparent font-bold py-2 px-4 rounded ${activeTab === 'clock' ? 'text-blue-500' : 'text-white'}`} onClick={() => setActiveTab('clock')}>
                        <i className="fas fa-clock"></i>
                    </button>
                    <button className={`bg-transparent font-bold py-2 px-4 rounded ${activeTab === 'stopwatch' ? 'text-blue-500' : 'text-white'}`} onClick={() => setActiveTab('stopwatch')}>
                        <i className="fas fa-stopwatch"></i>
                    </button>
                    <button className={`bg-transparent font-bold py-2 px-4 rounded ${activeTab === 'settings' ? 'text-blue-500' : 'text-white'}`} onClick={() => setActiveTab('settings')}>
                        <i className="fas fa-cog"></i>
                    </button>
                </div>
            </div>
        </div>
        );
    }

    const showToast = () => {
        setToastVisible(true);
        setTimeout(() => {
            setToastVisible(false);
        }, 3000);
    };

    useEffect(() => {
        if (!localStorage.getItem('clockSessionID')) {
            setSetPasswordModalVisibleState(true);
        } else {
            setPasswordModalVisible(true);
        }
    }, []);

    useEffect(() => {
        if (db) {
            loadMedia();
            loadNonMedia();
            loadNotes();
        }
    }, [db]);

    const hashPassword = async (password) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    };
    
    const initializeDB = () => {
        const request = indexedDB.open('clockData', 2);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('clockSettings')) {
                db.createObjectStore('clockSettings', { keyPath: 'id', autoIncrement: true });
            }
            if (!db.objectStoreNames.contains('timeZoneData')) {
                db.createObjectStore('timeZoneData', { keyPath: 'id', autoIncrement: true });
            }
            if (!db.objectStoreNames.contains('clockData')) {
                db.createObjectStore('clockData', { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            setDb(event.target.result);
        };

        request.onerror = (event) => {
            console.error('Database error:', event.target.errorCode);
        };
    };

    const exportDatabase = () => {
        const mediaTransaction = db.transaction('clockSettings', 'readonly');
        const mediaStore = mediaTransaction.objectStore('clockSettings');
        const mediaRequest = mediaStore.getAll();
    
        mediaRequest.onsuccess = (event) => {
            const mediaItems = event.target.result;
    

            const nonMediaTransaction = db.transaction('timeZoneData', 'readonly');
            const nonMediaStore = nonMediaTransaction.objectStore('timeZoneData');
            const nonMediaRequest = nonMediaStore.getAll();

            nonMediaRequest.onsuccess = (event) => {
                const nonMediaItems = event.target.result;

                const dataToExport = { media: mediaItems, nonMedia: nonMediaItems };
                setExportData(dataToExport);

                const blob = new Blob([JSON.stringify(dataToExport)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'clockConfig.clk';
                a.click();
                URL.revokeObjectURL(url);
            };
        };
    };

    const handleInputFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const importedData = JSON.parse(e.target.result);
                importDatabase(importedData);
            };
            reader.readAsText(file);
        }
    };

    const importDatabase = (importedData) => {
        const mediaTransaction = db.transaction('clockSettings', 'readwrite');
        const mediaStore = mediaTransaction.objectStore('clockSettings');
        importedData.media.forEach(media => {
            mediaStore.add(media);
        });
        
        const nonMediaTransaction = db.transaction('timeZoneData', 'readwrite');
        const nonMediaStore = nonMediaTransaction.objectStore('timeZoneData');
        importedData.nonMedia.forEach(nonMedia => {
            nonMediaStore.add(nonMedia);
        });

        loadMedia();
        loadNonMedia();
        loadNotes();
    };

    const resetToDefaults = () => {
        indexedDB.deleteDatabase('clockData');
        localStorage.clear('clockSessionID');
        caches.delete('cLockCache');
        setIsAnalogClockEnabled(true);
        setCurrentTheme('Ocean');
    };

    const loadMedia = async () => {
        setIsLoading(true);
        const transaction = db.transaction('clockSettings', 'readonly');
        const objectStore = transaction.objectStore('clockSettings');
        const request = objectStore.getAll();
    
        request.onsuccess = async (event) => {
            const mediaItems = event.target.result;
            const decryptedMediaItems = await Promise.all(mediaItems.map(async (media) => {
                const decryptedUrl = await decryptData(media.data, media.iv, password);
                return { id: media.id, url: decryptedUrl, type: media.type };
            }));
            setMediaElements(decryptedMediaItems);
            setIsLoading(false);
        };
    };
    const LoadingPopup = () => {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-white">Loading...</h2>
                    <p className="text-gray-400">Decrypting database...</p>
                </div>
            </div>
        );
    };

    const loadNonMedia = async () => {
        setIsLoading(true);
        const transaction = db.transaction('timeZoneData', 'readonly');
        const objectStore = transaction.objectStore('timeZoneData');
        const request = objectStore.getAll();
        request.onsuccess = async (event) => {
            const nonMediaItems = event.target.result;
            const decryptedNonMediaItems = await Promise.all(nonMediaItems.map(async (media) => {
                const decryptedUrl = await decryptData(media.data, media.iv);
                return { id: media.id, url: decryptedUrl, type: media.type, name: media.name, size: media.size };
            }));
            setNonMediaElements(decryptedNonMediaItems);
            setIsLoading(false);
        };
        request.onerror = (event) => {
            console.error(`Error loading non-media: ${event.target.errorCode}`);
        }
    };

    const encryptData = async (data) => {
        const salt = localStorage.getItem('clockSessionID');
        const encoder = new TextEncoder();
        const keyMaterial = await window.crypto.subtle.importKey('raw', encoder.encode(salt), 'PBKDF2', false, ['deriveKey']);
        const key = await window.crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: encoder.encode(salt),
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt']
        );
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encryptedData = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            encoder.encode(data)
        );
        return { iv: Array.from(iv), data: Array.from(new Uint8Array(encryptedData)) };
    };

    const decryptData = async (encryptedData, iv) => {
        const salt = localStorage.getItem('clockSessionID');
        const encoder = new TextEncoder();
        const keyMaterial = await window.crypto.subtle.importKey('raw', encoder.encode(salt), 'PBKDF2', false, ['deriveKey']);
        const key = await window.crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: encoder.encode(salt),
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['decrypt']
        );
        const decryptedData = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: new Uint8Array(iv) },
            key,
            new Uint8Array(encryptedData)
        );
        return new TextDecoder().decode(decryptedData);
    };

    const handleFileUpload = async (event) => {
        const files = event.target.files;
    
        Array.from(files).forEach(async file => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const url = e.target.result;
                const encryptedURL = await encryptData(url);
                if (file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.endsWith('gif')) {
                    const mediaElement = { url, type: file.type };
                    setMediaElements(prev => [...prev, mediaElement]);
                    saveMediaToDB(encryptedURL, file.type);
                    showToast();
                } else {
                    const nonMediaElement = { iv: encryptedURL.iv, data: encryptedURL.data, name: file.name, size: file.size, type: file.type };
                    setNonMediaElements(prev => [...prev, nonMediaElement]);
                    saveFileToDB(nonMediaElement);
                    showToast();
                }
            };
            reader.onerror = (error) => {
                console.error('Error reading file:', error);
            };
            reader.readAsDataURL(file);
        });
    };

    const saveFileToDB = (file) => {
        const transaction = db.transaction('timeZoneData', 'readwrite');
        const objectStore = transaction.objectStore('timeZoneData');
        objectStore.add({
            iv: file.iv,
            data: file.data,
            name: file.name, 
            size: file.size, 
            type: file.type 
        });
    };

    const loadNotes = async () => {
        setIsLoading(true);
        const transaction = db.transaction('clockData', 'readonly');
        const objectStore = transaction.objectStore('clockData');
        const request = objectStore.getAll();
    
        request.onsuccess = async (event) => {
            const allNotes = event.target.result;
            const decryptedNotes = await Promise.all(allNotes.map(async (note) => {
                const decryptedContent = await decryptData(note.data, note.iv);
                return { ...note, content: decryptedContent };
            }));
            setNotes(decryptedNotes);
            setIsLoading(false);
        };
    
        request.onerror = (event) => {
            console.error('Error loading notes:', event.target.error);
        };
    };

    const saveNote = async (note) => {
        if (note.content.trim() === '') return;
        const encryptedNote = await encryptData(note.content);
        const noteToSave = {
            ...note,
            iv: encryptedNote.iv,
            data: encryptedNote.data,
        };
    
        const transaction = db.transaction('clockData', 'readwrite');
        const objectStore = transaction.objectStore('clockData');
        if (note.id) {
            objectStore.put(noteToSave);
        } else {
            objectStore.add(noteToSave);
        }
    
        transaction.oncomplete = () => {
            loadNotes();
        };
    };

    const deleteNote = (id) => {
        const transaction = db.transaction('clockData', 'readwrite');
        const objectStore = transaction.objectStore('clockData');
        objectStore.delete(id);
        transaction.oncomplete = () => {
            loadNotes();
        };
    };

    const handleNoteSave = async () => {
        if (currentNote.content.trim() === '') return;
    
        const encryptedNote = await encryptData(currentNote.content);
        const noteToSave = {
            ...currentNote,
            title: currentNote.content.split('\n')[0],
            iv: encryptedNote.iv,
            data: encryptedNote.data
        };
    
        saveNote(noteToSave);
        setCurrentNote({ content: '' });
        setEditNote(false);
    };

    const handleNoteEdit = (note) => {
        setCurrentNote({ ...note });
        setEditNote(true);
    };

    const handleNoteDelete = (note) => {
        deleteNote(note.id);
        setCurrentNote({ content: '' });
        setEditNote(false);
    };

    const renderNotes = () => {
        return (
            <>
                <div className="overflow-x-hidden">
                    <textarea
                        className="w-full p-2 border rounded bg-gray-800 text-gray-200"
                        rows="5"
                        value={currentNote.content}
                        onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                        placeholder="Write your note here..."
                    ></textarea>
                    <div className="mt-2">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                            onClick={handleNoteSave}
                        >
                            {editNote ? 'Update Note' : 'Save Note'}
                        </button>
                        {editNote && (
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={() => handleNoteDelete(currentNote)}
                            >
                                Delete Note
                            </button>
                        )}
                    </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3">
                    {notes.map((note) => {
                        const title = note.content.split('\n')[0];
                        return (
                            <div
                                key={note.id}
                                className="p-4 border rounded cursor-pointer bg-gray-700 text-gray-200 mb-2"
                                onClick={() => handleNoteEdit(note)}
                            >
                                <h2 className="text-xl font-bold">{title}</h2>
                                <p className="text-gray-400">{note.content}</p>
                            </div>
                        )})}
                </div>
            </>
        );
    };

    const renderNonMediaFiles = () => {
        return nonMediaElements.map((file, index) => {
            const isPlainText = ['txt', 'md', 'cfg', 'ini', 'py', 'c', 'h', 'cpp', 'js', 'json', 'xml', 'html', 'css', 'md', 'sh', 'bat'].includes(file.name.split('.').pop().toLowerCase());
            
            return (
                <div key={index} className="file-item p-2 border rounded flex flex-col space-y-2">
                    {isDeleteMode && (
                        <button onClick={() => deleteFileItem(file.id)}>
                            Delete
                        </button>
                    )}
                    <p className="font-bold">{file.name}</p>
                    <p>Size: {file.size} bytes</p>
                    <p>Type: {file.name.split('.').pop()}</p>
                    <div className="flex items-center space-x-2">
                    <a href={file.url} download={file.name} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                        <i className="fas fa-download fa-2xl"></i>
                    </a>
                    {file.type === 'application/pdf' && (
                        <button className="text-blue-500" onClick={() => previewPDF(file.url)}>
                        <i className="fas fa-file-pdf fa-2xl"></i>
                        </button>
                    )}
                    {file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && (
                        <button className="text-blue-500" onClick={() => previewDOCX(file.url)}>
                        <i className="fas fa-file-word fa-2xl"></i>
                        </button>
                    )}
                    {file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && (
                        <button className="text-blue-500" onClick={() => previewXLSX(file.url)}>
                        <i className="fas fa-file-excel fa-2xl"></i>
                        </button>
                    )}
                    {(file.type === 'text/plain' || isPlainText) && (
                        <button className="text-blue-500" onClick={() => previewTextFile(file.url)}>
                            <i className="fas fa-file-alt fa-2xl"></i>
                        </button>
                    )}
                    {file.type.startsWith('audio/') && (
                        <button className="text-blue-500" onClick={() => previewAudio(file.url)}>
                        <i className="fas fa-file-audio fa-2xl"></i>
                        </button>
                    )}
                    {(file.type === 'application/zip' || file.name.endsWith('.zip')) && (
                        <button className="text-blue-500" onClick={() => previewZIPFile(file.url)}>
                            <i className="fas fa-file-archive fa-2xl"></i>
                        </button>
                    )}
                    </div>
                </div>
            );
        });
    };
      

    const previewPDF = (url) => {
        const pdfContainer = document.createElement('div');
        pdfContainer.id = 'pdf-preview-container';
        pdfContainer.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center';
        document.body.appendChild(pdfContainer);
    
        const pdfViewer = document.createElement('div');
        pdfViewer.id = 'pdf-viewer';
        pdfViewer.className = 'w-full h-full bg-white';
        pdfContainer.appendChild(pdfViewer);
    
        const closeButton = document.createElement('button');
        closeButton.className = 'absolute top-4 right-4 text-white text-2xl p-2 bg-gray-800 rounded-full';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.onclick = () => document.body.removeChild(pdfContainer);
        pdfContainer.appendChild(closeButton);
    
        pdfjsLib.getDocument(url).promise.then(pdf => {
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                pdf.getPage(pageNum).then(page => {
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    const viewport = page.getViewport({ scale: 1.5 });
    
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
    
                    pdfViewer.appendChild(canvas);
    
                    page.render({
                        canvasContext: context,
                        viewport: viewport
                    });
                });
            }
        });
    };

    const previewDOCX = (url) => {
        const docxContainer = document.createElement('div');
        docxContainer.id = 'docx-preview-container';
        docxContainer.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center';
        document.body.appendChild(docxContainer);
    
        const docxViewer = document.createElement('div');
        docxViewer.id = 'docx-viewer';
        docxViewer.className = 'w-full h-full bg-white p-4 overflow-auto';
        docxContainer.appendChild(docxViewer);
    
        const closeButton = document.createElement('button');
        closeButton.className = 'absolute top-4 right-4 text-white text-2xl p-2 bg-gray-800 rounded-full';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.onclick = () => document.body.removeChild(docxContainer);
        docxContainer.appendChild(closeButton);
    
        if (!window.docx || !window.docx.renderAsync) {
            console.error('docxPreview library is not loaded or renderAsync method is missing.');
            docxViewer.innerHTML = '<p class="text-red-500">Failed to load DOCX preview library.</p>';
            return;
        }
    
        const docxOptions = Object.assign(docx.defaultOptions, {
            experimental: true
        });
    
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.blob();
            })
            .then(blob => {
                const processedBlob = preprocessTiff(blob);
                window.docx.renderAsync(processedBlob, docxViewer, null, docxOptions);
            })
            .catch(error => {
                console.error(`Error fetching DOCX file: ${error}`);
                docxViewer.innerHTML = '<p class="text-red-500">Failed to load document.</p>';
            });
    };

    const previewXLSX = (url) => {
        const xlsxContainer = document.createElement('div');
        xlsxContainer.id = 'xlsx-preview-container';
        xlsxContainer.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center';
        document.body.appendChild(xlsxContainer);
    
        const xlsxViewer = document.createElement('div');
        xlsxViewer.id = 'xlsx-viewer';
        xlsxViewer.className = 'w-full h-full bg-white p-4 overflow-auto';
        xlsxContainer.appendChild(xlsxViewer);
    
        const closeButton = document.createElement('button');
        closeButton.className = 'absolute top-4 right-4 text-white text-2xl p-2 bg-gray-800 rounded-full';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.onclick = () => document.body.removeChild(xlsxContainer);
        xlsxContainer.appendChild(closeButton);
    
        fetch(url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => {
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const html = XLSX.utils.sheet_to_html(worksheet);
                xlsxViewer.innerHTML = html;
            })
            .catch(error => {
                console.error('Error fetching or parsing XLSX file:', error);
                xlsxViewer.innerHTML = '<p class="text-red-500">Failed to load XLSX file.</p>';
            });
    };

    const previewTextFile = (url) => {
        const textContainer = document.createElement('div');
        textContainer.id = 'text-preview-container';
        textContainer.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center';
        document.body.appendChild(textContainer);
    
        const textViewer = document.createElement('pre');
        textViewer.id = 'text-viewer';
        textViewer.className = 'w-full h-full bg-white p-4 overflow-auto language-js';
        textContainer.appendChild(textViewer);
    
        const closeButton = document.createElement('button');
        closeButton.className = 'absolute top-4 right-4 text-white text-2xl p-2 bg-gray-800 rounded-full';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.onclick = () => document.body.removeChild(textContainer);
        textContainer.appendChild(closeButton);
    
        fetch(url)
            .then(response => response.text())
            .then(text => {
                textViewer.innerHTML = Prism.highlight(text, Prism.languages.javascript, 'javascript');
            })
            .catch(error => {
                console.error('Error fetching text file:', error);
                textViewer.innerHTML = '<p class="text-red-500">Failed to load text file.</p>';
            });
    };

    const previewAudio = (url) => {
        const audioContainer = document.createElement('div');
        audioContainer.id = 'audio-preview-container';
        audioContainer.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center';
        document.body.appendChild(audioContainer);
    
        const audioViewer = document.createElement('audio');
        audioViewer.src = url;
        audioViewer.controls = true;
        audioViewer.className = 'w-full h-full object-contain';
        audioContainer.appendChild(audioViewer);
    
        const closeButton = document.createElement('button');
        closeButton.className = 'absolute top-4 right-4 text-white text-2xl p-2 bg-gray-800 rounded-full';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.onclick = () => document.body.removeChild(audioContainer);
        audioContainer.appendChild(closeButton);
    };

    const previewZIPFile = (url) => {
        const zipContainer = document.createElement('div');
        zipContainer.id = 'zip-preview-container';
        zipContainer.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center';
        document.body.appendChild(zipContainer);
    
        const zipViewer = document.createElement('div');
        zipViewer.id = 'zip-viewer';
        zipViewer.className = 'w-full h-full bg-white p-4 overflow-auto';
        zipContainer.appendChild(zipViewer);
    
        const closeButton = document.createElement('button');
        closeButton.className = 'absolute top-4 right-4 text-white text-2xl p-2 bg-gray-800 rounded-full';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.onclick = () => document .body.removeChild(zipContainer);
        zipContainer.appendChild(closeButton);
    
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const zip = new JSZip();
                return zip.loadAsync(blob);
            })
            .then(zip => {
                zipViewer.innerHTML = '<h2 class="font-bold">ZIP Contents:</h2>';
                Object.keys(zip.files).forEach(filename => {
                    const fileLink = document.createElement('a');
                    fileLink.href = `data:text/plain;charset=utf-8,${encodeURIComponent(zip.files[filename].async("text"))}`;
                    fileLink.download = filename;
                    fileLink.innerText = filename;
                    zipViewer.appendChild(fileLink);
                    zipViewer.appendChild(document.createElement('br'));
                });
            })
            .catch(error => {
                console.error('Error fetching ZIP file:', error);
                zipViewer.innerHTML = '<p class="text-red-500">Failed to load ZIP file.</p>';
            });
    };

    const saveMediaToDB = (url, type) => {
        const transaction = db.transaction('clockSettings', 'readwrite');
        const objectStore = transaction.objectStore('clockSettings');
        objectStore.add({ iv: url.iv, data: url.data, type });
    };

    const deleteGalleryItem = (id) => {
        const transaction = db.transaction('clockSettings', 'readwrite');
        const objectStore = transaction.objectStore('clockSettings');
        objectStore.delete(id);
        transaction.oncomplete = () => {
            loadMedia();
            setIsDeleteMode(false);
        };
    };
    
    const deleteFileItem = (id) => {
        const transaction = db.transaction('timeZoneData', 'readwrite');
        const objectStore = transaction.objectStore('timeZoneData');
        objectStore.delete(id);
        transaction.oncomplete = () => {
            loadNonMedia();
            setIsDeleteMode(false);
        };
    };

    const openModal = (url, type) => {
        setModalVisible(true);
        setModalContent({ url, type });
        setCurrentIndex(mediaElements.findIndex(media => media.url === url));
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const showPrevious = () => {
        if (currentIndex > 0) {
            const newIndex = currentIndex - 1;
            setCurrentIndex(newIndex);
            setModalContent(mediaElements[newIndex]);
        }
    };

    const showNext = () => {
        if (currentIndex < mediaElements.length - 1) {
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            setModalContent(mediaElements[newIndex]);
        }
    };

    const handlePasswordSubmit = async () => {
        const storedHash = localStorage.getItem('clockSessionID');
        const hash = await hashPassword(password);
        if (hash === storedHash) {
            setPasswordModalVisible(false);
            initializeDB();
            setPassword('');
        } else {
            setPassword('');
        }
    };

    const handleSetPasswordSubmit = async () => {
        if (setPasswordState) {
            const hash = await hashPassword(setPasswordState);
            localStorage.setItem('clockSessionID', hash);
            setSetPasswordModalVisibleState(false);
            initializeDB();
            setSetPasswordState('');
        }
    };

    const handleTabClick = (tab) => {
        setGalleryVisible(tab === 'gallery');
        setFilesVisible(tab === 'files');
        setNotesVisible(tab === 'notes');
        
        const tabIndex = tab === 'gallery' ? 0 : tab === 'files' ? 1 : 2;
        setActiveTabIndex(tabIndex);
    };

    const outputDatabase = () => {
        const mediaTransaction = db.transaction('clockSettings', 'readonly');
        const mediaStore = mediaTransaction.objectStore('clockSettings');
        const mediaRequest = mediaStore.getAll();

        mediaRequest.onsuccess = (event) => {
            const mediaItems = event.target.result;
            console.log('Media Items:');
            mediaItems.forEach(item => {
                console.log(`ID: ${item.id}, URL: ${item.url}, Type: ${item.type}`);
            });
        };
    };

    const clearDatabase = () => {
        const mediaTransaction = db.transaction('clockSettings', 'readwrite');
        const mediaStore = mediaTransaction.objectStore('clockSettings');
        const nonMediaTransaction = db.transaction('timeZoneData', 'readwrite');
        const nonMediaStore = nonMediaTransaction.objectStore('timeZoneData');

        mediaStore.clear().onsuccess = () => {
            console.log('Reset to default state.');
        };

        nonMediaStore.clear().onsuccess = () => {
            console.log('Reset to default state.');
        };

        loadMedia();
        loadNonMedia();
        loadNotes();
    };

    const openSettings = () => {
        setShowSettings(!showSettings);
    };

    const renderLockbox = () => {
        return (
                
                <div className="lockbox-container bg-gray-900">
                    {showSettings && (
                        <div className="settings-container text-white justify-center text-center">
                            <h2 className="text-2xl font-semibold">Lockbox Settings</h2>
                            <button className="btn btn-primary" onClick={openSettings}><i className="fas fa-arrow-left"></i> Back to Lockbox</button>
                            <div className="mt-4">
                                <label className="mr-2">Theme</label>
                                <select 
                                    value={currentTheme} 
                                    onChange={(e) => setCurrentTheme(e.target.value)}
                                    className="mt-2 w-full p-2 bg-gray-700 text-white rounded"
                                >
                                    {themes.map((theme, index) => (
                                        <option key={index} value={theme.name}>
                                            {theme.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center mt-4">
                                <button 
                                    className="bg-red-700 text-white font-bold py-2 px-4 rounded" 
                                    onClick={clearDatabase}
                                >
                                    Clear Database
                                </button>
                                <button
                                className="bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
                                onClick={setSetPasswordModalVisibleState}
                                >Set Password</button>
                            </div>
                            <div className="flex items-center mt-4">
                                <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2" onClick={exportDatabase}>
                                    Export Database
                                </button>
                                <input type="file" accept=".clk" onChange={handleInputFileChange} className="bg-gray-700 text-white rounded p-2" />
                            </div>
                        </div>
                    )}
                    <header className="lockbox-header text-center mb-8 bg-gray-900 text-white">
                        <h1 className="text-4xl font-bold" onClick={() => {setShowSettings(false); setPasswordModalVisible(true); setShowLockbox(false);}}>Lockbox</h1>
                        <button onClick={() => {setShowSettings(false); setPasswordModalVisible(true); setShowLockbox(false);}} className="mr-2 text-white"><i className="fas fa-lock fa-xl"></i></button>
                        <button 
                            className="mr-2 text-white"
                            onClick={() => setIsDeleteMode(!isDeleteMode)}
                        >
                            <i className="fas fa-trash"></i>
                        </button>
                        <button onClick={openSettings} className="mr-2 text-white">
                            <i className="fas fa-cogs fa-xl"></i>
                        </button>
                    </header>
                    <main className="lockbox-content bg-gray-900 text-white">
                        <div className="upload-button-container">
                            <input type="file" id="fileInput" multiple className="block w-full text-sm text-gray-400 file:bg-gray-700 file:text-white hover:file:bg-gray-600" onChange={handleFileUpload} />
                        </div>
                        <div className="tabs mb-4">
                            <button id="galleryTab" className={`tab ${galleryVisible ? 'active' : ''} bg-gray-800 text-white`} onClick={() => handleTabClick('gallery')}><i class="fas fa-photo-video fa-xl"></i></button>
                            <button id="filesTab" className={`tab ${filesVisible ? 'active' : ''} bg-gray-800 text-white`} onClick={() => handleTabClick('files')}><i class="fas fa-folder fa-xl"></i></button>
                            <button id="notesTab" className={`tab ${notesVisible ? 'active' : ''} bg-gray-800 text-white`} onClick={() => handleTabClick('notes')}><i class="fas fa-sticky-note fa-xl"></i></button>
                            <div className="active-indicator" style={{ left: `${activeTabIndex * 100}%` }}></div>
                        </div>
                        <div id="gallery" className={`grid grid-cols-3 gap-3 ${galleryVisible ? '' : 'hidden'}`}>
                            {mediaElements.map((media, index) => (
                                media.url ? (
                                <div key={index} className="gallery-item cursor-pointer" onClick={() => openModal(media.url, media.type)}>
                                    <div>
                                        {isDeleteMode && (
                                            <button 
                                                className="delete-button" 
                                                onClick={(e) => { e.stopPropagation(); deleteGalleryItem(media.id); }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                    {media.type.startsWith('image/') ? (
                                        <img src={media.url} alt="User  uploaded image" className="w-full h-full object-cover" />
                                    ) : (
                                        <video src={media.url} controls className="w-full h-full object-cover"></video>
                                    )}
                                </div>
                            ) : null
                            ))}
                        </div>
                        <div id="files" className={`grid grid-cols-3 gap-3 ${filesVisible ? '' : 'hidden'}`}>
                            {renderNonMediaFiles()}
                        </div>
                        <div id="notes" className={`overflow-y-auto ${notesVisible ? '' : 'hidden'}`}>    
                            {renderNotes()}
                        </div>
                    </main>
                    {modalVisible && (
                        <div id="modal" className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                            <div className="relative w-full max-w-4xl h-full max-h-4xl p-4 bg-gray-800">
                                <div id="modalContent" className="w-full h-full flex items-center justify-center">
                                    {modalContent.type.startsWith('image/') ? (
                                        <img src={modalContent.url} alt="Enlarged user uploaded image" className="w-full h-full object-contain" />
                                    ) : (
                                        <video src={modalContent.url} controls className="w-full h-full object-contain"></video>
                                    )}
                                </div>
                                <button id="prevButton" className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white text-2xl p-2" onClick={showPrevious}>
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                                <button id="nextButton" className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white text-2xl p-2" onClick={showNext}>
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                                <button id="closeButton" className="absolute top-4 right-4 text-white text-2xl p-2 bg-gray-800 rounded-full" onClick={closeModal}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    )}
                    {passwordModalVisible && (
                        <div id="passwordModal" className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                            <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-bold mb-4 text-white">Enter Password</h2>
                                <input type="password" id="passwordInput" value={password} className="w-full p-2 border border-gray-600 rounded mb-4 bg-gray-700 text-white" placeholder="Password" onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => {if (e.key === 'Enter') {handlePasswordSubmit();}}}/>
                                <button id="passwordSubmit" className="w-full bg-blue-500 text-white p-2 rounded" onClick={handlePasswordSubmit}>Submit</button>
                            </div>
                        </div>
                    )}
    
                    {setPasswordModalVisibleState && (
                        <div id="setPasswordModal" className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                            <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-bold mb-4 text-white">Set Password</h2>
                                <input type="password" id="setPasswordInput" value={setPasswordState} className="w-full p-2 border border-gray-600 rounded mb-4 bg-gray-700 text-white" placeholder="Password" onChange={(e) => setSetPasswordState(e.target.value)} onKeyDown={(e) => {if (e.key === 'Enter') {handleSetPasswordSubmit();}}}/>
                                <button id="setPasswordSubmit" className="w-full bg-blue-500 text-white p-2 rounded" onClick={handleSetPasswordSubmit}>Set Password</button>
                            </div>
                        </div>
                    )}
                </div>
        );
    }

    const renderAbout = () => {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8 space-y-4">
                <h1 className="text-3xl font-bold">About</h1>
                <p className="text-lg">Welcome to cLockbox!</p>
                <p className="text-lg">Built as a curiosity project to implement a discreet media storage solution.</p>
                <a href="https://github.com/9-5/cLockbox" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline"><i className="fab fa-github mr-2"></i> GitHub Repo</a>
                <a href="https://johnle.org/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline"><i className="fas fa-user mr-2"></i> Developer Site</a>
            </div>
        );
    };

    return (
        <>
            {isLoading && <LoadingPopup />}
            {showLockbox ? renderLockbox() : 
            showAbout ? renderAbout() : 
            renderClock()}
        </>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));