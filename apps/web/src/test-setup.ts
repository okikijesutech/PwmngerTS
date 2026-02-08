import '@testing-library/jest-dom';
import React from 'react';
import ReactDOM from 'react-dom';

// Help Vitest coalesce React instances
(globalThis as any).React = React;
(globalThis as any).ReactDOM = ReactDOM;
