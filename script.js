function calculate() {

  let currentAge = +document.getElementById("currentAge").value;
  let retireAge = +document.getElementById("retireAge").value;
  let years = retireAge - currentAge;

  let growthRate = +document.getElementById("growthRate").value / 100;
  let inflationRate = +document.getElementById("inflationRate").value / 100;

  let ira = +document.getElementById("iraBalance").value;
  let k401 = +document.getElementById("kBalance").value;
  let brokerage = +document.getElementById("brokerageBalance").value;

  let iraContrib = +document.getElementById("iraContribution").value;
  let kContrib = +document.getElementById("kContribution").value;
  let brokerageContrib = +document.getElementById("brokerageContribution").value;

  let matchPercent = +document.getElementById("matchPercent").value / 100;
  let profitSharing = +document.getElementById("profitSharing").value;

  let maxToggle = document.getElementById("maxToggle").checked;
  let growToggle = document.getElementById("growToggle").checked;
  let contribGrowth = +document.getElementById("contributionGrowth").value / 100;

  // Assumed current max limits
  let iraMax = 7000;
  let kMax = 23000;

  // Historical pattern assumption:
  // IRS increases roughly every 2 years ~3%
  let limitGrowthRate = 0.03;
  let limitIncreaseFrequency = 2;

  let totalContributions = 0;

  for (let i = 1; i <= years; i++) {

    // Increase max limits periodically
    if (maxToggle && i % limitIncreaseFrequency === 0) {
      iraMax *= (1 + limitGrowthRate);
      kMax *= (1 + limitGrowthRate);
    }

    let currentIraContrib = maxToggle ? iraMax : iraContrib;
    let currentKContrib = maxToggle ? kMax : kContrib;

    if (growToggle && !maxToggle) {
      currentIraContrib *= Math.pow((1 + contribGrowth), i - 1);
      currentKContrib *= Math.pow((1 + contribGrowth), i - 1);
      brokerageContrib *= Math.pow((1 + contribGrowth), i - 1);
    }

    let employerMatch = currentKContrib * matchPercent;

    ira = (ira + currentIraContrib) * (1 + growthRate);

    k401 = (k401 + currentKContrib + employerMatch + profitSharing) * (1 + growthRate);

    brokerage = (brokerage + brokerageContrib) * (1 + growthRate);

    totalContributions += currentIraContrib + currentKContrib + employerMatch + profitSharing + brokerageContrib;
  }

  let total = ira + k401 + brokerage;

  let realReturn = ((1 + growthRate) / (1 + inflationRate)) - 1;
  let inflationAdjusted = total / Math.pow((1 + inflationRate), years);

  document.getElementById("results").innerHTML = `
    <p><strong>Total Projected Balance:</strong> $${total.toFixed(0)}</p>
    <p>IRA: $${ira.toFixed(0)}</p>
    <p>401k: $${k401.toFixed(0)}</p>
    <p>Brokerage: $${brokerage.toFixed(0)}</p>
    <p>Total Contributions: $${totalContributions.toFixed(0)}</p>
    <p>Inflation Adjusted Value: $${inflationAdjusted.toFixed(0)}</p>
  `;
}
