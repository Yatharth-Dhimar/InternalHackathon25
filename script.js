document.addEventListener("DOMContentLoaded", () => {
  const careers = [
    "Software Engineer", "Data Scientist", "AI Engineer", "Machine Learning Engineer",
    "Cloud Architect", "Cybersecurity Analyst", "Blockchain Developer", "Game Developer",
    "Mobile App Developer", "Web Developer", "DevOps Engineer", "UI/UX Designer",
    "Product Manager", "Business Analyst", "Database Administrator", "IT Support Specialist",
    "Network Engineer", "Systems Analyst", "Automation Engineer", "Full Stack Developer",
    "Robotics Engineer", "Embedded Systems Developer", "AR/VR Developer", "IoT Engineer",
    "Digital Marketing Specialist", "SEO Specialist", "Content Strategist", "Creative Director",
    "Graphic Designer", "Video Editor", "Animator", "3D Modeler",
    "Finance Analyst", "Investment Banker", "Accountant", "Auditor", "Risk Manager",
    "HR Manager", "Talent Acquisition Specialist", "Learning & Development Specialist",
    "Teacher", "Professor", "Research Scientist", "Instructional Designer",
    "Doctor", "Nurse", "Pharmacist", "Biotechnologist", "Healthcare Data Analyst",
    "Psychologist", "Counselor", "Sociologist", "Social Worker", "Policy Analyst",
    "Lawyer", "Legal Advisor", "Corporate Lawyer", "Paralegal",
    "Civil Engineer", "Mechanical Engineer", "Electrical Engineer", "Chemical Engineer",
    "Architect", "Urban Planner", "Construction Manager", "Surveyor",
    "Astronomer", "Physicist", "Chemist", "Biologist", "Environmental Scientist",
    "Geologist", "Meteorologist", "Oceanographer", "Ecologist",
    "Journalist", "Author", "Editor", "Copywriter", "Public Relations Specialist",
    "Event Manager", "Sales Executive", "Customer Success Manager", "Operations Manager",
    "Entrepreneur", "Startup Founder", "Venture Capitalist", "Business Consultant",
    "Chef", "Hotel Manager", "Travel Agent", "Airline Pilot", "Flight Attendant",
    "Musician", "Actor", "Dancer", "Fashion Designer", "Photographer",
    "Sports Coach", "Athlete", "Fitness Trainer", "Physiotherapist"
  ];

  const careerGrid = document.getElementById("careerGrid");

  careers.forEach(career => {
    const card = document.createElement("div");
    card.className = "career-card";
    card.textContent = career;
    careerGrid.appendChild(card);
  });

  // Search Filter
  const searchInput = document.getElementById("careerSearch");
  searchInput.addEventListener("keyup", () => {
    const filter = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll(".career-card");

    cards.forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(filter) ? "block" : "none";
    });
  });
});
