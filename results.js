// Get address from URL params
const params = new URLSearchParams(window.location.search);
const address = params.get('address') || '1234 Main St, Austin, TX';

// Store address for checkout
sessionStorage.setItem('tf_address', address);

// Generate realistic-looking mock data based on address string
function seedRandom(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededNum(seed, min, max) {
  const x = Math.sin(seed) * 10000;
  const rand = x - Math.floor(x);
  return Math.floor(rand * (max - min + 1)) + min;
}

const seed = seedRandom(address);
const assessedValue  = seededNum(seed,       280000, 620000);
const overPct        = seededNum(seed + 1,   8, 18);           // % over fair value
const fairValue      = Math.round(assessedValue / (1 + overPct / 100));
const overassessment = assessedValue - fairValue;
const taxRate        = seededNum(seed + 2,   18, 26) / 1000;   // ~1.8–2.6%
const currentTax     = Math.round(assessedValue * taxRate);
const projectedTax   = Math.round(fairValue * taxRate);
const savings        = currentTax - projectedTax;
const sqft           = seededNum(seed + 3,   1600, 2400);
const strengthPct    = seededNum(seed + 4,   70, 95);

// Comp properties
const streetNames = ['Oak', 'Elm', 'Cedar', 'Maple', 'Pecan', 'Birch', 'Pine'];
const streetTypes = ['St', 'Ave', 'Dr', 'Ln', 'Blvd'];
function compAddr(n) {
  const num = seededNum(seed + n * 7, 100, 999);
  const name = streetNames[seededNum(seed + n * 3, 0, streetNames.length - 1)];
  const type = streetTypes[seededNum(seed + n * 5, 0, streetTypes.length - 1)];
  return `${num} ${name} ${type}`;
}

function fmt(n) { return '$' + n.toLocaleString(); }

// Simulate loading steps then show results
function runLoading() {
  const steps = ['lstep1','lstep2','lstep3','lstep4'];
  const delays = [800, 1600, 2400, 3200];

  steps.forEach((id, i) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      el.classList.add('done');
      el.innerHTML = el.innerHTML.replace('⏳', '✓');
    }, delays[i]);
  });

  setTimeout(() => {
    populateResults();
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('results-page').style.display = 'block';
    // Animate strength bar
    setTimeout(() => {
      document.getElementById('strength-fill').style.width = strengthPct + '%';
    }, 200);
    // Animate savings number
    animateCount('savings-amount', savings, '$');
  }, 4200);
}

function animateCount(id, target, prefix = '') {
  const el = document.getElementById(id);
  const duration = 1200;
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = prefix + Math.round(current).toLocaleString();
  }, duration / steps);
}

function populateResults() {
  // Header
  document.getElementById('address-display').textContent = address;

  // Summary cards
  document.getElementById('savings-amount').textContent = fmt(savings);
  document.getElementById('current-value').textContent = fmt(assessedValue);
  document.getElementById('fair-value').textContent = fmt(fairValue);
  document.getElementById('overassessment').textContent = fmt(overassessment);

  // Strength label
  const label = strengthPct >= 85 ? 'Very Strong' : strengthPct >= 75 ? 'Strong' : 'Moderate';
  document.getElementById('strength-label').textContent = label + ' Appeal Case (' + strengthPct + '%)';

  // Bottom savings
  document.getElementById('bottom-savings').textContent = fmt(savings);

  // Your row in comp table
  document.getElementById('comp-your-address').textContent = address.split(',')[0];
  document.getElementById('comp-sqft').textContent = sqft.toLocaleString();
  document.getElementById('comp-your-value').textContent = fmt(assessedValue);
  document.getElementById('comp-your-tax').textContent = fmt(currentTax) + '/yr';

  // Comp rows
  const comps = [
    { addr: compAddr(1), sqft: seededNum(seed+10, 1700, 2200), valAdj: -0.09 },
    { addr: compAddr(2), sqft: seededNum(seed+11, 1750, 2300), valAdj: -0.11 },
    { addr: compAddr(3), sqft: seededNum(seed+12, 1650, 2100), valAdj: -0.07 },
  ];

  comps.forEach((c, i) => {
    const n = i + 1;
    const cVal = Math.round(assessedValue * (1 + c.valAdj));
    const cTax = Math.round(cVal * taxRate);
    document.getElementById(`comp${n}-addr`).textContent = c.addr;
    document.getElementById(`comp${n}-sqft`).textContent = c.sqft.toLocaleString();
    document.getElementById(`comp${n}-val`).textContent = fmt(cVal);
    document.getElementById(`comp${n}-tax`).textContent = fmt(cTax) + '/yr';
  });

  // Pass data to checkout via sessionStorage
  sessionStorage.setItem('tf_savings', savings);
  sessionStorage.setItem('tf_currentTax', currentTax);
  sessionStorage.setItem('tf_assessedValue', assessedValue);
}

runLoading();
