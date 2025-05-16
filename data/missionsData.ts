import { sdgData } from './sdgData';

// Helper function to generate a unique ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Daily missions data
export const dailyMissionsData = [
  {
    id: generateId(),
    title: "Reduce Single-Use Plastics",
    description: "Commit to avoiding single-use plastics today by using reusable alternatives for bags, bottles, and straws.",
    type: "daily",
    sdg: sdgData[11], // SDG 12: Responsible Consumption and Production
    completed: false,
    steps: [
      {
        id: generateId(),
        description: "Use a reusable water bottle instead of buying bottled water",
        completed: false
      },
      {
        id: generateId(),
        description: "Carry a reusable shopping bag when going to stores",
        completed: false
      },
      {
        id: generateId(),
        description: "Decline plastic straws and utensils when ordering food",
        completed: false
      },
      {
        id: generateId(),
        description: "Document and share how much plastic you avoided using today",
        completed: false
      }
    ],
    impact: "By avoiding single-use plastics for a day, you help reduce plastic pollution in oceans, which harms marine life and ecosystems that Filipinos depend on for food and livelihoods."
  },
  {
    id: generateId(),
    title: "Mindful Energy Conservation",
    description: "Practice energy conservation throughout the day by being conscious of your electricity usage at home or work.",
    type: "daily",
    sdg: sdgData[6], // SDG 7: Affordable and Clean Energy
    completed: false,
    steps: [
      {
        id: generateId(),
        description: "Unplug electronic devices when not in use",
        completed: false
      },
      {
        id: generateId(),
        description: "Use natural light instead of artificial lighting when possible",
        completed: false
      },
      {
        id: generateId(),
        description: "Adjust air conditioning to energy-efficient settings",
        completed: false
      },
      {
        id: generateId(),
        description: "Record your energy-saving actions and estimate the energy saved",
        completed: false
      }
    ],
    impact: "Energy conservation directly reduces greenhouse gas emissions from power plants and helps combat climate change, which particularly affects the Philippines through extreme weather events and sea level rise."
  },
  {
    id: generateId(),
    title: "Support Local Food Producers",
    description: "Purchase food from local Filipino farmers or markets for your meals today to support sustainable agriculture.",
    type: "daily",
    sdg: sdgData[1], // SDG 2: Zero Hunger
    completed: false,
    steps: [
      {
        id: generateId(),
        description: "Visit a local market or farm stand",
        completed: false
      },
      {
        id: generateId(),
        description: "Purchase vegetables, fruits, or other products directly from local farmers",
        completed: false
      },
      {
        id: generateId(),
        description: "Cook a meal using only locally sourced ingredients",
        completed: false
      },
      {
        id: generateId(),
        description: "Learn about where your food comes from and share this information",
        completed: false
      }
    ],
    impact: "Supporting local farmers helps reduce the carbon footprint of food transportation, promotes food security in your community, and provides economic support to small-scale farmers who are often among the most vulnerable economically."
  },
  {
    id: generateId(),
    title: "Conserve Water Usage",
    description: "Implement water-saving practices throughout your day to reduce water waste.",
    type: "daily",
    sdg: sdgData[5], // SDG 6: Clean Water and Sanitation
    completed: false,
    steps: [
      {
        id: generateId(),
        description: "Take a shorter shower (under 5 minutes)",
        completed: false
      },
      {
        id: generateId(),
        description: "Turn off the tap while brushing teeth or washing dishes",
        completed: false
      },
      {
        id: generateId(),
        description: "Check for and report any leaking faucets or pipes",
        completed: false
      },
      {
        id: generateId(),
        description: "Reuse water where appropriate (e.g., use rinsing water for plants)",
        completed: false
      }
    ],
    impact: "Water conservation is crucial in many Philippine communities that face water scarcity issues. Your actions help preserve this essential resource and raise awareness about sustainable water management."
  },
  {
    id: generateId(),
    title: "Digital Cleanup Day",
    description: "Reduce your digital carbon footprint by cleaning up digital waste and practicing sustainable digital habits.",
    type: "daily",
    sdg: sdgData[12], // SDG 13: Climate Action
    completed: false,
    steps: [
      {
        id: generateId(),
        description: "Delete unnecessary emails, files, and photos from cloud storage",
        completed: false
      },
      {
        id: generateId(),
        description: "Unsubscribe from unwanted email lists",
        completed: false
      },
      {
        id: generateId(),
        description: "Adjust device settings to save energy (e.g., reduce screen brightness)",
        completed: false
      },
      {
        id: generateId(),
        description: "Learn about the environmental impact of digital storage and streaming",
        completed: false
      }
    ],
    impact: "Digital services consume significant energy through data centers and networks. By reducing your digital waste, you're helping minimize the energy demands and associated carbon emissions of digital infrastructure."
  },
  {
    id: generateId(),
    title: "Engage in Community Knowledge Sharing",
    description: "Share educational resources or knowledge with someone who could benefit from it.",
    type: "daily",
    sdg: sdgData[3], // SDG 4: Quality Education
    completed: true,
    completedAt: "2023-09-15T10:30:00.000Z",
    steps: [
      {
        id: generateId(),
        description: "Identify a skill or knowledge area you can share with others",
        completed: true
      },
      {
        id: generateId(),
        description: "Spend at least 30 minutes teaching or explaining this to someone",
        completed: true
      },
      {
        id: generateId(),
        description: "Share or recommend educational resources with others",
        completed: true
      },
      {
        id: generateId(),
        description: "Reflect on the experience and how knowledge sharing benefits communities",
        completed: true
      }
    ],
    impact: "Education is a powerful tool for sustainable development. By sharing knowledge, you're contributing to building more informed and empowered communities capable of addressing local challenges."
  }
];

