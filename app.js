const goals = [
  { id: 1, name: 'Kid 1 Undergrad', amount: 2500000, years: 10, type: 'education' },
  { id: 2, name: 'Retirement', amount: 50000000, years: 20, type: 'retirement' }
];

const fundData = {
  core: [
    {
      name: 'Parag Parikh Flexi Cap Fund',
      bucket: 'Best fit',
      category: 'Flexi Cap',
      risk: 'Moderately High',
      vr: 5,
      mc: 5,
      expense: 0.76,
      consistency: 9,
      costScore: 8,
      style: 'global-aware',
      notes: 'Core diversified active fund with blended India-plus-global orientation and reasonable cost.'
    },
    {
      name: 'UTI Nifty 50 Index Fund',
      bucket: 'Lower-cost option',
      category: 'Large Cap Index',
      risk: 'Moderate',
      vr: 4,
      mc: 4,
      expense: 0.2,
      consistency: 8,
      costScore: 10,
      style: 'index',
      notes: 'Simple low-cost core holding for users preferring clean benchmark exposure.'
    },
    {
      name: 'HDFC Flexi Cap Fund',
      bucket: 'Aggressive option',
      category: 'Flexi Cap',
      risk: 'Moderately High',
      vr: 4,
      mc: 4,
      expense: 0.95,
      consistency: 8,
      costScore: 7,
      style: 'active',
      notes: 'Broader active style suited to users comfortable with active manager tilt.'
    }
  ],
  satellite: [
    {
      name: 'HDFC Mid-Cap Opportunities Fund',
      bucket: 'Best fit',
      category: 'Mid Cap',
      risk: 'High',
      vr: 4,
      mc: 4,
      expense: 0.83,
      consistency: 8,
      costScore: 7,
      style: 'growth',
      notes: 'Adds controlled mid-cap growth for long-horizon investors.'
    },
    {
      name: 'Nippon India Small Cap Fund',
      bucket: 'Aggressive option',
      category: 'Small Cap',
      risk: 'Very High',
      vr: 4,
      mc: 4,
      expense: 0.73,
      consistency: 7,
      costScore: 7,
      style: 'smallcap',
      notes: 'Only for investors with high risk tolerance and long patience.'
    }
  ],
  debt: [
    {
      name: 'HDFC Corporate Bond Fund',
      bucket: 'Best fit',
      category: 'Debt',
      risk: 'Moderate',
      vr: 4,
      mc: 4,
      expense: 0.36,
      consistency: 8,
      costScore: 9,
      style: 'quality debt',
      notes: 'Suitable core debt sleeve for stability and predictable compounding.'
    },
    {
      name: 'SBI Magnum Gilt Fund',
      bucket: 'Interest-rate hedge',
      category: 'Gilt',
      risk: 'Moderate',
      vr: 4,
      mc: 3,
      expense: 0.62,
      consistency: 7,
      costScore: 7,
      style: 'duration',
      notes: 'Useful when falling rates and sovereign safety are key priorities.'
    },
    {
      name: 'Quant Liquid Fund',
      bucket: 'Emergency sleeve',
      category: 'Liquid',
      risk: 'Low to Moderate',
      vr: 3,
      mc: 3,
      expense: 0.22,
      consistency: 7,
      costScore: 10,
      style: 'cash',
      notes: 'For emergency cash and near-term liabilities rather than return maximization.'
    }
  ],
  global: [
    {
      name: 'Motilal Oswal S&P 500 Index Fund',
      bucket: 'Best fit',
      category: 'International',
      risk: 'Moderately High',
      vr: 4,
      mc: 4,
      expense: 0.5,
      consistency: 8,
      costScore: 8,
      style: 'global index',
      notes: 'Simple USD diversification sleeve for global exposure.'
    },
    {
      name: 'Mirae Asset NYSE FANG+ ETF FoF',
      bucket: 'Aggressive option',
      category: 'International / Tech',
      risk: 'Very High',
      vr: 3,
      mc: 4,
      expense: 0.62,
      consistency: 7,
      costScore: 7,
      style: 'tech',
      notes: 'For users explicitly seeking concentrated tech and innovation exposure.'
    }
  ]
};

const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');
const assetInputs = document.querySelectorAll('.asset-input');
let allocationChart;

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
  });
});

