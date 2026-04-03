const STORAGE_KEY = 'mf_planner_pro_v4';
let currentStep = 1;
let currentCharts = { current: null, target: null };

let goals = [
  { id: 1, name: 'Child Education', amount: 2500000, years: 10, priority: 'High' },
  { id: 2, name: 'Retirement', amount: 50000000, years: 9, priority: 'High' }
];

const profileTargets = {
  conservative: { indMf: 20, indEq: 8, usMf: 8, usEq: 2, debt: 28, gold: 12, invits: 7, realEstate: 15 },
  balanced:     { indMf: 22, indEq: 12, usMf: 10, usEq: 4, debt: 20, gold: 10, invits: 7, realEstate: 15 },
  growth:       { indMf: 24, indEq: 16, usMf: 12, usEq: 6, debt: 14, gold: 8,  invits: 6, realEstate: 14 },
  aggressive:   { indMf: 26, indEq: 19, usMf: 13, usEq: 8, debt: 10, gold: 7,  invits: 5, realEstate: 12 }
};

const fundDatabase = [
  {
    category: 'India Flexi Cap',
    fit: 'Core Growth',
    name: 'Parag Parikh Flexi Cap Fund',
    valueResearch: '5★',
    moneycontrol: '5★',
    expense: 'Low',
    purpose: 'Strong core holding for long-term Indian equity exposure with selective global style discipline.',
    notes: 'Suitable as a core diversified equity fund for long-duration goals.',
    benchmark: 'NIFTY 500 TRI',
    riskometer: 'Very High',
    score: 90,
    alt: 'Index alternative: Nifty 50 Index Fund'
  },
  {
    category: 'India Large & Mid Cap',
    fit: 'Blend',
    name: 'HDFC Large and Mid Cap Fund',
    valueResearch: '4★',
    moneycontrol: '4★',
    expense: 'Moderate',
    purpose: 'Balanced style to capture large-cap stability and mid-cap growth.',
    notes: 'Useful for balanced and growth profiles wanting a single blend vehicle.',
    benchmark: 'NIFTY LargeMidcap 250 TRI',
    riskometer: 'Very High',
    score: 84,
    alt: 'Safer alternative: Flexi Cap Fund'
  },
  {
    category: 'India Small Cap',
    fit: 'Satellite',
    name: 'Nippon India Small Cap Fund',
    valueResearch: '4★',
    moneycontrol: '4★',
    expense: 'Moderate',
    purpose: 'High growth satellite allocation for long time horizons only.',
    notes: 'Best for aggressive investors who can tolerate volatility.',
    benchmark: 'NIFTY Smallcap 250 TRI',
    riskometer: 'Very High',
    score: 78,
    alt: 'Safer alternative: Mid Cap Fund'
  },
  {
    category: 'US Index / Feeder',
    fit: 'Global Hedge',
    name: 'Motilal Oswal S&P 500 Index Fund',
    valueResearch: '4★',
    moneycontrol: '4★',
    expense: 'Low',
    purpose: 'Simple broad US market exposure and USD diversification.',
    notes: 'Useful for global diversification instead of concentrated stock picks.',
    benchmark: 'S&P 500',
    riskometer: 'Very High',
    score: 86,
    alt: 'Alternative: Nasdaq 100 exposure'
  },
  {
    category: 'US Growth / Innovation',
    fit: 'Satellite',
    name: 'Mirae Asset NYSE FANG+ ETF FoF',
    valueResearch: '3★',
    moneycontrol: '4★',
    expense: 'Moderate',
    purpose: 'Concentrated innovation and platform exposure for aggressive investors.',
    notes: 'Should remain a limited satellite allocation.',
    benchmark: 'NYSE FANG+ Index',
    riskometer: 'Very High',
    score: 72,
    alt: 'Safer alternative: S&P 500 Index Fund'
  },
  {
    category: 'Short Duration Debt',
    fit: 'Capital Stability',
    name: 'HDFC Short Term Debt Fund',
    valueResearch: '4★',
    moneycontrol: '4★',
    expense: 'Low',
    purpose: 'Stability bucket for near-term goals and rebalancing reserve.',
    notes: 'Useful for conservative and retirement-focused planning.',
    benchmark: 'CRISIL Short Duration Debt',
    riskometer: 'Moderate',
    score: 83,
    alt: 'Alternative: Corporate Bond Fund'
  },
  {
    category: 'Corporate Bond / Gilt',
    fit: 'Defensive Debt',
    name: 'SBI Magnum Gilt Fund',
    valueResearch: '4★',
    moneycontrol: '3★',
    expense: 'Moderate',
    purpose: 'High-quality debt option for defensive allocation.',
    notes: 'Better suited to investors who understand rate sensitivity.',
    benchmark: 'CRISIL Dynamic Gilt',
    riskometer: 'Moderately High',
    score: 76,
    alt: 'Alternative: Short Duration Debt Fund'
  },
  {
    category: 'Gold ETF',
    fit: 'Inflation Hedge',
    name: 'Nippon India Gold BeES',
    valueResearch: '4★',
    moneycontrol: '4★',
    expense: 'Low',
    purpose: 'Simple portfolio hedge against inflation, currency stress, and shocks.',
    notes: 'Should complement rather than replace debt allocation.',
    benchmark: 'Domestic Gold Price',
    riskometer: 'High',
    score: 80,
    alt: 'Alternative: Sovereign Gold Bonds when available'
  }
];

