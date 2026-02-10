import '@testing-library/jest-dom';
import React from 'react';
import ReactDOM from 'react-dom';

// Help Vitest coalesce React instances
(globalThis as unknown as { React: typeof React }).React = React;
(globalThis as unknown as { ReactDOM: typeof ReactDOM }).ReactDOM = ReactDOM;
