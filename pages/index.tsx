import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface LineType {
    symbol: string;
    changingTo: string | null;
    color: string;
}

const hexagrams = 
[
  {
    "id": 1,
    "name": "The Creative",
    "chinese_name": "乾 (Qián)",
    "representation": "111111",
    "overall_meaning": "The essence of the creative is power, the power to bring forth, to produce, to create.",
    "advice": "Maintain firm correctness to ensure good fortune. Consider the origins of your actions.",
    "keywords": ["initiative", "forcefulness", "power", "creation"],
    "creative_description": "As the sky above, the powerful force of creation ignites new beginnings and limitless potential.",
    "lines": [
      {
        "line_number": 1,
        "text": "Hidden dragon. Do not act.",
        "interpretation": "Potential is hidden and not yet visible. Wait for the right moment."
      },
      {
        "line_number": 2,
        "text": "Dragon appearing in the field. It furthers one to see the great man.",
        "interpretation": "Opportunities arise. Seek guidance from a wise person."
      },
      {
        "line_number": 3,
        "text": "All day long the superior man is creatively active. At nightfall his mind is still beset with cares. Danger. No blame.",
        "interpretation": "Continuous effort and vigilance are required. Be aware of potential dangers."
      },
      {
        "line_number": 4,
        "text": "Wavering flight over the depths. No blame.",
        "interpretation": "Navigating through uncertain situations requires balance and caution."
      },
      {
        "line_number": 5,
        "text": "Flying dragon in the heavens. It furthers one to see the great man.",
        "interpretation": "Achievement and success. Seek the counsel of those with experience."
      },
      {
        "line_number": 6,
        "text": "Arrogant dragon will have cause to repent.",
        "interpretation": "Overconfidence and arrogance lead to downfall. Remain humble."
      }
    ]
  },
  {
    "id": 2,
    "name": "The Receptive",
    "chinese_name": "坤 (Kūn)",
    "representation": "000000",
    "overall_meaning": "The essence of the receptive is devotion, the power to nurture, to support, to yield.",
    "advice": "Be open and accepting. Yield to the natural order and remain adaptable.",
    "keywords": ["receptivity", "nurturing", "support", "adaptability"],
    "creative_description": "As the earth below, the receptive nature supports growth and provides a foundation for all things.",
    "lines": [
      {
        "line_number": 1,
        "text": "When there is hoarfrost underfoot, solid ice is not far off.",
        "interpretation": "Early signs of change indicate that more significant transformations are coming."
      },
      {
        "line_number": 2,
        "text": "Straight, square, great. Without purpose, yet nothing remains unfurthered.",
        "interpretation": "Maintain integrity and simplicity. Success will follow naturally."
      },
      {
        "line_number": 3,
        "text": "Hidden lines. One is able to remain persevering. If by chance you are in the service of a king, seek not works.",
        "interpretation": "Remain steadfast and humble, avoiding the pursuit of recognition."
      },
      {
        "line_number": 4,
        "text": "A tied-up sack. No blame, no praise.",
        "interpretation": "Neutral actions and decisions. Neither significant gains nor losses."
      },
      {
        "line_number": 5,
        "text": "A yellow lower garment brings supreme good fortune.",
        "interpretation": "Humility and modesty bring great blessings and fortune."
      },
      {
        "line_number": 6,
        "text": "Dragons fight in the meadow. Their blood is black and yellow.",
        "interpretation": "Conflict and opposition lead to harm and regret. Seek harmony."
      }
    ]
  },
  {
    "id": 3,
    "name": "Difficulty at the Beginning",
    "chinese_name": "屯 (Zhūn)",
    "representation": "100010",
    "overall_meaning": "The beginning of any endeavor is marked by difficulty and struggle, but perseverance leads to success.",
    "advice": "Be patient and persistent. Recognize the challenges as part of the growth process.",
    "keywords": ["struggle", "beginning", "perseverance", "growth"],
    "creative_description": "As sprouts breaking through the earth, initial struggles give way to growth and development.",
    "lines": [
      {
        "line_number": 1,
        "text": "Hesitation and hindrance. It furthers one to remain persevering. It furthers one to appoint helpers.",
        "interpretation": "Initial obstacles require perseverance and seeking support from others."
      },
      {
        "line_number": 2,
        "text": "Difficulties pile up. Horse and wagon part. He is not a robber; he will woo at the right time. As one proceeds, it furthers one to be persevering.",
        "interpretation": "Challenges and setbacks are natural. Patience and timing are key."
      },
      {
        "line_number": 3,
        "text": "Whoever hunts deer without the forester only loses his way in the forest. The superior man gives careful consideration to the commencement of action.",
        "interpretation": "Guidance and preparation are essential to avoid missteps."
      },
      {
        "line_number": 4,
        "text": "Horse and wagon part. Strive for union. To go brings good fortune. Everything acts to further.",
        "interpretation": "Seek unity and cooperation. Moving forward brings success."
      },
      {
        "line_number": 5,
        "text": "Difficulty in the midst of blessing. A little perseverance brings good fortune. Great perseverance brings misfortune.",
        "interpretation": "Balance effort with wisdom. Overexertion can lead to negative outcomes."
      },
      {
        "line_number": 6,
        "text": "Horse and wagon part. Bloody tears flow.",
        "interpretation": "Severe difficulties and separation lead to sorrow. Seek resolution."
      }
    ]
  },
  {
      "id": 4,
      "name": "Youthful Folly",
      "chinese_name": "蒙 (Méng)",
      "representation": "100011",
      "overall_meaning": "Youthful folly represents the time of inexperience and ignorance, but also the potential for growth and learning.",
      "advice": "Seek guidance and be open to instruction. Learn from mistakes and strive for improvement.",
      "keywords": ["inexperience", "learning", "guidance", "growth"],
      "creative_description": "As a young sprout struggling to break through the soil, youthful folly faces challenges but holds the promise of growth and wisdom.",
      "lines": [
      {
          "line_number": 1,
          "text": "To make a fool develop it furthers one to apply discipline. The fetters should be removed. To go on in this way brings humiliation.",
          "interpretation": "Discipline is necessary for growth. Avoid stubbornness to prevent disgrace."
      },
      {
          "line_number": 2,
          "text": "To bear with fools in kindliness brings good fortune. To know how to take women brings good fortune. The son is capable of taking charge of the household.",
          "interpretation": "Patience and kindness lead to success. Embrace responsibilities with wisdom."
      },
      {
          "line_number": 3,
          "text": "Take not a maiden who, when she sees a man of bronze, loses possession of herself. Nothing furthers.",
          "interpretation": "Avoid hasty decisions and unreliable partners. Maintain self-control."
      },
      {
          "line_number": 4,
          "text": "Entangled folly brings humiliation.",
          "interpretation": "Getting caught in foolishness leads to shame. Seek clarity and avoid confusion."
      },
      {
          "line_number": 5,
          "text": "Childlike folly brings good fortune.",
          "interpretation": "Maintaining a humble and open attitude fosters learning and success."
      },
      {
          "line_number": 6,
          "text": "In punishing folly, it does not further one to commit transgressions. The only thing that furthers is to prevent transgressions.",
          "interpretation": "Correction should focus on prevention and education, not punishment."
      }
      ]
  },
  {
      "id": 5,
      "name": "Waiting (Nourishment)",
      "chinese_name": "需 (Xū)",
      "representation": "110111",
      "overall_meaning": "Waiting signifies the need for patience and the recognition that proper nourishment and timing are essential for success.",
      "advice": "Be patient and prepare adequately. Trust that the right opportunities will come with time.",
      "keywords": ["patience", "preparation", "timing", "trust"],
      "creative_description": "As clouds gather before the rain, waiting signifies the need to prepare and trust in the natural timing of events.",
      "lines": [
      {
          "line_number": 1,
          "text": "Waiting in the meadow. It furthers one to abide in what endures. No blame.",
          "interpretation": "Stay grounded and patient. Good fortune comes from stability."
      },
      {
          "line_number": 2,
          "text": "Waiting on the sand. There is some gossip. The end brings good fortune.",
          "interpretation": "Patience amidst uncertainty brings eventual success despite initial difficulties."
      },
      {
          "line_number": 3,
          "text": "Waiting in the mud brings about the arrival of the enemy.",
          "interpretation": "Neglecting preparation leads to challenges. Be proactive."
      },
      {
          "line_number": 4,
          "text": "Waiting in blood. Get out of the pit.",
          "interpretation": "Dangerous situations require decisive action to avoid harm."
      },
      {
          "line_number": 5,
          "text": "Waiting with food and drink. Perseverance brings good fortune.",
          "interpretation": "Adequate preparation and persistence ensure success."
      },
      {
          "line_number": 6,
          "text": "One falls into the pit. Three uninvited guests arrive. Honor them, and in the end, there will be good fortune.",
          "interpretation": "Unexpected challenges bring valuable lessons and opportunities."
      }
      ]
  },
  {
      "id": 6,
      "name": "Conflict",
      "chinese_name": "訟 (Sòng)",
      "representation": "011110",
      "overall_meaning": "Conflict indicates a period of disputes and disagreements that require careful handling and resolution.",
      "advice": "Approach conflicts with caution and seek fair resolution. Avoid unnecessary confrontations.",
      "keywords": ["disputes", "caution", "resolution", "fairness"],
      "creative_description": "As a river overflows, conflict arises from opposing forces. Navigate disputes with wisdom to restore harmony.",
      "lines": [
      {
          "line_number": 1,
          "text": "If one does not perpetuate the affair, there is a little gossip. In the end, good fortune comes.",
          "interpretation": "Avoid escalating conflicts. Remaining calm leads to favorable outcomes."
      },
      {
          "line_number": 2,
          "text": "One cannot engage in conflict; one returns home, gives way. The people of his town, three hundred households, remain free of guilt.",
          "interpretation": "Yielding in disputes protects the community and prevents harm."
      },
      {
          "line_number": 3,
          "text": "To nourish oneself on ancient virtue induces perseverance. Danger. In the end, good fortune comes. If by chance you are in the service of a king, seek not works.",
          "interpretation": "Rely on past wisdom and remain steadfast. Avoid seeking recognition during conflicts."
      },
      {
          "line_number": 4,
          "text": "One cannot engage in conflict; one turns back and submits to fate, changes one's attitude, and finds peace in perseverance. Good fortune.",
          "interpretation": "Accepting circumstances and maintaining peace leads to positive outcomes."
      },
      {
          "line_number": 5,
          "text": "To contend before him brings supreme good fortune.",
          "interpretation": "Engaging in conflict with the right attitude and fairness brings success."
      },
      {
          "line_number": 6,
          "text": "Even if by chance a leather belt is bestowed on one, by the end of a morning it will have been snatched away three times.",
          "interpretation": "Material gains from conflicts are temporary and unreliable. Focus on lasting solutions."
      }
      ]
  },
  {
      "id": 7,
      "name": "The Army",
      "chinese_name": "師 (Shī)",
      "representation": "010001",
      "overall_meaning": "The Army signifies discipline, leadership, and the need for strategic planning and organization.",
      "advice": "Lead with integrity and discipline. Proper organization and strategy ensure success.",
      "keywords": ["discipline", "leadership", "strategy", "organization"],
      "creative_description": "As a well-organized army, discipline and strategic planning lead to successful outcomes.",
      "lines": [
      {
          "line_number": 1,
          "text": "An army must set forth in proper order. If the order is not good, misfortune threatens.",
          "interpretation": "Organization and discipline are crucial. Disarray leads to failure."
      },
      {
          "line_number": 2,
          "text": "In the midst of the army. Good fortune. No blame. The king bestows a triple decoration.",
          "interpretation": "Maintaining integrity within the group brings rewards and success."
      },
      {
          "line_number": 3,
          "text": "Perchance the army carries corpses in the wagon. Misfortune.",
          "interpretation": "Carrying past burdens hinders progress. Let go of what no longer serves."
      },
      {
          "line_number": 4,
          "text": "The army retreats. No blame.",
          "interpretation": "Strategic withdrawal can be wise. Avoid unnecessary confrontation."
      },
      {
          "line_number": 5,
          "text": "There is game in the field. It furthers one to catch it. No blame. The elder son leads the army. The younger transports corpses; then perseverance brings misfortune.",
          "interpretation": "Focus on current opportunities. Mismanagement leads to failure."
      },
      {
          "line_number": 6,
          "text": "The great prince issues commands, founds states, vests families with fiefs. Inferior people should not be employed.",
          "interpretation": "Wise leadership and delegation ensure stability and growth."
      }
      ]
  },
      {
        "id": 8,
        "name": "Holding Together (Union)",
        "chinese_name": "比 (Bǐ)",
        "representation": "010011",
        "overall_meaning": "Holding Together signifies unity and cooperation, emphasizing the importance of mutual support and collective effort.",
        "advice": "Seek unity and harmony in relationships. Collaborate and support each other to achieve common goals.",
        "keywords": ["unity", "cooperation", "support", "collective effort"],
        "creative_description": "As rivers converge to form a mighty ocean, unity and cooperation amplify strength and potential.",
        "lines": [
          {
            "line_number": 1,
            "text": "Hold to him in truth and loyalty; this is without blame. Truth, like a full earthen bowl: Thus in the end good fortune comes from without.",
            "interpretation": "Honesty and loyalty in relationships bring lasting benefits and external rewards."
          },
          {
            "line_number": 2,
            "text": "Hold to him inwardly. Perseverance brings good fortune.",
            "interpretation": "Inner commitment and perseverance in unity lead to positive outcomes."
          },
          {
            "line_number": 3,
            "text": "You hold together with the wrong people.",
            "interpretation": "Be cautious about alliances. Associating with the wrong people can lead to trouble."
          },
          {
            "line_number": 4,
            "text": "Hold to him outwardly also. No blame.",
            "interpretation": "External expressions of unity and support are as important as internal commitments."
          },
          {
            "line_number": 5,
            "text": "Manifestation of holding together. In the hunt, the king uses beaters on three sides only and foregoes game that runs off in front. The citizens need no warning. Good fortune.",
            "interpretation": "Wisely guided cooperation and voluntary participation bring success."
          },
          {
            "line_number": 6,
            "text": "He finds no head for holding together. Misfortune.",
            "interpretation": "Lack of leadership or clear direction leads to disunity and misfortune."
          }
        ]
      },
      {
        "id": 9,
        "name": "The Taming Power of the Small",
        "chinese_name": "小畜 (Xiǎo Chù)",
        "representation": "110010",
        "overall_meaning": "The Taming Power of the Small emphasizes restraint, patience, and the gradual accumulation of resources and strength.",
        "advice": "Exercise patience and restraint. Focus on small, incremental gains and build up resources steadily.",
        "keywords": ["restraint", "patience", "gradual progress", "accumulation"],
        "creative_description": "Like a gentle breeze gradually shaping the landscape, small but consistent efforts lead to significant change over time.",
        "lines": [
          {
            "line_number": 1,
            "text": "Return to the way. How could there be blame in this? Good fortune.",
            "interpretation": "Returning to the right path brings good fortune. Stay true to your principles."
          },
          {
            "line_number": 2,
            "text": "He allows himself to be drawn into returning. Good fortune.",
            "interpretation": "Being receptive and adaptable leads to positive outcomes."
          },
          {
            "line_number": 3,
            "text": "The spokes burst out of the wagon wheels. Man and wife roll their eyes.",
            "interpretation": "Tensions and misunderstandings disrupt harmony. Avoid confrontations."
          },
          {
            "line_number": 4,
            "text": "If you are sincere, blood vanishes and fear gives way. No blame.",
            "interpretation": "Sincerity and honesty dispel fear and conflict. Maintain integrity."
          },
          {
            "line_number": 5,
            "text": "If you are sincere and loyally attached, you are richly rewarded. All is well.",
            "interpretation": "Loyalty and sincerity in relationships bring rich rewards and well-being."
          },
          {
            "line_number": 6,
            "text": "The rain comes, there is rest. This is due to the lasting effect of character. Perseverance brings the woman into danger. The moon is nearly full. If the superior man persists, misfortune comes.",
            "interpretation": "Recognize when to rest and when to act. Overextending can lead to danger."
          }
        ]
      },
      {
        "id": 10,
        "name": "Treading (Conduct)",
        "chinese_name": "履 (Lǚ)",
        "representation": "011010",
        "overall_meaning": "Treading signifies cautious and correct behavior, emphasizing the importance of maintaining proper conduct and awareness.",
        "advice": "Tread carefully and maintain proper conduct. Be mindful of your actions and their impact.",
        "keywords": ["caution", "proper conduct", "awareness", "mindfulness"],
        "creative_description": "Like walking on a tiger's tail, proper conduct and awareness prevent missteps and ensure safety.",
        "lines": [
          {
            "line_number": 1,
            "text": "Simple conduct. Progress without blame.",
            "interpretation": "Simplicity and straightforward actions lead to progress without complications."
          },
          {
            "line_number": 2,
            "text": "Treading a smooth, level course. The perseverance of a dark man brings good fortune.",
            "interpretation": "Steady and consistent effort leads to success. Perseverance is key."
          },
          {
            "line_number": 3,
            "text": "A one-eyed man is able to see, a lame man is able to tread. He treads on the tail of the tiger. The tiger bites the man. Misfortune. Thus a warrior acts on behalf of his great prince.",
            "interpretation": "Taking risks without proper preparation leads to misfortune. Act wisely."
          },
          {
            "line_number": 4,
            "text": "He treads on the tail of the tiger. Caution and circumspection lead ultimately to good fortune.",
            "interpretation": "Careful and cautious actions lead to positive outcomes, even in risky situations."
          },
          {
            "line_number": 5,
            "text": "Resolute conduct. Perseverance with awareness of danger.",
            "interpretation": "Determined and mindful perseverance ensures success despite dangers."
          },
          {
            "line_number": 6,
            "text": "Look to your conduct and weigh the favorable signs. When everything is fulfilled, supreme good fortune comes.",
            "interpretation": "Reflect on your actions and their results. Fulfillment and supreme good fortune follow."
          }
        ]
      },
      {
        "id": 11,
        "name": "Peace",
        "chinese_name": "泰 (Tài)",
        "representation": "111000",
        "overall_meaning": "Peace signifies harmony, prosperity, and the natural order. It represents a time of balance and flourishing.",
        "advice": "Embrace harmony and balance. Foster peace and prosperity in your environment.",
        "keywords": ["harmony", "prosperity", "balance", "flourishing"],
        "creative_description": "As heaven and earth unite, peace brings forth a time of flourishing and natural order.",
        "lines": [
          {
            "line_number": 1,
            "text": "When ribbon grass is pulled up, the sod comes with it. Each according to his kind. Undertakings bring good fortune.",
            "interpretation": "Actions have far-reaching effects. Unified efforts lead to success."
          },
          {
            "line_number": 2,
            "text": "Bearing with the uncultured in gentleness, forgoing evil and strength. Good fortune.",
            "interpretation": "Gentleness and tolerance bring good fortune. Forgo harshness and embrace kindness."
          },
          {
            "line_number": 3,
            "text": "No plain not followed by a slope. No going not followed by a return. He who remains persevering in danger is without blame. Do not complain about this truth; enjoy the good fortune you still possess.",
            "interpretation": "Understand the cyclical nature of life. Persevere through dangers and appreciate existing good fortune."
          },
          {
            "line_number": 4,
            "text": "He flutters down, not boasting of his wealth, together with his neighbor, guileless and sincere.",
            "interpretation": "Humility and sincerity in relationships bring harmony and mutual prosperity."
          },
          {
            "line_number": 5,
            "text": "The sovereign I gives his daughter in marriage. This brings blessing and supreme good fortune.",
            "interpretation": "Generosity and fostering alliances lead to supreme good fortune and blessings."
          },
          {
            "line_number": 6,
            "text": "The wall falls back into the moat. Use no army now. Make your commands known within your own town. Perseverance brings humiliation.",
            "interpretation": "Internal issues require internal solutions. Avoid external force and maintain integrity."
          }
        ]
      },
      {
          "id": 12,
          "name": "Standstill (Stagnation)",
          "chinese_name": "否 (Pǐ)",
          "representation": "000111",
          "overall_meaning": "Standstill signifies a period of stagnation and obstruction, where progress is halted and difficulties prevail.",
          "advice": "Remain patient and avoid forcing progress. Use this time for reflection and preparation for future actions.",
          "keywords": ["stagnation", "obstruction", "patience", "preparation"],
          "creative_description": "As heaven and earth are out of harmony, stagnation sets in, halting progress and creating obstacles.",
          "lines": [
            {
              "line_number": 1,
              "text": "Pushing upward out of the darkness and in harmony with the light. This means great good fortune.",
              "interpretation": "Even in difficult times, strive to align with positive influences and make gradual progress."
            },
            {
              "line_number": 2,
              "text": "They bear and endure; this means good fortune for inferior people. The standstill serves to perfect the great man.",
              "interpretation": "Patience and endurance during stagnation foster growth and development."
            },
            {
              "line_number": 3,
              "text": "They bear shame.",
              "interpretation": "Acknowledging and learning from failures or missteps is crucial during periods of standstill."
            },
            {
              "line_number": 4,
              "text": "They climb the heights and hide their chariots. No blame.",
              "interpretation": "Retreating and conserving resources during difficulties prevents further harm."
            },
            {
              "line_number": 5,
              "text": "Standstill comes and goes. This is how heaven and earth act together. Good fortune for the great man.",
              "interpretation": "Understanding that stagnation is a natural phase helps in navigating through it wisely."
            },
            {
              "line_number": 6,
              "text": "The standstill comes to an end. First standstill, then good fortune.",
              "interpretation": "After a period of stagnation, positive change will eventually come. Patience leads to good fortune."
            }
          ]
        },
        {
          "id": 13,
          "name": "Fellowship with Men",
          "chinese_name": "同人 (Tóng Rén)",
          "representation": "111010",
          "overall_meaning": "Fellowship with Men emphasizes the importance of unity, collaboration, and harmonious relationships.",
          "advice": "Seek unity and cooperation with others. Foster harmonious relationships for collective success.",
          "keywords": ["unity", "collaboration", "harmony", "relationships"],
          "creative_description": "As fire ascends into the sky, fellowship and unity among people create a strong and harmonious community.",
          "lines": [
            {
              "line_number": 1,
              "text": "Fellowship with men at the gate. No blame.",
              "interpretation": "Initiating relationships and seeking common ground with others brings no harm."
            },
            {
              "line_number": 2,
              "text": "Fellowship with men in the clan. Humiliation.",
              "interpretation": "Favoring close associations over broader relationships may lead to partiality and conflict."
            },
            {
              "line_number": 3,
              "text": "He hides weapons in the thicket; he climbs the high hill in front of it. For three years, he does not rise.",
              "interpretation": "Caution and preparation are necessary to avoid conflicts and misunderstandings."
            },
            {
              "line_number": 4,
              "text": "He climbs up on his wall; he cannot attack. Good fortune.",
              "interpretation": "Taking a higher perspective and avoiding unnecessary confrontations lead to good outcomes."
            },
            {
              "line_number": 5,
              "text": "Men bound in fellowship first weep and lament, but afterward they laugh. After great struggles, they succeed.",
              "interpretation": "Unity and collaboration, even through hardships, ultimately lead to joy and success."
            },
            {
              "line_number": 6,
              "text": "Fellowship with men in the meadow. No remorse.",
              "interpretation": "Joining forces with like-minded individuals in a peaceful environment brings satisfaction."
            }
          ]
        },
        {
          "id": 14,
          "name": "Possession in Great Measure",
          "chinese_name": "大有 (Dà Yǒu)",
          "representation": "111100",
          "overall_meaning": "Possession in Great Measure signifies abundance, prosperity, and the responsible management of resources.",
          "advice": "Manage resources wisely and share prosperity with others. Responsible stewardship ensures lasting success.",
          "keywords": ["abundance", "prosperity", "management", "stewardship"],
          "creative_description": "As the sun shines brightly at its zenith, great abundance and prosperity are achieved through wise management and generosity.",
          "lines": [
            {
              "line_number": 1,
              "text": "No relationship with what is harmful; there is no blame in this. If one remains conscious of difficulty, one remains without blame.",
              "interpretation": "Avoid harmful associations and remain vigilant to ensure continued success."
            },
            {
              "line_number": 2,
              "text": "A big wagon for loading. One may undertake something. No blame.",
              "interpretation": "Preparedness and capability allow for successful undertakings without fault."
            },
            {
              "line_number": 3,
              "text": "A prince offers it to the Son of Heaven. A petty man cannot do this.",
              "interpretation": "Generosity and noble actions are required for greatness, beyond the capacity of petty individuals."
            },
            {
              "line_number": 4,
              "text": "He makes a difference between himself and his neighbor. No blame.",
              "interpretation": "Distinguishing oneself from others through virtuous actions brings no harm."
            },
            {
              "line_number": 5,
              "text": "He who is blessed by heaven brings good fortune. Nothing that does not further.",
              "interpretation": "Those favored by fortune achieve success in all endeavors."
            },
            {
              "line_number": 6,
              "text": "He is modest and unassuming in virtue. A great river. Good fortune.",
              "interpretation": "Modesty and humility in abundance lead to lasting good fortune."
            }
          ]
        },
        {
          "id": 15,
          "name": "Modesty",
          "chinese_name": "謙 (Qiān)",
          "representation": "010001",
          "overall_meaning": "Modesty represents humility and the strength that comes from recognizing and embracing one's limitations.",
          "advice": "Practice humility and modesty in all actions. Recognize your limitations and seek continuous improvement.",
          "keywords": ["humility", "strength", "limitations", "improvement"],
          "creative_description": "As mountains rise from the earth, modesty elevates one’s character, allowing for growth and strength.",
          "lines": [
            {
              "line_number": 1,
              "text": "Modesty creates success. The superior person carries things through.",
              "interpretation": "Humility leads to success, and the wise person completes tasks with modesty."
            },
            {
              "line_number": 2,
              "text": "Modesty that comes to expression. Perseverance brings good fortune.",
              "interpretation": "Expressing humility through consistent actions leads to good fortune."
            },
            {
              "line_number": 3,
              "text": "A superior person of modesty and merit carries things to conclusion. Good fortune.",
              "interpretation": "Modesty combined with merit ensures successful outcomes."
            },
            {
              "line_number": 4,
              "text": "Nothing that would not further modesty in movement.",
              "interpretation": "All actions should be guided by humility for positive results."
            },
            {
              "line_number": 5,
              "text": "No boasting of wealth before one's neighbor. It is favorable to attack with force. Nothing that would not further.",
              "interpretation": "Avoiding arrogance and maintaining modesty in all actions ensures favorable outcomes."
            },
            {
              "line_number": 6,
              "text": "Modesty that comes to expression. It is favorable to set armies marching to chastise one's own city and one's country.",
              "interpretation": "Expressing humility while addressing internal issues leads to harmony and order."
            }
          ]
        },
        {
          "id": 16,
          "name": "Enthusiasm",
          "chinese_name": "豫 (Yù)",
          "representation": "100100",
          "overall_meaning": "Enthusiasm signifies a time of excitement and energy, driving progress and the pursuit of goals.",
          "advice": "Harness your enthusiasm to drive progress, but remain grounded and aware of your surroundings.",
          "keywords": ["excitement", "energy", "progress", "pursuit"],
          "creative_description": "Like thunder and lightning, enthusiasm brings a surge of energy and excitement, propelling forward momentum.",
          "lines": [
            {
              "line_number": 1,
              "text": "Enthusiasm that expresses itself brings misfortune.",
              "interpretation": "Excessive excitement can lead to recklessness. Stay balanced."
            },
            {
              "line_number": 2,
              "text": "Firm as a rock. Not a whole day. Perseverance brings good fortune.",
              "interpretation": "Steadfastness and perseverance through short-term challenges lead to success."
            },
            {
              "line_number": 3,
              "text": "Enthusiasm that looks upward creates remorse. Hesitation brings remorse.",
              "interpretation": "Aimless excitement and indecision lead to regret. Focus your energy wisely."
            },
            {
              "line_number": 4,
              "text": "The source of enthusiasm. He achieves great things. Doubt not. You gather friends around you as a hair clasp gathers the hair.",
              "interpretation": "Centered enthusiasm attracts support and leads to great achievements."
            },
            {
              "line_number": 5,
              "text": "Persistently ill, and still does not die.",
              "interpretation": "Endurance and resilience in the face of prolonged challenges ensure survival."
            },
            {
              "line_number": 6,
              "text": "Deluded enthusiasm. But if after completion one changes, there is no blame.",
              "interpretation": "Correct misguided excitement through reflection and adaptation."
            }
          ]
        },
        {
          "id": 17,
          "name": "Following",
          "chinese_name": "隨 (Suí)",
          "representation": "011100",
          "overall_meaning": "Following signifies the importance of adaptability and responsiveness to circumstances and guidance.",
          "advice": "Be adaptable and responsive. Follow wise guidance and be open to change.",
          "keywords": ["adaptability", "responsiveness", "guidance", "change"],
          "creative_description": "As the wind follows the path of the sky, following emphasizes the importance of adaptability and responsiveness to the environment.",
          "lines": [
            {
              "line_number": 1,
              "text": "The standard is changing. Perseverance brings good fortune. To go out of the door in company produces deeds.",
              "interpretation": "Adaptability and collaboration in changing circumstances lead to successful outcomes."
            },
            {
              "line_number": 2,
              "text": "If one clings to the little boy, one loses the strong man.",
              "interpretation": "Clinging to immature ideas or behaviors prevents growth and success."
            },
            {
              "line_number": 3,
              "text": "Following creates success. Perseverance brings misfortune. To go one's way with sincerity brings clarity. How could there be blame in this?",
              "interpretation": "True following requires sincerity and clarity. Persevere with integrity to avoid misfortune."
            },
            {
              "line_number": 4,
              "text": "Following creates success. No blame.",
              "interpretation": "Following wise guidance and adapting to circumstances lead to success without fault."
            },
            {
              "line_number": 5,
              "text": "Sincere in the good. Good fortune.",
              "interpretation": "Genuine adherence to positive principles brings good fortune."
            },
            {
              "line_number": 6,
              "text": "He meets with firm allegiance and is still further bound. The king introduces him to the Western Mountain.",
              "interpretation": "Strong loyalty and commitment to a higher purpose are rewarded with honor and recognition."
            }
          ]
        },
        {
          "id": 18,
          "name": "Work on the Decayed",
          "chinese_name": "蠱 (Gǔ)",
          "representation": "100011",
          "overall_meaning": "Work on the Decayed signifies the need to address decay and corruption, restoring order and integrity.",
          "advice": "Address decay and corruption directly. Restore order and integrity through diligent effort.",
          "keywords": ["restoration", "integrity", "effort", "order"],
          "creative_description": "As the wind sweeps away decay, diligent effort is required to restore order and integrity.",
          "lines": [
            {
              "line_number": 1,
              "text": "Setting right what has been spoiled by the father. If there is a son, no blame rests upon the departed father. Danger. In the end, good fortune.",
              "interpretation": "Correcting past mistakes with responsibility ensures eventual good fortune."
            },
            {
              "line_number": 2,
              "text": "Setting right what has been spoiled by the mother. One must not be too persevering.",
              "interpretation": "Gentle correction of past errors brings positive change without harshness."
            },
            {
              "line_number": 3,
              "text": "Setting right what has been spoiled by the father. There will be a little remorse. No great blame.",
              "interpretation": "Acknowledging and rectifying inherited flaws brings minor regrets but no major faults."
            },
            {
              "line_number": 4,
              "text": "Tolerating what has been spoiled by the father. In continuing, no blame.",
              "interpretation": "Enduring past errors with patience and persistence avoids blame."
            },
            {
              "line_number": 5,
              "text": "Setting right what has been spoiled by the father. One meets with praise.",
              "interpretation": "Correcting inherited mistakes is praiseworthy and brings respect."
            },
            {
              "line_number": 6,
              "text": "He does not serve kings and princes, sets higher goals himself.",
              "interpretation": "Focusing on higher principles and self-improvement rather than seeking external approval."
            }
          ]
      },          
        {
          "id": 19,
          "name": "Approach",
          "chinese_name": "臨 (Lín)",
          "representation": "011110",
          "overall_meaning": "Approach signifies a time of coming together and mutual influence, bringing about new opportunities and growth.",
          "advice": "Welcome new opportunities and relationships. Mutual influence leads to growth and success.",
          "keywords": ["opportunities", "relationships", "growth", "mutual influence"],
          "creative_description": "As the earth rises to meet the heavens, approach emphasizes the power of mutual influence and the creation of new opportunities.",
          "lines": [
            {
              "line_number": 1,
              "text": "Joint approach. Perseverance brings good fortune.",
              "interpretation": "Collaborative efforts and perseverance lead to successful outcomes."
            },
            {
              "line_number": 2,
              "text": "Joint approach. Good fortune. Everything acts to further.",
              "interpretation": "Working together harmoniously brings good fortune and progress."
            },
            {
              "line_number": 3,
              "text": "Comfortable approach. Nothing that would further. If one is induced to grieve over it, one becomes free of blame.",
              "interpretation": "Being at ease with approaching opportunities. Avoid complacency to remain blameless."
            },
            {
              "line_number": 4,
              "text": "Complete approach. No blame.",
              "interpretation": "Wholehearted acceptance and engagement with opportunities lead to blameless success."
            },
            {
              "line_number": 5,
              "text": "Wise approach. This is right for a great prince. Good fortune.",
              "interpretation": "Approaching situations with wisdom and discernment leads to success."
            },
            {
              "line_number": 6,
              "text": "Approach with sincerity and kindness. Good fortune.",
              "interpretation": "Sincere and kind interactions in new opportunities bring good fortune."
            }
          ]
        },
        {
          "id": 20,
          "name": "Contemplation (View)",
          "chinese_name": "觀 (Guān)",
          "representation": "011000",
          "overall_meaning": "Contemplation signifies a time of observation and reflection, emphasizing the importance of gaining insight and understanding.",
          "advice": "Take time to observe and reflect. Understanding comes from careful contemplation.",
          "keywords": ["observation", "reflection", "insight", "understanding"],
          "creative_description": "As the wind moves over the earth, contemplation involves observing the world carefully to gain deeper insights.",
          "lines": [
            {
              "line_number": 1,
              "text": "Boy-like contemplation. For an inferior man, no blame. For a superior man, humiliation.",
              "interpretation": "Naive or shallow observation is acceptable for the inexperienced but is shameful for those who should know better."
            },
            {
              "line_number": 2,
              "text": "Contemplation through the crack of the door. Furthering for the perseverance of a woman.",
              "interpretation": "Limited perspective can still be beneficial if one remains patient and persistent."
            },
            {
              "line_number": 3,
              "text": "Contemplation of my life decides the choice between advance and retreat.",
              "interpretation": "Self-reflection guides decisions on whether to move forward or withdraw."
            },
            {
              "line_number": 4,
              "text": "Contemplation of the light of the kingdom. It furthers one to exert influence as the guest of a king.",
              "interpretation": "Understanding the broader situation enables one to exert a positive influence."
            },
            {
              "line_number": 5,
              "text": "Contemplation of my life. The superior man is without blame.",
              "interpretation": "Deep self-reflection leads to a blameless and wise life."
            },
            {
              "line_number": 6,
              "text": "Contemplation of his life. The superior man is without blame.",
              "interpretation": "Persistent self-reflection and awareness ensure a life free from blame."
            }
          ]
        },                
        {
          "id": 21,
          "name": "Biting Through",
          "chinese_name": "噬嗑 (Shì Kè)",
          "representation": "100101",
          "overall_meaning": "Biting Through signifies the necessity of decisive action to overcome obstacles and resolve conflicts.",
          "advice": "Take decisive action to overcome obstacles. Address conflicts directly to resolve them.",
          "keywords": ["decisive action", "overcoming obstacles", "resolution", "conflict"],
          "creative_description": "As a powerful force bites through tough material, decisive actions break through obstacles and resolve conflicts.",
          "lines": [
            {
              "line_number": 1,
              "text": "His feet are fastened in the stocks, so that his toes disappear. No blame.",
              "interpretation": "Initial restraint is necessary. Endure minor constraints to avoid greater harm."
            },
            {
              "line_number": 2,
              "text": "Bites through tender meat, so that his nose disappears. No blame.",
              "interpretation": "Acting decisively and firmly, even if it causes some discomfort, is necessary for resolution."
            },
            {
              "line_number": 3,
              "text": "Bites on old dried meat and strikes on something poisonous. Slight humiliation. No blame.",
              "interpretation": "Facing tough challenges and unpleasant truths may cause discomfort, but it is necessary."
            },
            {
              "line_number": 4,
              "text": "Bites on dried gristly meat. Receives metal arrows. It furthers one to be mindful of difficulties and be persevering. Good fortune.",
              "interpretation": "Persevere through tough challenges. Awareness and persistence lead to success."
            },
            {
              "line_number": 5,
              "text": "Bites on dried lean meat. Receives yellow gold. Perseveringly aware of danger. No blame.",
              "interpretation": "Endure and remain vigilant in difficult situations. Reward comes with caution and persistence."
            },
            {
              "line_number": 6,
              "text": "His neck is fastened in the wooden cangue, so that his ears disappear. Misfortune.",
              "interpretation": "Excessive restraint and lack of freedom lead to severe consequences and misfortune."
            }
          ]
        },        
        {
          "id": 22,
          "name": "Grace",
          "chinese_name": "賁 (Bì)",
          "representation": "100011",
          "overall_meaning": "Grace signifies beauty and elegance, emphasizing the importance of harmonious and aesthetically pleasing actions.",
          "advice": "Act with grace and elegance. Seek harmony and beauty in your actions and surroundings.",
          "keywords": ["beauty", "elegance", "harmony", "aesthetics"],
          "creative_description": "As the mountain displays its graceful form, grace involves creating harmony and beauty in all actions.",
          "lines": [
            {
              "line_number": 1,
              "text": "He lends grace to his toes, leaves the carriage, and walks.",
              "interpretation": "Simplify and approach tasks with elegance and humility."
            },
            {
              "line_number": 2,
              "text": "Lends grace to the beard on his chin.",
              "interpretation": "Small acts of grace and refinement enhance overall dignity."
            },
            {
              "line_number": 3,
              "text": "Graceful and moist. Constant perseverance brings good fortune.",
              "interpretation": "Consistent grace and refinement in actions lead to lasting success."
            },
            {
              "line_number": 4,
              "text": "Grace or simplicity? A white horse comes as if on wings. He is not a robber; he will woo at the right time.",
              "interpretation": "Choose simplicity over excessive refinement. Timing and sincerity matter."
            },
            {
              "line_number": 5,
              "text": "Grace in hills and gardens. The roll of silk is meager and small. Humiliation, but in the end, good fortune.",
              "interpretation": "Moderation and humility in the pursuit of beauty lead to eventual success."
            },
            {
              "line_number": 6,
              "text": "Simple grace. No blame.",
              "interpretation": "Simplicity and natural grace in actions bring no fault."
            }
          ]
        },
        {
          "id": 23,
          "name": "Splitting Apart",
          "chinese_name": "剝 (Bō)",
          "representation": "111000",
          "overall_meaning": "Splitting Apart signifies a period of decay and disintegration, where separation and decline are inevitable.",
          "advice": "Accept the process of disintegration and prepare for renewal. Let go of what no longer serves you.",
          "keywords": ["decay", "disintegration", "separation", "renewal"],
          "creative_description": "As the mountain crumbles into the earth, splitting apart signifies the natural process of decay and the opportunity for renewal.",
          "lines": [
            {
              "line_number": 1,
              "text": "The leg of the bed is split. Those who persevere are destroyed. Misfortune.",
              "interpretation": "Clinging to what is decaying leads to destruction. Let go of what no longer serves."
            },
            {
              "line_number": 2,
              "text": "The bed is split at the edge. Those who persevere are destroyed. Misfortune.",
              "interpretation": "Partial decay is a warning. Continued attachment leads to greater loss."
            },
            {
              "line_number": 3,
              "text": "He splits with them. No blame.",
              "interpretation": "Separation from what is decaying is necessary and blameless."
            },
            {
              "line_number": 4,
              "text": "The bed is split up to the skin. Misfortune.",
              "interpretation": "Ignoring decay until it affects the core leads to severe consequences."
            },
            {
              "line_number": 5,
              "text": "A shoal of fishes. Favor comes through the court ladies. Everything acts to further.",
              "interpretation": "Support and assistance from allies lead to favorable outcomes."
            },
            {
              "line_number": 6,
              "text": "There is a large fruit still uneaten. The superior man receives a carriage. The house of the inferior man is split apart.",
              "interpretation": "Holding on to valuable resources leads to recognition and reward, while neglect leads to downfall."
            }
          ]
        },
        {
          "id": 24,
          "name": "Return (The Turning Point)",
          "chinese_name": "復 (Fù)",
          "representation": "000100",
          "overall_meaning": "Return signifies a time of renewal and revival, where the old gives way to the new, and the cycle of life continues.",
          "advice": "Embrace renewal and new beginnings. Trust in the natural cycles of life.",
          "keywords": ["renewal", "revival", "new beginnings", "cycles"],
          "creative_description": "As the winter solstice marks the return of light, return signifies the turning point towards renewal and revival.",
          "lines": [
            {
              "line_number": 1,
              "text": "Return from a short distance. No need for remorse. Great good fortune.",
              "interpretation": "Small corrections and adjustments lead to great fortune."
            },
            {
              "line_number": 2,
              "text": "Return from a distance. It furthers one to have something to say.",
              "interpretation": "Expressing one's thoughts and intentions aids in the process of renewal."
            },
            {
              "line_number": 3,
              "text": "Repeated return. Danger. No blame.",
              "interpretation": "Frequent reversals indicate instability, but no blame if recognized and addressed."
            },
            {
              "line_number": 4,
              "text": "Walking in the midst of others, one returns alone.",
              "interpretation": "Individual paths and decisions are necessary for true renewal."
            },
            {
              "line_number": 5,
              "text": "Noble-hearted return. No remorse.",
              "interpretation": "A sincere and noble approach to renewal brings peace and eliminates regret."
            },
            {
              "line_number": 6,
              "text": "Missing the return. Misfortune. Misfortune from within and without. If armies are set marching in this way, one will suffer a great defeat, disastrous for the ruler of the country. For ten years it will not be possible to attack again.",
              "interpretation": "Ignoring the opportunity for renewal leads to misfortune and long-term setbacks."
            }
          ]
      },
      {
          "id": 25,
          "name": "Innocence (The Unexpected)",
          "chinese_name": "無妄 (Wú Wàng)",
          "representation": "111001",
          "overall_meaning": "Innocence signifies a state of natural and spontaneous action that is free from ulterior motives, resulting in harmony with the natural order.",
          "advice": "Act with sincerity and purity of intention. Trust in the natural flow and avoid overthinking.",
          "keywords": ["innocence", "spontaneity", "sincerity", "natural order"],
          "creative_description": "Like the purity of a clear sky, innocence and sincerity align one's actions with the natural order, bringing unexpected good fortune.",
          "lines": [
            {
              "line_number": 1,
              "text": "Innocent behavior brings good fortune.",
              "interpretation": "Acting with purity and sincerity leads to positive outcomes."
            },
            {
              "line_number": 2,
              "text": "If one does not count on the harvest while plowing, nor on the use of the ground while clearing it, it furthers one to undertake something.",
              "interpretation": "Focus on the present effort rather than the results, and success will follow naturally."
            },
            {
              "line_number": 3,
              "text": "Undeserved misfortune. The cow that was tethered by someone is the wanderer's gain, the citizen's loss.",
              "interpretation": "Misfortune may arise from external factors, but it can lead to unexpected benefits."
            },
            {
              "line_number": 4,
              "text": "He who can be persevering remains without blame.",
              "interpretation": "Consistency and perseverance in one's actions maintain one's integrity."
            },
            {
              "line_number": 5,
              "text": "Use no medicine in an illness that is incurable. It furthers one to be persevering.",
              "interpretation": "Incurable situations should be accepted. Perseverance in such times is beneficial."
            },
            {
              "line_number": 6,
              "text": "Innocent action brings misfortune. Nothing furthers.",
              "interpretation": "Actions lacking in forethought and awareness can lead to misfortune. Be mindful."
            }
          ]
        },
        {
          "id": 26,
          "name": "The Taming Power of the Great",
          "chinese_name": "大畜 (Dà Chù)",
          "representation": "111100",
          "overall_meaning": "The Taming Power of the Great signifies the accumulation of inner strength and wisdom, and the ability to overcome obstacles through patience and perseverance.",
          "advice": "Cultivate inner strength and patience. Use accumulated wisdom to navigate obstacles and challenges.",
          "keywords": ["inner strength", "patience", "wisdom", "perseverance"],
          "creative_description": "Like a mountain that holds firm, the taming power of the great emphasizes inner strength and perseverance to overcome challenges.",
          "lines": [
            {
              "line_number": 1,
              "text": "Danger is at hand. It furthers one to desist.",
              "interpretation": "Recognize potential danger and avoid unnecessary risks. Pause and reassess."
            },
            {
              "line_number": 2,
              "text": "The axletrees are taken from the wagon.",
              "interpretation": "Remove key components to prevent movement and avoid danger. Pause action temporarily."
            },
            {
              "line_number": 3,
              "text": "A good horse that follows others. Awareness of danger, with perseverance, brings good fortune.",
              "interpretation": "Follow wise guidance and remain alert. Perseverance leads to positive outcomes."
            },
            {
              "line_number": 4,
              "text": "The headboard of a young bull. Great good fortune.",
              "interpretation": "Guidance and control lead to successful development and great fortune."
            },
            {
              "line_number": 5,
              "text": "The tusk of a gelded boar. Good fortune.",
              "interpretation": "Strength and power, when properly channeled, bring good fortune."
            },
            {
              "line_number": 6,
              "text": "One attains the way of heaven. Success.",
              "interpretation": "Aligning with higher principles and wisdom ensures success."
            }
          ]
      }, 
      {
          "id": 27,
          "name": "The Corners of the Mouth (Providing Nourishment)",
          "chinese_name": "頤 (Yí)",
          "representation": "100100",
          "overall_meaning": "The Corners of the Mouth signifies the importance of proper nourishment and care, both physically and spiritually. It emphasizes the need to be mindful of what we take in and how we sustain ourselves.",
          "advice": "Pay attention to both physical and spiritual nourishment. Be mindful of what you consume and how it affects your well-being.",
          "keywords": ["nourishment", "care", "mindfulness", "well-being"],
          "creative_description": "As the corners of the mouth guide nourishment into the body, this hexagram highlights the importance of mindful intake and sustenance.",
          "lines": [
            {
              "line_number": 1,
              "text": "You let your magic tortoise go, and look at me with the corners of your mouth drooping. Misfortune.",
              "interpretation": "Neglecting one's own resources and relying on others leads to misfortune. Take responsibility for your own nourishment."
            },
            {
              "line_number": 2,
              "text": "Turning to the summit for nourishment, deviating from the path to seek nourishment from the hill. Continuing this way brings good fortune.",
              "interpretation": "Seeking nourishment from higher and better sources leads to good fortune. Aim high and stay on the right path."
            },
            {
              "line_number": 3,
              "text": "Turning away from nourishment. Perseverance brings misfortune. Do not act in this way for ten years. Nothing serves to further.",
              "interpretation": "Ignoring proper nourishment and care leads to long-term misfortune. Be consistent in maintaining your well-being."
            },
            {
              "line_number": 4,
              "text": "Turning to the summit for provision of nourishment brings good fortune. Spying about with sharp eyes like a tiger with insatiable craving. No blame.",
              "interpretation": "Seeking the best nourishment and being vigilant brings good fortune. Stay alert and focused."
            },
            {
              "line_number": 5,
              "text": "Turning away from the path. To remain persevering brings good fortune. One should not cross the great water.",
              "interpretation": "Remaining committed to proper nourishment and not taking unnecessary risks leads to good fortune."
            },
            {
              "line_number": 6,
              "text": "The source of nourishment. Awareness of danger brings good fortune. It furthers one to cross the great water.",
              "interpretation": "Understanding the importance of nourishment and recognizing potential dangers leads to good fortune. Taking calculated risks can be beneficial."
            }
          ]
        },
        {
          "id": 28,
          "name": "Preponderance of the Great",
          "chinese_name": "大過 (Dà Guò)",
          "representation": "011110",
          "overall_meaning": "Preponderance of the Great signifies a situation where extraordinary effort is required to address an overwhelming challenge. It emphasizes the need for decisive and strong action.",
          "advice": "Take decisive action and put in extraordinary effort to overcome significant challenges. Be mindful of potential risks.",
          "keywords": ["extraordinary effort", "decisive action", "challenges", "risks"],
          "creative_description": "Like a beam that must bear a heavy load, the preponderance of the great requires strength and decisive action to support and balance the situation.",
          "lines": [
            {
              "line_number": 1,
              "text": "The leg of the bed is split. Those who persevere are destroyed. Misfortune.",
              "interpretation": "Initial instability indicates potential danger. Correct the imbalance early to avoid further harm."
            },
            {
              "line_number": 2,
              "text": "The beam is sagging. Good fortune if one perseveres.",
              "interpretation": "Recognize the strain and take corrective action to restore balance. Perseverance brings good fortune."
            },
            {
              "line_number": 3,
              "text": "The ridgepole sags to the breaking point. Misfortune.",
              "interpretation": "Excessive strain leads to collapse. Avoid pushing beyond the breaking point."
            },
            {
              "line_number": 4,
              "text": "The ridgepole is braced. Good fortune. If there are ulterior motives, it is humiliating.",
              "interpretation": "Strengthen and support the structure. Sincere actions lead to good fortune, but hidden agendas cause shame."
            },
            {
              "line_number": 5,
              "text": "A withered poplar puts forth flowers. An older woman takes a husband. No blame. No praise.",
              "interpretation": "Unexpected renewal is possible, but may not bring significant recognition or blame."
            },
            {
              "line_number": 6,
              "text": "One must go through the water. It goes over one's head. Misfortune. No blame.",
              "interpretation": "Facing overwhelming challenges may lead to temporary misfortune. Acceptance without self-blame is necessary."
            }
          ]
        },    
        {
          "id": 29,
          "name": "The Abysmal (Water)",
          "chinese_name": "坎 (Kǎn)",
          "representation": "010010",
          "overall_meaning": "The Abysmal signifies a time of danger and difficulty, where perseverance and adaptability are essential for overcoming challenges.",
          "advice": "Remain steadfast and adaptable in the face of danger. Perseverance and inner strength will see you through difficulties.",
          "keywords": ["danger", "difficulty", "perseverance", "adaptability"],
          "creative_description": "Like water that flows through deep and dangerous gorges, The Abysmal emphasizes the need for perseverance and adaptability to navigate through challenges.",
          "lines": [
            {
              "line_number": 1,
              "text": "Repetition of the Abysmal. In the abyss one falls into a pit. Misfortune.",
              "interpretation": "Repeated dangers require careful navigation. Avoid falling deeper into trouble."
            },
            {
              "line_number": 2,
              "text": "The abyss is dangerous. One should strive to attain small things only.",
              "interpretation": "Focus on small, achievable goals to safely navigate through difficulties."
            },
            {
              "line_number": 3,
              "text": "Forward and backward, abyss on abyss. In danger like this, pause at first and wait, otherwise you will fall into a pit in the abyss. Do not act in this way.",
              "interpretation": "When surrounded by danger, pause and assess before moving forward to avoid deeper trouble."
            },
            {
              "line_number": 4,
              "text": "A jug of wine, a bowl of rice with it, earthen vessels simply handed in through the window. There is certainly no blame in this.",
              "interpretation": "Simple and sincere efforts are blameless and can provide relief even in difficult times."
            },
            {
              "line_number": 5,
              "text": "The abyss is not filled to overflowing, it is filled only to the rim. No blame.",
              "interpretation": "Maintain balance and do not overextend in dangerous situations to avoid negative consequences."
            },
            {
              "line_number": 6,
              "text": "Bound with cords and ropes, shut in between thorn-hedged prison walls. For three years one does not find the way. Misfortune.",
              "interpretation": "Severe restrictions and prolonged confinement lead to significant misfortune. Seek to avoid such entrapments."
            }
          ]
        },
        {
          "id": 30,
          "name": "The Clinging, Fire",
          "chinese_name": "離 (Lí)",
          "representation": "101101",
          "overall_meaning": "The Clinging signifies the importance of clarity and awareness, and the need to adhere to what is bright and enlightening.",
          "advice": "Seek clarity and maintain awareness. Adhere to enlightening principles and stay true to what illuminates your path.",
          "keywords": ["clarity", "awareness", "illumination", "adherence"],
          "creative_description": "Like fire that clings to its source, The Clinging emphasizes the need for clarity, awareness, and adherence to enlightening principles.",
          "lines": [
            {
              "line_number": 1,
              "text": "The footprints run crisscross. If one is seriously intent, no blame.",
              "interpretation": "Initial confusion can be overcome with serious intent and focus."
            },
            {
              "line_number": 2,
              "text": "Yellow light. Supreme good fortune.",
              "interpretation": "Clarity and wisdom, symbolized by the yellow light, bring supreme good fortune."
            },
            {
              "line_number": 3,
              "text": "In the light of the setting sun, men either beat the pot and sing or loudly bewail the approach of old age. Misfortune.",
              "interpretation": "Neglecting responsibilities and indulging in distractions during times of decline leads to misfortune."
            },
            {
              "line_number": 4,
              "text": "Its coming is sudden; it flames up, dies down, is thrown away.",
              "interpretation": "Sudden and intense actions without sustained effort lead to failure."
            },
            {
              "line_number": 5,
              "text": "Tears in floods, sighing and lamenting. Good fortune.",
              "interpretation": "Emotional release and genuine expressions of grief lead to eventual good fortune."
            },
            {
              "line_number": 6,
              "text": "The king uses him to march forth and chastise. Then it is best to kill the leaders and take captive the followers. No blame.",
              "interpretation": "Decisive and just actions to address wrongdoing lead to success and stability."
            }
          ]
        },      
        {
          "id": 31,
          "name": "Influence (Wooing)",
          "chinese_name": "咸 (Xián)",
          "representation": "011100",
          "overall_meaning": "Influence signifies the importance of mutual attraction and responsiveness. It emphasizes the power of gentle persuasion and emotional resonance.",
          "advice": "Cultivate mutual attraction and responsiveness. Use gentle persuasion and emotional resonance to influence situations positively.",
          "keywords": ["mutual attraction", "responsiveness", "persuasion", "emotional resonance"],
          "creative_description": "Like the gentle wind that influences the lake, this hexagram emphasizes the power of attraction and the importance of emotional connection and responsiveness.",
          "lines": [
            {
              "line_number": 1,
              "text": "The influence shows itself in the big toe.",
              "interpretation": "Initial influence is small and subtle. Recognize and nurture it."
            },
            {
              "line_number": 2,
              "text": "The influence shows itself in the calves of the legs. Misfortune. Tarrying brings good fortune.",
              "interpretation": "Rushing into action without proper thought leads to misfortune. Patience brings better outcomes."
            },
            {
              "line_number": 3,
              "text": "The influence shows itself in the thighs. Holds to that which follows it. To continue is humiliating.",
              "interpretation": "Desires and attractions may lead to compromising positions. Reflect before continuing."
            },
            {
              "line_number": 4,
              "text": "Perseverance brings good fortune. Remorse disappears. If a man is agitated in mind, and his thoughts go hither and thither, only those friends on whom he fixes his conscious thoughts will follow.",
              "interpretation": "Steadfastness and clear focus bring good fortune. Inner calm attracts true allies."
            },
            {
              "line_number": 5,
              "text": "The influence shows itself in the back of the neck. No remorse.",
              "interpretation": "True influence comes from inner strength and self-assurance, not force."
            },
            {
              "line_number": 6,
              "text": "The influence shows itself in the jaws, cheeks, and tongue.",
              "interpretation": "Expressing influence through communication and speech. Be mindful of your words."
            }
          ]
        },
        {
          "id": 32,
          "name": "Duration",
          "chinese_name": "恆 (Héng)",
          "representation": "111101",
          "overall_meaning": "Duration signifies the importance of perseverance and constancy. It emphasizes the value of long-term commitment and enduring principles.",
          "advice": "Remain steadfast and committed to your principles. Perseverance and constancy lead to lasting success.",
          "keywords": ["perseverance", "constancy", "commitment", "endurance"],
          "creative_description": "Like the unchanging nature of heaven and earth, Duration emphasizes the need for perseverance and constancy to achieve lasting success.",
          "lines": [
            {
              "line_number": 1,
              "text": "Seeking duration too hastily brings misfortune persistently. Nothing that would further.",
              "interpretation": "Rushing into commitments leads to persistent misfortune. Take time to build a solid foundation."
            },
            {
              "line_number": 2,
              "text": "Remorse disappears.",
              "interpretation": "Steadfastness and patience remove any regret and bring stability."
            },
            {
              "line_number": 3,
              "text": "He who does not give duration to his character meets with disgrace. Persistent humiliation.",
              "interpretation": "Lack of consistency and integrity in one's character leads to disgrace and ongoing shame."
            },
            {
              "line_number": 4,
              "text": "No game in the field.",
              "interpretation": "A lack of resources or opportunities requires patience and perseverance."
            },
            {
              "line_number": 5,
              "text": "Giving duration to one's character through perseverance. This is good fortune for a woman, misfortune for a man.",
              "interpretation": "Perseverance in character is generally good, but specific roles or expectations may influence outcomes."
            },
            {
              "line_number": 6,
              "text": "Restlessness as a condition brings misfortune.",
              "interpretation": "Constant agitation and instability lead to misfortune. Seek calm and consistency."
            }
          ]
        },
        {
          "id": 33,
          "name": "Retreat",
          "chinese_name": "遯 (Dùn)",
          "representation": "100011",
          "overall_meaning": "Retreat signifies a strategic withdrawal to avoid danger and conserve strength. It emphasizes the importance of knowing when to step back to preserve resources and regroup.",
          "advice": "Recognize the need to retreat strategically. Preserve your strength and avoid unnecessary confrontations.",
          "keywords": ["withdrawal", "preservation", "strategy", "caution"],
          "creative_description": "Like the mountain that stands firm by stepping back, Retreat emphasizes the importance of strategic withdrawal to conserve strength and avoid danger.",
          "lines": [
            {
              "line_number": 1,
              "text": "At the tail in retreat. This is dangerous. One must not wish to undertake anything.",
              "interpretation": "Retreating too late is dangerous. Avoid taking risks during this time."
            },
            {
              "line_number": 2,
              "text": "He holds him fast with yellow oxhide. No one can tear him loose.",
              "interpretation": "A firm and secure retreat ensures safety. Strong bonds and support are crucial."
            },
            {
              "line_number": 3,
              "text": "A halted retreat is nerve-wracking and dangerous. To retain people as men and maidservants brings good fortune.",
              "interpretation": "A poorly executed retreat causes stress and danger. Secure loyal support for a safe withdrawal."
            },
            {
              "line_number": 4,
              "text": "Voluntary retreat brings good fortune to the superior man and downfall to the inferior man.",
              "interpretation": "Choosing to retreat voluntarily is wise and brings good fortune to those of strong character."
            },
            {
              "line_number": 5,
              "text": "Friendly retreat. Perseverance brings good fortune.",
              "interpretation": "A well-supported and friendly retreat ensures success. Stay committed to the decision."
            },
            {
              "line_number": 6,
              "text": "Cheerful retreat. Everything serves to further.",
              "interpretation": "A positive and well-timed retreat opens up new opportunities. Embrace the change."
            }
          ]
        },
        {
          "id": 34,
          "name": "The Power of the Great",
          "chinese_name": "大壯 (Dà Zhuàng)",
          "representation": "111101",
          "overall_meaning": "The Power of the Great signifies a time of great strength and energy, emphasizing the importance of using this power wisely and responsibly.",
          "advice": "Harness your strength and energy wisely. Use your power responsibly to achieve positive outcomes.",
          "keywords": ["strength", "energy", "responsibility", "power"],
          "creative_description": "Like thunder that resonates powerfully through the heavens, The Power of the Great emphasizes the need to use great strength and energy wisely and responsibly.",
          "lines": [
            {
              "line_number": 1,
              "text": "Power in the toes. Continuing brings misfortune. This is certainly true.",
              "interpretation": "Acting on impulse and without consideration leads to misfortune. Exercise caution."
            },
            {
              "line_number": 2,
              "text": "Perseverance brings good fortune.",
              "interpretation": "Continued effort and determination bring positive results. Stay committed."
            },
            {
              "line_number": 3,
              "text": "The inferior man works through power. The superior man does not act thus. To continue is dangerous. A goat butts against a hedge and gets its horns entangled.",
              "interpretation": "Using brute force is not wise. Intelligent and thoughtful action is necessary to avoid danger."
            },
            {
              "line_number": 4,
              "text": "Perseverance brings good fortune. Remorse disappears. The hedge opens; there is no entanglement. Power depends upon the axle of a big cart.",
              "interpretation": "Steadfastness leads to success. Obstacles are removed through careful and steady efforts."
            },
            {
              "line_number": 5,
              "text": "Loses the goat with ease. No remorse.",
              "interpretation": "Letting go of a stubborn pursuit brings relief and avoids regret."
            },
            {
              "line_number": 6,
              "text": "A goat butts against a hedge. It cannot go backward, it cannot go forward. Nothing serves to further. If one notes the difficulty, this brings good fortune.",
              "interpretation": "Recognizing and addressing an impasse leads to good fortune. Do not force progress."
            }
          ]
        },
        {
          "id": 35,
          "name": "Progress",
          "chinese_name": "晉 (Jìn)",
          "representation": "110101",
          "overall_meaning": "Progress signifies a time of advancement and forward movement. It emphasizes the importance of clear vision and steady effort to achieve success.",
          "advice": "Maintain a clear vision and make steady progress towards your goals. Use your momentum to advance positively.",
          "keywords": ["advancement", "forward movement", "vision", "effort"],
          "creative_description": "Like the rising sun that illuminates the world, Progress emphasizes the power of clear vision and steady effort to achieve success and move forward.",
          "lines": [
            {
              "line_number": 1,
              "text": "Progressing, but turned back. Perseverance brings good fortune. If one meets with no confidence, one should remain calm. No mistake.",
              "interpretation": "Initial setbacks can be overcome with perseverance. Remain calm and confident."
            },
            {
              "line_number": 2,
              "text": "Progressing, but in sorrow. Perseverance brings good fortune. Then one obtains great happiness from one's ancestress.",
              "interpretation": "Advancing despite difficulties brings eventual happiness and good fortune."
            },
            {
              "line_number": 3,
              "text": "All are in accord. Remorse disappears.",
              "interpretation": "Harmony and agreement with others eliminate regrets and ensure smooth progress."
            },
            {
              "line_number": 4,
              "text": "Progress like a hamster. Perseverance brings danger.",
              "interpretation": "Advancing timidly or cautiously can be dangerous. Be bold and confident."
            },
            {
              "line_number": 5,
              "text": "Remorse disappears. Take not gain and loss to heart. Undertakings bring good fortune. Everything serves to further.",
              "interpretation": "Letting go of attachment to outcomes brings good fortune. Focus on the process."
            },
            {
              "line_number": 6,
              "text": "Making progress with the horns is permissible only for the purpose of punishing one's own city. To be conscious of danger brings good fortune. No blame. Perseverance brings humiliation.",
              "interpretation": "Use forceful measures only when necessary and be aware of potential dangers. Persevere wisely."
            }
          ]
        },
        {
          "id": 36,
          "name": "Darkening of the Light",
          "chinese_name": "明夷 (Míng Yí)",
          "representation": "101110",
          "overall_meaning": "Darkening of the Light signifies a time of adversity and obscurity, where wisdom and caution are needed to navigate through difficult situations.",
          "advice": "Exercise caution and remain vigilant during times of adversity. Use wisdom to navigate through challenges.",
          "keywords": ["adversity", "obscurity", "caution", "wisdom"],
          "creative_description": "Like the sun setting behind the mountains, Darkening of the Light emphasizes the need for wisdom and caution to navigate through periods of adversity and obscurity.",
          "lines": [
            {
              "line_number": 1,
              "text": "Darkening of the light during flight. He lowers his wings. The superior man does not eat for three days on his wanderings. But he has somewhere to go. The host has occasion to gossip about him.",
              "interpretation": "In difficult times, restraint and discretion are necessary. Endure temporary hardships with dignity."
            },
            {
              "line_number": 2,
              "text": "Darkening of the light injures him in the left thigh. He gives aid with the strength of a horse. Good fortune.",
              "interpretation": "Despite suffering and injury, using one's strength to help others brings good fortune."
            },
            {
              "line_number": 3,
              "text": "Darkening of the light during the hunt in the south. Their great leader is captured. One must not expect perseverance too soon.",
              "interpretation": "During pursuits, expect setbacks and delays. Perseverance is necessary but may take time."
            },
            {
              "line_number": 4,
              "text": "He penetrates the left side of the belly. One gets at the very heart of the darkening of the light, and leaves the gate and courtyard.",
              "interpretation": "Understanding the core of adversity allows one to find a way out. Seek deeper insights."
            },
            {
              "line_number": 5,
              "text": "Darkening of the light as with Prince Chi. Perseverance furthers.",
              "interpretation": "Endure and remain steadfast like Prince Chi in times of hardship. Perseverance leads to success."
            },
            {
              "line_number": 6,
              "text": "Not light but darkness. First he climbs up to heaven, then he plunges into the depths of the earth.",
              "interpretation": "Great fluctuations between success and failure. Maintain balance and avoid extremes."
            }
          ]
        },
        {
          "id": 37,
          "name": "The Family (The Clan)",
          "chinese_name": "家人 (Jiā Rén)",
          "representation": "101011",
          "overall_meaning": "The Family signifies the importance of harmony and proper relationships within the family and community. It emphasizes the need for clear roles and mutual respect.",
          "advice": "Foster harmony and respect within the family and community. Establish clear roles and responsibilities.",
          "keywords": ["harmony", "family", "roles", "respect"],
          "creative_description": "Like a well-organized household, The Family emphasizes the importance of clear roles and mutual respect to maintain harmony within the family and community.",
          "lines": [
            {
              "line_number": 1,
              "text": "Firm seclusion within the family. Remorse disappears.",
              "interpretation": "Establishing firm boundaries and roles within the family leads to harmony and eliminates regrets."
            },
            {
              "line_number": 2,
              "text": "She should not follow her whims. She must attend within to the food. Perseverance brings good fortune.",
              "interpretation": "Maintaining focus on responsibilities and avoiding whims ensures good fortune and harmony."
            },
            {
              "line_number": 3,
              "text": "When tempers flare, reprimand is necessary. Remorse disappears.",
              "interpretation": "Addressing conflicts and maintaining discipline within the family leads to harmony."
            },
            {
              "line_number": 4,
              "text": "She is the treasure of the house. Great good fortune.",
              "interpretation": "Recognizing and valuing key members within the family brings great good fortune."
            },
            {
              "line_number": 5,
              "text": "As a king, he approaches his family. Fear not. Good fortune.",
              "interpretation": "Leading the family with authority and care ensures good fortune and harmony."
            },
            {
              "line_number": 6,
              "text": "His work commands respect. In the end, good fortune comes.",
              "interpretation": "Diligent and respectful work within the family brings lasting good fortune."
            }
          ]
        },
        {
          "id": 38,
          "name": "Opposition",
          "chinese_name": "睽 (Kuí)",
          "representation": "110011",
          "overall_meaning": "Opposition signifies a time of conflict and divergence, where differences in opinions and goals lead to tension and separation. It emphasizes the need for understanding and flexibility to navigate these challenges.",
          "advice": "Seek understanding and remain flexible in the face of conflict. Use diplomacy and patience to navigate opposition.",
          "keywords": ["conflict", "divergence", "understanding", "flexibility"],
          "creative_description": "Like fire over water, Opposition highlights the tension and conflict that arise from differences, and the need for understanding and flexibility to find harmony.",
          "lines": [
            {
              "line_number": 1,
              "text": "Remorse disappears. If you lose your horse, do not run after it; it will come back of its own accord. When you see evil people, guard yourself against mistakes.",
              "interpretation": "Stay calm and avoid impulsive actions. Trust that things will resolve naturally and remain vigilant."
            },
            {
              "line_number": 2,
              "text": "One meets his lord in a narrow street. No blame.",
              "interpretation": "Unexpected encounters can lead to positive outcomes. Stay open and flexible."
            },
            {
              "line_number": 3,
              "text": "One sees the wagon dragged back, the oxen halted, a man's hair and nose cut off. Not a good beginning, but a good end.",
              "interpretation": "Initial setbacks and conflicts may be harsh, but perseverance leads to a favorable outcome."
            },
            {
              "line_number": 4,
              "text": "Isolated through opposition, one meets a like-minded man with whom one can associate in good faith. Despite the danger, no blame.",
              "interpretation": "Finding common ground and allies in times of opposition ensures safety and success."
            },
            {
              "line_number": 5,
              "text": "Remorse disappears. The companion bites his way through the wrappings. If one goes to him, how could it be a mistake?",
              "interpretation": "Resolving misunderstandings and breaking through barriers leads to positive resolutions."
            },
            {
              "line_number": 6,
              "text": "Isolated through opposition, one sees one's companion as a pig covered with dirt, as a wagon full of devils. First one draws a bow against him, then one lays the bow aside. He is not a robber; he will woo at the right time. As one goes, rain falls; then good fortune comes.",
              "interpretation": "Initial mistrust and conflict can transform into understanding and harmony. Patience and open-mindedness bring good fortune."
            }
          ]
        },
        {
          "id": 39,
          "name": "Obstruction",
          "chinese_name": "蹇 (Jiǎn)",
          "representation": "100101",
          "overall_meaning": "Obstruction signifies a time of obstacles and challenges, where progress is hindered by difficulties. It emphasizes the need for patience, reflection, and strategic planning to overcome these barriers.",
          "advice": "Exercise patience and reflection. Develop strategic plans to navigate and overcome obstacles.",
          "keywords": ["obstacles", "challenges", "patience", "strategy"],
          "creative_description": "Like a traveler facing a steep mountain, Obstruction highlights the need for patience and strategic planning to navigate through challenges and overcome barriers.",
          "lines": [
            {
              "line_number": 1,
              "text": "Going leads to obstructions, coming meets with praise.",
              "interpretation": "Pushing forward aggressively leads to obstacles. Retreating or taking a step back can bring better results."
            },
            {
              "line_number": 2,
              "text": "The servant suffers obstructions upon obstructions. Misfortune.",
              "interpretation": "Facing repeated difficulties can lead to misfortune. Be cautious and deliberate in actions."
            },
            {
              "line_number": 3,
              "text": "Going leads to obstructions, hence he comes back.",
              "interpretation": "Recognize when to stop pushing forward and take time to reassess and regroup."
            },
            {
              "line_number": 4,
              "text": "Going leads to obstructions, coming leads to union.",
              "interpretation": "Instead of forging ahead, seek to connect with others and find strength in unity."
            },
            {
              "line_number": 5,
              "text": "In the midst of obstructions, friends come.",
              "interpretation": "Even in difficult times, support and help from friends can appear unexpectedly."
            },
            {
              "line_number": 6,
              "text": "Going leads to obstructions, coming leads to great good fortune. It furthers one to see the great man.",
              "interpretation": "Avoid pushing forward and instead seek the advice and support of wise and influential people."
            }
          ]
        },
        {
          "id": 40,
          "name": "Deliverance",
          "chinese_name": "解 (Xiè)",
          "representation": "010100",
          "overall_meaning": "Deliverance signifies a time of relief and liberation from obstacles and difficulties. It emphasizes the importance of resolution and moving forward after overcoming challenges.",
          "advice": "Embrace relief and liberation. Focus on resolving issues and moving forward.",
          "keywords": ["relief", "liberation", "resolution", "moving forward"],
          "creative_description": "Like a storm that clears the sky, Deliverance emphasizes the relief and liberation that comes after overcoming challenges and resolving issues.",
          "lines": [
            {
              "line_number": 1,
              "text": "Without blame.",
              "interpretation": "The situation is clear and uncomplicated. Proceed without guilt or hesitation."
            },
            {
              "line_number": 2,
              "text": "One kills three foxes in the field and receives a yellow arrow. Perseverance brings good fortune.",
              "interpretation": "Successfully overcoming deceitful obstacles brings rewards. Perseverance is beneficial."
            },
            {
              "line_number": 3,
              "text": "If a man carries a burden on his back and nonetheless rides in a carriage, he thereby encourages robbers to draw near. Perseverance leads to humiliation.",
              "interpretation": "Attempting to do too much at once invites trouble. Focus on one thing at a time to avoid failure."
            },
            {
              "line_number": 4,
              "text": "Deliver yourself from your great toe. Then the companion comes, and they can move forward.",
              "interpretation": "Freeing yourself from minor entanglements allows for collaboration and progress."
            },
            {
              "line_number": 5,
              "text": "If only the superior man can deliver himself, it brings good fortune. Then let him consider it an occasion for rejoicing.",
              "interpretation": "Self-reliance and independence lead to good fortune. Celebrate the achievement."
            },
            {
              "line_number": 6,
              "text": "The prince shoots at a hawk on a high wall. He kills it. Everything serves to further.",
              "interpretation": "Taking decisive action against a challenging target ensures success and progress."
            }
          ]
        },
        
        {
          "id": 41,
          "name": "Decrease",
          "chinese_name": "損 (Sǔn)",
          "representation": "100110",
          "overall_meaning": "Decrease signifies a time of reduction and restraint, where less is more. It emphasizes the importance of simplifying and focusing on what truly matters.",
          "advice": "Embrace reduction and simplify your life. Focus on what is truly important and let go of excess.",
          "keywords": ["reduction", "restraint", "simplification", "focus"],
          "creative_description": "Like a river that flows more smoothly with less water, Decrease emphasizes the importance of reduction and restraint to create clarity and focus on what truly matters.",
          "lines": [
            {
              "line_number": 1,
              "text": "Going quickly when one's tasks are finished is without blame. But one must reflect on how much one may decrease others.",
              "interpretation": "Act swiftly once your responsibilities are complete, but be mindful of how your actions affect others."
            },
            {
              "line_number": 2,
              "text": "Perseverance furthers. To undertake something brings misfortune. Without decreasing oneself, one is able to bring increase to others.",
              "interpretation": "Consistency is beneficial. Avoid taking on new ventures that may overextend you. Focus on helping others."
            },
            {
              "line_number": 3,
              "text": "When three people journey together, their number decreases by one. When one man journeys alone, he finds a companion.",
              "interpretation": "Group dynamics can lead to loss, while independence attracts new alliances."
            },
            {
              "line_number": 4,
              "text": "If a man decreases his faults, it makes the other hasten to come and rejoice. No blame.",
              "interpretation": "Improving oneself attracts positive responses from others. There is no fault in this."
            },
            {
              "line_number": 5,
              "text": "Someone does indeed increase him. Ten pairs of tortoises cannot oppose it. Supreme good fortune.",
              "interpretation": "Support and help from others lead to significant and unopposable good fortune."
            },
            {
              "line_number": 6,
              "text": "If one is increased without depriving others, there is no blame. Perseverance brings good fortune. It furthers one to undertake something. One obtains servants but no longer has a separate home.",
              "interpretation": "Gaining without causing loss to others is blameless. Perseverance and new ventures bring good fortune and support."
            }
          ]
        },
        {
          "id": 42,
          "name": "Increase",
          "chinese_name": "益 (Yì)",
          "representation": "011010",
          "overall_meaning": "Increase signifies a time of growth and abundance, where efforts are rewarded and opportunities for expansion are present. It emphasizes the importance of generosity and proactive effort.",
          "advice": "Embrace opportunities for growth and abundance. Be generous and proactive in your efforts to expand and improve.",
          "keywords": ["growth", "abundance", "generosity", "effort"],
          "creative_description": "Like the wind that nourishes the trees, Increase emphasizes the importance of growth and expansion through generous and proactive efforts.",
          "lines": [
            {
              "line_number": 1,
              "text": "It furthers one to accomplish great deeds. Supreme good fortune. No blame.",
              "interpretation": "Taking on significant tasks leads to great success and is without fault."
            },
            {
              "line_number": 2,
              "text": "Someone does indeed increase him; ten pairs of tortoises cannot oppose it. Constant perseverance brings good fortune. The king presents him before God. Good fortune.",
              "interpretation": "Support from others ensures unopposable success. Perseverance and recognition lead to good fortune."
            },
            {
              "line_number": 3,
              "text": "One is enriched through unfortunate events. No blame, if you are sincere and walk in the middle, and report with a presentation of peace.",
              "interpretation": "Adversity can lead to growth if approached with sincerity and balance. Communicate your intentions clearly."
            },
            {
              "line_number": 4,
              "text": "If you walk in the middle and report to the prince, he will follow. It furthers one to be used in the removal of the capital.",
              "interpretation": "Balanced actions and clear communication attract support from influential figures. This is beneficial for significant changes."
            },
            {
              "line_number": 5,
              "text": "If in truth you have a kind heart, ask not. Supreme good fortune. Truly, kindness will be recognized in the end.",
              "interpretation": "Genuine kindness and generosity lead to supreme good fortune. Your good deeds will be acknowledged."
            },
            {
              "line_number": 6,
              "text": "He brings increase to no one. Indeed, someone even strikes him. He does not keep his heart constantly steady. Misfortune.",
              "interpretation": "Failure to help others and inconsistency lead to misfortune. Remain steadfast and generous."
            }
          ]
        },
        {
          "id": 43,
          "name": "Breakthrough (Resoluteness)",
          "chinese_name": "夬 (Guài)",
          "representation": "111011",
          "overall_meaning": "Breakthrough signifies a time of decisive action and resoluteness, where clarity and determination are needed to overcome obstacles and achieve success.",
          "advice": "Take decisive action and be resolute in your efforts. Use clarity and determination to break through obstacles.",
          "keywords": ["decisive action", "resoluteness", "clarity", "determination"],
          "creative_description": "Like a powerful force that breaks through barriers, Breakthrough emphasizes the importance of clarity and determination in overcoming obstacles and achieving success.",
          "lines": [
            {
              "line_number": 1,
              "text": "Mighty in the forward-striding toes. When one goes and is not equal to the task, one makes a mistake.",
              "interpretation": "Initial enthusiasm must be matched with capability. Avoid taking on tasks beyond your means."
            },
            {
              "line_number": 2,
              "text": "A cry of alarm. Arms at evening and at night. Fear nothing.",
              "interpretation": "Remain vigilant and prepared for challenges, but do not let fear dominate your actions."
            },
            {
              "line_number": 3,
              "text": "To be powerful in the cheekbones brings misfortune. The superior man is firmly resolved. He walks alone and is caught in the rain. He is bespattered, and people murmur against him. No blame.",
              "interpretation": "Overly aggressive actions lead to backlash. Stay firm in your resolve despite criticism."
            },
            {
              "line_number": 4,
              "text": "There is no skin on his thighs, and walking comes hard. If a man were to let himself be led like a sheep, remorse would disappear. But if these words are heard, they will not be believed.",
              "interpretation": "Difficulties can be overcome with humility and willingness to be guided. However, advice may be met with skepticism."
            },
            {
              "line_number": 5,
              "text": "In dealing with weeds, firm resolution is necessary. Walking in the middle remains free of blame.",
              "interpretation": "Addressing problems requires firmness. Maintain a balanced approach to avoid blame."
            },
            {
              "line_number": 6,
              "text": "No cry. In the end, good fortune comes.",
              "interpretation": "Stay calm and composed. Ultimately, this approach leads to good fortune."
            }
          ]
        },
        {
          "id": 44,
          "name": "Coming to Meet",
          "chinese_name": "姤 (Gòu)",
          "representation": "011111",
          "overall_meaning": "Coming to Meet signifies the arrival of unexpected encounters or influences. It emphasizes the importance of awareness and caution in dealing with new situations.",
          "advice": "Stay aware and exercise caution with new encounters or influences. Be mindful of potential challenges.",
          "keywords": ["encounters", "influences", "awareness", "caution"],
          "creative_description": "Like a sudden wind meeting the sky, Coming to Meet highlights the importance of awareness and caution in dealing with unexpected encounters or influences.",
          "lines": [
            {
              "line_number": 1,
              "text": "It must be checked with a brake of bronze. Perseverance brings good fortune. If one lets it take its course, one experiences misfortune.",
              "interpretation": "Control initial impulses with discipline. Perseverance in restraint brings good fortune."
            },
            {
              "line_number": 2,
              "text": "There is a fish in the tank. No blame. Does not further guests.",
              "interpretation": "Maintain a low profile and avoid unnecessary social interactions. Stay focused on your own tasks."
            },
            {
              "line_number": 3,
              "text": "There is no skin on his thighs, and walking comes hard. If one is mindful of the danger, no great mistake is made.",
              "interpretation": "Recognize and acknowledge the difficulties ahead. Mindfulness of potential dangers prevents major mistakes."
            },
            {
              "line_number": 4,
              "text": "No fish in the tank. This leads to misfortune.",
              "interpretation": "Neglecting important resources or relationships leads to negative consequences."
            },
            {
              "line_number": 5,
              "text": "A melon covered with willow leaves. Hidden lines. Then it drops down to one from heaven.",
              "interpretation": "Unexpected rewards or solutions may appear. Stay open to hidden opportunities."
            },
            {
              "line_number": 6,
              "text": "He comes to meet with his horns. Humiliation. No blame.",
              "interpretation": "Approaching situations aggressively leads to embarrassment. However, the intent is understood and blameless."
            }
          ]
        },
        {
          "id": 45,
          "name": "Gathering Together (Massing)",
          "chinese_name": "萃 (Cuì)",
          "representation": "010011",
          "overall_meaning": "Gathering Together signifies a time of unity and cooperation, where collective efforts are necessary to achieve common goals. It emphasizes the importance of bringing people together for a shared purpose.",
          "advice": "Foster unity and cooperation. Bring people together to work towards common goals.",
          "keywords": ["unity", "cooperation", "collective effort", "shared purpose"],
          "creative_description": "Like a lake that gathers waters from various sources, Gathering Together emphasizes the importance of unity and cooperation in achieving common goals.",
          "lines": [
            {
              "line_number": 1,
              "text": "If you are sincere, but not to the end, there will sometimes be confusion, sometimes gathering together. If you call out, then after one grasp of the hand you can laugh again. Regret not. Going is without blame.",
              "interpretation": "Sincerity brings people together, but inconsistency leads to confusion. Reach out and maintain efforts to foster unity."
            },
            {
              "line_number": 2,
              "text": "Letting oneself be drawn brings good fortune and remains blameless. If one is sincere, it furthers one to bring even a small offering.",
              "interpretation": "Allowing oneself to be guided by sincerity and contributing, even in small ways, brings good fortune."
            },
            {
              "line_number": 3,
              "text": "Gathering together amid sighs. Nothing that would further. Going is without blame. Slight humiliation.",
              "interpretation": "Challenges in unity may cause frustration, but perseverance is blameless. Accept minor setbacks gracefully."
            },
            {
              "line_number": 4,
              "text": "Great good fortune. No blame.",
              "interpretation": "Efforts in unity and cooperation lead to great good fortune and are blameless."
            },
            {
              "line_number": 5,
              "text": "If in gathering together one has position, this brings no blame. If there are some who are not yet sincerely in the work, sublime and enduring perseverance is needed. Then remorse disappears.",
              "interpretation": "Holding a position of leadership in uniting efforts is blameless. Perseverance is needed to inspire sincerity in others."
            },
            {
              "line_number": 6,
              "text": "Lamenting and sighing, floods of tears. No blame.",
              "interpretation": "Emotional expressions in the face of challenges are natural. Accept them without blame."
            }
          ]
        },                   
        {
          "id": 46,
          "name": "Pushing Upward",
          "chinese_name": "升 (Shēng)",
          "representation": "011001",
          "overall_meaning": "Pushing Upward signifies a time of growth and progress through dedicated effort. It emphasizes the importance of perseverance and continuous improvement to achieve higher goals.",
          "advice": "Persevere and continue to improve. Dedicate your efforts to achieve higher goals and progress.",
          "keywords": ["growth", "progress", "perseverance", "improvement"],
          "creative_description": "Like a plant pushing upward towards the light, Pushing Upward emphasizes the importance of perseverance and continuous improvement to achieve growth and progress.",
          "lines": [
            {
              "line_number": 1,
              "text": "Pushing upward that meets with confidence brings great good fortune.",
              "interpretation": "Efforts met with confidence and support lead to great good fortune."
            },
            {
              "line_number": 2,
              "text": "If one is sincere, it furthers one to bring even a small offering. No blame.",
              "interpretation": "Sincerity in efforts, even if small, brings positive results without blame."
            },
            {
              "line_number": 3,
              "text": "One pushes upward into an empty city.",
              "interpretation": "Advancing towards goals may initially seem unchallenged, but remain vigilant and prepared."
            },
            {
              "line_number": 4,
              "text": "The king offers him Mount Chi. Good fortune. No blame.",
              "interpretation": "Recognition and support from authority lead to good fortune and are without blame."
            },
            {
              "line_number": 5,
              "text": "Perseverance brings good fortune. One pushes upward by steps.",
              "interpretation": "Steady and consistent effort leads to good fortune. Progress step by step."
            },
            {
              "line_number": 6,
              "text": "Pushing upward in darkness. It furthers one to be unremittingly persevering.",
              "interpretation": "Even in challenging and unclear situations, continued perseverance is beneficial."
            }
          ]
        },                     
  ]