// Weekly missions data
export const weeklyMissionsData = [
  {
    id: generateId(),
    title: "Conduct a Neighborhood Cleanup",
    description: "Organize or participate in a cleanup effort in your local community to reduce pollution and protect the environment.",
    type: "weekly",
    sdg: sdgData[13], // SDG 14: Life Below Water
    completed: false,
    steps: [
      {
        id: generateId(),
        description: "Choose a location (beach, street, park) that needs cleaning",
        completed: false
      },
      {
        id: generateId(),
        description: "Gather necessary supplies (bags, gloves, etc.)",
        completed: false
      },
      {
        id: generateId(),
        description: "Spend at least 2 hours collecting trash",
        completed: false
      },
      {
        id: generateId(),
        description: "Properly sort and dispose of collected waste",
        completed: false
      },
      {
        id: generateId(),
        description: "Document the experience and share on social media to raise awareness",
        completed: false
      }
    ],
    impact: "Community cleanups help prevent waste from reaching waterways and harming marine life. In the Philippines, where many communities depend on healthy marine ecosystems for food and livelihoods, this action directly supports sustainable development."
  },
  {
    id: generateId(),
    title: "Plant Native Trees or Plants",
    description: "Contribute to biodiversity conservation by planting native Philippine species in your garden or community.",
    type: "weekly",
    sdg: sdgData[14], // SDG 15: Life on Land
    completed: false,
    steps: [
      {
        id: generateId(),
        description: "Research native plants or trees appropriate for your area",
        completed: false
      },
      {
        id: generateId(),
        description: "Obtain seedlings or young plants from a reputable source",
        completed: false
      },
      {
        id: generateId(),
        description: "Prepare the planting site properly",
        completed: false
      },
      {
        id: generateId(),
        description: "Plant at least 3 native plants or trees",
        completed: false
      },
      {
        id: generateId(),
        description: "Create a care plan to ensure their survival",
        completed: false
      }
    ],
    impact: "Native plants support local wildlife and help preserve the Philippines' rich biodiversity. They're also typically better adapted to local conditions, requiring less water and maintenance while providing ecological services like erosion control and carbon sequestration."
  },
  {
    id: generateId(),
    title: "Promote Gender Equality at Home and Work",
    description: "Take concrete actions to promote gender equality in your household or workplace throughout the week.",
    type: "weekly",
    sdg: sdgData[4], // SDG 5: Gender Equality
    completed: false,
    steps: [
      {
        id: generateId(),
        description: "Analyze the division of household or workplace tasks for gender bias",
        completed: false
      },
      {
        id: generateId(),
        description: "Implement more equitable distribution of responsibilities",
        completed: false
      },
      {
        id: generateId(),
        description: "Advocate for equal opportunities and fair treatment",
        completed: false
      },
      {
        id: generateId(),
        description: "Educate others about gender equality issues",
        completed: false
      },
      {
        id: generateId(),
        description: "Reflect on and document changes made and their impact",
        completed: false
      }
    ],
    impact: "Promoting gender equality creates more harmonious and productive homes, workplaces, and communities. It allows all people to reach their full potential, benefiting society as a whole through increased innovation, productivity, and well-being."
  },
  {
    id: generateId(),
    title: "Volunteer for a Local Cause",
    description: "Dedicate time to volunteer for an organization or initiative that addresses an SDG-related issue in your community.",
    type: "weekly",
    sdg: sdgData[9], // SDG 10: Reduced Inequalities
    completed: false,
    steps: [
      {
        id: generateId(),
        description: "Research local organizations addressing inequality issues",
        completed: false
      },
      {
        id: generateId(),
        description: "Contact an organization and arrange volunteer work",
        completed: false
      },
      {
        id: generateId(),
        description: "Volunteer for at least 4 hours during the week",
        completed: false
      },
      {
        id: generateId(),
        description: "Learn about the systemic issues the organization is addressing",
        completed: false
      },
      {
        id: generateId(),
        description: "Share your experience and encourage others to get involved",
        completed: false
      }
    ],
    impact: "Volunteering directly supports community organizations working to address inequalities and other sustainable development challenges. Your time and skills contribute to strengthening community resilience and social cohesion."
  },
  {
    id: generateId(),
    title: "Implement a Household Zero-Waste Week",
    description: "Challenge yourself to produce as little waste as possible for one week by following zero-waste principles.",
    type: "weekly",
    sdg: sdgData[11], // SDG 12: Responsible Consumption and Production
    completed: false,
    steps: [
      {
        id: generateId(),
        description: "Plan meals to minimize packaging waste",
        completed: false
      },
      {
        id: generateId(),
        description: "Use reusable containers, bags, and products throughout the week",
        completed: false
      },
      {
        id: generateId(),
        description: "Compost food scraps and organic waste",
        completed: false
      },
      {
        id: generateId(),
        description: "Repair items instead of replacing them when possible",
        completed: false
      },
      {
        id: generateId(),
        description: "Track your waste reduction and share tips with others",
        completed: false
      }
    ],
    impact: "Reducing waste helps address the growing waste management challenges in the Philippines, particularly in urban areas. It conserves resources, reduces pollution, and develops sustainable consumption habits that can continue beyond the challenge week."
  },
  {
    id: generateId(),
    title: "Mentoring Youth for Community Development",
    description: "Mentor young people in your community on sustainable development initiatives or career opportunities in sustainability fields.",
    type: "weekly",
    sdg: sdgData[16], // SDG 17: Partnerships for the Goals
    completed: true,
    completedAt: "2023-08-28T15:45:00.000Z",
    steps: [
      {
        id: generateId(),
        description: "Identify 2-3 young people who could benefit from mentorship",
        completed: true
      },
      {
        id: generateId(),
        description: "Schedule at least two mentoring sessions during the week",
        completed: true
      },
      {
        id: generateId(),
        description: "Share knowledge, experience, and resources related to sustainable development",
        completed: true
      },
      {
        id: generateId(),
        description: "Help mentees develop an action plan for their own sustainability initiatives",
        completed: true
      },
      {
        id: generateId(),
        description: "Establish ongoing support and check-in mechanisms",
        completed: true
      }
    ],
    impact: "Mentoring creates intergenerational partnerships that transfer knowledge and inspire action. By empowering youth with sustainability knowledge and skills, you're helping build the next generation of sustainability leaders in the Philippines."
  }
];