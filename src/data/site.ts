/**
 * Facts about Arjun used across the site. Anything still unconfirmed stays
 * null or out (see the design doc, section 15) until he confirms it.
 */
export const site = {
  name: 'Arjun Nagendra',
  logo: 'arjun nagendra',
  role: 'AI engineer',
  org: 'Orfiq',
  location: 'Bengaluru',
  email: 'arjunnagendra03@gmail.com',
  github: 'https://github.com/arjunn3',
  /** Two different URLs appear on his resumes; hidden until he confirms one. */
  linkedin: null as string | null,
  url: 'https://arjunn3.github.io',
  stack: ['Python', 'FastAPI', 'PydanticAI', 'Neo4j', 'Cypher', 'Gemini', 'OpenAI', 'Azure', 'Pytest'],
  taekwondo: 'Competitive Taekwondo athlete.',
  description:
    'Arjun Nagendra designs and builds production LLM systems: pipelines grounded in knowledge graphs, long-running jobs that survive failure, and validation layers that catch model mistakes.',
};
