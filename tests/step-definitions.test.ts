import { runFeature } from '../src/runner.js';
import { resolve } from 'path';
import './steps/step-definitions.steps.js';

runFeature(resolve(__dirname, './features/core/step-definitions.feature'));
