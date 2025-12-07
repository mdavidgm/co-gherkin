import { runFeature } from '../src/runner.js';
import { resolve } from 'path';
import './steps/parser.steps.js';

runFeature(resolve(__dirname, './features/core/parser.feature'));
