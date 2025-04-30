export enum MBTIType {
  ISTJ = "ISTJ",
  ISFJ = "ISFJ",
  INFJ = "INFJ",
  INTJ = "INTJ",
  ISTP = "ISTP",
  ISFP = "ISFP",
  INFP = "INFP",
  INTP = "INTP",
  ESTP = "ESTP",
  ESFP = "ESFP",
  ENFP = "ENFP",
  ENTP = "ENTP",
  ESTJ = "ESTJ",
  ESFJ = "ESFJ",
  ENFJ = "ENFJ",
  ENTJ = "ENTJ"
}

export interface MBTITypeInfo {
  name: string;
  nickname: string;
  description: string;
  strengths: string[];
  challenges: string[];
}

export const MBTITypeDescriptions: Record<MBTIType, MBTITypeInfo> = {
  [MBTIType.ISTJ]: {
    name: "Introverted Sensing Thinking Judging",
    nickname: "The Inspector",
    description: "Quiet, serious, and practical, ISTJs are thorough and dependable. They focus on logical organization of their world, valuing tradition, security, and peaceful living.",
    strengths: [
      "Organized and methodical",
      "Reliable and responsible",
      "Detail-oriented",
      "Practical and realistic"
    ],
    challenges: [
      "May resist change",
      "Can be overly rigid",
      "Might overlook long-term implications",
      "May miss abstract connections"
    ]
  },
  [MBTIType.ISFJ]: {
    name: "Introverted Sensing Feeling Judging",
    nickname: "The Protector",
    description: "Quiet, friendly, and responsible, ISFJs use their detailed personal experience to care for others. They create orderly and harmonious environments at work and at home.",
    strengths: [
      "Supportive and nurturing",
      "Reliable and patient",
      "Detail-oriented",
      "Practical and grounded"
    ],
    challenges: [
      "May neglect own needs",
      "Can be overly modest",
      "Might avoid conflict",
      "May resist change"
    ]
  },
  [MBTIType.INFJ]: {
    name: "Introverted Intuition Feeling Judging",
    nickname: "The Counselor",
    description: "Insightful and creative, INFJs seek meaning and connection in their relationships, ideas, and the world around them. They want to understand what motivates people and are insightful about others.",
    strengths: [
      "Insightful and creative",
      "Dedicated and helpful",
      "Determined and passionate",
      "Deep understanding of others"
    ],
    challenges: [
      "Can be overly sensitive",
      "May be perfectionistic",
      "Might avoid conflict",
      "Can burn out from helping others"
    ]
  },
  [MBTIType.INTJ]: {
    name: "Introverted Intuition Thinking Judging",
    nickname: "The Architect",
    description: "Innovative and strategic, INTJs have a unique ability to see patterns and develop long-range planning. They are driven by their insights and logic rather than tradition or emotion.",
    strengths: [
      "Strategic thinking",
      "Independent and decisive",
      "Rational and quick-minded",
      "High standards"
    ],
    challenges: [
      "May appear arrogant",
      "Can be overly critical",
      "Might be insensitive",
      "May overlook emotional factors"
    ]
  },
  [MBTIType.ISTP]: {
    name: "Introverted Thinking Sensing Perceiving",
    nickname: "The Craftsperson",
    description: "Tolerant and flexible, ISTPs are quiet observers until a problem appears, then act quickly to find workable solutions. They analyze what makes things work and readily get through large amounts of data to isolate the core of practical problems.",
    strengths: [
      "Adaptable and resourceful",
      "Action-oriented",
      "Realistic and practical",
      "Good at troubleshooting"
    ],
    challenges: [
      "May be seen as insensitive",
      "Can be risk-prone",
      "Might avoid commitment",
      "May seem unpredictable"
    ]
  },
  [MBTIType.ISFP]: {
    name: "Introverted Feeling Sensing Perceiving",
    nickname: "The Composer",
    description: "Quiet, friendly, sensitive, and kind, ISFPs enjoy the present moment and what's going on around them. They seek to create a personal and practical way of life that allows them to live according to their values.",
    strengths: [
      "Artistic and creative",
      "Sensitive and caring",
      "Flexible and adaptable",
      "Lives in the present"
    ],
    challenges: [
      "May avoid conflict",
      "Can be overly modest",
      "Might struggle with long-term planning",
      "May take criticism personally"
    ]
  },
  [MBTIType.INFP]: {
    name: "Introverted Feeling Intuition Perceiving",
    nickname: "The Healer",
    description: "Idealistic and loyal to their values, INFPs seek to understand people and help them fulfill their potential. They are curious about possibilities and what might be.",
    strengths: [
      "Creative and imaginative",
      "Strong values and morals",
      "Empathetic and caring",
      "Open-minded and flexible"
    ],
    challenges: [
      "May be too idealistic",
      "Can be overly sensitive",
      "Might avoid conflict",
      "May struggle with criticism"
    ]
  },
  [MBTIType.INTP]: {
    name: "Introverted Thinking Intuition Perceiving",
    nickname: "The Logician",
    description: "Logical and innovative, INTPs seek to understand the world through theoretical models. They are more interested in exploring ideas than in human interactions.",
    strengths: [
      "Analytical and logical",
      "Original thinking",
      "Open to new ideas",
      "Objective"
    ],
    challenges: [
      "May appear insensitive",
      "Can be overly critical",
      "Might neglect routine tasks",
      "May struggle with emotional expression"
    ]
  },
  [MBTIType.ESTP]: {
    name: "Extroverted Sensing Thinking Perceiving",
    nickname: "The Dynamo",
    description: "Flexible and tolerant, ESTPs live in the moment and seek out excitement. They learn best through doing and solving practical problems rather than theory.",
    strengths: [
      "Energetic and active",
      "Adaptable and resourceful",
      "Practical problem solver",
      "Good at negotiating"
    ],
    challenges: [
      "May be impulsive",
      "Can be insensitive",
      "Might avoid commitment",
      "May miss long-term consequences"
    ]
  },
  [MBTIType.ESFP]: {
    name: "Extroverted Sensing Feeling Perceiving",
    nickname: "The Performer",
    description: "Outgoing, friendly, and accepting, ESFPs love people and new experiences. They find joy in the present moment and make work fun.",
    strengths: [
      "Enthusiastic and fun-loving",
      "Good at practical help",
      "Adaptable and resourceful",
      "People-oriented"
    ],
    challenges: [
      "May avoid conflict",
      "Can be easily distracted",
      "Might struggle with routine",
      "May avoid complex analysis"
    ]
  },
  [MBTIType.ENFP]: {
    name: "Extroverted Intuition Feeling Perceiving",
    nickname: "The Champion",
    description: "Warmly enthusiastic and imaginative, ENFPs see life as full of possibilities. They make connections between events and information very quickly.",
    strengths: [
      "Enthusiastic and creative",
      "People-oriented",
      "Innovative problem solver",
      "Excellent communicator"
    ],
    challenges: [
      "May be unfocused",
      "Can be overly optimistic",
      "Might struggle with routine",
      "May avoid conflict"
    ]
  },
  [MBTIType.ENTP]: {
    name: "Extroverted Intuition Thinking Perceiving",
    nickname: "The Visionary",
    description: "Quick, ingenious, and stimulating, ENTPs are alert and outspoken. They enjoy new challenges and creative problem solving.",
    strengths: [
      "Innovative and creative",
      "Enthusiastic and energetic",
      "Good at analysis",
      "Quick and clever"
    ],
    challenges: [
      "May be argumentative",
      "Can be insensitive",
      "Might be unfocused",
      "May struggle with follow-through"
    ]
  },
  [MBTIType.ESTJ]: {
    name: "Extroverted Thinking Sensing Judging",
    nickname: "The Supervisor",
    description: "Practical, realistic, and matter-of-fact, ESTJs like to organize projects and people to get things done. They focus on getting results in the most efficient way possible.",
    strengths: [
      "Organized and efficient",
      "Dedicated and reliable",
      "Strong leadership skills",
      "Direct and honest"
    ],
    challenges: [
      "May be inflexible",
      "Can be judgmental",
      "Might be insensitive",
      "May overlook others' feelings"
    ]
  },
  [MBTIType.ESFJ]: {
    name: "Extroverted Feeling Sensing Judging",
    nickname: "The Provider",
    description: "Warmhearted, conscientious, and cooperative, ESFJs want harmony in their environment. They work with determination to establish it.",
    strengths: [
      "Practical and organized",
      "Loyal and reliable",
      "Warm and sympathetic",
      "Good at connecting with others"
    ],
    challenges: [
      "May be needy for approval",
      "Can be inflexible",
      "Might avoid conflict",
      "May be overly sensitive"
    ]
  },
  [MBTIType.ENFJ]: {
    name: "Extroverted Feeling Intuition Judging",
    nickname: "The Teacher",
    description: "Warm, empathetic, responsive, and responsible, ENFJs are highly attuned to the emotions, needs, and motivations of others. They find potential in everyone.",
    strengths: [
      "Natural leader",
      "Charismatic and inspiring",
      "Empathetic and warm",
      "Organized and structured"
    ],
    challenges: [
      "May be overly idealistic",
      "Can be too selfless",
      "Might be approval-seeking",
      "May avoid conflict"
    ]
  },
  [MBTIType.ENTJ]: {
    name: "Extroverted Thinking Intuition Judging",
    nickname: "The Commander",
    description: "Frank, decisive, and assume leadership readily, ENTJs quickly see illogical and inefficient procedures and policies. They develop and implement comprehensive systems to solve organizational problems.",
    strengths: [
      "Natural leader",
      "Strategic thinking",
      "Confident and assertive",
      "Efficient and organized"
    ],
    challenges: [
      "May appear arrogant",
      "Can be impatient",
      "Might be insensitive",
      "May be overly controlling"
    ]
  }
};

