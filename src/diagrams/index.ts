import type { DiagramSpec } from '../lib/diagram';
import agentObservability from './agent-observability';
import documentRepair from './document-repair';
import examPrep from './exam-prep-generation';
import groundedCases from './grounded-case-generation';
import imageService from './image-generation-service';
import jobReliability from './job-reliability';
import textbookPipeline from './textbook-pipeline';
import timetableParsing from './timetable-parsing';
import workMap from './work-map';

/** Overview diagrams, keyed by project slug, plus the work page's map. */
export const diagrams: Record<string, DiagramSpec> = {
  'work-map': workMap,
  'textbook-pipeline': textbookPipeline,
  'grounded-case-generation': groundedCases,
  'job-reliability': jobReliability,
  'document-repair': documentRepair,
  'exam-prep-generation': examPrep,
  'timetable-parsing': timetableParsing,
  'image-generation-service': imageService,
  'agent-observability': agentObservability,
};