const el = (id) => document.getElementById(id);
const stepEls = () => document.querySelectorAll('.planner-step');
const numberFmt = (num) => `₹${Math.round(num || 0).toLocaleString('en-IN')}`;

function getProfile() {
  return {
    userName: el('userName').value.trim(),
    userEmail: el('userEmail').value.trim(),
    age: Number(el('age').value) || 0,
    retirementAge: Number(el('retirementAge').value) || 0,
    riskProfile: el('riskProfile').value,
    monthlySip: Number(el('monthlySip').value) || 0,
    monthlyExp: Number(el('monthlyExp').value) || 0,
    monthlyIncome: Number(el('monthlyIncome').value) || 0,
    currIndMf: Number(el('currIndMf').value) || 0,
    currIndEq: Number(el('currIndEq').value) || 0,
    currUsMf: Number(el('currUsMf').value) || 0,
    currUsEq: Number(el('currUsEq').value) || 0,
    currDebt: Number(el('currDebt').value) || 0,
    currGold: Number(el('currGold').value) || 0,
    currInvits: Number(el('currInvits').value) || 0,
    currRealEstate: Number(el('currRealEstate').value) || 0,
  };
}

function setProfile(data) {
  Object.entries(data || {}).forEach(([key, value]) => {
    const field = el(key);
    if (field) field.value = value;
  });
}

function renderGoals() {
  const tbody = el('goalsListBody');
  tbody.innerHTML = '';
  goals.forEach((g) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${g.name}</strong></td>
      <td>${numberFmt(g.amount)}</td>
      <td>${g.years}</td>
      <td><span class="fit-badge">${g.priority}</span></td>
      <td style="text-align:right;"><button class="remove-goal" data-id="${g.id}" title="Remove">×</button></td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.remove-goal').forEach((btn) => {
    btn.addEventListener('click', () => {
      goals = goals.filter((g) => g.id !== Number(btn.dataset.id));
      renderGoals();
      saveProgress(true);
    });
  });
}

function addGoal() {
  const name = el('goalName').value.trim();
  const amount = Number(el('goalAmount').value) || 0;
  const years = Number(el('goalYears').value) || 0;
  const priority = el('goalPriority').value;

  if (!name || amount <= 0 || years <= 0) {
    alert('Please enter goal name, amount, and years.');
    return;
  }

  goals.push({ id: Date.now(), name, amount, years, priority });
  el('goalName').value = '';
  el('goalAmount').value = '';
  el('goalYears').value = '';
  el('goalPriority').value = 'Medium';
  renderGoals();
  saveProgress(true);
}

function applyTemplate(templateString) {
  const [name, amount, years, priority] = templateString.split('|');
  el('goalName').value = name;
  el('goalAmount').value = amount;
  el('goalYears').value = years;
  el('goalPriority').value = priority;
}

function calculateTotalCorpus() {
  const profile = getProfile();
  const totalCorpus = profile.currIndMf + profile.currIndEq + profile.currUsMf + profile.currUsEq + profile.currDebt + profile.currGold + profile.currInvits + profile.currRealEstate;
  el('totalCorpusDisplay').textContent = numberFmt(totalCorpus);
  el('emergencyNeed').textContent = numberFmt(profile.monthlyExp * 12);
  el('monthlySurplus').textContent = numberFmt(profile.monthlyIncome - profile.monthlyExp);
  return totalCorpus;
}

