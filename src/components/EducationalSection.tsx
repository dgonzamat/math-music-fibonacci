
import React, { useState } from 'react';
import { 
  Sigma, 
  BookOpen, 
  ChevronRight, 
  Music, 
  Calculator, 
  Brain, 
  ChevronDown, 
  ArrowRight
} from 'lucide-react';
import { generateFibonacciSequence, goldenRatio } from '@/utils/fibonacci';
import { cn } from '@/lib/utils';

interface FibonacciTopic {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  content: React.ReactNode;
}

const EducationalSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('sequence');
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
  
  const fibonacciSequence = generateFibonacciSequence(15);
  
  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId) 
        : [...prev, topicId]
    );
  };
  
  const topics: FibonacciTopic[] = [
    {
      id: 'sequence',
      title: 'The Fibonacci Sequence',
      icon: <Sigma className="w-5 h-5" />,
      description: 'Learn about the mathematical sequence and its properties',
      content: (
        <div className="space-y-4">
          <p>
            The Fibonacci sequence is a series of numbers where each number is the sum of the 
            two preceding ones, usually starting with 0 and 1. The sequence begins:
          </p>
          
          <div className="flex flex-wrap items-center justify-center p-4 glass-panel rounded-md">
            {fibonacciSequence.map((num, index) => (
              <div 
                key={index} 
                className={cn(
                  "m-1 px-3 py-1 rounded-md transition-all duration-300 text-center min-w-[40px]",
                  index % 2 === 0 
                    ? "bg-dark-tertiary text-silver" 
                    : "bg-golden/10 text-golden"
                )}
              >
                {num}
              </div>
            ))}
          </div>
          
          <p>
            This sequence appears throughout nature, art, architecture, and music. In Tool's music, 
            the Fibonacci sequence influences rhythm patterns, time signatures, and even lyrical structure.
          </p>
          
          <h4 className="text-lg font-heading text-golden mt-6">Mathematical Formula</h4>
          <p>
            The Fibonacci sequence can be expressed mathematically as:
          </p>
          
          <div className="p-4 text-center font-mono glass-panel">
            F(0) = 0, F(1) = 1<br />
            F(n) = F(n-1) + F(n-2) for n &gt; 1
          </div>
          
          <p>
            This recursive pattern creates a sequence that grows exponentially and approaches the golden ratio.
          </p>
        </div>
      )
    },
    {
      id: 'golden-ratio',
      title: 'The Golden Ratio',
      icon: <Calculator className="w-5 h-5" />,
      description: 'Understand the divine proportion and its relationship to Fibonacci',
      content: (
        <div className="space-y-4">
          <p>
            The golden ratio (approximately 1.618033988749895...) is an irrational number represented by the Greek 
            letter phi (φ). When visualized, it creates aesthetically pleasing proportions that appear throughout art 
            and nature.
          </p>
          
          <div className="bg-dark-secondary p-4 rounded-md text-center">
            <span className="text-xl font-mono">φ = (1 + √5)/2 ≈ {goldenRatio().toFixed(8)}...</span>
          </div>
          
          <p>
            As the Fibonacci sequence progresses, the ratio between consecutive numbers approaches the golden ratio. 
            This relationship is key to understanding how Tool incorporates these mathematical concepts into their music.
          </p>
          
          <h4 className="text-lg font-heading text-golden mt-6">Golden Ratio in Music</h4>
          <p>
            In music, the golden ratio can be used to determine key moments for transitions, climaxes, or thematic changes. 
            For a song of length L, the golden ratio point would be at approximately L/φ from the end, or 0.618 × L from 
            the beginning.
          </p>
          
          <div className="mt-4 relative h-8 bg-dark-tertiary rounded-md overflow-hidden">
            <div 
              className="absolute h-full bg-golden/30" 
              style={{ width: '61.8%' }}
            />
            <div 
              className="absolute h-full bg-dark-secondary border-l border-golden" 
              style={{ left: '61.8%' }}
            />
            <div className="absolute inset-0 flex items-center px-3 justify-between text-xs">
              <span>0%</span>
              <span className="absolute left-[61.8%] transform -translate-x-1/2 text-golden">61.8%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'musical-application',
      title: 'Mathematical Music',
      icon: <Music className="w-5 h-5" />,
      description: 'Explore how Tool applies these concepts in their compositions',
      content: (
        <div className="space-y-4">
          <p>
            Tool intentionally incorporates mathematical concepts into their music in several ways:
          </p>
          
          <ul className="space-y-3">
            <li className="glass-panel p-3 rounded-md">
              <h5 className="text-golden font-medium">Time Signatures</h5>
              <p className="text-sm">
                Songs like "Lateralus" use time signatures based on Fibonacci numbers (5/8, 8/8, 13/8) to create 
                complex rhythmic patterns.
              </p>
            </li>
            <li className="glass-panel p-3 rounded-md">
              <h5 className="text-golden font-medium">Lyrical Structure</h5>
              <p className="text-sm">
                In "Lateralus," the syllable count in key sections follows the Fibonacci sequence: 1, 1, 2, 3, 5, 8, 13.
              </p>
            </li>
            <li className="glass-panel p-3 rounded-md">
              <h5 className="text-golden font-medium">Song Structure</h5>
              <p className="text-sm">
                Key transitions and climaxes often occur at the golden ratio point of the song's total duration.
              </p>
            </li>
            <li className="glass-panel p-3 rounded-md">
              <h5 className="text-golden font-medium">Rhythmic Patterns</h5>
              <p className="text-sm">
                Drum patterns and guitar riffs are often composed with mathematical relationships that mirror 
                the Fibonacci sequence.
              </p>
            </li>
          </ul>
          
          <div className="p-4 border border-golden/20 rounded-md mt-6 bg-dark-secondary/50">
            <h4 className="text-lg font-heading text-golden mb-2">Lateralus Lyrical Analysis</h4>
            <p className="text-sm italic text-silver mb-3">
              "Black (1)<br />
              then (1)<br />
              white are (2)<br />
              all I see (3)<br />
              in my infancy (5)<br />
              red and yellow then came to be (8)<br />
              reaching out to me, lets me see (13)"
            </p>
            <p className="text-xs text-muted-foreground">
              The numbers in parentheses represent the syllable count in each line, following the Fibonacci sequence.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'patterns-nature',
      title: 'Natural Patterns',
      icon: <Brain className="w-5 h-5" />,
      description: 'Discover how these mathematical patterns appear in nature and art',
      content: (
        <div className="space-y-4">
          <p>
            The Fibonacci sequence and golden ratio are found throughout nature, suggesting an underlying 
            mathematical order to beauty and growth patterns.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="glass-panel p-3 rounded-md">
              <h5 className="text-golden font-medium">Spiral Patterns</h5>
              <p className="text-sm">
                Nautilus shells, hurricanes, and spiral galaxies all display logarithmic spirals that 
                approximate the golden ratio.
              </p>
            </div>
            <div className="glass-panel p-3 rounded-md">
              <h5 className="text-golden font-medium">Flower Petals</h5>
              <p className="text-sm">
                Many flowers have petal counts that are Fibonacci numbers (3, 5, 8, 13, 21, etc.).
              </p>
            </div>
            <div className="glass-panel p-3 rounded-md">
              <h5 className="text-golden font-medium">Leaf Arrangements</h5>
              <p className="text-sm">
                Plants often arrange leaves in patterns that follow the Fibonacci sequence to maximize sunlight.
              </p>
            </div>
            <div className="glass-panel p-3 rounded-md">
              <h5 className="text-golden font-medium">Human Proportions</h5>
              <p className="text-sm">
                The ratio of human body parts often approximates the golden ratio, creating a sense of natural balance.
              </p>
            </div>
          </div>
          
          <p className="mt-4">
            Tool draws inspiration from these natural patterns, incorporating them into both their music and visual aesthetic. 
            This creates a harmonious experience that resonates on both conscious and subconscious levels.
          </p>
          
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground italic">
              "As above, so below, and beyond, I imagine<br />
              Drawn beyond the lines of reason<br />
              Push the envelope, watch it bend"<br />
              - Tool, "Lateralus"
            </p>
          </div>
        </div>
      )
    }
  ];
  
  const activeTopic = topics.find(topic => topic.id === activeTab);
  
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h3 className="font-heading text-xl text-golden mb-4">Mathematical Concepts</h3>
          
          <div className="space-y-3">
            {topics.map((topic) => (
              <div key={topic.id} className="animate-stagger">
                <button
                  className={cn(
                    "w-full text-left glass-panel p-4 rounded-md transition-all duration-300 border",
                    activeTab === topic.id
                      ? "border-golden/50 bg-golden/10"
                      : "border-silver/10 hover:border-silver/30"
                  )}
                  onClick={() => setActiveTab(topic.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          activeTab === topic.id
                            ? "bg-golden text-dark"
                            : "bg-dark-tertiary text-silver"
                        )}
                      >
                        {topic.icon}
                      </div>
                      <div>
                        <h4 className={cn(
                          "font-medium",
                          activeTab === topic.id ? "text-golden" : "text-white"
                        )}>
                          {topic.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {topic.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight 
                      className={cn(
                        "w-5 h-5 transition-transform duration-300",
                        activeTab === topic.id && "transform rotate-90 text-golden"
                      )}
                    />
                  </div>
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-8 glass-panel p-4 rounded-md">
            <h4 className="font-heading text-white mb-2">Additional Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="flex items-center text-silver hover:text-golden transition-colors duration-300 group">
                  <BookOpen className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-golden" />
                  <span className="link-underline">Guide to Music Theory</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-silver hover:text-golden transition-colors duration-300 group">
                  <BookOpen className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-golden" />
                  <span className="link-underline">Mathematics of Rhythm</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-silver hover:text-golden transition-colors duration-300 group">
                  <BookOpen className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-golden" />
                  <span className="link-underline">Tool's Musical Philosophy</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="glass-panel p-6 rounded-md">
            <div className="flex items-center mb-6">
              {activeTopic?.icon && (
                <div className="w-10 h-10 rounded-full bg-golden flex items-center justify-center mr-3">
                  {activeTopic.icon}
                </div>
              )}
              <h2 className="text-2xl font-heading text-white">{activeTopic?.title}</h2>
            </div>
            
            <div className="animate-fade-in">
              {activeTopic?.content}
            </div>
            
            <div className="mt-8 pt-6 border-t border-silver/10">
              <h4 className="text-lg font-heading text-golden mb-4">Frequently Asked Questions</h4>
              
              <div className="space-y-3">
                <div className="glass-panel rounded-md">
                  <button
                    className="w-full flex items-center justify-between p-3 text-left"
                    onClick={() => toggleTopic('faq-1')}
                  >
                    <span className="font-medium">Did Tool intentionally use Fibonacci in their music?</span>
                    <ChevronDown 
                      className={cn(
                        "w-5 h-5 transition-transform duration-300",
                        expandedTopics.includes('faq-1') && "transform rotate-180"
                      )}
                    />
                  </button>
                  
                  {expandedTopics.includes('faq-1') && (
                    <div className="p-3 pt-0 border-t border-silver/10 text-sm text-silver">
                      Yes, Tool has confirmed in interviews that they deliberately incorporate mathematical 
                      concepts into their compositions. Maynard James Keenan and Adam Jones have specifically 
                      mentioned the Fibonacci sequence and the golden ratio as inspirations for their work, 
                      especially in the album Lateralus.
                    </div>
                  )}
                </div>
                
                <div className="glass-panel rounded-md">
                  <button
                    className="w-full flex items-center justify-between p-3 text-left"
                    onClick={() => toggleTopic('faq-2')}
                  >
                    <span className="font-medium">How can I identify Fibonacci patterns in music?</span>
                    <ChevronDown 
                      className={cn(
                        "w-5 h-5 transition-transform duration-300",
                        expandedTopics.includes('faq-2') && "transform rotate-180"
                      )}
                    />
                  </button>
                  
                  {expandedTopics.includes('faq-2') && (
                    <div className="p-3 pt-0 border-t border-silver/10 text-sm text-silver">
                      Listen for time signatures that use Fibonacci numbers (1, 2, 3, 5, 8, 13), rhythmic patterns 
                      that follow these proportions, and key transitions that occur at golden ratio points in the 
                      song's duration. In Tool's music, these patterns are often found in drum patterns, guitar 
                      riffs, and song structures.
                    </div>
                  )}
                </div>
                
                <div className="glass-panel rounded-md">
                  <button
                    className="w-full flex items-center justify-between p-3 text-left"
                    onClick={() => toggleTopic('faq-3')}
                  >
                    <span className="font-medium">Are there other bands that use mathematical concepts?</span>
                    <ChevronDown 
                      className={cn(
                        "w-5 h-5 transition-transform duration-300",
                        expandedTopics.includes('faq-3') && "transform rotate-180"
                      )}
                    />
                  </button>
                  
                  {expandedTopics.includes('faq-3') && (
                    <div className="p-3 pt-0 border-t border-silver/10 text-sm text-silver">
                      Yes, many progressive and experimental bands incorporate mathematical patterns. Examples include 
                      Meshuggah (complex polyrhythms), Animals as Leaders (geometric patterns), King Crimson (mathematical 
                      time signatures), and Radiohead (golden ratio in song structures). Classical composers like Bach and 
                      Mozart also used mathematical principles extensively.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 glass-panel rounded-md flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 text-golden mr-2" />
              <span>Want to learn more about the mathematics of music?</span>
            </div>
            <a 
              href="#" 
              className="flex items-center text-golden hover:text-golden/80 transition-colors duration-300"
            >
              <span className="mr-1">Explore resources</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalSection;
