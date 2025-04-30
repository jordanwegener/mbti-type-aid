export interface PositionInfo {
  name: string;
  description: string;
}

export const PrimaryPositionInfo: Record<string, PositionInfo> = {
  "Dominant": {
    name: "Dominant Function (Hero)",
    description: "Your most natural and developed cognitive function. It's your primary way of interacting with the world and forms the core of your personality. You use this function confidently and frequently."
  },
  "Auxiliary": {
    name: "Auxiliary Function (Parent/Good Parent)",
    description: "Your supporting function that balances your dominant function. It's well-developed but secondary, helping you handle situations your dominant function might not be best suited for."
  },
  "Tertiary": {
    name: "Tertiary Function (Child)",
    description: "A less developed but playful function. It's like a relief valve from your stronger functions, offering creative solutions but sometimes being unreliable. Develops more with maturity."
  },
  "Inferior": {
    name: "Inferior Function (Aspirational)",
    description: "Your least developed primary function. It represents an area of potential growth but also vulnerability. Often emerges in times of stress or as a source of aspiration."
  }
};

export const ShadowPositionInfo: Record<string, PositionInfo> = {
  "Opposing": {
    name: "Opposing Role (Opposing Personality)",
    description: "The shadow of your dominant function. It challenges your main approach and emerges when you feel threatened or defensive. Can be a source of stubborn or contrary behavior."
  },
  "Critical Parent": {
    name: "Critical Parent (Senex/Witch)",
    description: "A critical and judgmental version of your auxiliary function. Often emerges when being self-critical or criticizing others. Can be harsh but also a source of wisdom."
  },
  "Deceiving": {
    name: "Deceiving Role (Trickster)",
    description: "Creates blind spots and can make you feel confused or tricked. Often used to deflect criticism or trick others when feeling vulnerable. Can also be a source of humor and creative problem-solving."
  },
  "Demonstrative": {
    name: "Demonstrative Role (Double Agent)",
    description: "A function you're good at but take for granted. Used effortlessly but often unconsciously. Can help support your dominant function in a more flexible way."
  }
}; 