function formatINR(num) {
  return `₹${Math.round(num || 0).toLocaleString('en-IN')}`;
}

function getValue(id) {
  return Number(document.getElementById(id).value) || 0;
}

function totalCorpus() {
  return [
    'currIndMf','currIndEq','currUsMf','currUsEq','currDebt','currGold','currInvits','currRealEstate'
  ].reduce((sum, id) => sum + getValue(id), 0);
}

function calculateTotalCorpus() {
  document.getElementById('totalCorpusDisplay').textContent = formatINR(totalCorpus());
}
assetInputs.forEach(input => input.addEventListener('input', calculateTotalCorpus));
calculateTotalCorpus();

function renderGoals() {
  const body = document.getElementById('goalsBody');
  body.innerHTML = '';
  goals.forEach(goal => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${goal.name}</strong></td>
      <td>${formatINR(goal.amount)}</td>
      <td>${goal.years}</td>
      <td>${goal.type}</td>
      <td><button class="btn btn-secondary" onclick="removeGoal(${goal.id})">Remove</button></td>
    `;
    body.appendChild(tr);
  });
}
window.removeGoal = id => {
  const idx = goals.findIndex(g => g.id === id);
  if (idx >= 0) goals.splice(idx, 1);
  renderGoals();
};
renderGoals();

document.getElementById('addGoalBtn').addEventListener('click', () => {
  const name = prompt('Goal name', 'New Goal');
  if (!name) return;
  const amount = Number(prompt('Goal amount in today\'s rupees', '1000000'));
  const years = Number(prompt('Years away', '7'));
  const type = prompt('Goal type: retirement / education / wealth / purchase', 'wealth') || 'wealth';
  if (!amount || !years) return;
  goals.push({ id: Date.now(), name, amount, years, type });
  renderGoals();
});

function buildTargets() {
  const age = getValue('age');
  const retirementAge = getValue('retirementAge');
  const yearsToRetire = Math.max(retirementAge - age, 0);
  const risk = document.getElementById('riskProfile').value;
  const mode = document.getElementById('plannerMode').value;
  const emergencyMonths = getValue('emergencyMonths');

  let equityBase = 55;
  if (risk === 'conservative') equityBase = 35;
  if (risk === 'balanced') equityBase = 50;
  if (risk === 'growth') equityBase = 65;
  if (risk === 'aggressive') equityBase = 75;

  if (yearsToRetire < 10) equityBase -= 10;
  if (yearsToRetire > 20) equityBase += 5;
  if (emergencyMonths < 3) equityBase -= 5;

  equityBase = Math.min(80, Math.max(25, equityBase));

  let debt = Math.max(10, 100 - equityBase - 10);
  let gold = 8;
  let invits = mode === 'advanced' ? 8 : 5;
  let realEstate = mode === 'advanced' ? 12 : mode === 'hybrid' ? 8 : 5;
  let global = risk === 'aggressive' || risk === 'growth' ? 12 : 8;

  const indiaMf = Math.round(equityBase * (mode === 'mf' ? 0.65 : 0.45));
  const indiaEq = Math.round(equityBase * (mode === 'advanced' ? 0.25 : 0.1));
  const usMf = global;
  const usEq = mode === 'advanced' ? 5 : 0;

  const allocated = indiaMf + indiaEq + usMf + usEq + debt + gold + invits + realEstate;
  debt += (100 - allocated);

  return {
    indiaMf,
    indiaEq,
    usMf,
    usEq,
    debt,
    gold,
    invits,
    realEstate,
    yearsToRetire
  };
}

function healthDiagnostics(corpus, targets) {
  const diagnostics = [];
  const monthlyExp = getValue('monthlyExp');
  const emergencyMonths = getValue('emergencyMonths');
  const debtCurrent = getValue('currDebt');
  const smallRiskProxy = getValue('currIndEq') + getValue('currUsEq');
  const directEqPct = corpus ? (smallRiskProxy / corpus) * 100 : 0;

  if (monthlyExp * 6 > debtCurrent && emergencyMonths < 6) {
    diagnostics.push(['Emergency fund weak', 'Build 6-12 months of expenses in liquid / low-risk debt first.', 'danger']);
  } else {
    diagnostics.push(['Emergency fund okay', 'Liquidity bucket is reasonably aligned for planner use.', 'success']);
  }

  if (directEqPct > 25) {
    diagnostics.push(['Direct equity concentration high', 'Consider routing incremental SIPs to core mutual funds and debt instead of adding more stock-specific risk.', 'warn']);
  } else {
    diagnostics.push(['Concentration acceptable', 'Direct equity share is not excessive for a diversified plan.', 'info']);
  }

  if (getValue('currUsMf') + getValue('currUsEq') < corpus * 0.05) {
    diagnostics.push(['Global diversification light', 'Add international exposure gradually for currency and geography diversification.', 'warn']);
  } else {
    diagnostics.push(['Global diversification present', 'International sleeve exists and improves diversification.', 'success']);
  }

  if (getValue('currGold') < corpus * 0.05) {
    diagnostics.push(['Low defensive hedge', 'Gold can serve as a portfolio shock absorber in inflation / currency stress scenarios.', 'info']);
  }

  const score = Math.max(35, Math.min(95,
    70 + (emergencyMonths >= 6 ? 8 : -8) + (directEqPct <= 25 ? 5 : -7) + ((getValue('currUsMf') + getValue('currUsEq')) >= corpus * 0.05 ? 5 : -5)
  ));

  return { diagnostics, score };
}

function scoreFund(fund, bucketFit, riskProfile) {
  const ratingSupport = ((fund.vr + fund.mc) / 10) * 10;
  const riskFit = (
    (riskProfile === 'conservative' && /Low|Moderate/.test(fund.risk)) ||
    (riskProfile === 'balanced' && !/Very High/.test(fund.risk)) ||
    (riskProfile === 'growth' && !/Low to Moderate/.test(fund.risk)) ||
    (riskProfile === 'aggressive')
  ) ? 10 : 6;

  const score =
    bucketFit * 3 +
    fund.consistency * 2 +
    fund.costScore * 1.5 +
    ratingSupport +
    riskFit;

  return Math.round(score);
}

function renderFunds(targets) {
  const body = document.getElementById('fundTableBody');
  body.innerHTML = '';
  const riskProfile = document.getElementById('riskProfile').value;

  const fundBuckets = [
    { label: 'Core Equity', list: fundData.core, alloc: Math.max(targets.indiaMf - 10, 20) },
    { label: 'Satellite Equity', list: riskProfile === 'conservative' ? [] : fundData.satellite, alloc: riskProfile === 'aggressive' ? 10 : 6 },
    { label: 'Debt / Safety', list: fundData.debt, alloc: targets.debt },
    { label: 'International', list: fundData.global, alloc: targets.usMf }
  ];

  fundBuckets.forEach(bucket => {
    bucket.list.forEach((fund, idx) => {
      const fit = bucket.label === 'Debt / Safety' ? 10 : bucket.label === 'Core Equity' ? 9 : 8;
      const score = scoreFund(fund, fit, riskProfile);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${idx === 0 ? `<strong>${bucket.label}</strong>` : ''}</td>
        <td><strong>${fund.name}</strong><br><span style="color:var(--muted)">${fund.category}</span></td>
        <td>${fund.notes}</td>
        <td>${'★'.repeat(fund.vr)}</td>
        <td>${'★'.repeat(fund.mc)}</td>
        <td>${fund.risk}</td>
        <td><span class="score-badge ${score >= 78 ? 'high' : score >= 65 ? 'med' : 'low'}">${score}/100</span></td>
        <td>${idx === 0 ? `${bucket.alloc}%` : idx === 1 ? 'Alternative' : 'Optional'}</td>
      `;
      body.appendChild(tr);
    });
  });
}

