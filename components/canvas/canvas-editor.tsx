'use client';

import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Text } from 'react-konva';
import Konva from 'konva';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ZoomIn, ZoomOut, Download, Save } from 'lucide-react';

interface TextElement {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  fontStyle: string;
  width?: number;
}

interface CanvasEditorProps {
  resumeContent: any;
  initialLayout?: any;
  onSave?: (layout: any) => void;
  onExport?: () => void;
}

export default function CanvasEditor({
  resumeContent,
  initialLayout,
  onSave,
  onExport,
}: CanvasEditorProps) {
  const [elements, setElements] = useState<TextElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const stageRef = useRef<Konva.Stage>(null);

  useEffect(() => {
    if (initialLayout?.sections && initialLayout.sections.length > 0) {
      const loadedElements = initialLayout.sections.map((section: any, index: number) => ({
        id: `text-${index}`,
        x: section.x ?? 0,
        y: section.y ?? 0,
        text: section.text || '',
        fontSize: section.fontSize || 12,
        fontFamily: section.fontFamily || 'Arial',
        fill: section.color || '#000000',
        fontStyle: section.fontWeight === 'bold' ? 'bold' : 'normal',
        width: section.width,
      }));
      setElements(loadedElements);
    } else {
      initializeDefaultLayout();
    }
  }, [initialLayout, resumeContent]);

  const initializeDefaultLayout = () => {
    const newElements: TextElement[] = [];
    let yOffset = 40;
    let id = 0;

    const personal = resumeContent?.personalInfo || {};
    const experience = resumeContent?.experience || [];
    const education = resumeContent?.education || [];
    const skills = resumeContent?.skills || [];

    if (personal.fullName) {
      newElements.push({
        id: `text-${id++}`,
        x: 40,
        y: yOffset,
        text: personal.fullName,
        fontSize: 32,
        fontFamily: 'Arial',
        fill: '#1e293b',
        fontStyle: 'bold',
        width: 736,
      });
      yOffset += 50;
    }

    const contactInfo = [personal.email, personal.phone, personal.location].filter(Boolean).join(' | ');
    if (contactInfo) {
      newElements.push({
        id: `text-${id++}`,
        x: 40,
        y: yOffset,
        text: contactInfo,
        fontSize: 12,
        fontFamily: 'Arial',
        fill: '#64748b',
        fontStyle: 'normal',
        width: 736,
      });
      yOffset += 30;
    }

    if (personal.summary) {
      newElements.push({
        id: `text-${id++}`,
        x: 40,
        y: yOffset,
        text: personal.summary,
        fontSize: 12,
        fontFamily: 'Arial',
        fill: '#334155',
        fontStyle: 'normal',
        width: 736,
      });
      yOffset += 80;
    }

    if (experience.length > 0) {
      newElements.push({
        id: `text-${id++}`,
        x: 40,
        y: yOffset,
        text: 'EXPERIENCE',
        fontSize: 18,
        fontFamily: 'Arial',
        fill: '#1e293b',
        fontStyle: 'bold',
        width: 736,
      });
      yOffset += 35;

      experience.forEach((exp: any) => {
        const expText = `${exp.position || ''} | ${exp.company || ''}\n${exp.startDate || ''} - ${exp.endDate || 'Present'}\n${exp.description || ''}`;
        newElements.push({
          id: `text-${id++}`,
          x: 40,
          y: yOffset,
          text: expText,
          fontSize: 11,
          fontFamily: 'Arial',
          fill: '#334155',
          fontStyle: 'normal',
          width: 736,
        });
        yOffset += 80;
      });
    }

    if (education.length > 0) {
      newElements.push({
        id: `text-${id++}`,
        x: 40,
        y: yOffset,
        text: 'EDUCATION',
        fontSize: 18,
        fontFamily: 'Arial',
        fill: '#1e293b',
        fontStyle: 'bold',
        width: 736,
      });
      yOffset += 35;

      education.forEach((edu: any) => {
        const eduText = `${edu.degree || ''}${edu.field ? ` in ${edu.field}` : ''}\n${edu.institution || ''}\n${edu.startDate || ''} - ${edu.endDate || ''}`;
        newElements.push({
          id: `text-${id++}`,
          x: 40,
          y: yOffset,
          text: eduText,
          fontSize: 11,
          fontFamily: 'Arial',
          fill: '#334155',
          fontStyle: 'normal',
          width: 736,
        });
        yOffset += 60;
      });
    }

    if (skills.length > 0) {
      newElements.push({
        id: `text-${id++}`,
        x: 40,
        y: yOffset,
        text: 'SKILLS',
        fontSize: 18,
        fontFamily: 'Arial',
        fill: '#1e293b',
        fontStyle: 'bold',
        width: 736,
      });
      yOffset += 35;

      skills.forEach((skillGroup: any) => {
        const skillItems = skillGroup?.items || [];
        const skillText = `${skillGroup?.category || 'Skill'}: ${skillItems.join(', ')}`;
        newElements.push({
          id: `text-${id++}`,
          x: 40,
          y: yOffset,
          text: skillText,
          fontSize: 11,
          fontFamily: 'Arial',
          fill: '#334155',
          fontStyle: 'normal',
          width: 736,
        });
        yOffset += 25;
      });
    }

    setElements(newElements);
  };

  const handleDragEnd = (e: any, id: string) => {
    const newElements = elements.map((el) =>
      el.id === id ? { ...el, x: e.target.x(), y: e.target.y() } : el
    );
    setElements(newElements);
  };

  const handleZoomIn = () => setScale(Math.min(scale + 0.1, 2));
  const handleZoomOut = () => setScale(Math.max(scale - 0.1, 0.5));

  const handleSave = () => {
    if (!onSave) return;
    const layout = {
      width: 816,
      height: 1056,
      backgroundColor: '#ffffff',
      sections: elements.map((el) => ({
        type: 'text',
        x: el.x,
        y: el.y,
        width: el.width,
        text: el.text,
        fontSize: el.fontSize,
        fontFamily: el.fontFamily,
        fontWeight: el.fontStyle === 'bold' ? 'bold' : 'normal',
        color: el.fill,
      })),
    };
    onSave(layout);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-slate-600 min-w-[60px] text-center">{Math.round(scale * 100)}%</span>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Layout
          </Button>
          <Button variant="default" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-slate-100 p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl overflow-hidden">
            <Stage ref={stageRef} width={816} height={1056} scaleX={scale} scaleY={scale} style={{ backgroundColor: '#ffffff' }}>
              <Layer>
                {elements.map((element) => (
                  <Text
                    key={element.id}
                    id={element.id}
                    x={element.x}
                    y={element.y}
                    text={element.text}
                    fontSize={element.fontSize}
                    fontFamily={element.fontFamily}
                    fill={element.fill}
                    fontStyle={element.fontStyle}
                    draggable
                    width={element.width}
                    onDragEnd={(e) => handleDragEnd(e, element.id)}
                    onClick={() => setSelectedId(element.id)}
                  />
                ))}
              </Layer>
            </Stage>
          </Card>
        </div>
      </div>
    </div>
  );
}
