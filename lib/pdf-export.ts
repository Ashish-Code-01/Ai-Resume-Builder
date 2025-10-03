import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportCanvasToPDF(canvas: HTMLCanvasElement, filename: string = 'resume.pdf') {
  try {
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [816, 1056],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 816, 1056);
    pdf.save(filename);

    return true;
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw error;
  }
}

export async function exportResumeToPDF(resumeContent: any, filename: string = 'resume.pdf') {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  let yOffset = 40;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 40;
  const contentWidth = pageWidth - 2 * margin;

  if (resumeContent.personalInfo) {
    const { fullName, email, phone, location, summary } = resumeContent.personalInfo;

    if (fullName) {
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text(fullName, margin, yOffset);
      yOffset += 25;
    }

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const contactInfo = [email, phone, location].filter(Boolean).join(' | ');
    if (contactInfo) {
      pdf.text(contactInfo, margin, yOffset);
      yOffset += 20;
    }

    if (summary) {
      const summaryLines = pdf.splitTextToSize(summary, contentWidth);
      pdf.text(summaryLines, margin, yOffset);
      yOffset += summaryLines.length * 12 + 20;
    }
  }

  if (resumeContent.experience && resumeContent.experience.length > 0) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('EXPERIENCE', margin, yOffset);
    yOffset += 20;

    pdf.setFontSize(10);
    resumeContent.experience.forEach((exp: any) => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${exp.position} | ${exp.company}`, margin, yOffset);
      yOffset += 12;

      pdf.setFont('helvetica', 'normal');
      pdf.text(`${exp.startDate} - ${exp.endDate || 'Present'}`, margin, yOffset);
      yOffset += 12;

      if (exp.description) {
        const descLines = pdf.splitTextToSize(exp.description, contentWidth);
        pdf.text(descLines, margin, yOffset);
        yOffset += descLines.length * 12 + 15;
      }
    });
    yOffset += 10;
  }

  if (resumeContent.education && resumeContent.education.length > 0) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('EDUCATION', margin, yOffset);
    yOffset += 20;

    pdf.setFontSize(10);
    resumeContent.education.forEach((edu: any) => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`, margin, yOffset);
      yOffset += 12;

      pdf.setFont('helvetica', 'normal');
      pdf.text(edu.institution, margin, yOffset);
      yOffset += 12;

      pdf.text(`${edu.startDate} - ${edu.endDate}`, margin, yOffset);
      yOffset += 20;
    });
  }

  if (resumeContent.skills && resumeContent.skills.length > 0) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SKILLS', margin, yOffset);
    yOffset += 20;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    resumeContent.skills.forEach((skillGroup: any) => {
      const skillText = `${skillGroup.category}: ${skillGroup.items.join(', ')}`;
      const skillLines = pdf.splitTextToSize(skillText, contentWidth);
      pdf.text(skillLines, margin, yOffset);
      yOffset += skillLines.length * 12 + 10;
    });
  }

  pdf.save(filename);
  return true;
}
