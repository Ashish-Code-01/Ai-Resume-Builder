import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateResumeContent(userDetails: {
  fullName: string;
  email: string;
  phone?: string;
  experience?: string;
  education?: string;
  skills?: string;
  targetRole?: string;
}) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Generate a professional resume in JSON format for the following person:

Name: ${userDetails.fullName}
Email: ${userDetails.email}
${userDetails.phone ? `Phone: ${userDetails.phone}` : ''}
${userDetails.targetRole ? `Target Role: ${userDetails.targetRole}` : ''}

Experience: ${userDetails.experience || 'No experience provided'}
Education: ${userDetails.education || 'No education provided'}
Skills: ${userDetails.skills || 'No skills provided'}

Please generate a complete resume with the following structure:
{
  "personalInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "summary": "Professional summary (2-3 sentences)"
  },
  "experience": [
    {
      "id": "unique-id",
      "company": "Company Name",
      "position": "Job Title",
      "location": "City, Country",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or Present",
      "description": "Brief description",
      "achievements": ["Achievement 1", "Achievement 2"]
    }
  ],
  "education": [
    {
      "id": "unique-id",
      "institution": "University Name",
      "degree": "Degree Type",
      "field": "Field of Study",
      "location": "City, Country",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "description": "Optional description"
    }
  ],
  "skills": [
    {
      "id": "unique-id",
      "category": "Category Name",
      "items": ["Skill 1", "Skill 2", "Skill 3"]
    }
  ],
  "projects": []
}

Return ONLY valid JSON, no additional text.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  throw new Error('Failed to generate valid resume JSON');
}

export async function rewriteSection(sectionContent: string, instructions?: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Rewrite the following resume section to be more professional and impactful:

${sectionContent}

${instructions ? `Additional instructions: ${instructions}` : ''}

Make it:
- Action-oriented with strong verbs
- Quantifiable where possible
- Clear and concise
- ATS-friendly

Return only the improved text without additional commentary.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

export async function tailorResumeToJob(resumeContent: any, jobDescription: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Tailor this resume to match the following job description:

Job Description:
${jobDescription}

Current Resume:
${JSON.stringify(resumeContent, null, 2)}

Optimize the resume by:
1. Adjusting the professional summary to align with the job
2. Highlighting relevant experience and achievements
3. Emphasizing matching skills
4. Using keywords from the job description

Return the complete tailored resume in the same JSON format. Return ONLY valid JSON, no additional text.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  throw new Error('Failed to generate valid resume JSON');
}

export async function generateSectionContent(
  sectionType: string,
  context: string,
  existingContent?: any
) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Generate a professional ${sectionType} section for a resume.

Context: ${context}
${existingContent ? `Existing content for reference: ${JSON.stringify(existingContent)}` : ''}

Return the section in JSON format matching the resume structure.
For experience: include company, position, location, dates, description, and achievements array.
For education: include institution, degree, field, location, and dates.
For skills: include category and items array.
For projects: include name, description, technologies array, and optional link.

Return ONLY valid JSON array, no additional text.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  const jsonMatch = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  throw new Error('Failed to generate valid section JSON');
}
