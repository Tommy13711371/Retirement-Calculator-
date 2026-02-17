function formatNumber(num) {
  return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function getValue(id) {
  const val = document.getElementById(id).value.replace(/,/g, '');
  return parseFloat(val) || 0;
}

function calculate() {
  let currentAge = getValue("currentAge");
  let retireAge = getValue("retireAge");
  let years = retireAge - currentAge;

  let growthRate = getValue("growthRate") / 100;
  let inflationRate = getValue("inflationRate") / 100;

  // User balances
  let ira = getValue("iraBalance");
  let rothIra = getValue("rothIraBalance");
  let k401 = getValue("kBalance");
  let rothK = getValue("rothKBalance");
  let brokerage = getValue("brokerageBalance");

  // Spouse balances
  let sIra = getValue("spouseIraBalance");
  let sRothIra = getValue("spouseRothIraBalance");
  let sK401 = getValue("spouseKBalance");
  let sRothK = getValue("spouseRothKBalance");
  let sBrokerage = getValue("spouseBrokerageBalance");

  // Contributions
  let iraContrib = getValue("iraContribution");
  let rothIraContrib = getValue("rothIraContribution");
  let kContrib = getValue("kContribution");
  let rothKContrib = getValue("rothKContribution");
  let brokerageContrib = getValue("brokerageContribution");

  let sIraContrib = getValue("spouseIraContribution");
  let sRothIraContrib = getValue("spouseRothIraContribution");
  let sKContrib = getValue("spouseKContribution");
  let sRothKContrib = getValue("spouseRothKContribution");
  let sBrokerageContrib = getValue("spouseBrokerageContribution");

  let matchPercent = getValue("matchPercent") / 100;
  let profitSharing = getValue("profitSharing");

  let maxToggle = document.getElementById("maxToggle").checked;
  let growToggle = document.getElementById("growToggle").checked;
  let contribGrowth = getValue("contributionGrowth") / 100;

  let iraMax = 7000;
  let kMax = 23000;
  let limitGrowthRate = 0.03;
  let limitIncreaseFrequency = 2;

  let totalContributions = 0;

  for (let i = 1; i <= years; i++) {
    if (maxToggle && i % limitIncreaseFrequency === 0) {
      iraMax *= (1 + limitGrowthRate);
      kMax *= (1 + limitGrowthRate);
    }

    let curIraContrib = maxToggle ? iraMax : iraContrib;
    let curRothIraContrib = maxToggle ? iraMax : rothIraContrib;
    let curKContrib = maxToggle ? kMax : kContrib;
    let curRothKContrib = maxToggle ? kMax : rothKContrib;

    if (growToggle && !maxToggle) {
      curIraContrib *= Math.pow(1 + contribGrowth, i - 1);
      curRothIraContrib *= Math.pow(1 + contribGrowth, i - 1);
      curKContrib *= Math.pow(1 + contribGrowth, i - 1);
      curRothKContrib *= Math.pow(1 + contribGrowth, i - 1);
      brokerageContrib *= Math.pow(1 + contribGrowth, i - 1);
      sIraContrib *= Math.pow(1 + contribGrowth, i - 1);
      sRothIraContrib *= Math.pow(1 + contribGrowth, i - 1);
      sKContrib *= Math.pow(1 + contribGrowth, i - 1);
      sRothKContrib *= Math.pow(1 + contribGrowth, i - 1);
      sBrokerageContrib *= Math.pow(1 + contribGrowth, i - 1);
    }

    let employerMatch = curKContrib * matchPercent;
    let sEmployerMatch = sKContrib * matchPercent;

    ira = (ira + curIraContrib) * (1 + growthRate);
    rothIra = (rothIra + curRothIraContrib) * (1 + growthRate);
    k401 = (k401 + curKContrib + employerMatch + profitSharing) * (1 + growthRate);
    rothK = (rothK + curRothKContrib) * (1 + growthRate);
    brokerage = (brokerage + brokerageContrib) * (1 + growthRate);

    sIra = (sIra + sIraContrib) * (1 + growthRate);
    sRothIra = (sRothIra + sRothIraContrib) * (1 + growthRate);
    sK401 = (sK401 + sKContrib + sEmployerMatch + profitSharing) * (1 + growthRate);
    sRothK = (sRothK + sRothKContrib) * (1 + growthRate);
    sBrokerage = (sBrokerage + sBrokerageContrib) * (1 + growthRate);

    totalContributions += curIraContrib + curRothIraContrib + curKContrib + curRothKContrib + brokerageContrib;
    totalContributions += sIraContrib + sRothIraContrib + sKContrib + sRothKContrib + sBrokerageContrib;
    totalContributions += employerMatch + sEmployerMatch + profitSharing*2;
  }

  const totalIRA = ira + sIra;
  const totalRothIRA = rothIra + sRothIra;
  const totalK = k401 + sK401;
  const totalRothK = rothK + sRothK;
  const totalBrokerage = brokerage + sBrokerage;
  const totalAll = totalIRA + totalRothIRA + totalK + totalRothK + totalBrokerage;

  const inflationAdjusted = totalAll / Math.pow(1 + inflationRate, years);

  document.getElementById("results").innerHTML = `
    <p><strong>Total Projected Balance:</strong> $${formatNumber(totalAll)}</p>
    <p>IRA: $${formatNumber(totalIRA)}</p>
    <p>Roth IRA: $${formatNumber(totalRothIRA)}</p>
    <p>401k: $${formatNumber(totalK)}</p>
    <p>Roth 401k: $${formatNumber(totalRothK)}</p>
    <p>Brokerage: $${formatNumber(totalBrokerage)}</p>
    <p>Total Contributions: $${formatNumber(totalContributions)}</p>
    <p>Inflation Adjusted Value: $${formatNumber(inflationAdjusted)}</p>
  `;
}

// Live updates
document.querySelectorAll('input[type="number"], input[type="checkbox"]').forEach(input => {
  input.addEventListener('input', calculate);
});

// Initialize calculation
calculate();