function getAdjustedTargets(profile) {
  const base = { ...profileTargets[profile.riskProfile] };
  const yearsToRetire = Math.max(profile.retirementAge - profile.age, 0);

  if (profile.age >= 55 || yearsToRetire <= 7) {
    base.debt += 5; base.indEq -= 2; base.usEq -= 1; base.indMf -= 1; base.gold += 1;
  }
  if (profile.age < 40 && ['growth', 'aggressive'].includes(profile.riskProfile)) {
    base.indEq += 1; base.usEq += 1; base.debt -= 2;
  }

  const total = Object.values(base).reduce((a,b) => a + b, 0);
  Object.keys(base).forEach((k) => base[k] = +(base[k] * (100 / total)).toFixed(1));
  return base;
}

function validateStep(step) {
  const p = getProfile();
  if (step === 2) {
    if (!p.userName || !p.userEmail || p.age < 18 || p.retirementAge <= p.age || p.monthlyIncome <= 0) {
      alert('Please complete profile details with valid age, retirement age, income, name, and email.');
      return false;
    }
  }
  if (step === 3) {
    if (goals.length === 0) {
      alert('Please add at least one goal before continuing.');
      return false;
    }
  }
  if (step === 4) {
    if (calculateTotalCorpus() <= 0) {
      alert('Please enter current portfolio values before continuing.');
      return false;
    }
  }
  return true;
}

