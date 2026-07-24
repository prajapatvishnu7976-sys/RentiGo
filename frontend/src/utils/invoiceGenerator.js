// ═══════════════════════════════════════════════════════════
// 📄 RentiGo - Invoice PDF Generator (FIXED)
// Professional invoice like Amazon/Flipkart
// ═══════════════════════════════════════════════════════════

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoicePDF = (booking) => {
  try {
    const doc = new jsPDF();

    // ═══ DATA EXTRACTION ═══
    const vehicle = booking.vehicle || {};
    const owner = booking.owner || {};
    const customer = booking.customer || {};
    const location = booking.location || {};

    const bookingId = booking.bookingId || booking._id?.slice(-8).toUpperCase();
    const invoiceDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    // Pricing calculations
    const baseAmount = (booking.pricePerUnit || 0) * (booking.totalDays || 0);
    const serviceFee = Math.round(baseAmount * 0.05);
    const gst = Math.round(baseAmount * 0.18);
    const total = booking.totalAmount || (baseAmount + serviceFee + gst);

    // ═══ COLORS ═══
    const primaryColor = [139, 92, 246]; // Violet
    const secondaryColor = [79, 70, 229]; // Indigo
    const darkColor = [30, 30, 46];
    const lightGray = [243, 244, 246];
    const textGray = [107, 114, 128];

    // ═══ HEADER - Brand ═══
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, "F");

    // Logo Circle
    doc.setFillColor(255, 255, 255);
    doc.circle(20, 20, 8, "F");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("R", 17, 23);

    // Company Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("RentiGo", 32, 20);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Premium Vehicle Rentals", 32, 27);

    // Invoice Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 180, 20, { align: "right" });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`#${bookingId}`, 180, 27, { align: "right" });

    // ═══ INVOICE INFO ═══
    let yPos = 50;

    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE DETAILS", 15, yPos);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    yPos += 6;
    doc.text(`Invoice Date: ${invoiceDate}`, 15, yPos);
    yPos += 5;
    doc.text(`Booking ID: ${bookingId}`, 15, yPos);
    yPos += 5;
    doc.text(`Status: ${booking.status?.toUpperCase() || "CONFIRMED"}`, 15, yPos);

    // Payment status (Right side)
    doc.setFillColor(34, 197, 94);
    doc.roundedRect(140, 47, 55, 20, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("PAID", 167.5, 55, { align: "center" });
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(`Rs. ${total.toLocaleString("en-IN")}`, 167.5, 62, { align: "center" });

    // ═══ FROM & TO ═══
    yPos = 80;

    // FROM (Owner/Company)
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.roundedRect(15, yPos, 85, 42, 2, 2, "F");

    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("FROM", 20, yPos + 7);

    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(owner.businessName || "RentiGo Fleet Services", 20, yPos + 14);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    doc.text(owner.name || "Rajesh Kumar", 20, yPos + 20);
    doc.text(`Phone: ${owner.phone || "9000000002"}`, 20, yPos + 25);
    doc.text(`Email: ${owner.email || "owner@rentigo.com"}`, 20, yPos + 30);
    doc.text("GSTIN: 27AABCR1234M1Z5", 20, yPos + 35);

    // TO (Customer)
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.roundedRect(110, yPos, 85, 42, 2, 2, "F");

    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO", 115, yPos + 7);

    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(customer.name || "Valued Customer", 115, yPos + 14);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    doc.text(`Email: ${customer.email || "customer@example.com"}`, 115, yPos + 20);
    doc.text(`Phone: ${customer.phone || "N/A"}`, 115, yPos + 25);
    doc.text(`Pickup: ${location.city || "N/A"}`, 115, yPos + 30);
    doc.text(`${location.name || ""}`, 115, yPos + 35);

    // ═══ VEHICLE DETAILS ═══
    yPos = 135;

    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.rect(15, yPos, 180, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("VEHICLE DETAILS", 20, yPos + 5.5);

    yPos += 12;

    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`${vehicle.brand || ""} ${vehicle.model || ""}`, 20, yPos);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    yPos += 6;

    const vehicleInfo = [
      `Vehicle Number: ${vehicle.vehicleNumber || "N/A"}`,
      `Type: ${vehicle.type === "2W" ? "Two Wheeler" : "Four Wheeler"}`,
      `Fuel: ${vehicle.fuelType?.toUpperCase() || "N/A"}`,
      `Transmission: ${vehicle.transmission?.toUpperCase() || "N/A"}`,
      `Year: ${vehicle.modelYear || "N/A"}`,
      `Color: ${vehicle.color || "N/A"}`,
    ];

    vehicleInfo.forEach((info, i) => {
      const x = i % 2 === 0 ? 20 : 110;
      const y = yPos + Math.floor(i / 2) * 5;
      doc.text(info, x, y);
    });

    // ═══ TRIP DETAILS ═══
    yPos += 22;

    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.rect(15, yPos, 180, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("TRIP INFORMATION", 20, yPos + 5.5);

    yPos += 12;

    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    const tripInfo = [
      { label: "Pickup Date:", value: formatDateForInvoice(booking.startDate) },
      { label: "Return Date:", value: formatDateForInvoice(booking.endDate) },
      { label: "Duration:", value: `${booking.totalDays || 0} days (${booking.durationType || "daily"})` },
      { label: "Pickup Location:", value: `${location.name || ""}, ${location.city || ""}` },
    ];

    tripInfo.forEach((item, i) => {
      const y = yPos + i * 6;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text(item.label, 20, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(textGray[0], textGray[1], textGray[2]);
      doc.text(item.value, 60, y);
    });

    // ═══ PAYMENT BREAKDOWN TABLE (FIXED - Using autoTable directly) ═══
    yPos += 30;

    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.rect(15, yPos, 180, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("PAYMENT BREAKDOWN", 20, yPos + 5.5);

    yPos += 8;

    // 🔥 FIXED: Use autoTable as function with doc as first argument
    autoTable(doc, {
      startY: yPos,
      head: [["Description", "Rate", "Days", "Amount"]],
      body: [
        [
          `${vehicle.brand} ${vehicle.model} (${booking.durationType})`,
          `Rs. ${(booking.pricePerUnit || 0).toLocaleString("en-IN")}`,
          `${booking.totalDays || 0}`,
          `Rs. ${baseAmount.toLocaleString("en-IN")}`,
        ],
      ],
      theme: "grid",
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: "bold",
        halign: "left",
      },
      bodyStyles: {
        fontSize: 9,
        textColor: darkColor,
      },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 35, halign: "right" },
        2: { cellWidth: 20, halign: "center" },
        3: { cellWidth: 35, halign: "right" },
      },
      margin: { left: 15, right: 15 },
    });

    // ═══ TOTALS ═══
    let finalY = doc.lastAutoTable.finalY + 5;

    // Subtotal
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    doc.text("Subtotal:", 130, finalY);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text(`Rs. ${baseAmount.toLocaleString("en-IN")}`, 195, finalY, { align: "right" });

    finalY += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    doc.text("Service Fee (5%):", 130, finalY);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text(`Rs. ${serviceFee.toLocaleString("en-IN")}`, 195, finalY, { align: "right" });

    finalY += 6;
    doc.text("GST (18%):", 130, finalY);
    doc.text(`Rs. ${gst.toLocaleString("en-IN")}`, 195, finalY, { align: "right" });

    // Divider line
    finalY += 4;
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(130, finalY, 195, finalY);

    // Grand Total
    finalY += 8;
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.roundedRect(125, finalY - 5, 70, 12, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL PAID:", 130, finalY + 2);
    doc.setFontSize(13);
    doc.text(`Rs. ${total.toLocaleString("en-IN")}`, 195, finalY + 2, { align: "right" });

    // ═══ PAYMENT INFO ═══
    finalY += 20;

    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Payment Information", 15, finalY);

    finalY += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    doc.setFontSize(8);
    doc.text(`Transaction ID: TXN${booking._id?.slice(-10).toUpperCase() || "N/A"}`, 15, finalY);
    finalY += 4;
    doc.text(`Payment Method: Online Payment`, 15, finalY);
    finalY += 4;
    doc.text(`Payment Date: ${invoiceDate}`, 15, finalY);
    finalY += 4;
    doc.text(`Status: Payment Successful`, 15, finalY);

    // ═══ TERMS & CONDITIONS ═══
    finalY += 10;

    if (finalY < 240) {
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.roundedRect(15, finalY, 180, 30, 2, 2, "F");

      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Terms & Conditions", 20, finalY + 6);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(textGray[0], textGray[1], textGray[2]);
      const terms = [
        "1. Vehicle must be returned in the same condition as delivered.",
        "2. Late return will incur additional charges as per company policy.",
        "3. Fuel charges are extra and not included in the rental price.",
        "4. Valid driving license and ID proof required at pickup.",
        "5. Security deposit of Rs. 2,000 will be refunded within 5-7 business days.",
      ];

      terms.forEach((term, i) => {
        doc.text(term, 20, finalY + 12 + i * 3.5);
      });
    }

    // ═══ FOOTER ═══
    doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.rect(0, 280, 210, 17, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Thank you for choosing RentiGo!", 105, 288, { align: "center" });

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("For support: support@rentigo.com | +91 80000 00000", 105, 293, { align: "center" });
    doc.text("This is a computer-generated invoice. No signature required.", 105, 296, { align: "center" });

    // ═══ SAVE PDF ═══
    const fileName = `RentiGo_Invoice_${bookingId}.pdf`;
    doc.save(fileName);

    return { success: true, fileName };
  } catch (error) {
    console.error("Invoice generation error:", error);
    return { success: false, error: error.message };
  }
};

// Helper function
const formatDateForInvoice = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default generateInvoicePDF;