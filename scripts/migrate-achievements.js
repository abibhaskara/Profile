/**
 * Migration script to export hardcoded achievements to the new CMS database.
 * Run this while the local dev server is running on port 3001.
 */

const ACHIEVEMENTS = [
  // Competition
  {
    title: "Silver Medalist - World Robot Games (Thailand)",
    description: "Achievement in international robotics competition held in Thailand.",
    year: "2017",
    category: "competition",
    icon: "FaMedal",
    order: 1
  },
  {
    title: "Silver Medalist - World Robot Games (Japan)",
    description: "Achievement in international robotics competition held in Japan.",
    year: "2017",
    category: "competition",
    icon: "FaMedal",
    order: 2
  },
  {
    title: "Gold Medal - WYIIA",
    description: "World Young Inventors Exhibition, Award for innovative projects.",
    year: "2021",
    category: "competition",
    icon: "FaTrophy",
    order: 3
  },
  {
    title: "Gold Medal - ISIF",
    description: "International Science and Invention Fair, recognition for research and innovation.",
    year: "2021",
    category: "competition",
    icon: "FaTrophy",
    order: 4
  },
  {
    title: "Most Outstanding Student ICT",
    description: "Awarded for exceptional performance in Information and Communication Technology.",
    year: "2022",
    category: "competition",
    icon: "FaAward",
    order: 5
  },
  {
    title: "Junior High School Top Achiever",
    description: "Graduated as one of the top performing students in regional level.",
    year: "2019",
    category: "competition",
    icon: "FaGraduationCap",
    order: 6
  },
  {
    title: "Winner Siswa Siswi Berprestasi",
    description: "State-level award for overall academic and non-academic excellence.",
    year: "2022",
    category: "competition",
    icon: "FaMedal",
    order: 7
  },
  
  // Organization
  {
    title: "Titik Awal",
    description: "Founder of a social initiative focusing on educational empowerment.",
    year: "2020 - Present",
    category: "organization",
    icon: "FaUsers",
    order: 8
  },
  {
    title: "SatuPadu",
    description: "Co-founder of a community platform for youth collaboration.",
    year: "2021 - Present",
    category: "organization",
    icon: "FaUsers",
    order: 9
  },
  {
    title: "Student Council President",
    description: "Led the student representative body, organizing various school-wide events.",
    year: "2018 - 2019",
    category: "organization",
    icon: "FaUserTie",
    order: 10
  },
  {
    title: "Duta Pendidikan",
    description: "Education ambassador representing regional youth in national forums.",
    year: "2021",
    category: "organization",
    icon: "FaAward",
    order: 11
  },

  // Projects
  {
    title: "Fit+",
    description: "Health and wellness tracker app designed for personal productivity.",
    year: "2023",
    category: "projects",
    icon: "FaCode",
    order: 12
  },
  {
    title: "GESTIC AI",
    description: "Artificial Intelligence project focusing on gesture recognition technology.",
    year: "2024",
    category: "projects",
    icon: "FaRobot",
    order: 13
  },
  {
    title: "Peel and Petal",
    description: "E-commerce platform with a focus on sustainable floral products.",
    year: "2023",
    category: "projects",
    icon: "FaShoppingBag",
    order: 14
  }
];

async function migrate() {
  console.log("Starting migration of achievements...");
  
  for (const achievement of ACHIEVEMENTS) {
    try {
      const response = await fetch('http://localhost:3001/api/achievements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(achievement),
      });
      
      if (response.ok) {
        console.log(`✅ Migrated: ${achievement.title}`);
      } else {
        console.error(`❌ Failed: ${achievement.title}`, await response.text());
      }
    } catch (error) {
      console.error(`❌ Error migrating ${achievement.title}:`, error.message);
    }
  }
  
  console.log("Migration finished.");
}

migrate();
