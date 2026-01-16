import React, { useState } from 'react';

const StressDiaryApp = () => {
  const [screen, setScreen] = useState('start'); // start, diary, endDay, summary
  const [participantId, setParticipantId] = useState('');
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [currentEntry, setCurrentEntry] = useState({
    activity: '',
    stress: 3,
    people: '0',
    note: ''
  });
  const [dayEndData, setDayEndData] = useState({
    overallStress: 3,
    mainStressors: [],
    sensorComfort: 3,
    sensorIssues: '',
    dayNotes: ''
  });

  const activities = [
    { code: 'E', name: 'El. laiškai', icon: '📧', tooltip: 'El. pašto tikrinimas, laiškų rašymas ir atsakymas' },
    { code: 'P', name: 'Posėdis', icon: '👥', tooltip: 'Susitikimai, posėdžiai, pasitarimai (gyvai ar nuotoliniu būdu)' },
    { code: 'T', name: 'Telefonas', icon: '📞', tooltip: 'Telefoniniai pokalbiai, skambučiai' },
    { code: 'D', name: 'Dokumentai', icon: '📄', tooltip: 'Dokumentų ruošimas, redagavimas, tikrinimas, pasirašymas' },
    { code: 'A', name: 'Analizė', icon: '📊', tooltip: 'Duomenų analizė, skaičiavimai, planavimas, strateginis mąstymas' },
    { code: 'K', name: 'Kolegos', icon: '💬', tooltip: 'Neformalus bendravimas su kolegomis, kavos pertraukėlė su kolegomis' },
    { code: 'ST', name: 'Studentai', icon: '🎓', tooltip: 'Bendravimas su studentais, konsultacijos, atsakymas į klausimus' },
    { code: 'V', name: 'Veiklų organiz.', icon: '📋', tooltip: 'Renginių, veiklų, projektų organizavimas ir koordinavimas' },
    { code: 'AD', name: 'Administravimas', icon: '🗂️', tooltip: 'Studijų procesų administravimas, sistemų pildymas, ataskaitos' },
    { code: 'R', name: 'Rutina', icon: '⚙️', tooltip: 'Kasdienės rutininės užduotys, kurios netinka kitoms kategorijoms' },
    { code: 'S', name: 'Skubu!', icon: '⚡', tooltip: 'Skubūs, neplanuoti darbai, „gaisrų gesinimas"' },
    { code: 'X', name: 'Pertrauka', icon: '☕', tooltip: 'Pietūs, kavos pertrauka, poilsis, baseline matavimas' }
  ];

  const stressors = [
    { id: 'workload', label: 'Darbo krūvis', icon: '📚' },
    { id: 'deadlines', label: 'Terminai', icon: '⏰' },
    { id: 'people', label: 'Žmonės / konfliktai', icon: '👥' },
    { id: 'environment', label: 'Aplinka (triukšmas, trukdžiai)', icon: '🔊' },
    { id: 'unexpected', label: 'Neplanuoti dalykai', icon: '⚡' },
    { id: 'technology', label: 'Techninės problemos', icon: '💻' },
    { id: 'communication', label: 'Komunikacijos problemos', icon: '💬' },
    { id: 'other', label: 'Kita', icon: '❓' }
  ];

  const sensorComfortLevels = [
    { level: 1, label: 'Visai netrukdė', emoji: '😊' },
    { level: 2, label: 'Beveik nejaučiau', emoji: '🙂' },
    { level: 3, label: 'Šiek tiek jaučiau', emoji: '😐' },
    { level: 4, label: 'Trukdė dirbti', emoji: '😕' },
    { level: 5, label: 'Labai trukdė', emoji: '😣' }
  ];

  const stressLevels = [
    { level: 1, emoji: '😌', label: 'Ramu', color: 'bg-green-100 border-green-400' },
    { level: 2, emoji: '🙂', label: 'Gerai', color: 'bg-green-50 border-green-300' },
    { level: 3, emoji: '😐', label: 'Vidutiniškai', color: 'bg-yellow-50 border-yellow-400' },
    { level: 4, emoji: '😟', label: 'Įtempta', color: 'bg-orange-50 border-orange-400' },
    { level: 5, emoji: '😰', label: 'Stresiškai', color: 'bg-red-50 border-red-400' }
  ];

  const peopleOptions = [
    { value: '0', label: 'Vienas/a' },
    { value: '1', label: '1 žmogus' },
    { value: '2-5', label: '2-5' },
    { value: '5+', label: '5+' }
  ];

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('lt-LT', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('lt-LT');
  };

  const startDay = () => {
    if (participantId) {
      setScreen('diary');
    }
  };

  const addEntry = () => {
    if (currentEntry.activity) {
      const newEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        participantId,
        ...currentEntry
      };
      setEntries(prev => [...prev, newEntry]);
      setCurrentEntry({ activity: '', stress: 3, people: '0', note: '' });
      setShowForm(false);
    }
  };

  const deleteEntry = (id) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const toggleStressor = (stressorId) => {
    setDayEndData(prev => ({
      ...prev,
      mainStressors: prev.mainStressors.includes(stressorId)
        ? prev.mainStressors.filter(s => s !== stressorId)
        : [...prev.mainStressors, stressorId]
    }));
  };

  const getStressColor = (level) => {
    const colors = {
      1: 'border-l-green-400',
      2: 'border-l-green-300', 
      3: 'border-l-yellow-400',
      4: 'border-l-orange-400',
      5: 'border-l-red-400'
    };
    return colors[level] || 'border-l-gray-300';
  };

  const calculateAverageStress = () => {
    if (entries.length === 0) return 0;
    const sum = entries.reduce((acc, e) => acc + e.stress, 0);
    return (sum / entries.length).toFixed(1);
  };

  const finishDay = () => {
    setScreen('summary');
  };

  const exportToCSV = () => {
    // Entries CSV
    const entryHeaders = ['Timestamp', 'Data', 'Laikas', 'Dalyvis', 'Veiklos_kodas', 'Veikla', 'Stresas', 'Zmones', 'Pastaba'];
    const entryRows = entries.map(e => [
      e.timestamp,
      formatDate(e.timestamp),
      formatTime(e.timestamp),
      e.participantId,
      e.activity,
      activities.find(a => a.code === e.activity)?.name || '',
      e.stress,
      e.people,
      `"${e.note || ''}"`
    ]);
    
    // Day summary
    const summaryRows = [
      [],
      ['=== DIENOS APIBENDRINIMAS ==='],
      ['Dalyvis', participantId],
      ['Data', formatDate(new Date())],
      ['Viso iraisu', entries.length],
      ['Vidutinis stresas (irasuose)', calculateAverageStress()],
      ['Bendras dienos stresas', dayEndData.overallStress],
      ['Pagrindines streso priezastys', dayEndData.mainStressors.map(s => stressors.find(st => st.id === s)?.label).join(', ')],
      ['Biosensoriu patogumas (1-5)', dayEndData.sensorComfort],
      ['Biosensoriu pastabos', `"${dayEndData.sensorIssues || ''}"`],
      ['Dienos pastabos', `"${dayEndData.dayNotes || ''}"`]
    ];
    
    const csv = [
      entryHeaders.join(';'), 
      ...entryRows.map(r => r.join(';')),
      ...summaryRows.map(r => r.join(';'))
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `streso_dienorastis_${participantId}_${formatDate(new Date())}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyToClipboard = () => {
    const headers = ['Laikas', 'Veikla', 'Stresas', 'Žmonės', 'Pastaba'];
    const rows = entries.map(e => [
      formatTime(e.timestamp),
      activities.find(a => a.code === e.activity)?.name || '',
      e.stress,
      e.people,
      e.note || ''
    ]);
    
    const summary = [
      '',
      '=== DIENOS APIBENDRINIMAS ===',
      `Bendras dienos stresas: ${dayEndData.overallStress}/5`,
      `Streso priežastys: ${dayEndData.mainStressors.map(s => stressors.find(st => st.id === s)?.label).join(', ')}`,
      `Biosensorių patogumas: ${dayEndData.sensorComfort}/5`,
      dayEndData.sensorIssues ? `Biosensorių pastabos: ${dayEndData.sensorIssues}` : '',
      dayEndData.dayNotes ? `Dienos pastabos: ${dayEndData.dayNotes}` : ''
    ].filter(Boolean);
    
    const text = [headers.join('\t'), ...rows.map(r => r.join('\t')), ...summary].join('\n');
    navigator.clipboard.writeText(text);
    alert('Nukopijuota! Galite įklijuoti į Excel.');
  };

  // START SCREEN
  if (screen === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📋</div>
            <h1 className="text-2xl font-bold text-gray-800">Streso dienoraštis</h1>
            <p className="text-gray-500 mt-2">Pilotinis tyrimas</p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Jūsų dalyvio kodas
            </label>
            <select 
              value={participantId}
              onChange={(e) => setParticipantId(e.target.value)}
              className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            >
              <option value="">Pasirinkite...</option>
              {Array.from({length: 15}, (_, i) => {
                const id = `D${String(i + 1).padStart(2, '0')}`;
                return <option key={id} value={id}>{id}</option>;
              })}
            </select>
          </div>
          
          <button
            onClick={startDay}
            disabled={!participantId}
            className={`w-full py-4 rounded-xl text-lg font-semibold transition-all transform ${
              participantId 
                ? 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98]' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Pradėti dieną →
          </button>
          
          <p className="text-center text-xs text-gray-400 mt-6">
            Kauno kolegija • Multimodalinių tyrimų laboratorija
          </p>
        </div>
      </div>
    );
  }

  // END DAY SCREEN
  if (screen === 'endDay') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 to-pink-500 p-4">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-6">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🌅</div>
              <h1 className="text-2xl font-bold text-gray-800">Dienos pabaiga</h1>
              <p className="text-gray-500 mt-1">Keli klausimai apie šiandieną</p>
            </div>

            {/* Overall stress */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                1. Kaip vertinate bendrą dienos streso lygį?
              </label>
              <div className="flex gap-2">
                {stressLevels.map((level) => (
                  <button
                    key={level.level}
                    onClick={() => setDayEndData({...dayEndData, overallStress: level.level})}
                    className={`flex-1 py-3 rounded-xl text-center transition-all border-2 ${
                      dayEndData.overallStress === level.level
                        ? `${level.color} shadow-md scale-105`
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-2xl">{level.emoji}</div>
                    <div className="text-xs mt-1 text-gray-600">{level.level}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main stressors */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                2. Kas šiandien sukėlė daugiausiai streso? <span className="font-normal text-gray-400">(galima rinktis kelis)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {stressors.map((stressor) => (
                  <button
                    key={stressor.id}
                    onClick={() => toggleStressor(stressor.id)}
                    className={`p-3 rounded-xl text-left text-sm transition-all border-2 ${
                      dayEndData.mainStressors.includes(stressor.id)
                        ? 'bg-blue-50 border-blue-400 text-blue-800'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2">{stressor.icon}</span>
                    {stressor.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sensor comfort */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                3. Kaip vertinate biosensorių patogumą?
              </label>
              <div className="space-y-2">
                {sensorComfortLevels.map((level) => (
                  <button
                    key={level.level}
                    onClick={() => setDayEndData({...dayEndData, sensorComfort: level.level})}
                    className={`w-full p-3 rounded-xl text-left transition-all border-2 flex items-center gap-3 ${
                      dayEndData.sensorComfort === level.level
                        ? 'bg-blue-50 border-blue-400'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{level.emoji}</span>
                    <span className="text-sm">{level.label}</span>
                    <span className="ml-auto text-gray-400 text-sm">{level.level}/5</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sensor issues */}
            {dayEndData.sensorComfort >= 3 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3a. Kas konkrečiai trukdė? <span className="font-normal text-gray-400">(neprivaloma)</span>
                </label>
                <textarea
                  value={dayEndData.sensorIssues}
                  onChange={(e) => setDayEndData({...dayEndData, sensorIssues: e.target.value})}
                  placeholder="pvz., niežėjo, slinko, buvo per griozdiški..."
                  rows={2}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>
            )}

            {/* Day notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                4. Papildomos pastabos apie dieną <span className="font-normal text-gray-400">(neprivaloma)</span>
              </label>
              <textarea
                value={dayEndData.dayNotes}
                onChange={(e) => setDayEndData({...dayEndData, dayNotes: e.target.value})}
                placeholder="Bet kokios pastabos apie šiandienos patirtį..."
                rows={3}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setScreen('diary')}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
              >
                ← Grįžti
              </button>
              <button
                onClick={finishDay}
                className="flex-1 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
              >
                Baigti dieną ✓
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SUMMARY SCREEN
  if (screen === 'summary') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-teal-500 p-4">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-6">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">✅</div>
              <h1 className="text-2xl font-bold text-gray-800">Diena baigta!</h1>
              <p className="text-gray-500 mt-1">Ačiū už dalyvavimą tyrime</p>
            </div>

            {/* Stats */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <h3 className="font-medium text-gray-700 mb-3">📊 Šiandienos statistika</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{entries.length}</div>
                  <div className="text-sm text-gray-500">Įrašų</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">{calculateAverageStress()}</div>
                  <div className="text-sm text-gray-500">Vid. stresas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl">{stressLevels.find(s => s.level === dayEndData.overallStress)?.emoji}</div>
                  <div className="text-sm text-gray-500">Dienos vertinimas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl">{sensorComfortLevels.find(s => s.level === dayEndData.sensorComfort)?.emoji}</div>
                  <div className="text-sm text-gray-500">Sensorių patogumas</div>
                </div>
              </div>
            </div>

            {/* Stressors */}
            {dayEndData.mainStressors.length > 0 && (
              <div className="bg-orange-50 rounded-2xl p-4 mb-6">
                <h3 className="font-medium text-gray-700 mb-2">⚡ Streso priežastys</h3>
                <div className="flex flex-wrap gap-2">
                  {dayEndData.mainStressors.map(s => {
                    const stressor = stressors.find(st => st.id === s);
                    return (
                      <span key={s} className="bg-white px-3 py-1 rounded-full text-sm border border-orange-200">
                        {stressor?.icon} {stressor?.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Export */}
            <div className="bg-blue-50 rounded-2xl p-4 mb-6">
              <h3 className="font-medium text-gray-700 mb-3">📥 Išsaugokite duomenis</h3>
              <div className="flex gap-2">
                <button
                  onClick={exportToCSV}
                  className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                >
                  📥 Atsisiųsti CSV
                </button>
                <button
                  onClick={copyToClipboard}
                  className="flex-1 py-3 bg-white border-2 border-blue-200 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors"
                >
                  📋 Kopijuoti
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Prašome išsaugoti duomenis prieš uždarant langą!
              </p>
            </div>

            {/* Thank you message */}
            <div className="text-center p-4 bg-green-50 rounded-2xl">
              <p className="text-green-800">
                🙏 Jūsų indėlis labai svarbus mūsų tyrimui. Iki kitos dienos!
              </p>
            </div>

            {/* New day button */}
            <button
              onClick={() => {
                setScreen('start');
                setEntries([]);
                setParticipantId('');
                setDayEndData({
                  overallStress: 3,
                  mainStressors: [],
                  sensorComfort: 3,
                  sensorIssues: '',
                  dayNotes: ''
                });
              }}
              className="w-full mt-4 py-3 text-gray-500 hover:text-gray-700"
            >
              Pradėti naują dieną →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // DIARY SCREEN
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <div className="font-bold text-gray-800">{participantId}</div>
              <div className="text-xs text-gray-500">{formatDate(new Date())}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {entries.length} įrašų
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 pb-40">
        {/* Instructions */}
        {entries.length === 0 && !showForm && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <p className="text-blue-800 text-sm">
              💡 Spauskite <strong>„+ Naujas įrašas"</strong> kiekvieną kartą, kai keičiasi jūsų veikla arba pajuntate streso pokytį.
            </p>
          </div>
        )}

        {/* Entry Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-5 mb-4 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-800 text-lg">Naujas įrašas</h2>
              <span className="text-sm text-gray-500">{formatTime(new Date())}</span>
            </div>
            
            {/* Activity Selection */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Ką dabar darote?
              </label>
              <div className="grid grid-cols-4 gap-2">
                {activities.map((act) => (
                  <div key={act.code} className="relative">
                    <button
                      onClick={() => setCurrentEntry({...currentEntry, activity: act.code})}
                      onMouseEnter={() => setActiveTooltip(act.code)}
                      onMouseLeave={() => setActiveTooltip(null)}
                      onTouchStart={() => setActiveTooltip(activeTooltip === act.code ? null : act.code)}
                      className={`w-full p-2 rounded-xl text-center transition-all transform hover:scale-105 ${
                        currentEntry.activity === act.code
                          ? 'bg-blue-500 text-white shadow-lg scale-105'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <div className="text-xl">{act.icon}</div>
                      <div className="text-[10px] mt-1 leading-tight">{act.name}</div>
                    </button>
                    {activeTooltip === act.code && (
                      <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg w-48 text-center">
                        {act.tooltip}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Stress Level */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Streso lygis
              </label>
              <div className="flex gap-2">
                {stressLevels.map((level) => (
                  <button
                    key={level.level}
                    onClick={() => setCurrentEntry({...currentEntry, stress: level.level})}
                    className={`flex-1 py-3 rounded-xl text-center transition-all transform hover:scale-105 border-2 ${
                      currentEntry.stress === level.level
                        ? `${level.color} border-current shadow-md scale-105`
                        : 'bg-gray-50 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-2xl">{level.emoji}</div>
                    <div className="text-xs mt-1 text-gray-600">{level.level}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* People Count */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Žmonių skaičius
              </label>
              <div className="flex gap-2">
                {peopleOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setCurrentEntry({...currentEntry, people: opt.value})}
                    className={`flex-1 py-2 px-1 rounded-xl text-center text-sm transition-all ${
                      currentEntry.people === opt.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Pastaba <span className="text-gray-400 font-normal">(neprivaloma)</span>
              </label>
              <input
                type="text"
                value={currentEntry.note}
                onChange={(e) => setCurrentEntry({...currentEntry, note: e.target.value})}
                placeholder="pvz., skubus terminas, triukšminga..."
                maxLength={100}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowForm(false);
                  setCurrentEntry({ activity: '', stress: 3, people: '0', note: '' });
                }}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Atšaukti
              </button>
              <button
                onClick={addEntry}
                disabled={!currentEntry.activity}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  currentEntry.activity
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Išsaugoti ✓
              </button>
            </div>
          </div>
        )}

        {/* Add Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-5 bg-blue-500 text-white rounded-2xl shadow-lg text-lg font-semibold hover:bg-blue-600 active:scale-[0.98] transition-all mb-4"
          >
            + Naujas įrašas
          </button>
        )}

        {/* Entries List */}
        {entries.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              Šiandienos įrašai ({entries.length})
            </h3>
            <div className="space-y-2">
              {[...entries].reverse().map((entry) => {
                const activity = activities.find(a => a.code === entry.activity);
                const stress = stressLevels.find(s => s.level === entry.stress);
                return (
                  <div 
                    key={entry.id} 
                    className={`bg-white rounded-xl p-3 shadow-sm border-l-4 ${getStressColor(entry.stress)} flex items-center gap-3`}
                  >
                    <div className="text-2xl">{activity?.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800">{activity?.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <span>{formatTime(entry.timestamp)}</span>
                        <span>•</span>
                        <span>{entry.people === '0' ? 'vienas/a' : entry.people + ' žm.'}</span>
                        {entry.note && (
                          <>
                            <span>•</span>
                            <span className="truncate">{entry.note}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-2xl">{stress?.emoji}</div>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer with End Day button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-lg mx-auto">
          {entries.length >= 1 ? (
            <button
              onClick={() => setScreen('endDay')}
              className="w-full py-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-xl font-semibold text-lg hover:from-orange-500 hover:to-pink-600 transition-all shadow-md"
            >
              🌅 Baigti dieną
            </button>
          ) : (
            <p className="text-center text-gray-400 text-sm py-2">
              Pridėkite bent vieną įrašą, kad galėtumėte baigti dieną
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StressDiaryApp;

// App wrapper
function App() {
  return <StressDiaryApp />;
}

export { App };