function createActionRows(targets, corpus) {
  const actionPlan = document.getElementById('actionPlan');
  actionPlan.innerHTML = '';
  const mapping = [
    ['India Equity Funds', getValue('currIndMf'), targets.indiaMf],
    ['India Direct Equity', getValue('currIndEq'), targets.indiaEq],
    ['International Funds', getValue('currUsMf'), targets.usMf],
    ['US Direct Equity', getValue('currUsEq'), targets.usEq],
    ['Debt / Fixed Income', getValue('currDebt'), targets.debt],
    ['Gold / Silver', getValue('currGold'), targets.gold],
    ['InvIT / REIT', getValue('currInvits'), targets.invits],
    ['Real Estate', getValue('currRealEstate'), targets.realEstate]
  ];

  let bestRoute = null;
  mapping.forEach(([name, currentAmt, targetPct]) => {
    const targetAmt = corpus * targetPct / 100;
    const diff = targetAmt - currentAmt;
    const action = Math.abs(diff) < corpus * 0.015 ? 'Hold' : diff > 0 ? 'Add' : 'Trim';
    const cls = action === 'Add' ? 'success' : action === 'Trim' ? 'warn' : 'info';

    if (diff > 0 && (!bestRoute || diff > bestRoute.diff)) bestRoute = { name, diff };

    const row = document.createElement('div');
    row.className = 'action-row';
    row.innerHTML = `
      <div>
        <strong>${name}</strong>
        <span>Current ${formatINR(currentAmt)} • Target ${targetPct}% (${formatINR(targetAmt)})</span>
      </div>
      <div class="badge ${cls}">${action} ${Math.abs(diff) < 1 ? '' : formatINR(Math.abs(diff))}</div>
    `;
    actionPlan.appendChild(row);
  });

  document.getElementById('sipRoute').textContent = bestRoute ? bestRoute.name : 'Balanced';
  document.getElementById('sipRouteNote').textContent = bestRoute ? `Route next SIP toward gap of ${formatINR(bestRoute.diff)}` : 'No major allocation gaps';
}

