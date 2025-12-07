import { runFeature } from '../src/runner.js';
import { resolve } from 'path';
import './steps/hooks.steps.js';

runFeature(resolve(__dirname, './features/core/hooks.feature'));
