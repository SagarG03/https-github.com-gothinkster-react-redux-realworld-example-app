import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Home from './index';

jest.mock('../../agent', () => ({
  __esModule: true,
  default: {
    Articles: {
      all: () => Promise.resolve({ articles: [], articlesCount: 0 }),
      feed: () => Promise.resolve({ articles: [], articlesCount: 0 }),
      byTag: () => Promise.resolve({ articles: [], articlesCount: 0 })
    },
    Tags: {
      getAll: () => Promise.resolve({ tags: [] })
    }
  }
}));

const makeStore = () => createStore(() => ({
  home: { tags: [], articles: [], loading: false, articlesCount: 0, currentPage: 0 },
  common: { appName: 'Conduit', token: null },
  articleList: { pager: null, articles: [], loading: false, articlesCount: 0, currentPage: 0 }
}));

const findRefreshButton = container =>
  Array.from(container.querySelectorAll('button')).find(b => b.textContent.trim() === 'Refresh');

describe('Home page refresh button', () => {
  let container;
  const originalLocation = window.location;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
    Object.defineProperty(window, 'location', { value: originalLocation, writable: true, configurable: true });
  });

  it('[QP-TEST4-22-1] Clicking the refresh button reloads the entire browser page', () => {
    const reload = jest.fn();
    Object.defineProperty(window, 'location', { value: { reload }, writable: true, configurable: true });

    ReactDOM.render(<Provider store={makeStore()}><Home /></Provider>, container);
    const button = findRefreshButton(container);
    button.click();

    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('[QP-TEST4-22-2] The home page shows a refresh button', () => {
    ReactDOM.render(<Provider store={makeStore()}><Home /></Provider>, container);

    expect(findRefreshButton(container)).toBeTruthy();
  });
});