function futureValueWithStepUp(monthlySip, annualStep, monthlyRate, months) {
  let fv = 0;
  let sip = monthlySip;
  for (let m = 1; m <= months; m++) {
    fv = (fv + sip) * (1 + monthlyRate);
    if (m % 12 === 0) sip *= (1 + annualStep);
  }
  return fv;
}

function renderGoalsAndRetirement(corpus, targets) {
  const expectedReturn = getValue('expectedReturn') / 100;
  const inflation = getValue('inflation') / 100;
  const withdrawalRate = getValue('withdrawalRate') / 100;
  const sipStepUp = getValue('sipStepUp') / 100;
  const monthlySip = getValue('monthlySip');
  const goalWrap = document.getElementById('goalFeasibility');
  const retirementPanel = document.getElementById('retirementPanel');
  goalWrap.innerHTML = '';
  retirementPanel.innerHTML = '';

  let onTrack = 0;
  goals.forEach(goal => {
    const fvNeed = goal.amount * Math.pow(1 + inflation, goal.years);
    const share = corpus * (goal.type === 'retirement' ? 0.45 : goal.type === 'education' ? 0.2 : 0.12);
    const monthlyRate = expectedReturn / 12;
    const fvCorpus = share * Math.pow(1 + expectedReturn, goal.years);
    const fvSip = futureValueWithStepUp(monthlySip * 0.4, sipStepUp, monthlyRate, goal.years * 12);
    const projected = fvCorpus + fvSip;
    const gap = fvNeed - projected;
    const ok = gap <= 0;
    if (ok) onTrack++;

    const card = document.createElement('div');
    card.className = 'note-card';
    card.innerHTML = `
      <h4>${goal.name} <span class="badge ${ok ? 'success' : 'warn'}">${ok ? 'On Track' : 'Needs Attention'}</span></h4>
      <p>Inflation-adjusted target: <strong>${formatINR(fvNeed)}</strong> • Projected pool: <strong>${formatINR(projected)}</strong>${ok ? '' : ` • Gap: <strong>${formatINR(gap)}</strong>`}</p>
    `;
    goalWrap.appendChild(card);
  });

  document.getElementById('goalReadiness').textContent = `${onTrack}/${goals.length}`;
  document.getElementById('goalNote').textContent = onTrack === goals.length ? 'All tracked goals look funded in base case' : 'Some goals may need higher SIP or lower risk drift';

  const yearsToRetire = targets.yearsToRetire;
  const futureMonthlyExp = getValue('monthlyExp') * Math.pow(1 + inflation, yearsToRetire);
  const fireTarget = (futureMonthlyExp * 12) / Math.max(withdrawalRate, 0.03);
  const fvCorpus = corpus * Math.pow(1 + expectedReturn, yearsToRetire);
  const fvSip = futureValueWithStepUp(monthlySip, sipStepUp, expectedReturn / 12, yearsToRetire * 12);
  const totalFv = fvCorpus + fvSip;
  const retireOk = totalFv >= fireTarget;
  const retirementGap = Math.max(0, fireTarget - totalFv);

  const base = document.createElement('div');
  base.className = 'note-card';
  base.innerHTML = `
    <h4>${retireOk ? 'Retirement base case looks funded' : 'Retirement gap detected'} <span class="badge ${retireOk ? 'success' : 'danger'}">${retireOk ? 'Comfortable' : 'Gap'}</span></h4>
    <p>Projected corpus at retirement: <strong>${formatINR(totalFv)}</strong> • Required corpus using ${Math.round(withdrawalRate * 100)}% SWR: <strong>${formatINR(fireTarget)}</strong>${retireOk ? '' : ` • Gap: <strong>${formatINR(retirementGap)}</strong>`}</p>
  `;

  const lowReturn = getValue('lowReturn') / 100;
  const crashDrawdown = getValue('crashDrawdown') / 100;
  const stressCorpus = (corpus * (1 - crashDrawdown * 0.55)) * Math.pow(1 + lowReturn, yearsToRetire);
  const stressSip = futureValueWithStepUp(monthlySip, sipStepUp, lowReturn / 12, yearsToRetire * 12);
  const stressTotal = stressCorpus + stressSip;
  const stress = document.createElement('div');
  stress.className = 'note-card';
  stress.innerHTML = `
    <h4>Stress scenario snapshot <span class="badge info">Conservative</span></h4>
    <p>Assuming a ${Math.round(crashDrawdown)}% equity drawdown and ${Math.round(lowReturn * 100)}% long-term return, projected retirement corpus becomes <strong>${formatINR(stressTotal)}</strong>.</p>
  `;

  retirementPanel.append(base, stress);
  document.getElementById('retirementStatus').textContent = retireOk ? 'On Track' : 'Gap';
  document.getElementById('retirementNote').textContent = retireOk ? 'Base case retirement target looks achievable' : `Needs ${formatINR(retirementGap)} more over time`;
}

