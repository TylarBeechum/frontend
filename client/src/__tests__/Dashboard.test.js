/* eslint-disable */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
  renderWithRouterAndProviders,
  rendererWithRouterAndProviders
} from '../__testHelpers__';

import Dashboard from '../components/Dashboard/Dashboard';

describe('<Dashboard />', () => {
  describe('should render the component successfully without crashing', () => {
    it('tests that the component does not crash when it is rendered', () => {
      const helpers = renderWithRouterAndProviders(
        <Dashboard history={{ location: { pathname: '/' } }} />
      );
    });
  });

  describe('should match the previous snapshot of the component', () => {
    it('tests that the component has not changed and matched the previous snapshot', () => {
      const tree = rendererWithRouterAndProviders(
        <Dashboard history={{ location: { pathname: '/' } }} />
      );
      expect(tree.toJSON()).toMatchSnapshot();
    });
  });
});
