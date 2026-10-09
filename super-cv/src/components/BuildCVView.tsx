import React, { useState, useMemo } from 'react';
import { useCV } from '../context/CVContext';
import { useAuth } from '../context/AuthContext';
import { TECH_ROADMAPS, ALL_30_TECH_ROADMAPS, SOFT_SKILLS_OPTIONS, findTrackById, OTHER_TRACK } from '../data/roadmaps';
import { toPng } from 'html-to-image';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { BuildCVSkeleton } from './SkeletonLoader';

export const BuildCVView: React.FC = () => {
  const {
    cv,
    updateCV,
    setTrackId,
    toggleTechSkill,
    addCustomTechSkill,
    removeTechSkill,
    toggleSoftSkill,
    addCustomSoftSkill,
    removeSoftSkill,
    updateExperience,
    addExperience,
    deleteExperience,
    setActiveTab,
    saveCVToFirestore,
    createNewCV,
    isSyncing,
    isLoadingCVs,
  } = useCV();
  const { user } = useAuth();
  const [cloudSaved, setCloudSaved] = useState(false);
  const [isManualSaving, setIsManualSaving] = useState(false);
  const [saveToast, setSaveToast] = useState<{ show: boolean; title: string } | null>(null);

  const handleManualSave = async () => {
    setIsManualSaving(true);
    try {
      await saveCVToFirestore();
      const track = findTrackById(cv.trackId || 'other');
      const displayTitle = cv.trackId && cv.trackId !== 'other' && track
        ? track.titleAr
        : (cv.targetRole?.trim() || cv.title?.trim() || 'تراك مخصص');

      setCloudSaved(true);
      setSaveToast({
        show: true,
        title: displayTitle,
      });
      setTimeout(() => {
        setCloudSaved(false);
      }, 3500);
      setTimeout(() => {
        setSaveToast(null);
      }, 4500);
    } catch (e) {
      console.error('Error during manual save:', e);
    } finally {
      setIsManualSaving(false);
    }
  };

  // Distribute sections across A4 pages smartly without cutting text in half
  const resumePages = useMemo(() => {
    // 1. Filter out all unfilled sections - strictly only include filled content
    const hasSummary = Boolean(cv.summary?.trim());
    const hasTech = Boolean(cv.techSkills && cv.techSkills.length > 0);
    const hasSoft = Boolean(cv.softSkills && cv.softSkills.length > 0);
    const hasSkills = hasTech || hasSoft;
    const validEdus = cv.education ? cv.education.filter(e => e.degree?.trim() || e.institution?.trim()) : [];
    const hasEducation = validEdus.length > 0;
    const validExps = cv.experiences ? cv.experiences.filter(e => e.role?.trim() || e.company?.trim()) : [];
    const hasExperience = validExps.length > 0;
    const validProjs = cv.projects ? cv.projects.filter(p => p.title?.trim() || p.description?.trim()) : [];
    const hasProjects = validProjs.length > 0;
    const validCerts = cv.certifications ? cv.certifications.filter(c => c.title?.trim() || c.issuer?.trim()) : [];
    const hasCertifications = validCerts.length > 0;

    const contactParts = [cv.location?.trim(), cv.email?.trim(), cv.phone?.trim(), cv.linkedin?.trim(), cv.github?.trim()].filter(Boolean) as string[];
    const hasContact = contactParts.length > 0;

    // Available usable height per A4 page (at 500px width: 707px min-height - 48px padding - 20px safety buffer)
    const PAGE_HEIGHT = 635;

    // Header estimate on Page 1
    const headerHeight = 70 + (hasContact ? 25 : 0) + 15;

    interface PageBlock {
      id: string;
      estH: number;
      element: React.ReactNode;
    }

    const blocks: PageBlock[] = [];

    // Summary block (only if filled)
    if (hasSummary) {
      const summaryLines = Math.ceil((cv.summary?.length || 0) / 75);
      const estH = 30 + summaryLines * 16 + 10;
      blocks.push({
        id: 'summary',
        estH,
        element: (
          <div key="summary">
            <div className="font-mono font-bold text-xs uppercase text-neutral-900 border-b border-neutral-300 pb-1 mb-1.5 tracking-wider">
              <span>PROFESSIONAL SUMMARY</span>
            </div>
            <div className="pl-4 sm:pl-5">
              <p className="text-neutral-700 leading-normal">{cv.summary}</p>
            </div>
          </div>
        ),
      });
    }

    // Skills block (only if filled)
    if (hasSkills) {
      const estH = 30 + (hasTech ? 22 : 0) + (hasSoft ? 22 : 0) + 10;
      blocks.push({
        id: 'skills',
        estH,
        element: (
          <div key="skills">
            <div className="font-mono font-bold text-xs uppercase text-neutral-900 border-b border-neutral-300 pb-1 mb-1.5 tracking-wider">
              <span>SKILLS</span>
            </div>
            <div className="pl-4 sm:pl-5 grid grid-cols-1 gap-1.5 text-[10px]">
              {hasTech && (
                <div>
                  <span className="font-bold text-neutral-900 font-sans">Technical Skills: </span>
                  <span className="text-neutral-700 font-mono">{cv.techSkills?.join(', ')}</span>
                </div>
              )}
              {hasSoft && (
                <div>
                  <span className="font-bold text-neutral-900 font-sans">Soft Skills: </span>
                  <span className="text-neutral-700">{cv.softSkills?.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        ),
      });
    }

    // Education block (only if filled)
    if (hasEducation) {
      const estH = 30 + validEdus.length * 36 + 10;
      blocks.push({
        id: 'education',
        estH,
        element: (
          <div key="education">
            <div className="font-mono font-bold text-xs uppercase text-neutral-900 border-b border-neutral-300 pb-1 mb-1.5 tracking-wider">
              <span>EDUCATION</span>
            </div>
            <div className="pl-4 sm:pl-5 flex flex-col gap-1.5">
              {validEdus.map((edu, idx) => (
                <div key={idx} className="flex items-start justify-between text-[10px]">
                  <div>
                    <span className="font-bold text-neutral-900 block">{edu.degree || ''}</span>
                    <span className="text-neutral-600 block">
                      {edu.institution || ''} {edu.honors ? `— ${edu.honors}` : ''}
                    </span>
                  </div>
                  {edu.period && <span className="font-mono text-[9.5px] text-neutral-500 shrink-0">{edu.period}</span>}
                </div>
              ))}
            </div>
          </div>
        ),
      });
    }

    // Experience block (only if filled)
    if (hasExperience) {
      const totalExpH = 30 + validExps.reduce((acc, exp) => {
        const achCount = exp.achievements ? exp.achievements.filter(a => a?.trim()).length : 0;
        return acc + 34 + (exp.location ? 16 : 0) + achCount * 18 + 8;
      }, 0);

      blocks.push({
        id: 'experience',
        estH: totalExpH,
        element: (
          <div key="experience">
            <div className="font-mono font-bold text-xs uppercase text-neutral-900 border-b border-neutral-300 pb-1 mb-1.5 tracking-wider">
              <span>EXPERIENCE</span>
            </div>
            <div className="pl-4 sm:pl-5 flex flex-col gap-2.5">
              {validExps.map((exp, idx) => (
                <div key={idx} className="flex flex-col gap-0.5">
                  <div className="flex items-center justify-between font-bold text-neutral-900 text-[10px]">
                    <span>
                      {exp.role || ''} {exp.company ? `— ${exp.company}` : ''}
                    </span>
                    {exp.period && <span className="font-mono text-[9.5px] text-neutral-500 font-normal">{exp.period}</span>}
                  </div>
                  {exp.location && <div className="text-[10px] text-neutral-600 mb-0.5">{exp.location}</div>}
                  {exp.achievements && exp.achievements.filter(ach => ach?.trim()).length > 0 && (
                    <ul className="list-disc list-outside ml-4 text-neutral-700 space-y-1 text-[10px]">
                      {exp.achievements
                        .filter(ach => ach?.trim())
                        .map((ach, aIdx) => <li key={aIdx}>{ach}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ),
      });
    }

    // Projects block (only if filled)
    if (hasProjects) {
      const totalProjH = 30 + validProjs.reduce((acc, proj) => {
        const descLines = proj.description ? Math.ceil(proj.description.length / 75) : 0;
        return acc + 28 + (proj.techStack ? 16 : 0) + descLines * 16 + 8;
      }, 0);

      blocks.push({
        id: 'projects',
        estH: totalProjH,
        element: (
          <div key="projects">
            <div className="font-mono font-bold text-xs uppercase text-neutral-900 border-b border-neutral-300 pb-1 mb-1.5 tracking-wider">
              <span>PROJECTS</span>
            </div>
            <div className="pl-4 sm:pl-5 flex flex-col gap-2">
              {validProjs.map((proj, idx) => (
                <div key={idx} className="flex flex-col gap-0.5">
                  <div className="flex items-center justify-between font-bold text-neutral-900 text-[10px]">
                    <span>{proj.title || ''}</span>
                    {proj.link && (
                      <span className="font-mono text-[9.5px] text-neutral-500 font-normal">{proj.link}</span>
                    )}
                  </div>
                  {proj.techStack && (
                    <div className="text-[9.5px] text-neutral-600 font-mono mb-0.5">{proj.techStack}</div>
                  )}
                  {proj.description && (
                    <p className="text-[10px] text-neutral-700 leading-normal">{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ),
      });
    }

    // Certifications block (only if filled)
    if (hasCertifications) {
      const estH = 30 + validCerts.length * 22 + 10;
      blocks.push({
        id: 'certifications',
        estH,
        element: (
          <div key="certifications">
            <div className="font-mono font-bold text-xs uppercase text-neutral-900 border-b border-neutral-300 pb-1 mb-1.5 tracking-wider">
              <span>CERTIFICATIONS</span>
            </div>
            <div className="pl-4 sm:pl-5 flex flex-col gap-1 text-[10px]">
              {validCerts.map((cert, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-900">{cert.title} {cert.issuer ? `– ${cert.issuer}` : ''}</span>
                  {cert.year && <span className="font-mono text-[9.5px] text-neutral-500">{cert.year}</span>}
                </div>
              ))}
            </div>
          </div>
        ),
      });
    }

    // Packing into separated pages
    const pages: { isFirst: boolean; blocks: PageBlock[] }[] = [];
    let curPageIdx = 0;
    let spaceLeft = PAGE_HEIGHT - headerHeight;
    pages.push({ isFirst: true, blocks: [] });

    for (const block of blocks) {
      if (block.estH <= spaceLeft || pages[curPageIdx].blocks.length === 0) {
        pages[curPageIdx].blocks.push(block);
        spaceLeft -= (block.estH + 14);
      } else {
        curPageIdx++;
        spaceLeft = PAGE_HEIGHT - block.estH - 14;
        pages.push({ isFirst: false, blocks: [block] });
      }
    }

    return {
      pages,
      hasContact,
      contactParts,
      totalBlocksCount: blocks.length,
    };
  }, [cv]);

  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloadingPdf(true);
    try {
      // 1. Auto-save current progress
      await handleManualSave();

      const cleanName = (cv.fullName || 'Candidate')
        .trim()
        .replace(/[/\\?%*:|"<>]/g, '_');
      const fileName = `${cleanName || 'CV'}_Resume.pdf`;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      let pdfReady = false;

      // Method A: Capture separated A4 page sheets directly from .a4-resume-page elements
      try {
        const pageElements = Array.from(document.querySelectorAll<HTMLElement>('.a4-resume-page'));
        const elementsToRender = pageElements.length > 0
          ? pageElements
          : ([document.getElementById('a4-resume-sheet')].filter(Boolean) as HTMLElement[]);

        if (elementsToRender.length > 0) {
          for (let i = 0; i < elementsToRender.length; i++) {
            const element = elementsToRender[i];
            const prevTransform = element.style.transform;
            const prevShadow = element.style.boxShadow;
            const prevBorder = element.style.border;
            const prevRadius = element.style.borderRadius;

            // Temporarily remove preview decorations (zoom transform, shadow, card borders, rounded corners)
            element.style.transform = 'none';
            element.style.boxShadow = 'none';
            element.style.border = 'none';
            element.style.borderRadius = '0';

            // Wait a tick for browser layout & reflow
            await new Promise((r) => setTimeout(r, 80));

            let dataUrl: string | null = null;
          let canvasWidth = 0;
          let canvasHeight = 0;

          try {
            // High-DPI canvas capture (scale: 3 for 300 DPI vector-sharp quality)
            const canvas = await html2canvas(element, {
              scale: 3,
              useCORS: true,
              allowTaint: false,
              backgroundColor: '#ffffff',
              logging: false,
              windowWidth: element.scrollWidth,
            });
            dataUrl = canvas.toDataURL('image/png', 1.0);
            canvasWidth = canvas.width;
            canvasHeight = canvas.height;
          } catch (canvasErr) {
            console.warn('html2canvas notice, trying html-to-image fallback:', canvasErr);
            try {
              dataUrl = await toPng(element, {
                quality: 1,
                pixelRatio: 3,
                backgroundColor: '#ffffff',
                skipFonts: true,
                cacheBust: true,
              });
              const img = new Image();
              await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = dataUrl!;
              });
              canvasWidth = img.width;
              canvasHeight = img.height;
            } catch (pngErr) {
              console.error('All DOM capture methods failed:', pngErr);
            }
          }

          // Restore preview styling immediately
          element.style.transform = prevTransform;
          element.style.boxShadow = prevShadow;
          element.style.border = prevBorder;
          element.style.borderRadius = prevRadius;

            if (dataUrl) {
              if (i > 0) {
                pdf.addPage();
              }
              // Add exact full A4 page: 210mm x 297mm without clipping or slicing words in half
              pdf.addImage(dataUrl, 'PNG', 0, 0, 210, 297, undefined, 'SLOW');
              pdfReady = true;
            }
          }
        }
      } catch (domErr) {
        console.warn('DOM capture notice, switching to vector PDF builder:', domErr);
      }

      // Method B: High-Precision Vector PDF Fallback (Runs instantly with 0 external dependencies)
      if (!pdfReady) {
        let cursorY = 22;

        // Header: Full Name
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(18);
        pdf.setTextColor(20, 20, 20);
        pdf.text(cv.fullName || 'YOUR FULL NAME', 20, cursorY);
        cursorY += 7;

        // Target Role / Domain
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.setTextColor(70, 70, 70);
        pdf.text(cv.targetRole || 'Professional', 20, cursorY);
        cursorY += 6;

        // Contact info
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        const contactParts = [cv.location, cv.email, cv.phone, cv.linkedin, cv.github].filter(Boolean);
        if (contactParts.length > 0) {
          pdf.text(contactParts.join(' | '), 20, cursorY);
          cursorY += 6;
        }

        // Section divider line
        pdf.setDrawColor(210, 210, 210);
        pdf.setLineWidth(0.4);
        pdf.line(20, cursorY, 190, cursorY);
        cursorY += 8;

        // Professional Summary
        if (cv.summary) {
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(10.5);
          pdf.setTextColor(20, 20, 20);
          pdf.text('PROFESSIONAL SUMMARY', 20, cursorY);
          cursorY += 5;
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(9);
          pdf.setTextColor(50, 50, 50);
          const splitSummary = pdf.splitTextToSize(cv.summary, 170);
          pdf.text(splitSummary, 20, cursorY);
          cursorY += splitSummary.length * 4.2 + 5;
        }

        // Technical Skills
        if (cv.techSkills && cv.techSkills.length > 0) {
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(10.5);
          pdf.setTextColor(20, 20, 20);
          pdf.text('TECHNICAL SKILLS', 20, cursorY);
          cursorY += 5;
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(9);
          pdf.setTextColor(50, 50, 50);
          const splitSkills = pdf.splitTextToSize(cv.techSkills.join(', '), 170);
          pdf.text(splitSkills, 20, cursorY);
          cursorY += splitSkills.length * 4.2 + 5;
        }

        // Experience
        if (cv.experiences && cv.experiences.length > 0) {
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(10.5);
          pdf.setTextColor(20, 20, 20);
          pdf.text('EXPERIENCE', 20, cursorY);
          cursorY += 5;

          cv.experiences.forEach((exp) => {
            if (cursorY > 265) {
              pdf.addPage();
              cursorY = 20;
            }
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(9.5);
            pdf.setTextColor(25, 25, 25);
            pdf.text(`${exp.role || 'Role'} - ${exp.company || 'Company'}`, 20, cursorY);
            if (exp.period) {
              pdf.setFont('helvetica', 'normal');
              pdf.text(exp.period, 190, cursorY, { align: 'right' });
            }
            cursorY += 4.5;

            if (exp.achievements) {
              pdf.setFont('helvetica', 'normal');
              pdf.setFontSize(8.5);
              pdf.setTextColor(60, 60, 60);
              exp.achievements.forEach((ach) => {
                if (ach?.trim()) {
                  const splitAch = pdf.splitTextToSize(`• ${ach}`, 165);
                  pdf.text(splitAch, 23, cursorY);
                  cursorY += splitAch.length * 4;
                }
              });
            }
            cursorY += 3;
          });
        }

        // Education
        if (cv.education && cv.education.length > 0) {
          if (cursorY > 255) {
            pdf.addPage();
            cursorY = 20;
          }
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(10.5);
          pdf.setTextColor(20, 20, 20);
          pdf.text('EDUCATION', 20, cursorY);
          cursorY += 5;

          cv.education.forEach((edu) => {
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(9.5);
            pdf.text(edu.degree || 'Degree', 20, cursorY);
            if (edu.period) {
              pdf.setFont('helvetica', 'normal');
              pdf.text(edu.period, 190, cursorY, { align: 'right' });
            }
            cursorY += 4.5;
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8.5);
            pdf.text(edu.institution || '', 20, cursorY);
            cursorY += 5;
          });
        }

        // Projects
        if (cv.projects && cv.projects.length > 0) {
          if (cursorY > 255) {
            pdf.addPage();
            cursorY = 20;
          }
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(10.5);
          pdf.setTextColor(20, 20, 20);
          pdf.text('PROJECTS', 20, cursorY);
          cursorY += 5;

          cv.projects.forEach((proj) => {
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(9.5);
            pdf.text(proj.title || 'Project', 20, cursorY);
            cursorY += 4;
            if (proj.techStack) {
              pdf.setFont('helvetica', 'normal');
              pdf.setFontSize(8.5);
              pdf.setTextColor(70, 70, 70);
              pdf.text(`Tech Stack: ${proj.techStack}`, 20, cursorY);
              cursorY += 4;
            }
            if (proj.description) {
              pdf.setFont('helvetica', 'normal');
              pdf.setFontSize(8.5);
              pdf.setTextColor(60, 60, 60);
              const splitProj = pdf.splitTextToSize(proj.description, 168);
              pdf.text(splitProj, 20, cursorY);
              cursorY += splitProj.length * 3.8 + 2;
            }
          });
        }

        pdfReady = true;
      }

      // 3. Trigger Download strictly once
      const pdfBlob = pdf.output('blob');
      let downloadInitiated = false;

      // Primary Channel: Native Client-side Blob Anchor (instant direct download)
      try {
        const blobUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        downloadInitiated = true;
        setTimeout(() => {
          if (document.body.contains(link)) {
            document.body.removeChild(link);
          }
          URL.revokeObjectURL(blobUrl);
        }, 1500);
      } catch (blobErr) {
        console.warn('Blob anchor download notice:', blobErr);
      }

      // Fallback Channel: Only trigger server stream if primary client channel failed
      if (!downloadInitiated) {
        try {
          const pdfBase64 = pdf.output('datauristring');
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = '/api/cv/download-pdf';
          form.style.display = 'none';

          const inputPdf = document.createElement('input');
          inputPdf.type = 'hidden';
          inputPdf.name = 'pdfBase64';
          inputPdf.value = pdfBase64;
          form.appendChild(inputPdf);

          const inputName = document.createElement('input');
          inputName.type = 'hidden';
          inputName.name = 'fileName';
          inputName.value = fileName;
          form.appendChild(inputName);

          document.body.appendChild(form);
          form.submit();

          setTimeout(() => {
            if (document.body.contains(form)) {
              document.body.removeChild(form);
            }
          }, 3000);
        } catch (formErr) {
          console.warn('Form attachment fallback notice:', formErr);
        }
      }

      setSaveToast({
        show: true,
        title: `تم تنزيل ${fileName} بصيغة PDF على جهازك بنجاح! 📄`,
      });
      setTimeout(() => setSaveToast(null), 4500);
    } catch (err) {
      console.error('Fatal PDF download error:', err);
      try {
        window.print();
      } catch {}
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const [newSkillInput, setNewSkillInput] = useState('');
  const [newSoftSkillInput, setNewSoftSkillInput] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);


  const activeTrackId = cv.trackId || 'other';
  const currentTrack = findTrackById(activeTrackId) || OTHER_TRACK;
  const isTrackSelected = Boolean(cv.trackId && cv.trackId !== 'other');
  const hasTargetRole = Boolean(cv.targetRole?.trim());
  const canGenerateSummary = isTrackSelected || hasTargetRole;

  // Completion Indicator: Computes percentage based on filled sections
  const completionDetails = useMemo(() => {
    const sections = [
      { id: 'track', name: 'المسار والتخصص المهني', filled: Boolean((cv.trackId && cv.trackId !== 'other') || cv.targetRole?.trim()) },
      { id: 'name', name: 'الاسم الكامل', filled: Boolean(cv.fullName?.trim()) },
      { id: 'contact', name: 'بيانات التواصل (الهاتف أو الإيميل)', filled: Boolean(cv.phone?.trim() || cv.email?.trim()) },
      { id: 'role', name: 'المسمى الوظيفي المستهدف', filled: Boolean(cv.targetRole?.trim()) },
      { id: 'summary', name: 'الملخص المهني (Executive Summary)', filled: Boolean(cv.summary?.trim()) },
      { id: 'techSkills', name: 'المهارات التقنية (Technical Skills)', filled: Boolean(cv.techSkills && cv.techSkills.length > 0) },
      { id: 'softSkills', name: 'المهارات الشخصية (Soft Skills)', filled: Boolean(cv.softSkills && cv.softSkills.length > 0) },
      { id: 'experience', name: 'الخبرات العملية (Experience)', filled: Boolean(cv.experiences && cv.experiences.length > 0 && cv.experiences.some(e => e.role?.trim() || e.company?.trim())) },
      { id: 'education', name: 'التعليم والمؤهلات (Education)', filled: Boolean(cv.education && cv.education.length > 0 && cv.education.some(e => e.degree?.trim() || e.institution?.trim())) },
      { id: 'projects', name: 'المشاريع البرمجية (Projects)', filled: Boolean(cv.projects && cv.projects.length > 0 && cv.projects.some(p => p.title?.trim())) },
    ];

    const filledCount = sections.filter(s => s.filled).length;
    const percentage = Math.round((filledCount / sections.length) * 100);
    const remaining = sections.filter(s => !s.filled);

    return { percentage, filledCount, total: sections.length, remaining };
  }, [cv]);

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillInput.trim()) {
      addCustomTechSkill(newSkillInput.trim());
      setNewSkillInput('');
    }
  };

  const handleAddCustomSoftSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSoftSkillInput.trim()) {
      addCustomSoftSkill(newSoftSkillInput.trim());
      setNewSoftSkillInput('');
    }
  };

  const handleGenerateSummary = async () => {
    const roleFromInput = cv.targetRole?.trim();
    const track = findTrackById(cv.trackId || 'other');
    const targetTitle = roleFromInput || (track && track.id !== 'other' ? (track.roleTitle || track.titleEn) : '');

    if (!targetTitle) {
      // Prompt user and focus the target role input in Personal Info
      const roleInput = document.getElementById('target-role-input');
      if (roleInput) {
        roleInput.focus();
        roleInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsGeneratingSummary(true);
    try {
      const res = await fetch('/api/cv/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackId: track?.id || 'other',
          trackTitle: targetTitle,
          trackTitleAr: roleFromInput || track?.titleAr || 'هندسة البرمجيات',
          role: targetTitle,
          skills: cv.techSkills,
          existingSummary: cv.summary,
        }),
      });
      const data = await res.json();
      if (data.summary) {
        updateCV({ summary: data.summary });
      }
    } catch (e) {
      console.error('Summary Generation Error:', e);
      const isArabic = /[\u0600-\u06FF]/.test(targetTitle);
      const fallbackSummary = isArabic
        ? `Accomplished and results-driven professional specializing in ${targetTitle}. Proven expertise in architecting scalable solutions, leveraging ${cv.techSkills.length > 0 ? cv.techSkills.slice(0, 5).join(', ') : 'modern industry best practices'}, and collaborating across distributed teams to deliver high-performance applications with measurable business value.`
        : `Results-driven and impact-focused ${targetTitle}. Proven expertise in architecting scalable solutions, leveraging ${cv.techSkills.length > 0 ? cv.techSkills.slice(0, 5).join(', ') : 'modern industry best practices'}, and collaborating across distributed engineering teams to deliver high-performance applications with measurable business value.`;
      updateCV({ summary: fallbackSummary });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleAddBlankExperience = () => {
    const newExp = {
      id: 'exp-' + Date.now(),
      role: '',
      company: '',
      location: '',
      period: '',
      isCurrent: false,
      achievements: [''],
    };
    addExperience(newExp);
  };

  const handleAddEducation = () => {
    const newEdu = {
      id: 'edu-' + Date.now(),
      degree: '',
      institution: '',
      period: '',
      honors: '',
    };
    updateCV({ education: [...(cv.education || []), newEdu] });
  };

  const handleUpdateEducation = (index: number, updated: any) => {
    const list = [...(cv.education || [])];
    list[index] = updated;
    updateCV({ education: list });
  };

  const handleDeleteEducation = (index: number) => {
    const list = (cv.education || []).filter((_, i) => i !== index);
    updateCV({ education: list });
  };

  const handleAddProject = () => {
    const newProj = {
      id: 'proj-' + Date.now(),
      title: '',
      techStack: '',
      link: '',
      description: '',
      metrics: '',
    };
    updateCV({ projects: [...(cv.projects || []), newProj] });
  };

  const handleUpdateProject = (index: number, updated: any) => {
    const list = [...(cv.projects || [])];
    list[index] = updated;
    updateCV({ projects: list });
  };

  const handleDeleteProject = (index: number) => {
    const list = (cv.projects || []).filter((_, i) => i !== index);
    updateCV({ projects: list });
  };

  const handleAddCertification = () => {
    const newCert = {
      id: 'cert-' + Date.now(),
      title: '',
      issuer: '',
      year: '',
    };
    updateCV({ certifications: [...(cv.certifications || []), newCert] });
  };

  const handleUpdateCertification = (index: number, updated: any) => {
    const list = [...(cv.certifications || [])];
    list[index] = updated;
    updateCV({ certifications: list });
  };

  const handleDeleteCertification = (index: number) => {
    const list = (cv.certifications || []).filter((_, i) => i !== index);
    updateCV({ certifications: list });
  };

  if (isLoadingCVs) {
    return <BuildCVSkeleton />;
  }

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Sticky Workspace Sub-header */}
      <div className="sticky top-16 z-30 w-full bg-[var(--bg-surface-lowest)]/95 backdrop-blur-md px-6 py-3 border-b border-[var(--color-border)] flex flex-col md:flex-row md:items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-3">
          {/* Circular Completion Indicator: عباره عن دائره فقط */}
          <div
            className="relative flex items-center justify-center shrink-0 w-10 h-10 select-none cursor-pointer"
            title={`نسبة اكتمال السيرة الذاتية: ${completionDetails.percentage}%\n${
              completionDetails.remaining.length > 0
                ? `الأجزاء المتبقية:\n• ${completionDetails.remaining.map((r) => r.name).join('\n• ')}`
                : 'تم استكمال جميع أقسام السيرة الذاتية بنجاح! ✓'
            }`}
          >
            <svg className="w-10 h-10 -rotate-90 transform" viewBox="0 0 36 36">
              {/* Background Track */}
              <circle
                cx="18"
                cy="18"
                r="15"
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="18"
                cy="18"
                r="15"
                className={`transition-all duration-700 ease-out ${
                  completionDetails.percentage >= 80
                    ? 'text-emerald-500'
                    : completionDetails.percentage >= 40
                    ? 'text-blue-500'
                    : 'text-amber-500'
                }`}
                strokeWidth="3.2"
                strokeDasharray={2 * Math.PI * 15}
                strokeDashoffset={2 * Math.PI * 15 * (1 - completionDetails.percentage / 100)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
              />
            </svg>
            <span className="absolute text-[10px] font-black tracking-tight text-[var(--color-on-surface)]">
              {completionDetails.percentage}%
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-[var(--color-on-surface-variant)] text-xs">
              <span>محرر السيرة الذاتية</span>
              <span className="material-symbols-outlined text-[14px] rtl:rotate-180">chevron_right</span>
              <span className="text-[var(--color-on-surface)] font-semibold">
                {isTrackSelected ? (currentTrack.id === 'other' ? (cv.targetRole?.trim() || 'تراك مخصص') : currentTrack.titleAr) : 'اختر تخصصك المهني'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Create New CV Button */}
          <button
            type="button"
            onClick={createNewCV}
            className="flex items-center gap-1.5 px-3 h-9 rounded-lg font-bold text-xs transition-all shadow-xs cursor-pointer active:scale-95 border border-[var(--color-border)] bg-[var(--bg-surface-high)] hover:bg-[var(--bg-surface-higher)] text-[var(--color-on-surface)]"
            title="إنشاء سيرة ذاتية جديدة فارغة من الصفر"
          >
            <span className="material-symbols-outlined text-[17px] text-emerald-500">add_circle</span>
            <span>CV جديد</span>
          </button>

          {/* Download PDF Button */}
          <button
            type="button"
            id="download-pdf-button"
            onClick={handleDownloadPDF}
            disabled={isDownloadingPdf || isManualSaving}
            className={`flex items-center gap-1.5 px-3.5 h-9 rounded-lg font-bold text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50 active:scale-95 border ${
              isDownloadingPdf
                ? 'bg-blue-600 border-blue-500 text-white animate-pulse shadow-md shadow-blue-600/30 ring-2 ring-blue-400/50'
                : 'bg-[var(--bg-surface-high)] hover:bg-[var(--bg-surface-higher)] text-[var(--color-on-surface)] border-[var(--color-border)] hover:border-slate-400 dark:hover:border-slate-500'
            }`}
            title="تنزيل السيرة الذاتية بصيغة PDF مباشرة إلى جهازك"
          >
            <span className={`material-symbols-outlined text-[17px] ${isDownloadingPdf ? 'animate-spin' : ''}`}>
              {isDownloadingPdf ? 'progress_activity' : 'download'}
            </span>
            <span>{isDownloadingPdf ? 'جارٍ تنزيل PDF...' : 'تنزيل PDF'}</span>
          </button>

          {/* Primary Save Button */}
          <button
            type="button"
            id="save-cv-button"
            onClick={handleManualSave}
            disabled={isManualSaving}
            className={`flex items-center gap-2 px-4 h-9 rounded-lg transition-all text-xs font-bold shadow-md cursor-pointer disabled:opacity-75 active:scale-95 ${
              cloudSaved
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/50 shadow-emerald-600/30'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
            }`}
            title="حفظ السيرة الذاتية وتحديث المسار الحالي"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isManualSaving ? 'hourglass_empty' : cloudSaved ? 'check_circle' : 'save'}
            </span>
            <span>
              {isManualSaving ? 'جارٍ الحفظ...' : cloudSaved ? 'تم الحفظ بنجاح ✓' : 'حفظ السيرة الذاتية'}
            </span>
          </button>
        </div>
      </div>

      {/* Floating Save Toast Banner */}
      {saveToast && saveToast.show && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-emerald-600 text-white shadow-2xl shadow-emerald-950/40 font-bold text-xs sm:text-sm flex items-center gap-3 animate-bounce border border-emerald-400/50 backdrop-blur-md">
          <span className="material-symbols-outlined text-[24px] text-emerald-100">check_circle</span>
          <div className="flex flex-col text-right">
            <span>تم حفظ السيرة الذاتية بنجاح! ✓</span>
            <span className="text-[11px] font-normal text-emerald-100">
              المسار: {saveToast.title} — تم التحديث والمزامنة
            </span>
          </div>
        </div>
      )}

      {/* Main Split Layout: Right (Editor / RTL First), Left (Live A4 Preview Sheet) */}
      <div className="w-full px-4 lg:px-8 py-6 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start max-w-[1520px] mx-auto">
        {/* ================= RIGHT COLUMN: RESUME BUILDER (7 Cols) ================= */}
        <div className="xl:col-span-7 flex flex-col gap-5 no-print">

          {/* Section 1: Track Selector (from roadmap.sh - 30 Tracks in compact List) */}
          <div className="w-full bg-[var(--bg-surface-low)] border border-[var(--color-border)] rounded-xl p-4 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-[22px]">alt_route</span>
                <h2 className="text-sm font-bold text-[var(--color-on-surface)]">
                  اختار مجالك Select Track
                </h2>
              </div>
              <span className="text-xs text-emerald-500 font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/10">30 TRACKS</span>
            </div>

            {/* Compact 30-Tracks Select List with Default to 'تراك أخر' */}
            <div className="flex flex-col gap-1.5">
              <div className="relative">
                <select
                  value={cv.trackId || 'other'}
                  onChange={e => {
                    const selectedId = e.target.value;
                    if (selectedId) {
                      setTrackId(selectedId);
                      if (selectedId === 'other') {
                        // User chose custom track "تراك أخر"
                        updateCV({
                          title: cv.targetRole?.trim() || 'تراك مخصص'
                        });
                      } else {
                        const track = findTrackById(selectedId);
                        if (track) {
                          updateCV({
                            targetRole: track.roleTitle || track.titleEn,
                            title: track.titleAr,
                          });
                        }
                      }
                    }
                  }}
                  id="track-select-input"
                  className="w-full h-11 px-3.5 pr-10 rounded-xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] text-xs font-semibold text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)] shadow-xs cursor-pointer appearance-none"
                >
                  <option value="other">تراك أخر</option>
                  <optgroup label="هندسة البرمجيات والأنظمة السحابية (Software & Cloud)">
                    {ALL_30_TECH_ROADMAPS.filter(t => !['ai', 'data', 'ml', 'bi', 'android', 'ios', 'game', 'product', 'ux', 'seo', 'qa', 'manager', 'devrel', 'writer', 'forward'].some(k => t.id.toLowerCase().includes(k))).map(t => (
                      <option key={t.id} value={t.id}>{t.titleAr} — {t.titleEn}</option>
                    ))}
                  </optgroup>
                  <optgroup label="الذكاء الاصطناعي وعلوم البيانات (AI & Data)">
                    {ALL_30_TECH_ROADMAPS.filter(t => ['ai', 'data', 'ml', 'bi'].some(k => t.id.toLowerCase().includes(k))).map(t => (
                      <option key={t.id} value={t.id}>{t.titleAr} — {t.titleEn}</option>
                    ))}
                  </optgroup>
                  <optgroup label="تطبيقات الموبايل وتطوير الألعاب (Mobile & Games)">
                    {ALL_30_TECH_ROADMAPS.filter(t => ['android', 'ios', 'game'].some(k => t.id.toLowerCase().includes(k))).map(t => (
                      <option key={t.id} value={t.id}>{t.titleAr} — {t.titleEn}</option>
                    ))}
                  </optgroup>
                  <optgroup label="إدارة المنتج وتجربة المستخدم والجودة (Product, UX & Quality)">
                    {ALL_30_TECH_ROADMAPS.filter(t => ['product', 'ux', 'seo', 'qa', 'manager', 'devrel', 'writer', 'forward'].some(k => t.id.toLowerCase().includes(k))).map(t => (
                      <option key={t.id} value={t.id}>{t.titleAr} — {t.titleEn}</option>
                    ))}
                  </optgroup>
                </select>
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">
                  unfold_more
                </span>
              </div>
            </div>

          </div>

          {/* Section 2: Personal & Contact Information (Second in page after Track Selector) */}
          <div className="w-full bg-[var(--bg-surface-low)] border border-[var(--color-border)] rounded-xl p-4 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--color-on-surface)] text-[20px]">badge</span>
                <h2 className="text-sm font-bold text-[var(--color-on-surface)]">
                  معلوماتك الشخصية Personal Information
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--color-on-surface-variant)]">الأسم</label>
                <input
                  value={cv.fullName || ''}
                  onChange={e => updateCV({ fullName: e.target.value })}
                  placeholder="اسمك هنا"
                  className="w-full h-10 px-3 bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] text-[var(--color-on-surface)] rounded-lg text-xs focus:outline-none focus:border-[var(--color-primary)] placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="target-role-input" className="text-xs text-[var(--color-on-surface-variant)] flex items-center justify-between">
                  <span>المسمي الوظيفي</span>
                  {activeTrackId === 'other' && (
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">يُبنى عليه ملخص الـ AI</span>
                  )}
                </label>
                <input
                  id="target-role-input"
                  value={cv.targetRole || ''}
                  onChange={e => updateCV({ targetRole: e.target.value })}
                  placeholder="مسماك الوظيفي"
                  className="w-full h-10 px-3 bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] text-[var(--color-on-surface)] rounded-lg text-xs font-mono focus:outline-none focus:border-[var(--color-primary)] placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
                  dir="auto"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--color-on-surface-variant)]">البريد الإلكتروني</label>
                <input
                  value={cv.email || ''}
                  onChange={e => updateCV({ email: e.target.value })}
                  placeholder="إيميلك هنا"
                  className="w-full h-10 px-3 bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] text-[var(--color-on-surface)] rounded-lg text-xs font-mono focus:outline-none focus:border-[var(--color-primary)] placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  dir="ltr"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--color-on-surface-variant)]">رقم الهاتف</label>
                <input
                  value={cv.phone || ''}
                  onChange={e => updateCV({ phone: e.target.value })}
                  placeholder="رقم تليفونك"
                  className="w-full h-10 px-3 bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] text-[var(--color-on-surface)] rounded-lg text-xs font-mono focus:outline-none focus:border-[var(--color-primary)] placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  dir="ltr"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--color-on-surface-variant)]">المدينة والدولة</label>
                <input
                  value={cv.location || ''}
                  onChange={e => updateCV({ location: e.target.value })}
                  placeholder="عنوانك فين"
                  className="w-full h-10 px-3 bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] text-[var(--color-on-surface)] rounded-lg text-xs focus:outline-none focus:border-[var(--color-primary)] placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--color-on-surface-variant)]">LinkedIn URL</label>
                <input
                  value={cv.linkedin || ''}
                  onChange={e => updateCV({ linkedin: e.target.value })}
                  placeholder="لينك لينكدإن"
                  className="w-full h-10 px-3 bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] text-[var(--color-on-surface)] rounded-lg text-xs font-mono focus:outline-none focus:border-[var(--color-primary)] placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  dir="ltr"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-xs text-[var(--color-on-surface-variant)]">GitHub URL</label>
                <input
                  value={cv.github || ''}
                  onChange={e => updateCV({ github: e.target.value })}
                  placeholder="لينك جيت‌هَب"
                  className="w-full h-10 px-3 bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] text-[var(--color-on-surface)] rounded-lg text-xs font-mono focus:outline-none focus:border-[var(--color-primary)] placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Tech Skills Picker (Grouped by Category or Custom) */}
          <div className="w-full bg-[var(--bg-surface-low)] border border-[var(--color-border)] rounded-xl p-4 flex flex-col gap-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--color-on-surface)] text-[20px]">terminal</span>
                <h2 className="text-sm font-bold text-[var(--color-on-surface)]">
                  المهارات التقنية Technical Skills
                </h2>
              </div>
              <span className="text-xs text-emerald-500 font-semibold font-mono">
                {cv.techSkills.length} SELECTED
              </span>
            </div>

            {!cv.trackId && cv.trackId !== 'other' ? (
              <div className="p-6 rounded-xl border border-dashed border-[var(--color-border)] text-center flex flex-col items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[32px] text-slate-400">alt_route</span>
                <p className="text-xs font-semibold text-[var(--color-on-surface)]">
                  اختر تراكك من القائمة أعلاه أولاً
                </p>
                <p className="text-[11px] text-[var(--color-outline)]">
                  بمجرد اختيار أي من الـ 30 تراكاً أو تراك أخر، ستظهر لك خيارات المهارات التقنية لسيرتك الذاتية.
                </p>
                <button
                  type="button"
                  onClick={() => document.getElementById('track-select-input')?.focus()}
                  className="mt-1 px-4 py-1.5 rounded-lg bg-[var(--color-primary)] text-[var(--color-on-primary)] text-xs font-bold shadow-xs cursor-pointer"
                >
                  اختيار تراك الآن
                </button>
              </div>
            ) : currentTrack.id === 'other' ? (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed font-semibold">
                  أنت اخترت ({cv.targetRole?.trim() || 'تراك أخر'})
                </p>

                {cv.techSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 p-3 bg-[var(--bg-surface-lowest)] rounded-lg border border-[var(--color-border)]">
                    {cv.techSkills.map(skill => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--color-primary)] text-[var(--color-on-primary)] text-xs font-mono font-semibold shadow-xs"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => toggleTechSkill(skill)}
                          className="hover:opacity-75 cursor-pointer flex items-center"
                          title="إزالة هذه المهارة"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Add Custom Tech Skill */}
                <form onSubmit={handleAddCustomSkill} className="flex gap-2 pt-1">
                  <input
                    value={newSkillInput}
                    onChange={e => setNewSkillInput(e.target.value)}
                    placeholder="مهارتك هنا"
                    className="flex-1 h-9 px-3 bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] rounded-lg text-xs font-mono text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)] placeholder:text-slate-400"
                    dir="ltr"
                  />
                  <button
                    type="submit"
                    className="px-4 h-9 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>إضافة</span>
                  </button>
                </form>
              </div>
            ) : (
              <>
                <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed font-semibold">
                  أنت اخترت ({currentTrack.titleAr || currentTrack.titleEn})
                </p>

                {/* Categorized Skills */}
                <div className="flex flex-col gap-3">
                  {currentTrack.categories.map((cat: any, idx: number) => (
                    <div key={idx} className="flex flex-col gap-2 p-3 bg-[var(--bg-surface-lowest)] rounded-lg border border-[var(--color-border)]">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[var(--color-on-surface)]">{cat.nameAr}</span>
                        <span className="text-[11px] text-[var(--color-outline)] font-mono">{cat.nameEn}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {cat.skills.map((skill: any) => {
                          const isSelected = cv.techSkills.includes(skill.name);
                          return (
                            <button
                              key={skill.id}
                              onClick={() => toggleTechSkill(skill.name)}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all border cursor-pointer ${
                                isSelected
                                  ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] font-semibold border-[var(--color-primary)] shadow-sm'
                                  : 'bg-[var(--bg-surface-high)] text-[var(--color-on-surface)] border-[var(--color-border)] hover:border-[var(--color-outline)]'
                              }`}
                              title={skill.description}
                            >
                              <span className="material-symbols-outlined text-[14px]">
                                {isSelected ? 'check' : 'add'}
                              </span>
                              <span>{skill.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Custom Tech Skill */}
                <form onSubmit={handleAddCustomSkill} className="flex gap-2 pt-1">
                  <input
                    value={newSkillInput}
                    onChange={e => setNewSkillInput(e.target.value)}
                    placeholder="ضيف مهارة"
                    className="flex-1 h-9 px-3 bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] rounded-lg text-xs font-mono text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)] placeholder:text-slate-400"
                    dir="ltr"
                  />
                  <button
                    type="submit"
                    className="px-3 h-9 bg-[var(--bg-surface-high)] hover:bg-[var(--bg-surface-highest)] text-[var(--color-on-surface)] rounded-lg text-xs font-semibold flex items-center gap-1 border border-[var(--color-border)] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>إضافة</span>
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Section 4: Soft Skills Picker */}
          <div className="w-full bg-[var(--bg-surface-low)] border border-[var(--color-border)] rounded-xl p-4 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-[22px]">psychology</span>
                <h2 className="text-sm font-bold text-[var(--color-on-surface)]">
                  المهارات الشخصية Soft Skills
                </h2>
              </div>
              <span className="text-xs text-emerald-500 font-semibold font-mono">
                {cv.softSkills.length} SELECTED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SOFT_SKILLS_OPTIONS.map(soft => {
                const isSelected = cv.softSkills.includes(soft.name);
                return (
                  <div
                    key={soft.id}
                    onClick={() => toggleSoftSkill(soft.name)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-[var(--bg-surface-highest)] border-[var(--color-primary)] text-[var(--color-on-surface)] shadow-xs'
                        : 'bg-[var(--bg-surface-lowest)] border-[var(--color-border)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-outline)]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="mt-0.5 accent-[var(--color-primary)] cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[var(--color-on-surface)]">{soft.name}</span>
                      <span className="text-[11px] text-[var(--color-outline)]">{soft.descriptionAr}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Soft Skills added by user */}
            {cv.softSkills.filter(s => !SOFT_SKILLS_OPTIONS.some(opt => opt.name === s)).length > 0 && (
              <div className="flex flex-col gap-1.5 pt-2 border-t border-[var(--color-border)]/60">
                <span className="text-[11px] font-semibold text-[var(--color-outline)]">مهارات قمت بإضافتها:</span>
                <div className="flex flex-wrap gap-1.5">
                  {cv.softSkills.filter(s => !SOFT_SKILLS_OPTIONS.some(opt => opt.name === s)).map(customSkill => (
                    <span
                      key={customSkill}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--color-primary)] text-[var(--color-on-primary)] text-xs font-semibold shadow-xs"
                    >
                      <span>{customSkill}</span>
                      <button
                        type="button"
                        onClick={() => removeSoftSkill(customSkill)}
                        className="hover:opacity-75 cursor-pointer flex items-center"
                        title="إزالة هذه المهارة"
                      >
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Add Custom Soft Skill Form */}
            <form onSubmit={handleAddCustomSoftSkill} className="flex gap-2 pt-2 border-t border-[var(--color-border)]/60">
              <input
                value={newSoftSkillInput}
                onChange={e => setNewSoftSkillInput(e.target.value)}
                placeholder="ضيف مهارة"
                className="flex-1 h-9 px-3 bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)] placeholder:text-slate-400"
                dir="auto"
              />
              <button
                type="submit"
                className="px-4 h-9 bg-[var(--color-primary)] hover:opacity-90 text-[var(--color-on-primary)] rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                title="إضافة المهارة إلى السيرة الذاتية"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>إضافة</span>
              </button>
            </form>
          </div>

          {/* Section: Executive Summary */}
          <div className="w-full bg-[var(--bg-surface-low)] border border-[var(--color-border)] rounded-xl p-4 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--color-on-surface)] text-[20px]">subject</span>
                <h2 className="text-sm font-bold text-[var(--color-on-surface)]">
                  الملخص المهني Professional Summary
                </h2>
              </div>

              {/* AI Summary Generator Button: Works based on target role from personal info */}
              <button
                type="button"
                onClick={handleGenerateSummary}
                disabled={isGeneratingSummary}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                title={
                  cv.targetRole?.trim()
                    ? `صياغة ملخص تنفيذي مخصص لمسمى "${cv.targetRole.trim()}" بالذكاء الاصطناعي`
                    : "صياغة ملخص مهني بالذكاء الاصطناعي بناءً على مسماك الوظيفي"
                }
              >
                <span className={`material-symbols-outlined text-[16px] ${isGeneratingSummary ? 'animate-spin' : 'text-amber-300 animate-pulse'}`}>
                  {isGeneratingSummary ? 'sync' : 'auto_awesome'}
                </span>
                <span>
                  {isGeneratingSummary
                    ? 'جارِ الصياغة بالـ AI...'
                    : cv.targetRole?.trim()
                    ? `صيغ بالـ AI لـ (${cv.targetRole.trim()})`
                    : 'صيغ بالـ AI (بناءً على مسماك)'}
                </span>
              </button>
            </div>

            <p className="text-xs text-[var(--color-on-surface-variant)]">
              صيغ ملخص عنك بال Ai بناءا على مجالك
            </p>

            <textarea
              value={cv.summary || ''}
              onChange={e => updateCV({ summary: e.target.value })}
              placeholder="نبذة عنك"
              rows={4}
              className="w-full p-3 bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-on-surface)] leading-relaxed focus:outline-none focus:border-[var(--color-primary)] resize-y placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />

            <div className="flex items-center justify-between text-[11px] text-[var(--color-outline)]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">edit_note</span>
                <span>تقدر تعدل على اللي اتكتب من ال Ai</span>
              </span>
              <span>{cv.summary ? `${cv.summary.length} حرف` : ''}</span>
            </div>
          </div>

          {/* Section: Work Experiences */}
          <div className="w-full bg-[var(--bg-surface-low)] border border-[var(--color-border)] rounded-xl p-4 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--color-on-surface)] text-[20px]">work_history</span>
                <h2 className="text-sm font-bold text-[var(--color-on-surface)]">
                  الخبرات Experience
                </h2>
              </div>
              <button
                onClick={handleAddBlankExperience}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--bg-surface-high)] text-[var(--color-on-surface)] hover:bg-[var(--bg-surface-highest)] text-xs font-semibold border border-[var(--color-border)] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>إضافة خبرة</span>
              </button>
            </div>

            {(!cv.experiences || cv.experiences.length === 0) ? (
              <div className="py-6 px-4 rounded-xl border border-dashed border-[var(--color-border)] text-center flex flex-col items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[28px] text-slate-400">work_outline</span>
                <p className="text-xs font-medium text-[var(--color-on-surface-variant)]">مفيش خبرات لسه</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {cv.experiences.map((exp, expIdx) => (
                  <div
                    key={exp.id || expIdx}
                    className="p-4 bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] rounded-lg flex flex-col gap-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border)] pb-2">
                      <div className="flex flex-col gap-1 flex-1">
                        <input
                          value={exp.role || ''}
                          onChange={e => updateExperience(expIdx, { ...exp, role: e.target.value })}
                          className="font-bold text-sm text-[var(--color-on-surface)] bg-transparent focus:outline-none border-b border-transparent focus:border-[var(--color-primary)] placeholder:text-slate-400"
                          placeholder="مسماك الوظيفي"
                        />
                        <div className="flex items-center gap-2 text-xs text-[var(--color-on-surface-variant)]">
                          <input
                            value={exp.company || ''}
                            onChange={e => updateExperience(expIdx, { ...exp, company: e.target.value })}
                            className="bg-transparent focus:outline-none border-b border-transparent focus:border-[var(--color-primary)] placeholder:text-slate-400"
                            placeholder="اسم الشركة"
                          />
                          <span>•</span>
                          <input
                            value={exp.location || ''}
                            onChange={e => updateExperience(expIdx, { ...exp, location: e.target.value })}
                            className="bg-transparent focus:outline-none border-b border-transparent focus:border-[var(--color-primary)] placeholder:text-slate-400"
                            placeholder="المكان فين"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          value={exp.period || ''}
                          onChange={e => updateExperience(expIdx, { ...exp, period: e.target.value })}
                          className="text-xs font-mono text-[var(--color-on-surface-variant)] bg-[var(--bg-surface-high)] px-2 py-1 rounded focus:outline-none placeholder:text-slate-400"
                          placeholder="الفترة كام"
                        />
                        <button
                          onClick={() => deleteExperience(exp.id)}
                          className="p-1 text-[var(--color-outline)] hover:text-red-500 transition-colors cursor-pointer"
                          title="حذف هذه الخبرة"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Achievements (STAR list) */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-semibold text-[var(--color-outline)] uppercase tracking-wider">
                        الإنجازات الملموسة (STAR Method):
                      </span>
                      {exp.achievements.map((ach, achIdx) => (
                        <div key={achIdx} className="flex items-start gap-2 p-2 bg-[var(--bg-surface-low)] rounded border border-[var(--color-border)]">
                          <span className="material-symbols-outlined text-emerald-500 text-[18px] mt-0.5">check_circle</span>
                          <textarea
                            value={ach || ''}
                            onChange={e => {
                              const newAchievements = [...exp.achievements];
                              newAchievements[achIdx] = e.target.value;
                              updateExperience(expIdx, { ...exp, achievements: newAchievements });
                            }}
                            placeholder="عملت إيه"
                            rows={2}
                            className="flex-1 bg-transparent text-xs text-[var(--color-on-surface)] leading-relaxed focus:outline-none resize-none placeholder:text-slate-400"
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        const newAchievements = [
                          ...exp.achievements,
                          '',
                        ];
                        updateExperience(expIdx, { ...exp, achievements: newAchievements });
                      }}
                      className="self-start text-xs text-[var(--color-on-surface)] hover:underline flex items-center gap-1 font-semibold pt-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">add</span>
                      <span>إضافة نقطة إنجاز</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Education */}
          <div className="w-full bg-[var(--bg-surface-low)] border border-[var(--color-border)] rounded-xl p-4 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--color-on-surface)] text-[20px]">school</span>
                <h2 className="text-sm font-bold text-[var(--color-on-surface)]">
                  التعليم Education
                </h2>
              </div>
              <button
                onClick={handleAddEducation}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--bg-surface-high)] text-[var(--color-on-surface)] hover:bg-[var(--bg-surface-highest)] text-xs font-semibold border border-[var(--color-border)] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>إضافة مؤهل</span>
              </button>
            </div>

            {(!cv.education || cv.education.length === 0) ? (
              <div className="py-6 px-4 rounded-xl border border-dashed border-[var(--color-border)] text-center flex flex-col items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[28px] text-slate-400">school</span>
                <p className="text-xs text-[var(--color-on-surface-variant)]">مفيش مؤهلات لسه</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {cv.education.map((edu, idx) => (
                  <div key={edu.id || idx} className="p-3 bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] rounded-lg flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        value={edu.degree}
                        onChange={e => handleUpdateEducation(idx, { ...edu, degree: e.target.value })}
                        placeholder="مؤهلك إيه"
                        className="font-bold text-xs flex-1 bg-transparent border-b border-transparent focus:border-[var(--color-primary)] focus:outline-none placeholder:text-slate-400"
                      />
                      <input
                        value={edu.period}
                        onChange={e => handleUpdateEducation(idx, { ...edu, period: e.target.value })}
                        placeholder="الفترة كام"
                        className="text-[11px] font-mono bg-[var(--bg-surface-high)] px-2 py-0.5 rounded focus:outline-none w-28 text-center placeholder:text-slate-400"
                      />
                      <button
                        onClick={() => handleDeleteEducation(idx)}
                        className="p-1 text-[var(--color-outline)] hover:text-red-500 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        value={edu.institution}
                        onChange={e => handleUpdateEducation(idx, { ...edu, institution: e.target.value })}
                        placeholder="اسم الجامعة"
                        className="text-xs bg-transparent border-b border-transparent focus:border-[var(--color-primary)] focus:outline-none placeholder:text-slate-400"
                      />
                      <input
                        value={edu.honors || ''}
                        onChange={e => handleUpdateEducation(idx, { ...edu, honors: e.target.value })}
                        placeholder="تقديرك إيه"
                        className="text-xs bg-transparent border-b border-transparent focus:border-[var(--color-primary)] focus:outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Projects */}
          <div className="w-full bg-[var(--bg-surface-low)] border border-[var(--color-border)] rounded-xl p-4 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--color-on-surface)] text-[20px]">terminal</span>
                <h2 className="text-sm font-bold text-[var(--color-on-surface)]">
                  المشاريع Projects
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('projects')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-xs font-semibold border border-blue-200 dark:border-blue-800 cursor-pointer transition-colors"
                  title="توليد مشاريع تناسب تخصصك ومهاراتك بالذكاء الاصطناعي"
                >
                  <span className="material-symbols-outlined text-[15px] text-blue-600 dark:text-blue-400">auto_awesome</span>
                  <span>مشاريع تناسبك (AI)</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--bg-surface-high)] text-[var(--color-on-surface)] hover:bg-[var(--bg-surface-highest)] text-xs font-semibold border border-[var(--color-border)] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>إضافة مشروع</span>
                </button>
              </div>
            </div>

            {(!cv.projects || cv.projects.length === 0) ? (
              <div className="py-6 px-4 rounded-xl border border-dashed border-[var(--color-border)] text-center flex flex-col items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[28px] text-slate-400">terminal</span>
                <p className="text-xs text-[var(--color-on-surface-variant)]">مفيش مشاريع لسه</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {cv.projects.map((proj, idx) => (
                  <div key={proj.id || idx} className="p-3 bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] rounded-lg flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        value={proj.title}
                        onChange={e => handleUpdateProject(idx, { ...proj, title: e.target.value })}
                        placeholder="اسم المشروع"
                        className="font-bold text-xs flex-1 bg-transparent border-b border-transparent focus:border-[var(--color-primary)] focus:outline-none placeholder:text-slate-400"
                      />
                      <input
                        value={proj.link || ''}
                        onChange={e => handleUpdateProject(idx, { ...proj, link: e.target.value })}
                        placeholder="لينك المشروع"
                        className="text-[11px] font-mono bg-[var(--bg-surface-high)] px-2 py-0.5 rounded focus:outline-none w-44 text-left placeholder:text-slate-400"
                        dir="ltr"
                      />
                      <button
                        onClick={() => handleDeleteProject(idx)}
                        className="p-1 text-[var(--color-outline)] hover:text-red-500 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                    <input
                      value={proj.techStack || ''}
                      onChange={e => handleUpdateProject(idx, { ...proj, techStack: e.target.value })}
                      placeholder="التقنيات المستخدمة"
                      className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-transparent border-b border-transparent focus:border-[var(--color-primary)] focus:outline-none placeholder:text-slate-400"
                      dir="ltr"
                    />
                    <textarea
                      value={proj.description}
                      onChange={e => handleUpdateProject(idx, { ...proj, description: e.target.value })}
                      placeholder="وصف المشروع"
                      rows={2}
                      className="text-xs bg-transparent border border-[var(--color-border)] rounded p-2 focus:outline-none resize-none placeholder:text-slate-400"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Certifications */}
          <div className="w-full bg-[var(--bg-surface-low)] border border-[var(--color-border)] rounded-xl p-4 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--color-on-surface)] text-[20px]">verified</span>
                <h2 className="text-sm font-bold text-[var(--color-on-surface)]">
                  الشهادات Certifications
                </h2>
              </div>
              <button
                onClick={handleAddCertification}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--bg-surface-high)] text-[var(--color-on-surface)] hover:bg-[var(--bg-surface-highest)] text-xs font-semibold border border-[var(--color-border)] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>إضافة شهادة</span>
              </button>
            </div>

            {(!cv.certifications || cv.certifications.length === 0) ? (
              <div className="py-6 px-4 rounded-xl border border-dashed border-[var(--color-border)] text-center flex flex-col items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[28px] text-slate-400">verified</span>
                <p className="text-xs text-[var(--color-on-surface-variant)]">مفيش شهادات لسه</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {cv.certifications.map((cert, idx) => (
                  <div key={cert.id || idx} className="p-3 bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] rounded-lg flex items-center justify-between gap-2">
                    <input
                      value={cert.title}
                      onChange={e => handleUpdateCertification(idx, { ...cert, title: e.target.value })}
                      placeholder="اسم الشهادة"
                      className="font-semibold text-xs flex-1 bg-transparent border-b border-transparent focus:border-[var(--color-primary)] focus:outline-none placeholder:text-slate-400"
                    />
                    <input
                      value={cert.issuer || ''}
                      onChange={e => handleUpdateCertification(idx, { ...cert, issuer: e.target.value })}
                      placeholder="واخدها منين"
                      className="text-xs bg-transparent border-b border-transparent focus:border-[var(--color-primary)] focus:outline-none w-32 placeholder:text-slate-400"
                    />
                    <input
                      value={cert.year || ''}
                      onChange={e => handleUpdateCertification(idx, { ...cert, year: e.target.value })}
                      placeholder="سنة كام"
                      className="text-[11px] font-mono bg-[var(--bg-surface-high)] px-2 py-0.5 rounded focus:outline-none w-20 text-center placeholder:text-slate-400"
                    />
                    <button
                      onClick={() => handleDeleteCertification(idx)}
                      className="p-1 text-[var(--color-outline)] hover:text-red-500 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================= LEFT COLUMN: STICKY LIVE A4 SHEET PREVIEW (5 Cols) ================= */}
        {/* ================= LEFT COLUMN: STICKY LIVE A4 SHEET PREVIEW (5 Cols) ================= */}
        <div className="xl:col-span-5 sticky top-32 flex flex-col items-center">
          {/* Preview Tools Bar */}
          <div className="w-full max-w-[500px] mb-2 px-3 py-1.5 rounded-lg bg-[var(--bg-surface-low)] border border-[var(--color-border)] flex items-center justify-between shadow-sm no-print">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[var(--bg-surface-highest)] text-[var(--color-on-surface)] border border-[var(--color-border)]">
                {resumePages.pages.length === 1 ? 'A4 صفحة واحدة' : `A4 صفحتين منفصلتين (${resumePages.pages.length})`}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))}
                className="p-1 text-[var(--color-outline)] hover:text-[var(--color-on-surface)] rounded"
                title="تصغير"
              >
                <span className="material-symbols-outlined text-[18px]">zoom_out</span>
              </button>
              <span className="font-mono text-[11px] font-semibold text-[var(--color-on-surface)]">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(130, prev + 10))}
                className="p-1 text-[var(--color-outline)] hover:text-[var(--color-on-surface)] rounded"
                title="تكبير"
              >
                <span className="material-symbols-outlined text-[18px]">zoom_in</span>
              </button>
            </div>
          </div>

          {/* Simulated A4 Sheets (Separated cleanly per page without text cutoff) */}
          <div className="w-full flex flex-col items-center gap-5">
            {resumePages.pages.map((page, pIdx) => (
              <React.Fragment key={pIdx}>
                {pIdx > 0 && (
                  <div className="flex items-center gap-3 py-1 w-full max-w-[500px] text-[11px] font-bold text-[var(--color-outline)] no-print">
                    <div className="h-px bg-neutral-300 dark:bg-neutral-700 flex-1"></div>
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-surface-low)] border border-[var(--color-border)] text-[var(--color-on-surface)] shadow-xs">
                      <span className="material-symbols-outlined text-[14px] text-emerald-500">description</span>
                      الصفحة {pIdx + 1}
                    </span>
                    <div className="h-px bg-neutral-300 dark:bg-neutral-700 flex-1"></div>
                  </div>
                )}

                <div
                  id={pIdx === 0 ? "a4-resume-sheet" : `a4-resume-page-${pIdx}`}
                  className="a4-resume-page w-full max-w-[500px] min-h-[707px] bg-white text-neutral-900 rounded-lg p-6 sm:p-7 shadow-2xl flex flex-col justify-start select-text relative transition-transform duration-200 border border-neutral-300 font-sans text-xs print:shadow-none print:border-none print:rounded-none"
                  dir="ltr"
                  style={{
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: 'top center',
                  }}
                >
                  {/* Main Header on Page 1 */}
                  {pIdx === 0 && (
                    <div className="border-b border-neutral-300 pb-3 text-left">
                      <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight uppercase">
                        {cv.fullName?.trim() ? (
                          cv.fullName
                        ) : (
                          <span className="text-neutral-400 italic font-normal">[YOUR FULL NAME]</span>
                        )}
                      </h1>
                      <p className="text-xs sm:text-sm font-bold text-neutral-900 mt-0.5 tracking-wide">
                        {cv.targetRole?.trim() ? (
                          cv.targetRole
                        ) : (
                          <span className="text-neutral-400 italic font-normal">[Target Job Title / Domain]</span>
                        )}
                      </p>

                      {/* Contact Information Bar (Only shown if user actually entered contact details) */}
                      {resumePages.hasContact && (
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-2 text-[10px] font-mono text-neutral-600">
                          {resumePages.contactParts.map((item, cIdx) => (
                            <React.Fragment key={cIdx}>
                              {cIdx > 0 && <span>|</span>}
                              <span>{item}</span>
                            </React.Fragment>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Resume Body */}
                  {page.blocks.length > 0 ? (
                    <div className="mt-3 flex flex-col gap-3.5 text-[10px] leading-relaxed text-left">
                      {page.blocks.map(b => b.element)}
                    </div>
                  ) : (
                    /* Empty guidance state if no sections are filled yet */
                    <div className="mt-8 p-6 rounded-lg border-2 border-dashed border-neutral-200 text-center flex flex-col items-center justify-center gap-2 text-neutral-400">
                      <span className="material-symbols-outlined text-[32px] text-neutral-300">edit_note</span>
                      <p className="font-semibold text-xs text-neutral-600">السيرة الذاتية فارغة حالياً</p>
                      <p className="text-[10px] text-neutral-400 max-w-[280px]">
                        املأ بياناتك وخبراتك من القائمة على اليمين وستظهر هنا مباشرة في قالب A4 بدون نصوص افتراضية وهمية.
                      </p>
                    </div>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