// Function stack mappings for all 16 MBTI types
export const stackMap: Record<string, MBTIType> = {
  "Si,Te,Fi,Ne": MBTIType.ISTJ,
  "Si,Fe,Ti,Ne": MBTIType.ISFJ,
  "Ni,Fe,Ti,Se": MBTIType.INFJ,
  "Ni,Te,Fi,Se": MBTIType.INTJ,
  "Ti,Se,Ni,Fe": MBTIType.ISTP,
  "Fi,Se,Ni,Te": MBTIType.ISFP,
  "Fi,Ne,Si,Te": MBTIType.INFP,
  "Ti,Ne,Si,Fe": MBTIType.INTP,
  "Se,Ti,Fe,Ni": MBTIType.ESTP,
  "Se,Fi,Te,Ni": MBTIType.ESFP,
  "Ne,Fi,Te,Si": MBTIType.ENFP,
  "Ne,Ti,Fe,Si": MBTIType.ENTP,
  "Te,Si,Ne,Fi": MBTIType.ESTJ,
  "Fe,Si,Ne,Ti": MBTIType.ESFJ,
  "Fe,Ni,Se,Ti": MBTIType.ENFJ,
  "Te,Ni,Se,Fi": MBTIType.ENTJ
};

export const getStackType = (stackString: string): MBTIType | undefined => {
  return stackMap[stackString];
};

export const getTypeInfo = (type: MBTIType): MBTITypeInfo => {
  return MBTITypeDescriptions[type];
};