const lineTypes = {
    6: { 
        symbol: 'Old Yin', 
        changingTo: 'Yang', 
        color: '#B03060'  // Rich maroon for Old Yin, symbolizing deep transformation
    }, 
    7: { 
        symbol: 'Young Yang', 
        changingTo: null, 
        color: '#F8F8FF'  // Ghost white for Young Yang, maintaining brightness and purity
    }, 
    8: { 
        symbol: 'Young Yin', 
        changingTo: null, 
        color: '#000000'  // Dark gray for Young Yin, emphasizing subtlety and mystery
    }, 
    9: { 
        symbol: 'Old Yang', 
        changingTo: 'Yin', 
        color: '#8B008B'  // Dark magenta for Old Yang, indicating potent energy and change
    }
};



export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hexagram, setHexagram] = useState<LineType[]>([]);
  const [reading, setReading] = useState<any | null>(null);
  const [primaryColor, setPrimaryColor] = useState<string>('#a17fe0');

function getCoinFlipLine() {
    let sum = 0;
    for (let i = 0; i < 3; i++) {
        sum += Math.random() < 0.5 ? 2 : 3; // Coin flip results in 2 (tails) or 3 (heads)
    }
    // Return the line type object based on the sum of coin flips
    // @ts-expect-error
    return lineTypes[sum];
}