function renderAdvisorNotes(corpus, targets, healthScore) {
  const wrap = document.getElementById('advisorNotes');
  wrap.innerHTML = '';
  const notes = [];

  if (healthScore < 65) {
    notes.push(['Fix basics first', 'Strengthen emergency liquidity and reduce avoidable concentration before chasing alpha.']);
  }
  if (targets.debt >= 20) {
    notes.push(['Debt is meaningful for this profile', 'Given risk profile and retirement horizon, stability assets deserve a larger role than in your earlier MVP.']);
  }
  if (targets.usMf >= 8) {
    notes.push(['Keep global exposure intentional', 'International allocation should be treated as diversification support, not only tactical return chasing.']);
  }
  notes.push(['Use ratings correctly', 'Value Research and Moneycontrol ratings can support decisions, but category fit, consistency, cost, and risk control should drive fund selection.']);
  notes.push(['Upgrade path for production', 'Next production step is to replace sample fund data with a maintained CSV or API-driven dataset and add overlap analysis.']);

  notes.forEach(([title, text]) => {
    const el = document.createElement('div');
    el.className = 'note-card';
    el.innerHTML = `<h4>${title}</h4><p>${text}</p>`;
    wrap.appendChild(el);
  });
}

function renderDiagnostics(targets) {
  const corpus = totalCorpus();
  const { diagnostics, score } = healthDiagnostics(corpus, targets);
  const wrap = document.getElementById('diagnostics');
  wrap.innerHTML = '';
  diagnostics.forEach(([title, text, tone]) => {
    const div = document.createElement('div');
    div.className = 'note-card';
    div.innerHTML = `<h4>${title} <span class="badge ${tone}">${tone === 'danger' ? 'Urgent' : tone === 'warn' ? 'Watch' : 'Okay'}</span></h4><p>${text}</p>`;
    wrap.appendChild(div);
  });

  document.getElementById('healthScore').textContent = `${score}/100`;
  document.getElementById('healthNote').textContent = score >= 80 ? 'Strong base structure' : score >= 65 ? 'Good, with room to improve' : 'Needs portfolio clean-up';
  return score;
}

