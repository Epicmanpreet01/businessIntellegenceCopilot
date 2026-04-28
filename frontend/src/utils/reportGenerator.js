import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

export const generateProfessionalPDF = async (data, datasetId, chartRef) => {
  // Use a try-catch for the whole process to ensure we can at least show a meaningful error
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Helper to safely format numbers
    const formatNum = (val, dec = 1) => {
      const n = Number(val);
      return isNaN(n) ? "0.0" : n.toFixed(dec);
    };

    const { analytics, insights } = data || {};
    const primaryColor = [234, 88, 12]; // #ea580c (Orange)
    const secondaryColor = [38, 38, 38]; // #262626 (Neutral-800)
    const textColor = [64, 64, 64]; // #404040
    const lightBg = [250, 250, 250]; // #fafafa

    let currentY = 20;

    // --- Header ---
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("BUSINESS COPILOT AI", 15, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Intelligence Report | Dataset ID: ${String(datasetId || "N/A").substring(0, 12)}...`, 15, 28);
    doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 15, 33);

    // Confidence Score in Header
    const conf = String(insights?.confidence || "medium").toUpperCase();
    doc.setFontSize(9);
    doc.text(`CONFIDENCE: ${conf}`, 195, 33, { align: "right" });

    currentY = 55;

    // --- Executive Summary ---
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Executive Summary", 15, currentY);
    currentY += 8;

    doc.setTextColor(...textColor);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const summaryText = insights?.summary || "No summary available.";
    const summaryLines = doc.splitTextToSize(String(summaryText), 180);
    doc.text(summaryLines, 15, currentY);
    currentY += summaryLines.length * 5 + 10;

    // --- Key Performance Indicators (KPIs) ---
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Key Performance Indicators", 15, currentY);
    currentY += 5;

    const growthPos = (analytics?.change?.last_7d >= analytics?.change?.last_30d) ? "Accelerating" : "Softening";

    const kpiData = [
      ["Metric", "Value", "Status / Details"],
      ["Growth Positioning", growthPos, "Short vs Long-term Momentum"],
      ["30-Day Growth", `${Number(analytics?.change?.last_30d || 0) >= 0 ? "+" : ""}${formatNum(analytics?.change?.last_30d, 1)}%`, (Number(analytics?.change?.last_30d || 0) >= 0 ? "Positive Momentum" : "Requires Attention")],
      ["Overall Trend", String(analytics?.trend?.direction || "Unknown").toUpperCase(), `${String(analytics?.trend?.strength || "N/A")} Trajectory`],
      ["7-Day Momentum", `${Number(analytics?.change?.last_7d || 0) >= 0 ? "+" : ""}${formatNum(analytics?.change?.last_7d, 1)}%`, "Short-term Velocity"],
      ["Forecast", String(analytics?.forecast?.trend || "Stable").toUpperCase(), `${formatNum(analytics?.forecast?.change_pct, 1)}% Expected Change`],
      ["Seasonality", String(analytics?.seasonality?.dominant_period || "None"), `${String(analytics?.seasonality?.strength || "")} ${String(analytics?.seasonality?.pattern || "")}`],
      ["Data Health", `${analytics?.anomaly_summary?.count || 0} Anomalies`, (Number(analytics?.anomaly_summary?.count || 0) > 3 ? "Volatile" : "Stable")],
    ];

    autoTable(doc, {
      startY: currentY,
      head: [kpiData[0]],
      body: kpiData.slice(1),
      headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: lightBg },
      margin: { left: 15, right: 15 },
      theme: "striped",
    });

    currentY = doc.lastAutoTable.finalY + 15;

    // --- Root Cause Analysis (Analysis Reasons) ---
    if (insights?.reasons && insights.reasons.length > 0) {
      if (currentY > 240) {
        doc.addPage();
        currentY = 20;
      }

      doc.setTextColor(...secondaryColor);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Root Cause Analysis", 15, currentY);
      currentY += 8;

      doc.setTextColor(...textColor);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      insights.reasons.forEach((reason, index) => {
        const reasonLines = doc.splitTextToSize(`\u2022 ${reason}`, 170);
        if (currentY + reasonLines.length * 5 > 280) {
          doc.addPage();
          currentY = 20;
        }
        doc.text(reasonLines, 20, currentY);
        currentY += reasonLines.length * 5 + 2;
      });

      currentY += 10;
    }

    if (chartRef && chartRef.current) {
      try {
        const chartElement = chartRef.current;
        const canvas = await html2canvas(chartElement, {
          backgroundColor: "#ffffff",
          scale: 2,
          logging: false,
          useCORS: true,
          onclone: (clonedDoc) => {
            const allElements = clonedDoc.getElementsByTagName("*");
            for (let i = 0; i < allElements.length; i++) {
              const el = allElements[i];
              const style = window.getComputedStyle(el);
              if (style.color && style.color.includes("oklch")) el.style.color = "rgb(64, 64, 64)";
              if (style.backgroundColor && style.backgroundColor.includes("oklch")) el.style.backgroundColor = "transparent";
              if (style.borderColor && style.borderColor.includes("oklch")) el.style.borderColor = "rgb(229, 229, 229)";
            }

            const clonedChart = clonedDoc.querySelector('[ref-id="revenue-chart-container"]');
            if (clonedChart) {
              clonedChart.style.width = "1200px";
              clonedChart.style.height = "500px";
              clonedChart.style.display = "block";
              clonedChart.style.visibility = "visible";
            }
          }
        });

        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 180;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (currentY + imgHeight > 280) {
          doc.addPage();
          currentY = 20;
        }

        doc.addImage(imgData, "PNG", 15, currentY, imgWidth, imgHeight);
        currentY += imgHeight + 15;
      } catch (error) {
        console.warn("Skipping chart capture due to rendering issues:", error);
      }
    }

    const seasonalityDist = analytics?.seasonality?.distribution;
    if (seasonalityDist) {
      if (currentY > 230) {
        doc.addPage();
        currentY = 20;
      }

      doc.setTextColor(...secondaryColor);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Weekly Performance Distribution", 15, currentY);
      currentY += 5;

      const weeklyData = Object.entries(seasonalityDist).map(([day, val]) => [
        day,
        formatNum(val, 2),
        val >= 0 ? "Strong" : "Weak"
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [["Day", "Impact Score", "Rating"]],
        body: weeklyData,
        headStyles: { fillColor: [59, 130, 246], textColor: 255 }, // Blue header for this table
        margin: { left: 15, right: 15 },
        theme: "grid",
      });

      currentY = doc.lastAutoTable.finalY + 15;
    }

    // --- Strategic Recommendations ---
    if (currentY > 240) {
      doc.addPage();
      currentY = 20;
    }

    doc.setTextColor(...secondaryColor);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Strategic Recommendations", 15, currentY);
    currentY += 8;

    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const recommendations = insights?.recommendations || [];
    recommendations.forEach((rec, index) => {
      const recLines = doc.splitTextToSize(`${index + 1}. ${String(rec)}`, 170);
      if (currentY + recLines.length * 5 > 280) {
        doc.addPage();
        currentY = 20;
      }
      doc.text(recLines, 20, currentY);
      currentY += recLines.length * 5 + 3;
    });

    currentY += 10;

    // --- Anomaly Log ---
    if (analytics?.anomalies && Array.isArray(analytics.anomalies) && analytics.anomalies.length > 0) {
      if (currentY > 230) {
        doc.addPage();
        currentY = 20;
      }

      doc.setTextColor(...secondaryColor);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Anomaly Detection Log", 15, currentY);
      currentY += 5;

      const anomalyData = analytics.anomalies.slice(0, 10).map(a => [
        new Date(a.ds).toLocaleDateString(),
        String(a.type || "Anomaly").toUpperCase(),
        String(a.strength || "Normal").toUpperCase(),
        formatNum(a.severity, 2),
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [["Date", "Type", "Strength", "Severity"]],
        body: anomalyData,
        headStyles: { fillColor: [64, 64, 64], textColor: 255 },
        margin: { left: 15, right: 15 },
        theme: "grid",
      });
    }

    // --- Footer ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Confidential Business Intelligence Report - Page ${i} of ${pageCount}`,
        105,
        287,
        { align: "center" }
      );
    }

    doc.save(`Business_Report_${String(datasetId || "export").substring(0, 8)}.pdf`);
  } catch (globalError) {
    console.error("Critical error in PDF generation:", globalError);
    // Explicitly alert the user via console for debugging
    alert("Professional PDF generation failed. Falling back to simple print.");
    window.print(); // Fallback if JS generation fails
    throw globalError;
  }
};
