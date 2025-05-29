const barsContainer = document.getElementById('bars');
const generateBtn = document.getElementById('generateBtn');
const sortBtn = document.getElementById('sortBtn');
const algorithmSelect = document.getElementById('algorithm');
const directionSelect = document.getElementById('direction');
const speedSlider = document.getElementById('speed');
const complexityInfo = document.getElementById('complexityInfo');
const customInput = document.getElementById('customInput');

let array = [];
const maxDelay = 1000;
const minDelay = 10;
let delay = maxDelay - parseInt(speedSlider.value) + minDelay;

// Update delay on slider change (inverted)
speedSlider.addEventListener('input', () => {
  delay = maxDelay - parseInt(speedSlider.value) + minDelay;
});

// Update complexity info on algorithm change
algorithmSelect.addEventListener('change', updateComplexity);

// Button listeners
generateBtn.addEventListener('click', generateArray);
sortBtn.addEventListener('click', sortArray);

// Initialize
updateComplexity();
generateArray();

function updateComplexity() {
  const algo = algorithmSelect.value;
  const complexityMap = {
    bubble: {
      time: 'O(n²)',
      space: 'O(1)'
    },
    insertion: {
      time: 'O(n²)',
      space: 'O(1)'
    },
    merge: {
      time: 'O(n log n)',
      space: 'O(n)'
    },
    quick: {
      time: 'O(n log n)',
      space: 'O(log n)'
    },
    heap: {
      time: 'O(n log n)',
      space: 'O(1)'
    }
  };
  const { time, space } = complexityMap[algo];
  complexityInfo.innerHTML = `<strong>Time Complexity:</strong> ${time}, <strong>Space Complexity:</strong> ${space}`;
}

function compare(a, b) {
  return directionSelect.value === 'asc' ? a > b : a < b;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateArray() {
  const input = customInput.value;
  if (input.trim()) {
    array = input
      .split(',')
      .map(num => parseInt(num.trim()))
      .filter(n => !isNaN(n));
  } else {
    array = Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 1);
  }
  drawBars();
}

function drawBars(highlight = -1, sortedIndices = []) {
  barsContainer.innerHTML = '';
  array.forEach((value, i) => {
    const barContainer = document.createElement('div');
    barContainer.className = 'bar-container';

    const label = document.createElement('div');
    label.className = 'bar-label';
    label.innerText = value;

    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${value * 3}px`;

    if (i === highlight) bar.classList.add('active');
    if (sortedIndices.includes(i)) bar.classList.add('sorted');

    barContainer.appendChild(label);
    barContainer.appendChild(bar);
    barsContainer.appendChild(barContainer);
  });
}

// Sorting Algorithms

async function sortArray() {
  const algorithm = algorithmSelect.value;
  switch (algorithm) {
    case 'bubble': await bubbleSort(); break;
    case 'insertion': await insertionSort(); break;
    case 'merge': await mergeSort(0, array.length - 1); break;
    case 'quick': await quickSort(0, array.length - 1); break;
    case 'heap': await heapSort(); break;
  }
  drawBars(-1, [...Array(array.length).keys()]);
}

async function bubbleSort() {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      if (compare(array[j], array[j + 1])) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        drawBars(j);
        await sleep(delay);
      }
    }
  }
}

async function insertionSort() {
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && compare(array[j], key)) {
      array[j + 1] = array[j];
      j--;
      drawBars(j + 1);
      await sleep(delay);
    }
    array[j + 1] = key;
    drawBars(i);
    await sleep(delay);
  }
}

async function mergeSort(left, right) {
  if (left >= right) return;
  const mid = Math.floor((left + right) / 2);
  await mergeSort(left, mid);
  await mergeSort(mid + 1, right);
  await merge(left, mid, right);
}

async function merge(left, mid, right) {
  const leftArr = array.slice(left, mid + 1);
  const rightArr = array.slice(mid + 1, right + 1);
  let i = 0, j = 0, k = left;
  while (i < leftArr.length && j < rightArr.length) {
    array[k++] = compare(leftArr[i], rightArr[j]) ? rightArr[j++] : leftArr[i++];
    drawBars(k - 1);
    await sleep(delay);
  }
  while (i < leftArr.length) array[k++] = leftArr[i++];
  while (j < rightArr.length) array[k++] = rightArr[j++];
}

async function quickSort(low, high) {
  if (low < high) {
    const pi = await partition(low, high);
    await quickSort(low, pi - 1);
    await quickSort(pi + 1, high);
  }
}

async function partition(low, high) {
  let pivot = array[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (compare(pivot, array[j])) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      drawBars(j);
      await sleep(delay);
    }
  }
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  return i + 1;
}

async function heapSort() {
  let n = array.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) await heapify(n, i);
  for (let i = n - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    drawBars(i);
    await sleep(delay);
    await heapify(i, 0);
  }
}

async function heapify(n, i) {
  let extreme = i;
  let l = 2 * i + 1, r = 2 * i + 2;
  if (directionSelect.value === 'asc') {
    if (l < n && array[l] > array[extreme]) extreme = l;
    if (r < n && array[r] > array[extreme]) extreme = r;
  } else {
    if (l < n && array[l] < array[extreme]) extreme = l;
    if (r < n && array[r] < array[extreme]) extreme = r;
  }
  if (extreme !== i) {
    [array[i], array[extreme]] = [array[extreme], array[i]];
    drawBars(extreme);
    await sleep(delay);
    await heapify(n, extreme);
  }
}