function drawChart(corpus, targets) {
  const ctx = document.getElementById('allocationChart');
  const labels = ['India MF', 'India Direct', 'Intl MF', 'US Direct', 'Debt', 'Gold', 'InvIT/REIT', 'Real Estate'];
  const current = [
    getValue('currIndMf'), getValue('currIndEq'), getValue('currUsMf'), getValue('currUsEq'),
    getValue('currDebt'), getValue('currGold'), getValue('currInvits'), getValue('currRealEstate')
  ].map(v => corpus ? ((v / corpus) * 100).toFixed(1) : 0);
  const target = [targets.indiaMf, targets.indiaEq, targets.usMf, targets.usEq, targets.debt, targets.gold, targets.invits, targets.realEstate];

  if (allocationChart) allocationChart.destroy();
  allocationChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Current %', data: current },
        { label: 'Target %', data: target }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#e7edf7' } }
      },
      scales: {
        x: { ticks: { color: '#9fb0c8' }, grid: { color: 'rgba(255,255,255,.05)' } },
        y: { ticks: { color: '#9fb0c8' }, grid: { color: 'rgba(255,255,255,.05)' }, beginAtZero: true }
      }
    }
  });
}

function collectProfile() {
  return {
    age: getValue('age'),
    retirementAge: getValue('retirementAge'),
    monthlyIncome: getValue('monthlyIncome'),
    monthlySip: getValue('monthlySip'),
    monthlyExp: getValue('monthlyExp'),
    emergencyMonths: getValue('emergencyMonths'),
    riskProfile: document.getElementById('riskProfile').value,
    plannerMode: document.getElementById('plannerMode').value,
    expectedReturn: getValue('expectedReturn'),
    inflation: getValue('inflation'),
    withdrawalRate: getValue('withdrawalRate'),
    sipStepUp: getValue('sipStepUp'),
    crashDrawdown: getValue('crashDrawdown'),
    lowReturn: getValue('lowReturn'),
    assets: {
      currIndMf: getValue('currIndMf'), currIndEq: getValue('currIndEq'), currUsMf: getValue('currUsMf'), currUsEq: getValue('currUsEq'),
      currDebt: getValue('currDebt'), currGold: getValue('currGold'), currInvits: getValue('currInvits'), currRealEstate: getValue('currRealEstate')
    },
    goals
  };
}

function fillProfile(data) {
  Object.entries(data).forEach(([key, value]) => {
    const el = document.getElementById(key);
    if (el && typeof value !== 'object') el.value = value;
  });
  if (data.assets) {
    Object.entries(data.assets).forEach(([key, value]) => {
      const el = document.getElementById(key);
      if (el) el.value = value;
    });
  }
  if (Array.isArray(data.goals)) {
    goals.splice(0, goals.length, ...data.goals);
    renderGoals();
  }
  calculateTotalCorpus();
}

document.getElementById('saveProfileBtn').addEventListener('click', () => {
  localStorage.setItem('mfPlannerProProfile', JSON.stringify(collectProfile()));
  alert('Profile saved locally in your browser.');
});

document.getElementById('loadSampleBtn').addEventListener('click', () => {
  const saved = localStorage.getItem('mfPlannerProProfile');
  if (saved) {
    fillProfile(JSON.parse(saved));
    alert('Saved profile loaded.');
  } else {
    alert('No saved profile found. Using current sample values.');
  }
});

document.getElementById('printBtn').addEventListener('click', () => window.print());

document.getElementById('generatePlanBtn').addEventListener('click', () => {
  const corpus = totalCorpus();
  if (!corpus) {
    alert('Please enter portfolio values first.');
    return;
  }

  const targets = buildTargets();
  const healthScore = renderDiagnostics(targets);
  createActionRows(targets, corpus);
  renderGoalsAndRetirement(corpus, targets);
  renderFunds(targets);
  renderAdvisorNotes(corpus, targets, healthScore);
  drawChart(corpus, targets);

  tabs.forEach(t => t.classList.remove('active'));
  panels.forEach(p => p.classList.remove('active'));
  document.querySelector('[data-tab="results"]').classList.add('active');
  document.getElementById('tab-results').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

calculateTotalCorpus();
