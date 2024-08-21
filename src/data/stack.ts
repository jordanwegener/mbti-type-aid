// Function stack mappings for all 16 MBTI types
export const stackMap = {
  // ISTJ
  "Si,Te,Fi,Ne": "ISTJ",
  // ISFJ
  "Si,Fe,Ti,Ne": "ISFJ",
  // INFJ
  "Ni,Fe,Ti,Se": "INFJ",
  // INTJ
  "Ni,Te,Fi,Se": "INTJ",
  // ISTP
  "Ti,Se,Ni,Fe": "ISTP",
  // ISFP
  "Fi,Se,Ni,Te": "ISFP",
  // INFP
  "Fi,Ne,Si,Te": "INFP",
  // INTP
  "Ti,Ne,Si,Fe": "INTP",
  // ESTP
  "Se,Ti,Fe,Ni": "ESTP",
  // ESFP
  "Se,Fi,Te,Ni": "ESFP",
  // ENFP
  "Ne,Fi,Te,Si": "ENFP",
  // ENTP
  "Ne,Ti,Fe,Si": "ENTP",
  // ESTJ
  "Te,Si,Ne,Fi": "ESTJ",
  // ESFJ
  "Fe,Si,Ne,Ti": "ESFJ",
  // ENFJ
  "Fe,Ni,Se,Ti": "ENFJ",
  // ENTJ
  "Te,Ni,Se,Fi": "ENTJ"
};

export const getStackType = (stackString: string): string => {
  return stackMap[stackString] ?? undefined;
};