function mapLinesToHexagramDetails(lines: LineType[]) {
    // Convert line symbols to a binary representation
    const representation = lines.map(line => {
        return line.symbol.includes('Yang') ? '1' : '0';
    }).join('');

    // Find the matching hexagram in the predefined array
    const hexagram = hexagrams.find(hex => hex.representation === representation);

    if (!hexagram) {
        return { error: "No matching hexagram found." };
    }

    // Return the full hexagram details
    return {
        id: hexagram.id,
        name: hexagram.name,
        chinese_name: hexagram.chinese_name,
        representation: hexagram.representation,
        overall_meaning: hexagram.overall_meaning,
        advice: hexagram.advice,
        keywords: hexagram.keywords,
        creative_description: hexagram.creative_description,
        changing: hexagram.lines.map((line, index) => {
          if (lines[index].changingTo !== null) {
            return (line);
          }
        })
    };
}


function drawLine(ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}


  const drawLineAnimated = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    color: string,
    shadowColor: string,
    duration: number
) => {
    const startTime = performance.now();
    const draw = (currentTime: number) => {
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const x = startX + (endX - startX) * progress;

        ctx.strokeStyle = color;
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = 10;
        ctx.lineWidth = 10;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, endY);
        ctx.stroke();

        if (progress < 1) {
            requestAnimationFrame(draw);
        }
    };
    requestAnimationFrame(draw);
};

