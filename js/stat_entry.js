function initStatEntry(statListEl, positionDropdownEl, stats, positions, events) {
  const listEl = statListEl.querySelector('ul');
  const positionEl = positionDropdownEl.querySelector('div#athlete-position');

  const statListItems = {};
  const positionPositionItems = {};
  positions = positions.sort((a, b) => {
    return a.localeCompare(b);
  });

  const inputEl = document.querySelectorAll('#name-input, #status-input, #number-input');

  inputEl.forEach(function(input) {
    input.style.boxSizing = 'content-box'; // Ensure box-sizing is consistent
    input.addEventListener('input', resizeInput);
    resizeInput.call(input);
  });

  function resizeInput() {
    this.style.width = (this.value.length + 1) + 'ch'; // Adjust as needed
  }

  const orderedStats = [
    'Weight', 'Height', 'Wingspan',
    'Bench', 'Squat', '225lb Bench',
    'Vertical Jump', 'Broad Jump', 'Hang Clean', 'Power Clean',
    '10Y Sprint', 'Flying 10',
    'Pro Agility', 'L Drill', '60Y Shuttle',
  ];

  const unitMapping = {
    pounds: ['Bench', 'Squat', 'Power Clean', 'Hang Clean', 'Weight'],
    reps: ['225lb Bench'],
    inches: ['Vertical Jump', 'Broad Jump', 'Height', 'Wingspan'],
    seconds: ['10Y Sprint', '60Y Shuttle', 'L Drill', 'Pro Agility', 'Flying 10'],
  };

  function getUnit(stat) {
    if (unitMapping.pounds.includes(stat)) {
      return 'lbs';
    } else if (unitMapping.reps.includes(stat)) {
      return 'reps';
    } else if (unitMapping.inches.includes(stat)) {
      return 'in';
    } else if (unitMapping.seconds.includes(stat)) {
      return 's';
    }
    return '';
  }

  function updatePositionTitle(position) {
    const titleEl = document.getElementById('position-title');
    if (titleEl) {
      titleEl.textContent = `${position}`;
    }
  }

  function initListItems() {
    for (const stat of orderedStats) {
      if (stats.includes(stat)) {
        const unit = getUnit(stat);
        const item = document.createElement('li');
        item.innerHTML = `
              <label>
                  ${stat}
                  <div class="input-wrapper">
                      <input type="number" id="athlete-stat-${stat}" name="${stat}" max="1000" step="any">
                      <span class="unit">${unit}</span>
                  </div>
              </label>
              `;
        statListItems[stat] = item;
      }
    }
  }

  function initPositionItems() {
    const selectEl = document.createElement('select');
    selectEl.name = 'position';

    for (const position of positions) {
      const option = document.createElement('option');
      option.value = position;
      option.textContent = position;
      selectEl.appendChild(option);
    }
    return selectEl;
  }

  initPositionItems();
  initListItems();

  function populateList(stats) {
    const statCategories = {
      anthropometrics: ['Weight', 'Height', 'Wingspan'],
      strength: ['Bench', 'Squat', '225lb Bench'],
      speed: ['10Y Sprint', 'Flying 10'],
      agility: ['Pro Agility', 'L Drill', '60Y Shuttle'],
      power: ['Vertical Jump', 'Broad Jump', 'Hang Clean', 'Power Clean'],
    };

    listEl.innerHTML = '';

    const categoryAdded = new Set();

    for (const stat of orderedStats) {
      if (stats.includes(stat)) {
        // Find the category for the current stat
        for (const [category, categoryStats] of Object.entries(statCategories)) {
          if (categoryStats.includes(stat) && !categoryAdded.has(category)) {
            // Create and append a label for the category
            const labelEl = document.createElement('li');
            labelEl.className = 'stat-category-label';
            labelEl.textContent = category.charAt(0).toUpperCase() + category.slice(1); // Capitalize category name
            listEl.appendChild(labelEl);
            categoryAdded.add(category);
          }
        }

        const item = statListItems[stat];
        listEl.appendChild(item);
      }
    }
  }


  function populatePosition() {
    positionEl.innerHTML = '';

    const position = initPositionItems();
    positionEl.appendChild(position);

    position.addEventListener('change', handlePositionChange);
  }

  populatePosition();
  populateList(stats);

  // Handle stat entry
  function handleNumEntry(evt) {
    const numInput = evt.target;
    const statName = numInput.name;
    const filled = numInput.value.trim() !== '' && parseFloat(numInput.value) > 0;
    const statValue = filled ? parseFloat(numInput.value) : null;

    numInput.setCustomValidity('');

    if (!numInput.checkValidity() || parseFloat(numInput.value) <= 0) {
      numInput.setCustomValidity('Please enter a valid number');
      numInput.reportValidity();
      return;
    }

    const event = new CustomEvent('statFilled', {
      detail: { statName, filled, statValue },
    });
    events.dispatchEvent(event);
  }

  // Handle position selection
  function handlePositionChange(evt) {
    const selectedPosition = evt.target.value;

    const event = new CustomEvent('positionSelected', {
      detail: { position: selectedPosition },
    });
    events.dispatchEvent(event);
    updatePositionTitle(selectedPosition);
  }


  for (const item of Object.values(statListItems)) {
    const numInput = item.querySelector('input');
    numInput.addEventListener('input', handleNumEntry);
  }

  for (const item of Object.values(positionPositionItems)) {
    const radioInput = item.querySelector('input');
    radioInput.addEventListener('change', handlePositionChange);
  }
}

export { initStatEntry };
