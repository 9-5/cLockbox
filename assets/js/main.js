const { useState, useEffect } = React;

function App() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isStopwatchVisible, setIsStopwatchVisible] = useState(false);
    const [stopwatchTime, setStopwatchTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState([]);
    const [showLockbox, setShowLockbox] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [db, setDb] = useState(null);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0); // New state for upload progress

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setStopwatchTime(prevTime => prevTime + 1);
            }, 1000);
        } else if (!isRunning && stopwatchTime !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning, stopwatchTime]);

    useEffect(() => {
        openDatabase();
    }, []);

    const handleStartStop = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        setStopwatchTime(0);
        setLaps([]);
    };

    const handleLap = () => {
        setLaps([...laps, stopwatchTime]);
        if (laps.length + 1 === 5) {
            setShowLockbox(true);
            getAllPhotos();
        }
    };

    const handleBack = () => {
        setShowLockbox(false);
        setSelectedPhotoIndex(null); // Reset selected index when going back
    };

    const formatTime = (time) => {
        const getSeconds = `0${time % 60}`.slice(-2);
        const minutes = Math.floor(time / 60);
        const getMinutes = `0${minutes % 60}`.slice(-2);
        const getHours = `0${Math.floor(time / 3600)}`.slice(-2);
        return `${getHours} : ${getMinutes} : ${getSeconds}`;
    };

    const openDatabase = () => {
        let request = indexedDB.open('photoDB', 1);

        request.onerror = function(event) {
            console.error('Error opening database:', event.target.error);
        };

        request.onsuccess = function(event) {
            setDb(event.target.result);
            console.log('Database opened successfully');
        };

        request.onupgradeneeded = function(event) {
            let db = event.target.result;
            console.log('Database upgraded');
            db.createObjectStore('photos', { keyPath: 'id', autoIncrement: true });
        };
    };

    const addPhoto = (file) => {
        let reader = new FileReader();

        reader.onprogress = function(event) {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                setUploadProgress(percentComplete); // Update progress state
            }
        };

        reader.onload = function(event) {
            let blob = event.target.result;
            let objectStore = db.transaction('photos', 'readwrite').objectStore('photos');
            let request = objectStore.add({ data: blob });

            request.onerror = function() {
                console.error('Error adding photo to database');
            };

            request.onsuccess = function() {
                console.log('Photo added to database');
                getAllPhotos();
                setUploadProgress(0); // Reset progress after upload
            };
        };

        reader.readAsArrayBuffer(file);
    };

    const getAllPhotos = () => {
        let transaction = db.transaction('photos', 'readonly');
        let objectStore = transaction.objectStore('photos');
        let request = objectStore.getAll();

        request.onerror = function() {
            console.error('Error getting photos from database');
        };

        request.onsuccess = function(event) {
            setPhotos(event.target.result);
        };
    };

    const handleFileChange = (event) => {
        let file = event.target.files[0];
        if (file) {
            addPhoto(file);
        }
    };

    const openPhoto = (index) => {
        setSelectedPhotoIndex(index);
    };

    const closePhoto = () => {
        setSelectedPhotoIndex(null);
    };

    const nextPhoto = () => {
        setSelectedPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
    };

    const prevPhoto = () => {
        setSelectedPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            {selectedPhotoIndex !== null ? (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                    <div className="relative">
                        <button onClick={closePhoto} className="absolute top-2 right-2 text-white text-2xl">X</button>
                        <img src={URL.createObjectURL(new Blob([photos[selectedPhotoIndex].data]))} alt={`Photo ${selectedPhotoIndex + 1}`} className="max-w-full max-h-full" />
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
                            <button onClick={prevPhoto} className="text-white text-3xl">
                                <i className="fas fa-chevron-left"></i>
                            </button>
                        </div>
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                            <button onClick={nextPhoto} className="text-white text-3xl">
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            ) : showLockbox ? (
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold mb-4">Lockbox</h1>
                    <div className="mb-4">
                        <input type="file" onChange={handleFileChange} className="mb-2" />
                        {uploadProgress > 0 && (
                            <div className="mt-2">
                                <div className="bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                                </div>
                                <p className="text-sm text-gray-600">{Math.round(uploadProgress)}% Uploading...</p>
                            </div>
                        )}
                        <h2 className="text-xl font-semibold">Stored Photos/Videos</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {photos.map((photo, index) => (
                                <div key={index} className="cursor-pointer" onClick={() => openPhoto(index)}>
                                    <img src={URL.createObjectURL(new Blob([photo.data]))} alt={`Photo ${index + 1}`} className="w-full h-32 object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleBack} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Back to Stopwatch
                    </button>
                </div>
            ) : !isStopwatchVisible ? (
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold mb-4">Clock</h1>
                    <p className="text-2xl">{currentTime.toLocaleTimeString()}</p>
                    <button onClick={() => setIsStopwatchVisible(true)} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
                        Switch to Stopwatch
                    </button>
                </div>
            ) : (
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold mb-4">Stopwatch</h1>
                    <p className="text-2xl">{formatTime(stopwatchTime)}</p>
                    <div className="mt-4">
                        <button onClick={handleStartStop} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                            {isRunning ? 'Stop' : 'Start'}
                        </button>
                        <button onClick={handleReset} className="bg-red-500 text-white px-4 py-2 rounded mr-2">
                            Reset
                        </button>
                        <button onClick={handleLap} className="bg-green-500 text-white px-4 py-2 rounded">
                            Lap
                        </button>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Laps</h2>
                        <ul className="list-disc pl-5">
                            {laps.map((lap, index) => (
                                <li key={index} className="text-lg">{formatTime(lap)}</li>
                            ))}
                        </ul>
                    </div>
                    <button onClick={() => setIsStopwatchVisible(false)} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
                        Back to Clock
                    </button>
                </div>
            )}
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));