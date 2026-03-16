const recordTitle = document.querySelector('#recordTitle');
const recordMinute = document.querySelector('#recordMinute');
const recordSubmit = document.querySelector('#recordSubmit');
const recordList = document.querySelector('#recordList');
const recordClear = document.querySelector('#recordClear');

let records = [];

recordSubmit.addEventListener('click', (e) => {
    e.preventDefault();

    const title = recordTitle.value.trim();
    const minute = recordMinute.value;
    
    if (title === '' || minute === '') {
        alert('タイトルと分数を入力してください。');
        return;
    }

    addNewRecord(title, minute);
    renderRecords();
    recordTitle.value = '';
    recordMinute.value = '';
    saveRecords();
});

recordClear.addEventListener('click', () => {
    if (confirm('全ての記録をクリアしますか？')) {
        records = [];
        renderRecords();
        saveRecords();
    }
});

function timeToMinute(minute) {
    minute = minute.trim();
    const parts = minute.split(":");
    const minutes = Number(parts[0])*60 + Number(parts[1]);
    return minutes;
}

function minuteToTime(minute) {
    const hours = Math.floor(minute / 60);
    const minutes = minute % 60;
    return `${hours}時間${minutes.toString().padStart(2, '0')}分`;
}

function addNewRecord(title, minute) {
    if (equalTitle(title)) {
        const record = records.find(record => record.title === title);
        record.minute += timeToMinute(minute);
    } else {
        records.push( { title, minute: timeToMinute(minute) } );
    }
}

function equalTitle(title) {  // タイトルが既に存在するかどうかをチェックする関数　同じである場合には、時間を加算するようにする
    return records.some(record => record.title === title);
}

function renderRecords() {
    recordList.innerHTML = '';
    records.forEach(record => {
        const li = document.createElement('li');
        li.classList.add('record-item');
        li.textContent = `${record.title}: ${minuteToTime(record.minute)}`;
        recordList.appendChild(li);

        const div = document.createElement("div");
        div.classList.add("record-buttons");
        li.appendChild(div);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "削除";
        deleteButton.addEventListener("click", () => {
            if (confirm(`「${record.title}」の記録を削除しますか？`)) {
                records = records.filter(r => r.title !== record.title);
                renderRecords();
                saveRecords();
            }
        });
        div.appendChild(deleteButton);

        const selectButton = document.createElement("button");
        selectButton.textContent = "選択";
        selectButton.addEventListener("click", () => {
            recordTitle.value = record.title;
        });
        div.appendChild(selectButton);
    });
}

//localStorage
function saveRecords() {
    localStorage.setItem('records', JSON.stringify(records));
}

function loadRecords() {
    const savedRecords = localStorage.getItem('records');
    if (savedRecords) {
        records = JSON.parse(savedRecords);
        renderRecords();
    }
}

loadRecords();

//timerについて
const timerDisplay = document.querySelector('#timerDisplay');
const startTimer = document.querySelector('#startTimer');
const stopTimer = document.querySelector('#stopTimer');
const resetTimer = document.querySelector('#resetTimer');
const recordTimer = document.querySelector('#recordTimer');

let timerInterval;
let startTime = 0;

function updateTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    startTime = Date.now();
    timerInterval = setInterval(tick, 10);
}

function tick() {
    const elapsed = Date.now() - startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const centiSeconds = Math.floor((elapsed % 1000) / 10);
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${centiSeconds.toString().padStart(2, '0')}`;
}

startTimer.addEventListener('click', updateTimer);
stopTimer.addEventListener('click', () => {
    clearInterval(timerInterval);
});

resetTimer.addEventListener('click', () => {
    if (timerInterval) {
        clearInterval(timerInterval);
        if(confirm('タイマーをリセットしますか？')) {
            clearInterval(timerInterval);
            startTime = 0;
            timerDisplay.textContent = "00:00:00";
        }
    }
});

recordTimer.addEventListener('click', () => {
    const elapsed = Date.now() - startTime;
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const title = prompt('記録のタイトルを入力してください:');
    if (title) {
        addNewRecord(title, `${hours}:${minutes}`);
        renderRecords();
        saveRecords();
    }
});