function showStep(step) {
  stepEls().forEach((section) => section.classList.add('hidden'));
  document.querySelector(`.planner-step[data-step="${step}"]`).classList.remove('hidden');
  currentStep = step;
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress() {
  el('stepCounter').textContent = `Step ${currentStep} of 5`;
  el('progressFill').style.width = `${(currentStep / 5) * 100}%`;
  document.querySelectorAll('.step-label').forEach((label, idx) => {
    const step = idx + 1;
    label.classList.toggle('active', step === currentStep);
    label.classList.toggle('complete', step < currentStep);
  });
}

function updateDefaultSummary() {
  const profile = getProfile();
  const yearsToRetire = Math.max(profile.retirementAge - profile.age, 0);
  const text = `${capitalize(profile.riskProfile)} profile • ${yearsToRetire} years to retirement`;
  el('defaultSummary').textContent = text;
}

function capitalize(v) { return v ? v.charAt(0).toUpperCase() + v.slice(1) : ''; }

function buildAllocationRows(targets) {
  const labels = [
    ['indMf', 'India Mutual Funds'],
    ['indEq', 'India Direct Equity'],
    ['usMf', 'US Mutual Funds / ETFs'],
    ['usEq', 'US Direct Equity'],
    ['debt', 'Debt / Fixed Income'],
    ['gold', 'Gold / Silver'],
    ['invits', 'InvITs / REITs'],
    ['realEstate', 'Real Estate (Investment)']
  ];

  el('targetBreakdown').innerHTML = labels.map(([key, label]) => `<li><span>${label}</span><span>${targets[key]}%</span></li>`).join('');
}

function buildActionPlan(targets, totalCorpus, profile) {
  const mapping = [
    ['indMf', 'India Mutual Funds', profile.currIndMf],
    ['indEq', 'India Direct Equity', profile.currIndEq],
    ['usMf', 'US Mutual Funds / ETFs', profile.currUsMf],
    ['usEq', 'US Direct Equity', profile.currUsEq],
    ['debt', 'Debt / Fixed Income', profile.currDebt],
    ['gold', 'Gold / Silver', profile.currGold],
    ['invits', 'InvITs / REITs', profile.currInvits],
    ['realEstate', 'Real Estate (Investment)', profile.currRealEstate],
  ];

  const actionItems = [];
  el('actionPlan').innerHTML = '';
  mapping.forEach(([key, label, currentAmount]) => {
    const targetAmount = (targets[key] / 100) * totalCorpus;
    const diff = Math.round(targetAmount - currentAmount);
    let badge = '<span class="hold-action">Hold</span>';
    if (Math.abs(diff) >= 5000) {
      badge = diff > 0 ? `<span class="buy-action">Buy ${numberFmt(diff)}</span>` : `<span class="sell-action">Trim ${numberFmt(Math.abs(diff))}</span>`;
      actionItems.push({ label, diff });
    }
    const row = document.createElement('li');
    row.innerHTML = `<span>${label}</span>${badge}`;
    el('actionPlan').appendChild(row);
  });

  actionItems.sort((a,b) => Math.abs(b.diff) - Math.abs(a.diff));
  const top = actionItems[0];
  if (top) {
    el('topAction').textContent = top.diff > 0 ? 'Add allocation' : 'Reduce allocation';
    el('topActionDetail').textContent = `${top.label}: ${numberFmt(Math.abs(top.diff))}`;
  } else {
    el('topAction').textContent = 'Mostly aligned';
    el('topActionDetail').textContent = 'Current portfolio is close to target.';
  }
}

function filterFunds(profile) {
  const risk = profile.riskProfile;
  const yearsToRetire = Math.max(profile.retirementAge - profile.age, 0);
  return fundDatabase.filter((fund) => {
    if (fund.category.includes('Small Cap')) return ['growth', 'aggressive'].includes(risk) && yearsToRetire >= 7;
    if (fund.category.includes('FANG')) return ['growth', 'aggressive'].includes(risk);
    if (fund.category.includes('Debt') || fund.category.includes('Gold')) return true;
    return true;
  }).sort((a,b) => b.score - a.score).slice(0, 6);
}

function renderFunds(profile) {
  const funds = filterFunds(profile);
  const tbody = el('fundTableBody');
  tbody.innerHTML = '';
  funds.forEach((fund) => {
    const tr = document.createElement('tr');
    tr.dataset.fund = fund.name;
    tr.innerHTML = `
      <td>${fund.category}</td>
      <td><strong>${fund.name}</strong></td>
      <td><span class="fit-badge">${fund.fit}</span></td>
      <td><span class="rating-badge">${fund.valueResearch}</span></td>
      <td><span class="rating-badge">${fund.moneycontrol}</span></td>
      <td>${fund.purpose}</td>
    `;
    tr.addEventListener('click', () => openFundModal(fund));
    tbody.appendChild(tr);
  });
}

function openFundModal(fund) {
  el('modalFundName').textContent = fund.name;
  el('modalFundBody').innerHTML = `
    <div class="tagline">${fund.category} • ${fund.fit}</div>
    <p>${fund.notes}</p>
    <div class="modal-grid">
      <div class="modal-stat"><span>Value Research Rating</span><strong>${fund.valueResearch}</strong></div>
      <div class="modal-stat"><span>Moneycontrol Rating</span><strong>${fund.moneycontrol}</strong></div>
      <div class="modal-stat"><span>Expense Profile</span><strong>${fund.expense}</strong></div>
      <div class="modal-stat"><span>Riskometer</span><strong>${fund.riskometer}</strong></div>
      <div class="modal-stat"><span>Benchmark</span><strong>${fund.benchmark}</strong></div>
      <div class="modal-stat"><span>Alternative</span><strong>${fund.alt}</strong></div>
    </div>
  `;
  el('fundModal').classList.remove('hidden');
}

function closeFundModal() { el('fundModal').classList.add('hidden'); }

function calculateGoalFeasibility(profile, totalCorpus) {
  const expectedReturn = 0.10;
  const inflation = 0.06;
  const monthlyReturn = expectedReturn / 12;
  let totalPVNeeded = 0;

  goals.forEach((g) => {
    const futureCost = g.amount * Math.pow(1 + inflation, g.years);
    const presentValue = futureCost / Math.pow(1 + expectedReturn, g.years);
    totalPVNeeded += presentValue;
  });

  const avgYears = goals.length ? goals.reduce((s, g) => s + g.years, 0) / goals.length : 10;
  const months = avgYears * 12;
  const sipPV = profile.monthlySip > 0 ? profile.monthlySip * ((1 - Math.pow(1 + monthlyReturn, -months)) / monthlyReturn) : 0;
  const totalPVAvailable = totalCorpus + sipPV;

  const retireYears = Math.max(profile.retirementAge - profile.age, 0);
  const futureMonthlyExp = profile.monthlyExp * Math.pow(1 + inflation, retireYears);
  const fireTarget = futureMonthlyExp * 12 * 25;
  const fvCorpus = totalCorpus * Math.pow(1 + expectedReturn, retireYears);
  const fvSip = profile.monthlySip > 0 ? profile.monthlySip * ((Math.pow(1 + monthlyReturn, retireYears * 12) - 1) / monthlyReturn) * (1 + monthlyReturn) : 0;
  const totalFV = fvCorpus + fvSip;

  let goalStatus = totalPVAvailable >= totalPVNeeded ? 'On Track' : 'Gap Found';
  let fireStatus = totalFV >= fireTarget ? 'Ready' : 'Gap Found';
  let healthScore = 50;

  const emergencyNeed = profile.monthlyExp * 12;
  const defensiveBucket = profile.currDebt + profile.currGold;
  if (defensiveBucket >= emergencyNeed) healthScore += 15;
  if (profile.monthlyIncome > profile.monthlyExp) healthScore += 10;
  if (goalStatus === 'On Track') healthScore += 15;
  if (fireStatus === 'Ready') healthScore += 10;

  healthScore = Math.min(100, healthScore);

  return {
    goalStatus,
    fireStatus,
    healthScore,
    totalPVNeeded,
    totalPVAvailable,
    fireTarget,
    totalFV,
    futureMonthlyExp,
    emergencyNeed
  };
}

function renderFeasibility(feasibility, profile) {
  el('goalStatus').textContent = feasibility.goalStatus;
  el('goalMessage').textContent = feasibility.goalStatus === 'On Track'
    ? 'Current corpus + SIP appears sufficient for listed goals.'
    : `Gap of ${numberFmt(feasibility.totalPVNeeded - feasibility.totalPVAvailable)} in present value terms.`;

  el('fireStatus').textContent = feasibility.fireStatus;
  el('fireMessage').textContent = feasibility.fireStatus === 'Ready'
    ? `Projected corpus ${numberFmt(feasibility.totalFV)} vs target ${numberFmt(feasibility.fireTarget)}.`
    : `Need to improve retirement funding; target ${numberFmt(feasibility.fireTarget)}.`;

  el('healthScore').textContent = `${feasibility.healthScore}/100`;
  el('healthMessage').textContent = feasibility.healthScore >= 80 ? 'Strong' : feasibility.healthScore >= 65 ? 'Good, but improvable' : 'Needs attention';

  el('feasibilityReport').innerHTML = `
    <div class="note-card">
      <strong>Goal Feasibility</strong>
      <div>Required present value for goals: ${numberFmt(feasibility.totalPVNeeded)}</div>
      <div>Available present value from corpus + SIPs: ${numberFmt(feasibility.totalPVAvailable)}</div>
    </div>
    <div class="note-card">
      <strong>Retirement / FIRE</strong>
      <div>Future monthly expense at retirement: ${numberFmt(feasibility.futureMonthlyExp)}</div>
      <div>4% withdrawal target corpus: ${numberFmt(feasibility.fireTarget)}</div>
      <div>Projected corpus: ${numberFmt(feasibility.totalFV)}</div>
    </div>
    <div class="note-card">
      <strong>Emergency Reserve</strong>
      <div>Suggested emergency fund: ${numberFmt(feasibility.emergencyNeed)}</div>
      <div>Current debt + gold bucket: ${numberFmt(profile.currDebt + profile.currGold)}</div>
    </div>
  `;
}

function renderAdvisorNotes(profile, feasibility, targets) {
  const notes = [];
  const surplus = profile.monthlyIncome - profile.monthlyExp;
  if (surplus < profile.monthlySip) {
    notes.push({ title: 'Cashflow caution', body: 'Current SIP is higher than monthly surplus. Verify whether the SIP is fully supported by recurring income.' });
  }
  if ((profile.currDebt + profile.currGold) < profile.monthlyExp * 12) {
    notes.push({ title: 'Emergency fund gap', body: 'Increase debt / liquid allocation until at least 12 months of expenses are covered.' });
  }
  if (['growth', 'aggressive'].includes(profile.riskProfile)) {
    notes.push({ title: 'Equity discipline', body: 'Use equity-heavy allocation only for long-duration goals. Keep near-term expenses out of volatile assets.' });
  }
  notes.push({ title: 'Ratings usage', body: 'Value Research Rating and Moneycontrol Rating are supporting signals, not standalone buy decisions.' });
  notes.push({ title: 'Suggested approach', body: `For a ${profile.riskProfile} profile, use India Mutual Funds (${targets.indMf}%) as the core and debt (${targets.debt}%) for stability.` });

  el('advisorNotes').innerHTML = notes.map((note) => `<div class="note-card"><strong>${note.title}</strong><div>${note.body}</div></div>`).join('');
}

function chartConfig(labels, data, title) {
  return {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#2563eb','#0ea5e9','#22c55e','#f59e0b','#7c3aed','#e11d48','#14b8a6','#64748b'],
        borderColor: '#ffffff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: false, text: title }
      }
    }
  };
}

