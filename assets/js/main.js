const { useState, useEffect } = React;

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
    const [notesVisible, setNotesVisible] = useState(false);
    const [notes, setNotes] = useState([]);
    const [db, setDb] = useState(null);
    const [toastVisible, setToastVisible] = useState(false);
    const [nonMediaElements, setNonMediaElements] = useState([]);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState(new Date());
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

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 100);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let timerInterval;
        if (isTimerRunning) {
            timerInterval = setInterval(() => {
                setTimer(prev => prev > 0 ? prev - 1 : 0);
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
    }, [isAnalogClockEnabled, currentTheme]);

    useEffect(() => {
        document.body.className = currentTheme === 'Ocean' ? '' : currentTheme.toLowerCase();
        localStorage.setItem('theme', currentTheme);
    }, [currentTheme]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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
        const seconds =  ((timeNow.getSeconds() / 60) * 360) + 90;
        const minutes = ((timeNow.getMinutes() / 60) * 360) + ((seconds / 60) * 6) + 90;
        const hours = ((timeNow.getHours() % 12) * 30) + (minutes / 60) * 30;
        return {
            secondHand: { transform: `rotate(${seconds}deg)` },
            minuteHand: { transform: `rotate(${minutes}deg)` },
            hourHand: { transform: `rotate(${hours}deg)` }
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
                {activeTab === 'clock' && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold">Current Time</h2>
                        <p className="text-xl">{currentTime.toLocaleTimeString()}</p>
                    </div>
                )}
                {activeTab === 'timer' && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold">Timer (Pomodoro)</h2>
                        <p className="text-xl">{formatTime(timer)}</p>
                        <button className="bg-transparent hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={() => setIsTimerRunning(!isTimerRunning)}>
                            {isTimerRunning ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>}
                        </button>
                        <button className="bg-transparent hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => { setTimer(1500); setIsTimerRunning(false); }}>
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
                        </div>
                    </div>
                )}
                <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center"> 
                    <button className={`bg-transparent font-bold py-2 px-4 rounded ${activeTab === 'alarm' ? 'text-blue-500' : 'text-white'}`} onClick={() => setActiveTab('alarm')}>
                    <i class="fas fa-cube"></i>
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
            if (!db.objectStoreNames.contains('clockThemes')) {
                db.createObjectStore('clockThemes', { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            setDb(event.target.result);
        };

        request.onerror = (event) => {
            console.error('Database error:', event.target.errorCode);
        };
    };

    const resetToDefaults = () => {
        const request = indexedDB.open('clockData', 2);
        request.onsuccess = (event) => {
            clearDatabase();
        }

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
                return { url: decryptedUrl, type: media.type };
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
                return { url: decryptedUrl, type: media.type, name: media.name, size: media.size };
            }));
            setNonMediaElements(decryptedNonMediaItems);
            setIsLoading(false);
        };
        request.onerror = (event) => {
            console.error(`Error loading non-media: ${event.target.errorCode}`);
        }
    };

    const loadNotes = () => {
        const transaction = db.transaction('clockThemes', 'readonly');
        const objectStore = transaction.objectStore('clockThemes');
        const request = objectStore.getAll();

        request.onsuccess = (event) => {
            const notesItems = event.target.result;
            setNotes(notesItems);
        };
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

    const renderNonMediaFiles = () => {
        return nonMediaElements.map((file, index) => (
            <div key={index} className="file-item p-2 border rounded flex flex-col space-y-2">
                <p className="font-bold">{file.name}</p>
                <p>Size: {file.size} bytes</p>
                <p>Type: {file.type}</p>
                <a href={file.url} download={file.name} target="_blank" rel="noopener noreferrer" className="text-blue-500">Download</a>
            </div>
        ));
    };

    const saveMediaToDB = (url, type) => {
        const transaction = db.transaction('clockSettings', 'readwrite');
        const objectStore = transaction.objectStore('clockSettings');
        objectStore.add({ iv: url.iv, data: url.data, type });
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

    const addNote = (noteContent) => {
        const transaction = db.transaction('clockThemes', 'readwrite');
        const store = transaction.objectStore('clockThemes');
        const note = { content: noteContent };
        store.add(note);
        loadNotes();
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

    const createNote = () => {
        const newNote = { id: Date.now(), content: '', timestamp: Date.now() };
        setNotes(prev => [...prev, newNote]);
        saveNoteToDB(newNote);
    };


    const saveNoteToDB = (note) => {
        const transaction = db.transaction('clockThemes', 'readwrite');
        const objectStore = transaction.objectStore('clockThemes');
        objectStore.add(note);
    };

    const updateNote = (id, newContent) => {
        const transaction = db.transaction('clockThemes', 'readwrite');
        const store = transaction.objectStore('clockThemes');
        const request = store.get(id);

        request.onsuccess = (event) => {
            const note = event.target.result;
            note.content = newContent;
            store.put(note);
            loadNotes();
        };
    };

    const handleTabClick = (tab) => {
        setGalleryVisible(tab === 'gallery');
        setFilesVisible(tab === 'files');
        setNotesVisible(tab === 'clockThemes');
        
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

        const notesTransaction = db.transaction('clockThemes', 'readonly');
        const notesStore = notesTransaction.objectStore('clockThemes');
        const notesRequest = notesStore.getAll();

        notesRequest.onsuccess = (event) => {
            const notesItems = event.target.result;
            console.log('Notes Items:');
            notesItems.forEach(note => {
                console.log(`ID: ${note.id}, Content: ${note.content}`);
            });
        };
    };

    const clearDatabase = () => {
        const mediaTransaction = db.transaction('clockSettings', 'readwrite');
        const mediaStore = mediaTransaction.objectStore('clockSettings');
        const notesTransaction = db.transaction('clockThemes', 'readwrite');
        const notesStore = notesTransaction.objectStore('clockThemes');

        mediaStore.clear().onsuccess = () => {
            console.log('Media store cleared');
        };

        notesStore.clear().onsuccess = () => {
            console.log('Notes store cleared');

        loadMedia();
        loadNotes();
        };
    };

    const openSettings = () => {
        setShowSettings(!showSettings);
    };

    const renderLockbox = () => {
        return (
            
            <div className="w-full h-full bg-gray-900 text-white">
                {showSettings && (
                <div className="settings-container">
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
                        onClick={resetToDefaults}
                    >
                        Clear Database
                    </button>
                    <button
                    className="bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
                    onClick={setSetPasswordModalVisibleState}
                    >Set Password</button>
                </div>
            </div>
                )}
                <header className="w-screen text-center mb-8 bg-gray-900 text-white">
                <h1 className="text-4xl font-bold" onClick={() => {setShowSettings(false); setPasswordModalVisible(true); setShowLockbox(false);}}>Lockbox</h1>
                                <button onClick={() => {setShowSettings(false); setPasswordModalVisible(true); setShowLockbox(false);}} className="mr-2 text-white"><i className="fas fa-lock fa-xl"></i></button>
                                <button onClick={openSettings} className="mr-2 text-white"><i className="fas fa-cogs fa-xl"></i></button>
                            </header>
                            <main className="flex-grow bg-gray-900 text-white">

                    <div className="upload-button-container">
                        <input type="file" id="fileInput" multiple className="block w-full text-sm text-gray-400 file:bg-gray-700 file:text-white hover:file:bg-gray-600" onChange={handleFileUpload} />
                    </div>
                    <div className="tabs mb-4">
                        <button id="galleryTab" className={`tab ${galleryVisible ? 'active' : ''} bg-gray-800 text-white`} onClick={() => handleTabClick('gallery')}>Gallery</button>
                        <button id="filesTab" className={`tab ${filesVisible ? 'active' : ''} bg-gray-800 text-white`} onClick={() => handleTabClick('files')}>Files</button>
                        <button id="notesTab" className={`tab ${notesVisible ? 'active' : ''} bg-gray-800 text-white`} onClick={() => handleTabClick('clockThemes')}>Notes</button>
                        <div className="active-indicator" style={{ left: `${activeTabIndex * 100}%` }}></div>
                    </div>
                    <div className="mb-4">
                        <button id="addNoteButton" className={`bg-blue-500 text-white p-2 rounded ${notesVisible ? '' : 'hidden'}`} onClick={createNote}>+ Add Note</button>
                    </div>
                    <div id="gallery" className={`grid grid-cols-3 gap-4 ${galleryVisible ? '' : 'hidden'}`}>
                        {mediaElements.map((media, index) => (
                            media.url ? (
                            <div key={index} className="gallery-item cursor-pointer" onClick={() => openModal(media.url, media.type)}>
                                {media.type.startsWith('image/') ? (
                                    <img src={media.url} alt="User  uploaded image" className="w-full h-full object-cover" />
                                ) : (
                                    <video src={media.url} controls className="w-full h-full object-cover"></video>
                                )}
                            </div>
                        ) : null
                        ))}
                    </div>
                    <div id="files" className={`grid grid-cols-3 gap-4 ${filesVisible ? '' : 'hidden'}`}>
                        {renderNonMediaFiles()}
                    </div>
                    <div id="notes" className={`grid grid-cols-3 gap-4 ${notesVisible ? '' : 'hidden'}`}>
                        {notes.map((note, index) => (
                            <div key={note.id} className="note-item p-2 border rounded flex flex-col space-y-2 bg-gray-800">
                                <textarea 
                                    value={note.content} 
                                    onChange={(e) => updateNote(note.id, e.target.value)}
                                    className="w-full h-24 p-2 border border-gray-600 bg-gray-700 text-white"
                                    placeholder="Type your note here..."
                                />
                            </div>
                        ))}
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