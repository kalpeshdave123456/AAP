// Data Models
let goals = [
    { id: 1, name: "Kid 1 Undergrad", amount: 2500000, years: 10 },
    { id: 2, name: "Retirement", amount: 50000000, years: 20 }
];

// Fund Recommendations mapped to worst-case scenarios and global diversification
const fundDatabase = {
    "India Mutual Funds": [
        { name: "Parag Parikh Flexi Cap Fund", category: "Flexi-Cap", purpose: "Core global exposure, USD Hedge, Low Volatility" },
        { name: "Nippon India Small Cap Fund", category: "Small Cap", purpose: "Aggressive domestic economic growth capture" },
        { name: "HDFC Mid-Cap Opportunities", category: "Mid Cap", purpose: "Balanced growth and capital compounding" }
    ],
    "US Mutual Funds / ETFs": [
        { name: "Motilal Oswal S&P 500 Index Fund", category: "Broad US Market", purpose: "Core global exposure, USD appreciation shield" },
        { name: "Mirae Asset NYSE FANG+ ETF", category: "Tech/Innovation", purpose: "Capturing AI boom and US Tech monopolies" },
        { name: "ICICI Pru US Bluechip Equity", category: "US Large Cap", purpose: "Stable multinational secular growth" }
    ],
    "India Direct Equity": [
        { name: "Top 10 Nifty 50 Stocks", category: "Bluechip Direct", purpose: "Low cost wealth compounders (e.g., Reliance, HDFC, TCS)" },
        { name: "Dividend Aristocrats Portfolio", category: "Quality Direct", purpose: "Consistent cash flow yielding stocks (e.g., ITC, Coal India)" }
    ],
    "US Direct Equity": [
        { name: "Mag 7 / AI Leaders", category: "Tech Monopolies", purpose: "Direct ownership via tech platforms (e.g., MSFT, AAPL, NVDA)" },
        { name: "Berkshire Hathaway (BRK.B)", category: "Diversified Holding", purpose: "Ultimate defensive compounding strategy" }
    ],
    "Real Estate (Investment)": [
        { name: "Tier 1/2 Commercial Plots", category: "Physical Land", purpose: "High appreciation, inflation hedge" },
        { name: "Pre-Leased Commercial Properties", category: "Yielding Asset", purpose: "Rental yield + capital appreciation" }
    ],
    "Debt": [
        { name: "SBI Magnum Gilt Fund", category: "Government Bonds", purpose: "Protection against AI Deflation / Interest drops" },
        { name: "Quant Liquid Fund", category: "Cash Equivalent", purpose: "GFC Crisis Ammo, Absolute liquidity" },
        { name: "HDFC Corporate Bond Fund", category: "High Quality Debt", purpose: "Stable returns bridging inflation" }
    ],
    "Gold": [
        { name: "Nippon India Gold BeES ETF", category: "Gold", purpose: "Hyperinflation / Currency Collapse shield" },
        { name: "SBI Silver ETF", category: "Silver", purpose: "Industrial demand + monetary premium" }
    ],
    "InvITs": [
        { name: "PowerGrid InvIT", category: "Infrastructure", purpose: "Inflation-protected Govt backed cash flows" },
        { name: "Nexus Select Trust REIT", category: "Commercial Estate", purpose: "Retail Mall yields" }
    ]
};

// DOM Elements
const addGoalBtn = document.getElementById('addGoalBtn');
const generatePlanBtn = document.getElementById('generatePlanBtn');
const resultsDashboard = document.getElementById('resultsDashboard');

// DOM logic: total corpus calculation
const assetInputs = document.querySelectorAll('.asset-input');
const totalCorpusDisplay = document.getElementById('totalCorpusDisplay');

function calculateTotalCorpus() {
    let sum = 0;
    assetInputs.forEach(input => {
        sum += Number(input.value) || 0;
    });
    if(totalCorpusDisplay) {
        totalCorpusDisplay.textContent = `₹${sum.toLocaleString('en-IN')}`;
    }
    return sum;
}

