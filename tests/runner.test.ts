import { runFeature } from '../src/runner';
import { resolve } from 'path';
import './steps/runner.steps';

runFeature(resolve(__dirname, './features/core/runner.feature'));
