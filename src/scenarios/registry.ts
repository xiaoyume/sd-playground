import type { Scenario } from './types';
import { urlShortenerScenario } from './urlShortener';

const scenarios: Scenario[] = [
  urlShortenerScenario,
];

export function getScenarios(): Scenario[] {
  return scenarios;
}

export function getScenarioById(id: string): Scenario | undefined {
  return scenarios.find((scenario) => scenario.id === id);
}