function renderCharts(profile, targets) {
  const labels = ['India MF', 'India Eq', 'US MF', 'US Eq', 'Debt', 'Gold', 'InvITs', 'Real Estate'];
  const currentData = [profile.currIndMf, profile.currIndEq, profile.currUsMf, profile.currUsEq, profile.currDebt, profile.currGold, profile.currInvits, profile.currRealEstate];
  const targetData = [targets.indMf, targets.indEq, targets.usMf, targets.usEq, targets.debt, targets.gold, targets.invits, targets.realEstate];

  if (typeof Chart === 'undefined') {
    el('currentAllocationChart').replaceWith(document.createTextNode('Chart library unavailable.'));
    el('targetAllocationChart').replaceWith(document.createTextNode('Chart library unavailable.'));
    return;
  }

  if (currentCharts.current) currentCharts.current.destroy();
  if (currentCharts.target) currentCharts.target.destroy();

  currentCharts.current = new Chart(el('currentAllocationChart'), chartConfig(labels, currentData, 'Current Allocation'));
  currentCharts.target = new Chart(el('targetAllocationChart'), chartConfig(labels, targetData, 'Target Allocation'));
}

function generatePlan() {
  const profile = getProfile();
  const totalCorpus = calculateTotalCorpus();
  if (totalCorpus <= 0) {
    alert('Please enter portfolio values before generating the plan.');
    return;
  }

  const targets = getAdjustedTargets(profile);
  const feasibility = calculateGoalFeasibility(profile, totalCorpus);

  buildAllocationRows(targets);
  buildActionPlan(targets, totalCorpus, profile);
  renderFunds(profile);
  renderFeasibility(feasibility, profile);
  renderAdvisorNotes(profile, feasibility, targets);
  renderCharts(profile, targets);
  showStep(5);
  saveProgress(true);
}

