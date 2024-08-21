export enum CognitiveFunction {
  Fi = "Fi",
  Fe = "Fe",
  Ti = "Ti",
  Te = "Te",
  Si = "Si",
  Se = "Se",
  Ni = "Ni",
  Ne = "Ne"
}

export const CognitiveFunctionInfo = {
  [CognitiveFunction.Fi]: {
    name: "Introverted Feeling",
    description: "Fi is a judging function that is concerned with understanding and evaluating the internal emotional landscape of oneself and others. It is focused on understanding the personal values and beliefs that guide behavior and decision-making."
  },
  [CognitiveFunction.Fe]: {
    name: "Extroverted Feeling",
    description: "Fe is a judging function that is concerned with understanding and evaluating the emotional landscape of groups and communities. It is focused on understanding the emotional needs and values of others and creating harmony and connection between people."
  },
  [CognitiveFunction.Ti]: {
    name: "Introverted Thinking",
    description: "Ti is a judging function that is concerned with understanding and evaluating the internal logical structure of ideas and systems. It is focused on analyzing and categorizing information to create a coherent and consistent understanding of the world."
  },
  [CognitiveFunction.Te]: {
    name: "Extroverted Thinking",
    description: "Te is a judging function that is concerned with understanding and evaluating the external logical structure of systems and organizations. It is focused on organizing and structuring information to achieve goals and solve problems efficiently."
  },
  [CognitiveFunction.Si]: {
    name: "Introverted Sensing",
    description: "Si is a perceiving function that is concerned with gathering and storing sensory information from the past. It is focused on recalling and comparing past experiences to create a sense of stability and continuity in the present."
  },
  [CognitiveFunction.Se]: {
    name: "Extroverted Sensing",
    description: "Se is a perceiving function that is concerned with experiencing and responding to the sensory information of the present moment. It is focused on engaging with the external environment and seeking out new experiences and opportunities."
  },
  [CognitiveFunction.Ni]: {
    name: "Introverted Intuition",
    description: "Ni is a perceiving function that is concerned with generating and exploring possibilities and insights about the future. It is focused on synthesizing information and making connections between ideas to create a vision of what could be."
  },
  [CognitiveFunction.Ne]: {
    name: "Extroverted Intuition",
    description: "Ne is a perceiving function that is concerned with generating and exploring possibilities and connections between ideas. It is focused on brainstorming and exploring new ideas and perspectives to create innovative solutions and insights."
  }
}