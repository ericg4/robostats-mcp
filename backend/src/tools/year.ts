// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatYearStats(yearData: any): string {
  if (!yearData || typeof yearData !== "object") return "No data available.";
  const lines: string[] = [];
  
  lines.push(`=== FRC ${yearData.year} Season Statistics ===`);
  lines.push("");
  
  // Overall scoring stats
  if (yearData.score_mean !== undefined) {
    lines.push("📊 OVERALL SCORING");
    lines.push(`Average Score: ${yearData.score_mean} ± ${yearData.score_sd || 'N/A'}`);
    if (yearData.breakdown?.no_foul_mean) lines.push(`Score (no fouls): ${yearData.breakdown.no_foul_mean}`);
    if (yearData.breakdown?.foul_mean) lines.push(`Average Fouls: ${yearData.breakdown.foul_mean} points`);
    lines.push("");
  }
  
  // Game phase breakdown
  if (yearData.breakdown) {
    lines.push("🎮 GAME PHASE BREAKDOWN");
    if (yearData.breakdown.auto_points_mean) lines.push(`Autonomous: ${yearData.breakdown.auto_points_mean} points`);
    if (yearData.breakdown.teleop_points_mean) lines.push(`Teleoperated: ${yearData.breakdown.teleop_points_mean} points`);
    if (yearData.breakdown.endgame_points_mean) lines.push(`Endgame: ${yearData.breakdown.endgame_points_mean} points`);
    lines.push("");
    
    // Game-specific stats
    lines.push("🎯 GAME ELEMENT AVERAGES");
    const gameElements = Object.entries(yearData.breakdown)
      .filter(([key]) => !key.includes('points_mean') && !key.includes('rp_mean') && !key.includes('total_') && !key.includes('foul') && !key.includes('tiebreaker'))
      .map(([key, value]) => {
        const readable = key.replace(/_mean$/, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return `${readable}: ${value}`;
      });
    gameElements.forEach(element => lines.push(element));
    lines.push("");
    
    // Ranking points
    if (yearData.breakdown.rp_1_mean !== undefined || yearData.breakdown.rp_2_mean !== undefined) {
      lines.push("🏆 RANKING POINTS");
      if (yearData.breakdown.rp_1_mean !== undefined) lines.push(`RP 1: ${(yearData.breakdown.rp_1_mean * 100).toFixed(1)}% achievement rate`);
      if (yearData.breakdown.rp_2_mean !== undefined) lines.push(`RP 2: ${(yearData.breakdown.rp_2_mean * 100).toFixed(1)}% achievement rate`);
      lines.push("");
    }
  }
  
  // Top percentiles for key metrics
  if (yearData.percentiles) {
    lines.push("📈 PERFORMANCE PERCENTILES (Top 10% / Top 25% / Bottom 25%)");
    const keyMetrics = ['total_points', 'auto_points', 'teleop_points', 'endgame_points'];
    keyMetrics.forEach(metric => {
      if (yearData.percentiles[metric]) {
        const p = yearData.percentiles[metric];
        const readable = metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        lines.push(`${readable}: ${p.p90}+ / ${p.p75}+ / ${p.p25}+`);
      }
    });
    lines.push("");
  }
  
  // Model performance metrics
  if (yearData.metrics) {
    lines.push("🤖 PREDICTION MODEL PERFORMANCE");
    if (yearData.metrics.win_prob?.season) {
      const wp = yearData.metrics.win_prob.season;
      lines.push(`Win Prediction: ${(wp.acc * 100).toFixed(1)}% accuracy (${wp.count.toLocaleString()} matches)`);
    }
    if (yearData.metrics.score_pred?.season) {
      const sp = yearData.metrics.score_pred.season;
      lines.push(`Score Prediction: ${sp.rmse.toFixed(1)} RMSE, ${sp.error.toFixed(1)} avg error`);
    }
    lines.push("");
  }
  
  return lines.join("\n");
}