function saveProgress(silent = false) {
  const payload = { profile: getProfile(), goals, currentStep };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  if (!silent) alert('Progress saved in your browser.');
}

function loadProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    alert('No saved progress found.');
    return;
  }
  try {
    const payload = JSON.parse(raw);
    setProfile(payload.profile || {});
    goals = payload.goals || goals;
    renderGoals();
    calculateTotalCorpus();
    updateDefaultSummary();
    showStep(Math.min(payload.currentStep || 1, 4));
  } catch {
    alert('Saved data could not be loaded.');
  }
}

function resetPlanner() {
  showStep(1);
}

function bindEvents() {
  el('addGoalBtn').addEventListener('click', addGoal);
  document.querySelectorAll('.template-btn').forEach((btn) => btn.addEventListener('click', () => applyTemplate(btn.dataset.template)));
  document.querySelectorAll('.next-btn').forEach((btn) => btn.addEventListener('click', () => {
    const nextStep = Number(btn.dataset.next);
    if (validateStep(nextStep)) showStep(nextStep);
  }));
  document.querySelectorAll('.back-btn').forEach((btn) => btn.addEventListener('click', () => showStep(Number(btn.dataset.back))));
  document.querySelectorAll('.asset-input, #monthlyExp, #monthlyIncome, #monthlySip, #age, #retirementAge, #riskProfile').forEach((field) => {
    field.addEventListener('input', () => { calculateTotalCorpus(); updateDefaultSummary(); saveProgress(true); });
    field.addEventListener('change', () => { calculateTotalCorpus(); updateDefaultSummary(); saveProgress(true); });
  });

  ['userName','userEmail','goalName','goalAmount','goalYears'].forEach((id) => {
    const field = el(id);
    field.addEventListener('change', () => saveProgress(true));
  });

  el('generatePlanBtn').addEventListener('click', generatePlan);
  el('saveProfileBtn').addEventListener('click', () => saveProgress(false));
  el('resumeProfileBtn').addEventListener('click', loadProgress);
  el('printReportBtn').addEventListener('click', () => window.print());
  el('startOverBtn').addEventListener('click', resetPlanner);
  el('closeModalBtn').addEventListener('click', closeFundModal);
  el('fundModal').addEventListener('click', (e) => { if (e.target.id === 'fundModal') closeFundModal(); });
}

function init() {
  renderGoals();
  calculateTotalCorpus();
  updateDefaultSummary();
  updateProgress();
  bindEvents();
}

init();