if(assetInputs.length > 0) {
    assetInputs.forEach(input => {
        input.addEventListener('input', calculateTotalCorpus);
    });
    calculateTotalCorpus();
}

// Initialize
function renderGoals() {
    const tbody = document.getElementById('goalsListBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    goals.forEach(g => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: 500;">${g.name}</td>
            <td style="color: var(--text-muted);">₹${g.amount.toLocaleString('en-IN')}</td>
            <td style="color: var(--text-muted);">${g.years} years</td>
            <td style="text-align: right;">
                <button class="remove-goal" onclick="removeGoal(${g.id})" title="Remove Goal">×</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.removeGoal = function(id) {
    goals = goals.filter(g => g.id !== id);
    renderGoals();
};

if(addGoalBtn) {
    addGoalBtn.addEventListener('click', () => {
        const name = document.getElementById('goalName').value;
        const amount = Number(document.getElementById('goalAmount').value);
        const years = Number(document.getElementById('goalYears').value);
        
        if(!name || !amount || !years) return alert("Please fill all goal fields");
        
        goals.push({ id: Date.now(), name, amount, years });
        document.getElementById('goalName').value = '';
        document.getElementById('goalAmount').value = '';
        document.getElementById('goalYears').value = '';
        renderGoals();
    });
}

// The Core Logic
if(generatePlanBtn) {
    generatePlanBtn.addEventListener('click', () => {
        const totalCorpus = calculateTotalCorpus();
        const monthlySip = Number(document.getElementById('monthlySip').value) || 0;
        const monthlyExp = Number(document.getElementById('monthlyExp').value) || 0;
        
        const currVals = {
            indEq: Number(document.getElementById('currIndEq').value) || 0,
            indMf: Number(document.getElementById('currIndMf').value) || 0,
            usEq: Number(document.getElementById('currUsEq').value) || 0,
            usMf: Number(document.getElementById('currUsMf').value) || 0,
            realEstate: Number(document.getElementById('currRealEstate').value) || 0,
            debt: Number(document.getElementById('currDebt').value) || 0,
            gold: Number(document.getElementById('currGold').value) || 0,
            invits: Number(document.getElementById('currInvits').value) || 0
        };

        if(totalCorpus === 0) {
            alert("Please enter your current holding values.");
            return;
        }

        // Determine "All-Weather" + Globally Diversified Target Allocation
        const targets = {
            indEq: 15,
            indMf: 20,
            usEq: 5,
            usMf: 10,
            realEstate: 15,
            debt: 15,
            gold: 10,
            invits: 10
        };
        
        // Display Breakdown
        const breakdownEl = document.getElementById('targetBreakdown');
        breakdownEl.innerHTML = `
            <li><span>India Direct Eq (High Alpha)</span> <span>${targets.indEq}%</span></li>
            <li><span>India Mutual Funds (Core Growth)</span> <span>${targets.indMf}%</span></li>
            <li><span>US Direct Eq (Tech Monopolies)</span> <span>${targets.usEq}%</span></li>
            <li><span>US Mutual Funds (USD Hedge)</span> <span>${targets.usMf}%</span></li>
            <li><span>Real Estate (Hard Asset)</span> <span>${targets.realEstate}%</span></li>
            <li><span>Debt (Deflation/Liquidity Ammo)</span> <span>${targets.debt}%</span></li>
            <li><span>Gold/Silver (Hyperinflation)</span> <span>${targets.gold}%</span></li>
            <li><span>InvITs/REITs (Yield)</span> <span>${targets.invits}%</span></li>
        `;

        // Calculate Actions
        const actionPlanEl = document.getElementById('actionPlan');
        actionPlanEl.innerHTML = '';
        
        const assetsMapping = [
            { name: "India Direct Equity", cAmount: currVals.indEq, tPct: targets.indEq },
            { name: "India Mutual Funds", cAmount: currVals.indMf, tPct: targets.indMf },
            { name: "US Direct Equity", cAmount: currVals.usEq, tPct: targets.usEq },
            { name: "US Mutual Funds", cAmount: currVals.usMf, tPct: targets.usMf },
            { name: "Real Estate (Investment)", cAmount: currVals.realEstate, tPct: targets.realEstate },
            { name: "Debt", cAmount: currVals.debt, tPct: targets.debt },
            { name: "Gold", cAmount: currVals.gold, tPct: targets.gold },
            { name: "InvITs", cAmount: currVals.invits, tPct: targets.invits }
        ];

        assetsMapping.forEach(a => {
            const targetAmount = (a.tPct / 100) * totalCorpus;
            const diff = targetAmount - a.cAmount;
            
            const li = document.createElement('li');
            if (Math.abs(diff) < 5000) {
                li.innerHTML = `<span>${a.name}</span> <span class="hold-action">Hold (On Target)</span>`;
            } else if (diff > 0) {
                li.innerHTML = `<span>${a.name}</span> <span class="buy-action">Buy ₹${Math.abs(diff).toLocaleString('en-IN', {maximumFractionDigits:0})}</span>`;
            } else {
                li.innerHTML = `<span>${a.name}</span> <span class="sell-action">Sell ₹${Math.abs(diff).toLocaleString('en-IN', {maximumFractionDigits:0})}</span>`;
            }
            actionPlanEl.appendChild(li);
        });

        // Suggest Funds Table
        const fundTableBody = document.getElementById('fundTableBody');
        if (fundTableBody) {
            fundTableBody.innerHTML = '';
            
            const targetMap = {
                "India Mutual Funds": targets.indMf,
                "US Mutual Funds / ETFs": targets.usMf,
                "India Direct Equity": targets.indEq,
                "US Direct Equity": targets.usEq,
                "Real Estate (Investment)": targets.realEstate,
                "Debt": targets.debt,
                "Gold": targets.gold,
                "InvITs": targets.invits
            };

            Object.keys(fundDatabase).forEach(category => {
                const funds = fundDatabase[category];
                const categoryTarget = targetMap[category];
                const individualTarget = (categoryTarget / funds.length).toFixed(1);

                funds.forEach((fund, index) => {
                    const tr = document.createElement('tr');
                    
                    let categoryHTML = '';
                    if (index === 0) {
                         categoryHTML = `<td rowspan="${funds.length}" style="font-weight: 600; border-right: 1px solid #e2e8f0; vertical-align: middle;">${category} <br><span style="color:var(--text-muted); font-size: 0.8rem; font-weight: 400;">(${categoryTarget}% Total)</span></td>`;
                    }

                    tr.innerHTML = `
                        ${categoryHTML}
                        <td>
                            <span class="tag">${fund.category}</span><br>
                            <strong style="color: var(--text-main); font-size: 1.05rem;">${fund.name}</strong>
                        </td>
                        <td style="color: var(--text-muted); font-size: 0.9rem;">${fund.purpose}</td>
                        <td style="font-weight: 600; color: var(--success); text-align: right; vertical-align: middle;">${individualTarget}%</td>
                    `;
                    fundTableBody.appendChild(tr);
                });
            });
        }

        // Check Goal Feasibility & FIRE Check
        const feasibilityEl = document.getElementById('feasibilityReport');
        feasibilityEl.innerHTML = '';
        
        const expectedReturn = 0.10; 
        const inflation = 0.06;
        const r = expectedReturn / 12;
        
        const gridDiv = document.createElement('div');
        gridDiv.className = 'feasibility-grid';

        // 1. General Goals PV Logic
        let totalPVNeeded = 0;
        goals.forEach(g => {
            const futureCost = g.amount * Math.pow((1 + inflation), g.years);
            const pv = futureCost / Math.pow((1 + expectedReturn), g.years);
            totalPVNeeded += pv;
        });

        const avgYears = goals.length > 0 ? goals.reduce((s,g)=>s+g.years,0)/goals.length : 10;
        const n = avgYears * 12;
        const pvOfSip = monthlySip > 0 && n > 0 ? monthlySip * ((1 - Math.pow(1+r, -n)) / r) : 0;
        const totalAvailPV = totalCorpus + pvOfSip;
        
        const goalsDiv = document.createElement('div');
        if(totalAvailPV >= totalPVNeeded) {
            goalsDiv.className = 'feasibility-item';
            goalsDiv.innerHTML = `<div class="feas-title">Goals Trajectory: Safe</div>
                                 <div class="feas-desc">Your current Corpus (₹${totalCorpus.toLocaleString('en-IN')}) + upcoming SIPs are sufficient to fund all tracked goals.</div>`;
        } else {
            const gap = totalPVNeeded - totalAvailPV;
            const reqSip = (gap * r) / (1 - Math.pow(1+r,-n));
            goalsDiv.className = 'feasibility-item at-risk';
            goalsDiv.innerHTML = `<div class="feas-title">Goals Trajectory: At Risk</div>
                                 <div class="feas-desc">Gap detected. Increase monthly SIP by ~₹${Math.round(reqSip).toLocaleString('en-IN')} to securely fund your milestones.</div>`;
        }
        gridDiv.appendChild(goalsDiv);

        // 2. FIRE / Retirement Check based on 4% Rule
        const fireEl = document.createElement('div');
        const retireGoal = goals.find(g => g.name.toLowerCase().includes('retire'));
        const yearsToRetire = retireGoal ? retireGoal.years : 15;
        
        const futureMonthlyExp = monthlyExp * Math.pow((1 + inflation), yearsToRetire);
        const futureFireTarget = (futureMonthlyExp * 12) * 25; 
        
        const fvCorpus = totalCorpus * Math.pow((1 + expectedReturn), yearsToRetire);
        const monthsToRetire = yearsToRetire * 12;
        
        let fvSip = 0;
        if (monthlySip > 0 && monthsToRetire > 0) {
            fvSip = monthlySip * ((Math.pow(1 + r, monthsToRetire) - 1) / r) * (1 + r);
        }
        const totalFv = fvCorpus + fvSip;
        
        if(totalFv >= futureFireTarget) {
            fireEl.className = 'feasibility-item info';
            fireEl.innerHTML = `<div class="feas-title">FIRE Check: Fully Funded 🎉</div>
                                <div class="feas-desc">In ${yearsToRetire} years, your projected corpus is ~₹${(totalFv/10000000).toFixed(2)} Cr. This easily clears your required 4% SAFE withdrawal target of ₹${(futureFireTarget/10000000).toFixed(2)} Cr to sustain future monthly living expenses of ₹${Math.round(futureMonthlyExp).toLocaleString('en-IN')}.</div>`;
        } else {
            fireEl.className = 'feasibility-item at-risk';
            const gapFv = futureFireTarget - fvCorpus;
            const requiredSip = gapFv > 0 ? (gapFv / (((Math.pow(1 + r, monthsToRetire) - 1) / r) * (1 + r))) : 0;
            
            fireEl.innerHTML = `<div class="feas-title">FIRE Check: Gap Detected</div>
                                <div class="feas-desc">In ${yearsToRetire} years, your 4% safe withdrawal target is ₹${(futureFireTarget/10000000).toFixed(2)} Cr vs projected corpus of ₹${(totalFv/10000000).toFixed(2)} Cr. To retire independently in ${yearsToRetire} years, raise your total SIP to ~₹${Math.round(requiredSip).toLocaleString('en-IN')}/mo.</div>`;
        }
        gridDiv.appendChild(fireEl);

        feasibilityEl.appendChild(gridDiv);

        resultsDashboard.classList.remove('hidden');
        resultsDashboard.scrollIntoView({ behavior: 'smooth' });
    });
}

// Initial Render
renderGoals();