function drawHexagram(hexagram: LineType[]) {
  const canvas = canvasRef.current!;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears the canvas for a new drawing

  // Setup the glow effect for all lines
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 8;
  ctx.shadowOffsetY = 0;

  hexagram.forEach((line, index) => {
      const startY = 50 + index * 40;
      const midPoint = 150;
      const lineLength = 100;
      const halfLineLength = lineLength / 2;
      const gap = 20;

      let shadowColor = '#000000';  // Default shadow color for lines
      // Apply shadow color for each line based on its type
      if (line.symbol.includes('Yin') && line.symbol.startsWith('Young')) {
        shadowColor = '#6e47c9';
      } else if (line.symbol.includes('Yin') && line.symbol.startsWith('Old')) {
        shadowColor = '#7fbbf0';
      } else if (line.symbol.includes('Yang') && line.symbol.startsWith('Young')) {
        shadowColor = '#ff8533';
      } else if (line.symbol.includes('Yang') && line.symbol.startsWith('Old')) {
        shadowColor = '#991150';
      }

      setPrimaryColor(shadowColor);
      updateCanvasGlow(ctx, hexagram);
      console.log('drawhex', shadowColor)

      ctx.shadowColor = shadowColor;


      ctx.lineWidth = 10;
      ctx.strokeStyle = line.color;

      // Draw only the last added line with animation
      if (index === hexagram.length - 1) {
          if (line.symbol.includes('Yin')) {
              drawLineAnimated(ctx, midPoint - halfLineLength, startY, midPoint - gap / 2, startY, line.color, shadowColor, 500);
              drawLineAnimated(ctx, midPoint + gap / 2, startY, midPoint + halfLineLength, startY, line.color, shadowColor, 500);
          } else {
              drawLineAnimated(ctx, midPoint - halfLineLength, startY, midPoint + halfLineLength, startY, line.color, shadowColor, 500);
          }
      } else {
          // Draw static lines for previously added lines
          if (line.symbol.includes('Yin')) {
              drawLine(ctx, midPoint - halfLineLength, startY, midPoint - gap / 2, startY);
              drawLine(ctx, midPoint + gap / 2, startY, midPoint + halfLineLength, startY);
          } else {
              drawLine(ctx, midPoint - halfLineLength, startY, midPoint + halfLineLength, startY);
          }
      }
  });
}


