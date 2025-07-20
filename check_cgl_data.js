// Check CGL Exam Data
// Run this in browser console or Node.js to check for CGL data

const SUPABASE_URL = 'https://your-project.supabase.co'; // Replace with your actual URL
const SUPABASE_ANON_KEY = 'your-anon-key'; // Replace with your actual key

// Function to check exams table
async function checkExams() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/exams?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    const exams = await response.json();
    console.log('Available exams:', exams);
    
    // Check for CGL
    const cglExam = exams.find(exam => 
      exam.name.toLowerCase().includes('cgl') || 
      exam.name.toLowerCase().includes('combined graduate level')
    );
    
    if (cglExam) {
      console.log('✅ CGL exam found:', cglExam);
      return cglExam.id;
    } else {
      console.log('❌ CGL exam not found');
      return null;
    }
  } catch (error) {
    console.error('Error checking exams:', error);
    return null;
  }
}

// Function to check mock data for a specific exam
async function checkMockData(examId) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/mock_tests?exam_id=eq.${examId}&select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    const mockData = await response.json();
    console.log(`Mock data for exam ${examId}:`, mockData);
    console.log(`Total mock tests: ${mockData.length}`);
    
    return mockData;
  } catch (error) {
    console.error('Error checking mock data:', error);
    return [];
  }
}

// Function to check subjects for a specific exam
async function checkSubjects(examId) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/subjects?exam_id=eq.${examId}&select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    const subjects = await response.json();
    console.log(`Subjects for exam ${examId}:`, subjects);
    console.log(`Total subjects: ${subjects.length}`);
    
    return subjects;
  } catch (error) {
    console.error('Error checking subjects:', error);
    return [];
  }
}

// Main function to run all checks
async function checkCGLData() {
  console.log('🔍 Checking for CGL exam data...');
  
  // Check exams
  const cglExamId = await checkExams();
  
  if (cglExamId) {
    // Check mock data for CGL
    await checkMockData(cglExamId);
    
    // Check subjects for CGL
    await checkSubjects(cglExamId);
  } else {
    console.log('No CGL exam found, cannot check related data');
  }
}

// Run the check
checkCGLData(); 