function updateCanvasGlow(ctx: CanvasRenderingContext2D, hexagram: LineType[]) {
    // Initialize base colors with vibrant and magical defaults
    let baseGlow = primaryColor;  
    let secondaryGlow = '#FFD700';  
    let tertiaryGlow = '#FF69B4';  

    // Adjust colors dynamically based on line properties
    hexagram.forEach(line => {
        if (line.symbol.startsWith('Old')) {
            secondaryGlow = '#ff7d69';  // Chartreuse, vibrant and visually striking
            tertiaryGlow = '#00BFFF';  // Deep Sky Blue for depth and energy
        } else if (line.symbol.startsWith('Young')) {
            secondaryGlow = '#efadff';  // Medium Orchid for youthful energy
            tertiaryGlow = '#ffe4a8';  // Medium Spring Green for freshness and new beginnings
        }
    });

    // Create dynamic visual effects based on the amalgamation of all line types
    const intensity = hexagram.reduce((acc, line) => acc + (line.symbol.startsWith('Old') ? 2 : 1), 1);
    const blurRadius = 5 + intensity;  // Increase blur radius based on the intensity

    // Update the canvas glow dynamically with multiple colors
    ctx.canvas.style.boxShadow = `
        0 0 ${blurRadius}px ${baseGlow}, /* Primary dynamic glow based on line type */
        0 0 ${blurRadius * 1.5}px ${secondaryGlow}, /* Secondary vibrant glow for consistency */
        0 0 ${blurRadius * 2}px ${tertiaryGlow}, /* Tertiary magical glow for depth */
        0 0 ${blurRadius * 2.5}px ${baseGlow} inset, /* Inner glow matching the primary */
        0 0 ${blurRadius * 3}px ${secondaryGlow} inset /* Inner secondary glow for a rich effect */
    `;
}
  const nextStep = () => {
    if (hexagram.length < 6) {
      const newLine = getCoinFlipLine();
      const newHexagram = [...hexagram, newLine];
      setHexagram(newHexagram);
        drawHexagram(newHexagram);
        if (newHexagram.length === 6) {
          const newReading = mapLinesToHexagramDetails(newHexagram);
          console.log(newReading)
          setReading(newReading);
      }
      console.log(hexagram);
    } else {
      console.log(hexagram);
      setReading(null);
      setHexagram([]);
    }
  };
  const lavenderAndPurpleShades = [
    '#EAD1DC', // Pastel Lavender
    '#DEC6E0', // Pastel Thistle
    '#FBCCE7', // Pastel Plum
    '#FCC9E2', // Light Pastel Orchid
    '#DDBEDF', // Soft Medium Orchid
    '#D1BBEC', // Light Pastel Dark Orchid
    '#DCC6F3', // Very Light Medium Purple
    '#C5A3FF', // Pastel Blue Violet
    '#F3D6E4', // Very Soft Magenta
    '#E6CEFF'  // Light Pastel Purple
];

  const filteredArray = reading?.changing?.filter((line: any) => line !== undefined);
  console.log(filteredArray);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <title>Ask the Orb</title>
        <link rel="stylesheet" href="styles.css" />
      </Head>
      <main id={styles.main}>
        <div style={{ width: "100%", display: "flex", justifyContent: 'flex-end', marginRight: '64px', marginTop: '36px'}}>
        <WalletMultiButton />
          </div>
        <div id={styles.overlay}>
          {
            reading?.advice ? (
              <div style={{ width: 'fit-content', display: "flex", flexDirection: 'row', flexWrap: 'wrap', gap: '8px', justifyItems: "center", alignItems: 'center'}}>
                <p>{ filteredArray.length } changing lines.</p>
                <p style={{ width: '60%', textWrap: 'nowrap', overflow: 'clip', overflowClipMargin: '6px', overflowClipBox: "padding-box"}}>{reading.advice}</p>
              <a href="/mint" style={{ textDecoration: 'underline'}}>Mint this fortune to read more.</a></div>
            ) : (
              <p></p>
            )
          }
        </div>
        <div id={styles.container}>
          <canvas id={styles.canvas} ref={canvasRef} onClick={nextStep} width="300" height="300"></canvas>
        </div>
        <div>
        { reading ? (
          <div style={{ width: '100%', display: "flex", flexDirection: 'column', justifyItems: 'center', alignItems: 'center'}}>
            <p className={styles.title} style={{ textShadow: `0 0 8px #ffffff, 0 0 45px ${primaryColor}`, textAlign: "center", fontFamily: "Bonsad"}}>{reading.id ? `No.${reading.id}:${reading.chinese_name}` : 'Waiting for Interpretation'}</p>
            <p className={styles.title} style={{ textShadow: `0 0 8px #ffffff, 0 0 45px ${primaryColor}`, textAlign: "center"}}>{reading ? reading.name : 'Ask the Orb'}</p>
            <div style={{ width: "60%", display: "flex", flexDirection: 'column', justifyItems: 'center', alignItems: 'center', gap: '24px'}}>
            <div>
            {reading.keywords?.map((keyword: String, index: React.Key) => (
                <span key={index} className={styles.keyword_bubble}>
                    {keyword}
                </span>
              ))}
              </div>
            <div className={styles.description}>{reading.creative_description}</div>
            <div className={styles.meaning}>{reading.overall_meaning}</div>
            </div>
          </div>
          ): (
            <p className={styles.title} style={{ textShadow: `0 0 8px #ffffff, 0 0 45px ${primaryColor}`, textAlign: "center", userSelect: "none", padding: '10%'}}>Ask the Orb with intention</p>
          )}
            </div>
          {/* <div >
              {
                reading ? (
                  <div className={styles.chat}>
                  <div>
                  </div>
                  <div className={styles.description}>{reading.creative_description}</div>
                  <div className={styles.meaning}>{reading.overall_meaning}</div>
                  <div className={styles.advice} style={{ color: primaryColor}}>Advice: {reading.advice}</div>
                  <div>
                      {reading.changing?.map((line: any) => {
                        if (line === undefined) {
                          return;
                        }
                        return (
                          <div>
                            Changing Line {line.line_number}:
                            <div className={styles.description}>{line.text}</div>
                            <div className={styles.description}>{line.interpretation}</div>
                          </div>
                        )
                      })}
                    </div>
                 </div>
                ) : (
                  <div>
                  </div>
                )
              }
          </div> */}
      </main>
    </>
  );
}
